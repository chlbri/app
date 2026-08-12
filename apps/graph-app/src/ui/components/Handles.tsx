import { Fragment, useMemo, type CSSProperties, type FC } from 'react';
import { Handle, Position, useNodes } from 'reactflow';
import { calculateHandlePosition, sizeHandle } from '../helpers/styles';

type Props = {
  disposition?: 'vertical' | 'horizontal';
  size?: number;
  id: string;
  color: CSSProperties['color'];
};

export const Handles: FC<Props> = ({
  disposition = 'horizontal',
  size = 12,
  id,
  color,
}) => {
  const nodes = useNodes();

  const childNodes = useMemo(() => {
    const out = nodes.filter(n => n.parentId === id).map(({ id }) => id);
    if (out.length === 0) out.push('alone');
    return out;
  }, [nodes.length, id]);

  const [css, padding] = sizeHandle(size);
  const isHorizontal = disposition === 'horizontal';
  const target = isHorizontal ? Position.Left : Position.Top;
  const source = isHorizontal ? Position.Right : Position.Bottom;

  return childNodes.map((childID, index, { length }) => {
    const _index = (index + 1)
      .toString()
      .padStart(Math.log10(length + 1), '0');

    const key = `${id}->${childID}->${_index}`;
    const positionning = calculateHandlePosition(index, length);

    const common: CSSProperties = {
      [isHorizontal ? 'top' : 'left']: positionning,
      backgroundColor: color,
      ...css,
      zIndex: 3,
    };

    return (
      <Fragment key={key}>
        <Handle
          id={`${key}->${target}`}
          type='target'
          position={target}
          style={{ [isHorizontal ? 'left' : 'top']: padding, ...common }}
        />
        <Handle
          id={`${key}->${source}`}
          position={source}
          type='source'
          style={{
            [isHorizontal ? 'right' : 'bottom']: padding,
            ...common,
          }}
        />
      </Fragment>
    );
  });
};
