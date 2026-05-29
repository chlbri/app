import type { ParentComponent } from 'solid-js';
import { createResourceContext, ResourceContext } from '../signals';

/**
 * Provider component for resource context
 *
 * Wrap your application with this component to provide
 * resource management capabilities to all child components.
 *
 * @example
 * ```tsx
 * import { ResourceProvider } from '~/globals/ui/signals/ressource';
 *
 * export default function Root() {
 *   return (
 *     <ResourceProvider>
 *       <Router />
 *     </ResourceProvider>
 *   );
 * }
 * ```
 */
export const RessourcesProvider: ParentComponent = props => {
  const value = createResourceContext();

  return (
    <ResourceContext.Provider value={value}>
      {props.children}
    </ResourceContext.Provider>
  );
};
