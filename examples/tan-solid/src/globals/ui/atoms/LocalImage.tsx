import {
  createSignal,
  Match,
  onMount,
  splitProps,
  Switch,
  type Component,
} from 'solid-js';
import { cn } from '~cn/utils';
import type { AssetPath } from '~types';
import { useRessource } from '../signals';
import type { OmitPropsOf } from '../types';

/**
 * Cache global en mémoire pour les images en base64
 * Persiste pendant toute la durée de vie de la session
 */

interface ImageProps extends OmitPropsOf<
  'img',
  'src' | 'alt' | 'onload' | 'on:load' | 'onLoad'
> {
  /**
   * Source de l'image - doit être un chemin d'asset valide
   */
  src: AssetPath;

  /**
   * Texte alternatif pour l'image
   * Required for accessibility compliance
   */
  alt: string;

  /**
   * Composant ou élément à afficher pendant le chargement
   */
  fallback?: Component;

  /**
   * Composant ou élément à afficher en cas d'erreur
   */
  errorFallback?: Component;

  /**
   * Désactiver le cache
   * @default false
   */
  disableCache?: boolean;
}

const _LocalImage: Component<Omit<ImageProps, 'disableCache'>> = props => {
  const [local, rest] = splitProps(props, [
    'src',
    'alt',
    'class',
    'fallback',
    'errorFallback',
  ]);

  const [cachedImg, setCachedImg] = createSignal<string>();

  const [state, subscribe] = useRessource<string>(local.src);

  onMount(() =>
    subscribe(
      async () => {
        const response = await fetch(local.src);
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.statusText}`);
        }
        const blob = await response.blob();

        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = () => {
            const base64 = reader.result;

            const check =
              typeof base64 === 'string' &&
              base64.startsWith('data:image/');

            if (check) return resolve(base64);
            reject(new Error(`Invalid image data: ${base64}`));
          };

          reader.onerror = () => {
            const error = new Error(
              `Erreur de lecture du blob: ${local.src}`,
            );

            return reject(error);
          };

          reader.readAsDataURL(blob);
        });
      },
      ({ data, state }) => {
        if (state === 'loaded' && data) setCachedImg(data);
      },
    ),
  );

  // Génère une clé de cache unique basée sur le chemin de l'image

  return (
    <Switch>
      <Match when={state() === 'errored'}>
        {local.errorFallback ? (
          <local.errorFallback />
        ) : (
          <div
            class={cn(
              'flex items-center justify-center bg-gray-100 dark:bg-gray-800',
              local.class,
            )}
            role='img'
            aria-label={`Erreur de chargement: ${local.alt}`}
          >
            <span class='text-sm text-gray-500 dark:text-gray-400'>
              ⚠️ Erreur
            </span>
          </div>
        )}
      </Match>

      <Match when={state() === 'loaded' && cachedImg()}>
        <img
          {...rest}
          src={cachedImg()}
          alt={local.alt}
          class={cn('transition-opacity duration-300', local.class)}
          loading='lazy'
          decoding='async'
        />
      </Match>

      <Match when={state() === 'loading' || state() === 'idle'}>
        {local.fallback ? (
          <local.fallback />
        ) : (
          <div
            class={cn(
              'animate-pulse bg-gray-200 dark:bg-gray-700',
              local.class,
            )}
            role='img'
            aria-label={`Chargement: ${local.alt}`}
            aria-busy='true'
          />
        )}
      </Match>
    </Switch>
  );
};

/**
 * Composant Image type-safe avec cache en mémoire
 *
 * - Met en cache les images en base64 dans une Map globale
 * - Évite les rechargements répétés pendant la session
 * - Convertit automatiquement les images en base64
 * - Gère les états de chargement et d'erreur
 *
 * @example
 * ```tsx
 * import { LocalImage } from '~ui/atoms';
 * import { ASSETS } from '~types';
 *
 * <LocalImage
 *   src={ASSETS.img.logo}
 *   alt="Logo de l'école"
 *   class="w-32 h-32"
 * />
 *
 * // Avec fallback personnalisé
 * <LocalImage
 *   src={ASSETS.img.building}
 *   alt="Bâtiment"
 *   class="w-full h-96"
 *   fallback={() => <div class="animate-pulse bg-gray-200 w-full h-96" />}
 *   errorFallback={() => <div class="text-red-500">Erreur de chargement</div>}
 * />
 * ```
 */
export const LocalImage: Component<ImageProps> = props => {
  if (props.disableCache) {
    const [, rest] = splitProps(props, [
      'fallback',
      'errorFallback',
      'disableCache',
    ]);

    return <img {...rest} />;
  }

  return <_LocalImage {...props} />;
};
