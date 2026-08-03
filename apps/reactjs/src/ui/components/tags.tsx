import type { Service } from '#/machines/counter';
import { useState } from '@bemedev/app-reactjs';
import type { FC } from 'react';
import { Badge } from './badge';

export const Tags: FC<{ service: Service }> = ({ service }) => {
  const tags = useState(service, { selector: s => s.tags });

  return (
    <div className='flex flex-wrap gap-2'>
      {tags.length > 0 ? (
        tags.map(tag => (
          <Badge key={tag} variant='blue' className='text-xs'>
            #{tag}
          </Badge>
        ))
      ) : (
        <span className='text-xs text-slate-500 italic'>
          No tags active
        </span>
      )}
    </div>
  );
};
