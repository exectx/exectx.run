export function throttle<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
): T {
  let lastCallTime = 0;
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: any = null;

  const invoke = (args: Parameters<T>, context: any) => {
    func.apply(context, args);
    lastCallTime = Date.now();
  };

  return function (...args: Parameters<T>) {
    const now = Date.now();
    const remainingTime = wait - (now - lastCallTime);

    lastArgs = args;
    // @ts-ignore
    lastThis = this;

    if (remainingTime <= 0) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      // @ts-ignore
      invoke(args, this);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        invoke(lastArgs!, lastThis);
        timeout = null;
      }, remainingTime);
    }
  } as T;
}
