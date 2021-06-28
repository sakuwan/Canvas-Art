export const round = (value, precision = 0) => {
    const precisionScale = Math.pow(10, precision);
    return Math.round(value * precisionScale) / precisionScale;
};

export const clamp = (value, min = 0, max = 1) => {
  return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max));
}

export const scale = (value, fromMin, fromMax, toMin, toMax, isClamped = false) => {
  const scaledValue = (value - fromMin) * (toMax - toMin) / (fromMax - fromMin) + toMin;

  return isClamped
    ? clamp(scaledValue, Math.min(toMin, toMax), Math.max(toMin, toMax))
    : scaledValue;
};

export const lerp = (a, b, alpha) => a * (1 - alpha) + b * alpha;

export const step = (edge, value) => value < edge ? 0 : 1;
export const smoothStep = (min, max, value) => {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));

  return x * x * (3 - 2 * x);
}

export const mod = (value, n) => (value % n + n) % n;
export const fract = (value) => value - Math.floor(value);

export const rand = (min, max) => {
  if (min === undefined) return Math.random();
  if (min === max) return min;

  return Math.floor(Math.random() * (max + 1 - min) + min);
};

export const degrees = (r) => r * (180 / Math.PI);
export const radians = (d) => d * (Math.PI / 180);
