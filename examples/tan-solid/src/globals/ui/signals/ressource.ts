import {
  createContext,
  createSignal,
  useContext,
  type Accessor,
} from 'solid-js';

/**
 * États possibles pour une ressource
 *
 * - `idle` : État initial, ressource non chargée
 * - `loading` : Ressource en cours de téléchargement
 * - `loaded` : Ressource chargée avec succès
 * - `errored` : Erreur lors du téléchargement
 */
export type ResourceState = 'idle' | 'loading' | 'loaded' | 'errored';

/**
 * Information d'état pour une ressource spécifique
 */
export interface ResourceStatus<T = unknown> {
  state: ResourceState;
  data?: T;
  error?: Error;
}

/**
 * Fonction de téléchargement d'une ressource
 * Doit retourner les données téléchargées
 */
export type ResourceDownloader<T = unknown> = () => Promise<T>;

/**
 * Callback appelée quand l'état de la ressource change
 */
export type ResourceSubscriber<T = unknown> = (
  status: ResourceStatus<T>,
) => void;

/**
 * Represents a single file resource entry
 *
 * - `key` : Unique identifier for the resource
 * - `data` : The resource content (can be any type: string, blob, object, etc.)
 * - `timestamp` : When the resource was added to the cache
 */
export interface FileResource<T = unknown> {
  key: string;
  data: T;
  timestamp: number;
}

/**
 * Context value for managing file resources
 *
 * Provides methods to:
 * - Store and retrieve resources
 * - Check resource existence
 * - Clear individual or all resources
 * - Get all resources or by key pattern
 */
export interface ResourceContextValue {
  /**
   * Internal Map storing all resources by key
   */
  resources: Map<string, unknown>;

  subscribe: (
    key: string,
    downloader: ResourceDownloader,
    subscriber: ResourceSubscriber,
  ) => () => void;

  /**
   * Get the current state of a resource
   *
   * @param key - Resource identifier
   * @returns Current state: 'idle' | 'loading' | 'loaded' | 'errored'
   *
   * @example
   * ```tsx
   * const { getState } = useResource();
   * const state = getState('image-logo'); // 'loaded'
   * ```
   */
  state: (key: string) => ResourceState;
}

/**
 * Creates the resource context for managing file resources globally
 *
 * @internal Use `useResource()` hook instead of consuming this context directly
 */
export const ResourceContext = createContext<
  ResourceContextValue | undefined
>();

/**
 * Creates a resource context provider that stores file resources in a Map
 *
 * This function initializes the context with all necessary methods
 * to manage file resources throughout the application.
 *
 * @returns An object containing:
 *   - `ResourceProvider` : Solid component to wrap your app
 *   - `createResourceContext` : Function to manually create resource contexts
 *
 * @example
 * ```tsx
 * import { createResourceContext } from '~/globals/ui/signals/ressource';
 *
 * // In your root component
 * export const App = () => {
 *   return (
 *     <ResourceProvider>
 *       <YourApp />
 *     </ResourceProvider>
 *   );
 * };
 * ```
 */
