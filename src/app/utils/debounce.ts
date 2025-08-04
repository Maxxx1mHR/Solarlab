export const debounce = <T extends string[]>(
  fn: (...args: T) => void,
  ms: number
) => {
  let timeout: ReturnType<typeof setTimeout>;

  return function (...args: T) {
    const fnCall = () => {
      fn(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(fnCall, ms);
  };
};
