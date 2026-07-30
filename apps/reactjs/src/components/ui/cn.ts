import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

type Props = Parameters<typeof clsx>[0];
export const cn = (...inputs: Props[]) => {
  return twMerge(clsx(inputs));
};
