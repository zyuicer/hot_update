export function wait(delay: number) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(undefined);
    }, delay);
  });
}