export const createResourceContext = () => {
  // Map pour stocker l'état de chaque ressource
  const resourceStates = new Map<
    string,
    [signal: () => ResourceState, setter: (state: ResourceState) => void]
  >();

  // Signal pour stocker les souscripteurs par ressource
  const [subscribersData, setSubscribersData] = createSignal(
    new Map<string, Set<ResourceSubscriber>>(),
  );

  // Signal pour stocker les promesses de téléchargement en cours
  const [downloadPromisesData, setDownloadPromisesData] = createSignal(
    new Map<string, Promise<unknown>>(),
  );

  /**
   * Crée ou récupère le signal d'état pour une ressource
   */
  const getOrCreateState = (
    key: string,
  ): [Accessor<ResourceState>, (state: ResourceState) => void] => {
    if (!resourceStates.has(key)) {
      const signal = createSignal<ResourceState>('idle');
      resourceStates.set(key, signal);
    }
    return resourceStates.get(key)!;
  };

  /**
   * Notifie tous les souscripteurs d'un changement d'état
   */
  const notifySubscribers = (key: string, status: ResourceStatus) => {
    const subs = subscribersData().get(key);
    if (subs) {
      subs.forEach(sub => sub(status));
    }
  };

  const contextValue: ResourceContextValue = {
    resources: new Map<string, unknown>(),

    /**
     * Subscribe à une ressource avec gestion automatique du téléchargement
     */
    subscribe(
      key: string,
      downloader: ResourceDownloader,
      subscriber: ResourceSubscriber,
    ) {
      // Ajouter le souscripteur
      const [getState, setState] = getOrCreateState(key);
      notifySubscribers(key, { state: getState() });

      setSubscribersData(subs1 => {
        if (!subs1.has(key)) {
          subs1.set(key, new Set());
        }
        const s = subs1.get(key)!;
        s.add(subscriber);
        return subs1;
      });

      // Obtenir ou créer le signal d'état

      // Si un téléchargement est déjà en cours, attendre et notifier
      const downloadPromises = downloadPromisesData();
      if (downloadPromises.has(key)) {
        // Rien à faire, le téléchargement est en cours
      } else if (getState() === 'loaded') {
        // Ressource déjà chargée
        const data = this.resources.get(key);

        subscriber({ state: 'loaded', data });
      } else {
        // Lancer le téléchargement
        setState('loading');
        notifySubscribers(key, { state: getState() });

        const downloadPromise = downloader()
          .then(data => {
            this.resources.set(key, data);
            setState('loaded');
            notifySubscribers(key, { state: 'loaded', data });

            setDownloadPromisesData(dp => {
              dp.delete(key);
              return dp;
            });
          })
          .catch((error: Error) => {
            setState('errored');
            notifySubscribers(key, { state: 'errored', error });
            setDownloadPromisesData(dp => {
              dp.delete(key);
              return dp;
            });
          });

        downloadPromises.set(key, downloadPromise);
        setDownloadPromisesData(downloadPromises);
      }

      // Retourner fonction pour se désabonner
      return () => {
        setSubscribersData(map => {
          const subs = map.get(key);
          if (subs) {
            subs.delete(subscriber);
            if (subs.size === 0) {
              map.delete(key);
            }
          }
          return map;
        });
      };
    },

    /**
     * Récupère l'état actuel d'une ressource
     */
    state(key: string): ResourceState {
      const [state] = getOrCreateState(key);
      return state();
    },
  };

  return contextValue;
};

/**
 * Hook to use the resource context
 *
 * Must be called within a component wrapped by `ResourceProvider`
 *
 * @returns The resource context value with all methods and accessors
 * @throws Error if used outside of ResourceProvider
 *
 * @example
 * ```tsx
 * import { useResource } from '~/globals/ui/signals/ressource';
 * import { createEffect } from 'solid-js';
 *
 * const MyComponent = () => {
 *   const { set, get, has, size } = useResource();
 *
 *   createEffect(() => {
 *     console.log(`Total resources: ${size()}`);
 *   });
 *
 *   const handleCache = () => {
 *     set('my-resource', { id: 1, name: 'Test' });
 *   };
 *
 *   const handleRetrieve = () => {
 *     const data = get('my-resource');
 *     console.log(data);
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={handleCache}>Cache Resource</button>
 *       <button onClick={handleRetrieve}>Get Resource</button>
 *       <p>Cached items: {size()}</p>
 *     </div>
 *   );
 * };
 * ```
 */
export const useRessource = <T>(key: string) => {
  const context = useContext(ResourceContext);
  if (!context) {
    throw new Error(
      'useResource must be called within a ResourceProvider. ' +
        'Make sure your component is wrapped with <ResourceProvider>',
    );
  }

  const state = () => context.state(key);

  const subscribe = (
    downloader: ResourceDownloader<T>,
    subscriber: ResourceSubscriber<T>,
  ) => context.subscribe(key, downloader, subscriber as any);

  return [state, subscribe] as const;
};
