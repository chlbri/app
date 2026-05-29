import {
  createDeferred,
  createSignal,
  onCleanup,
  onMount,
} from 'solid-js';

/**
 * Crée un signal d'intersection qui détecte quand un élément entre dans le viewport.
 * Utilise l'API IntersectionObserver pour surveiller la visibilité d'un élément.
 *
 * @param options - Options de configuration pour l'IntersectionObserver
 * @param options.threshold - Pourcentage de visibilité nécessaire pour déclencher l'intersection (par défaut: 0.1)
 * @param options.root - Élément racine utilisé comme viewport (par défaut: viewport du navigateur)
 * @param options.rootMargin - Marge autour de l'élément racine
 * @returns Un tuple contenant:
 *   - [0] `intersecting`: Signal différé indiquant si l'élément est visible
 *   - [1] `setRef`: Fonction à passer comme ref à l'élément HTML à observer
 *
 * @example
 * ```tsx
 * const [visible, setRef] = createIntersect({ threshold: 0.5 });
 *
 * return (
 *   <div ref={setRef}>
 *     {visible() ? 'Element is visible!' : 'Element is hidden'}
 *   </div>
 * );
 * ```
 *
 * @example
 * Utilisation avec createWindowHandler
 * ```tsx
 * const [visible, setRef] = createIntersect();
 *
 * createWindowHandler('scroll', handleScroll, visible);
 *
 * return <section ref={setRef}>Content</section>;
 * ```
 */
export const createIntersect = (
  options: IntersectionObserverInit = { threshold: 0.1 },
) => {
  let observer: IntersectionObserver | undefined;
  const [isIntersecting, setIsIntersecting] = createSignal(false);
  let ref: HTMLElement | null = null;

  onMount(() => {
    observer = new IntersectionObserver(entries => {
      const first = entries[0];
      setIsIntersecting(first.isIntersecting);
    }, options);

    if (ref) observer?.observe(ref);
  });
  // Ne rien faire côté serveur

  const intersecting = createDeferred(isIntersecting, {
    timeoutMs: 15,
  });
  const setRef = (el: HTMLElement) => (ref = el);
  onCleanup(() => observer?.disconnect());

  return [intersecting, setRef] as const; // Return signal and ref setter
};
