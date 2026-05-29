import {
  createDeferred,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
  type Accessor,
} from 'solid-js';

export const assignWindow = () => {
  const [win, setWin] = createSignal<Window>();
  onMount(() => setWin(window));
  return createDeferred(win, { timeoutMs: 15 });
};

export type UseWindowProps = Record<string, (win: Window) => void>;
type Out<T extends UseWindowProps> = { [K in keyof T]: () => void };

export const useWindow = <const T extends UseWindowProps>(
  props: T,
): Out<T> => {
  const win = assignWindow();
  const entries = Object.entries(props);

  const out = Object.fromEntries(
    entries.map(([name, handler]) => {
      const method = () => {
        const _win = win();
        if (_win) return handler(_win);
      };
      return [name, method] as const;
    }),
  );

  return out as Out<T>;
};

/**
 * Crée un gestionnaire d'événements pour l'objet `window` qui peut être activé/désactivé conditionnellement.
 *
 * @template K - Type de l'événement window (keyof WindowEventMap)
 * @param type - Type d'événement à écouter (ex: 'keydown', 'resize', 'scroll')
 * @param listener - Fonction callback appelée lors du déclenchement de l'événement
 * @param condition - Condition (booléenne ou accessor) qui détermine si l'événement doit être écouté
 * @returns Objet contenant les méthodes `add` et `remove` pour gérer manuellement l'événement
 *
 * @example
 * ```tsx
 * const [visible, setRef] = createIntersect();
 *
 * createWindowHandler(
 *   'keydown',
 *   (e) => {
 *     if (e.key === 'Escape') handleEscape();
 *   },
 *   visible
 * );
 * ```
 */
export const createWindowHandler = <K extends keyof WindowEventMap>(
  type: K,
  listener: (ev: WindowEventMap[K]) => void,
  condition: boolean | Accessor<boolean | undefined>,
) => {
  const { add, remove } = useWindow({
    add: ({ addEventListener }) => addEventListener(type, listener),
    remove: ({ removeEventListener }) =>
      removeEventListener(type, listener),
  });

  createEffect(() => {
    const _condition =
      typeof condition === 'function' ? (condition() ?? false) : condition;
    if (_condition) return add();
    return remove();
  });

  onCleanup(remove);
  return { add, remove };
};

/**
 * Crée un gestionnaire d'événements pour l'objet `window` qui s'active au montage du composant.
 * Version simplifiée de `createWindowHandler` sans condition, l'événement est toujours actif après le montage.
 *
 * @template K - Type de l'événement window (keyof WindowEventMap)
 * @param type - Type d'événement à écouter (ex: 'resize', 'scroll', 'keydown')
 * @param listener - Fonction callback appelée lors du déclenchement de l'événement
 *
 * @example
 * ```tsx
 * createWindowHandler.onMount('resize', () => {
 *   console.log('Window resized');
 * });
 * ```
 */
createWindowHandler.onMount = <K extends keyof WindowEventMap>(
  type: K,
  listener: (ev: WindowEventMap[K]) => void,
) => {
  onMount(() => {
    window.addEventListener(type, listener);
    return onCleanup(() => window.removeEventListener(type, listener));
  });
};
