import type { Accessor, Component } from 'solid-js';

const Counter: Component<{
  onClick: () => void;
  count: Accessor<number>;
  label: string;
}> = ({ onClick, label, count }) => {
  return (
    <button
      class='px-5 py-3 bg-blue-200 text-blue-800 rounded-2xl border-2 border-gray-900 outline-none cursor-pointer focus:border-blue-600 active:bg-gray-200'
      onClick={onClick}
      type='button'
    >
      {`${label}${count()}`}
    </button>
  );
};

export default Counter;
