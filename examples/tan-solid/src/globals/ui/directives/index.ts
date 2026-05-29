/* eslint-disable @typescript-eslint/no-namespace */

export * from './clickoutside';

// Déclaration du module pour la directive clickOutside
declare module 'solid-js' {
  namespace JSX {
    interface Directives {
      clickOutside: () => void;
    }
  }
}
