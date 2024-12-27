export const getRoundedInt = (value: number, n: number) =>
  Math.ceil(value * (10 * n)) / (10 * n);
