import type { Component } from 'solid-js';
import { TypingText } from '~/globals/ui/molecules/TypingText';
import { cn } from '~cn/utils';
import { FadingDots } from '../molecules/FadingDots';

interface LoadingFallbackProps {
  /**
   * Texte à afficher pendant le chargement
   * @default "Chargement en cours..."
   */
  message?: string;
  /**
   * Classes CSS supplémentaires
   */
  class?: string;
  /**
   * Taille du spinner
   * @default "lg"
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * LoadingFallback - Composant de fallback avec spinner et texte animé
 *
 * Affiche un spinner animé accompagné d'un texte avec effet de typing
 * pour améliorer l'expérience utilisateur pendant les chargements.
 *
 * @example
 * ```tsx
 * <Show when={data()} fallback={<LoadingFallback />}>
 *   <DataComponent data={data()!} />
 * </Show>
 * ```
 */
export const LoadingFallback: Component<LoadingFallbackProps> = props => {
  const message = props.message ?? 'Chargement en cours...';

  const spinnerSizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const size = props.size ?? 'lg';

  return (
    <div
      class={cn(
        'flex flex-col items-center justify-center gap-6',
        'h-screen w-screen overflow-hidden p-4',
        props.class,
      )}
      role='status'
      aria-live='polite'
      aria-label='Chargement en cours'
    >
      {/* Spinner animé */}
      <div class='relative'>
        {/* Cercle extérieur avec rotation */}
        <div
          class={cn(
            spinnerSizes[size],
            'rounded-full border-4 border-[#4B9CAD]/20',
            'animate-spin',
            'border-t-[#4B9CAD]',
          )}
          aria-hidden='true'
        />

        {/* Cercle intérieur pour effet de profondeur */}
        <div
          class={cn(
            'absolute inset-2',
            'rounded-full border-4 border-transparent',
            'border-b-[#4B9CAD]/40',
            'animate-spin',
            'animation-duration-[1.5s]',
            'direction-[reverse]',
          )}
          aria-hidden='true'
        />
      </div>

      {/* Texte avec effet typing */}
      <div class='text-center' aria-label={message}>
        <TypingText
          class='text-lg md:text-xl font-medium text-gray-700 dark:text-gray-300'
          interval={80}
          rewind={true}
          rewindDelay={2000}
        >
          {message}
        </TypingText>

        {/* Points d'animation pour indiquer le chargement */}
        <FadingDots
          count={5}
          innerProps={{
            class: 'bg-[#3d8091]',
          }}
        />
      </div>
    </div>
  );
};
