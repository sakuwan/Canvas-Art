export const TAU = Math.PI * 2;
export const HALF_PI = Math.PI * 0.5;
export const PHI = (1 + Math.sqrt(5)) * 0.5;

export const round = (value, precision = 0) => {
  const precisionScale = 10 ** precision;

  return Math.round(value * precisionScale) / precisionScale;
};

export const clamp = (value, min = 0, max = 1) => (
  Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max))
);

export const scale = (value, fromMin, fromMax, toMin, toMax, isClamped = false) => {
  const scaledValue = (value - fromMin) * ((toMax - toMin) / (fromMax - fromMin)) + toMin;

  return isClamped
    ? clamp(scaledValue, Math.min(toMin, toMax), Math.max(toMin, toMax))
    : scaledValue;
};

export const lerp = (a, b, alpha) => (1 - alpha) * a + b * alpha;
export const invlerp = (a, b, alpha) => (a !== b ? (alpha - a) / (b - a) : 0);

export const step = (edge, value) => (value < edge ? 0 : 1);
export const smoothStep = (min, max, value) => {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));

  return x * x * (3 - 2 * x);
};
export const smootherStep = (min, max, value) => {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));

  return x * x * x * (x * (x * 6 - 15) + 10);
};

export const mod = (value, n) => ((value % n) + n) % n;
export const fract = (value) => value - Math.floor(value);

export const rand = (min, max) => {
  if (min === undefined) return Math.random();
  if (min === max) return min;

  return Math.floor(Math.random() * (max + 1 - min) + min);
};

export const degrees = (r) => r * (180 / Math.PI);
export const radians = (d) => d * (Math.PI / 180);

export const angle = (a, b) => Math.atan2(a, b);
export const distance = (a, b) => (a ** 2 + b ** 2) ** 0.5;
