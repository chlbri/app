import { isChildConfig, isEmitterConfig } from '#actors';
import { NodeConfig } from '#states';

export const constructEvents = (node: NodeConfig) => {
  const out: string[] = [];
  const on = node.on;
  if (on) {
    const keys = Object.keys(on);
    out.push(...keys);
  }
  const actors = node.actors;
  if (actors) {
    const entries = Object.entries(actors);
    entries.forEach(([key, actor]) => {
      const checkChild = isChildConfig(actor);
      const checkEmmiter = isEmitterConfig(actor);
      if (checkChild) {
        const on = actor.on;
        if (on) {
          const keys = Object.keys(on);
          keys.forEach(k => {
            out.push(`${key}::on::${k}`);
          });
        }
      } else if (checkEmmiter) {
        out.push(`${key}::next`);
        out.push(`${key}::error`);
      }
    });
  }

  const states = node.states;
  if (states) {
    const values = Object.values(states);
    values.forEach(state => {
      out.push(...constructEvents(state));
    });
  }

  return out;
};
