import { mulberry32 } from './prng';

/**
 * @function simplexNoise
 * @description Generate a 3D simplex noise function, with the provided seed
 *
 * @param {function|number} [prng=null] - Function or seed for internal PRNG
 * @returns {function} - Seeded 3D simplex noise function
 *
 * @see https://weber.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf
 */
export const simplexNoise = (prng = null) => {
  const F3 = 1 / 3;
  const G3 = 1 / 6;
  const G3_2 = G3 * 2;
  const G3_3 = G3 * 3;

  const grad3 = new Float32Array([
    1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 
    1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1,
    0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1,
  ]);

  const simplexOrder = new Uint8Array([
    1, 0, 0, 1, 1, 0, // XYZ
    1, 0, 0, 1, 0, 1, // XZY
    0, 0, 1, 1, 0, 1, // ZXY
    0, 0, 1, 0, 1, 1, // ZYX
    0, 1, 0, 0, 1, 1, // YZX
    0, 1, 0, 1, 1, 0, // YXZ
  ]);

  const rand = (typeof prng === 'function')
    ? prng
    : mulberry32(prng ?? 0);

  const permTable = Uint8Array.from({ length: 256 }, (_, i) => i);
  for (let i = 0; i < 255; i += 1) {
    const j = i + Math.trunc(rand() * (256 - i));
    [permTable[i], permTable[j]] = [permTable[j], permTable[i]];
  }

  const permSet = Uint8Array.from({ length: 512 }, (_, i) => permTable[i & 255]);
  const permDir = Uint8Array.from({ length: 512 }, (_, i) => permSet[i] % 12);

  const gradientContribution = (t, gx, gy, gz, x, y, z) => {
    const t4 = t * t * t * t;
    const gi = permDir[gx + permSet[gy + permSet[gz]]] * 3;

    return t4 * (grad3[gi] * x + grad3[gi + 1] * y + grad3[gi + 2] * z);
  };

  return (x, y, z) => {
    const skewFactor = (x + y + z) * F3;
    const skewX = Math.floor(x + skewFactor);
    const skewY = Math.floor(y + skewFactor);
    const skewZ = Math.floor(z + skewFactor);

    const unskewFactor = (skewX + skewY + skewZ) * G3;
    const x0 = x - skewX + unskewFactor;
    const y0 = y - skewY + unskewFactor;
    const z0 = z - skewZ + unskewFactor;

    const simplexOffset = (x0 >= y0)
      ? (y0 >= z0) ? 0 : (x0 >= z0) ? 6 : 12
      : (y0 < z0) ? 18 : (x0 < z0) ? 24 : 30;

    const x1 = x0 - simplexOrder[simplexOffset] + G3;
    const y1 = y0 - simplexOrder[simplexOffset + 1] + G3;
    const z1 = z0 - simplexOrder[simplexOffset + 2] + G3;

    const x2 = x0 - simplexOrder[simplexOffset + 3] + G3_2;
    const y2 = y0 - simplexOrder[simplexOffset + 4] + G3_2;
    const z2 = z0 - simplexOrder[simplexOffset + 5] + G3_2;

    const x3 = x0 - 1 + G3_3;
    const y3 = y0 - 1 + G3_3;
    const z3 = z0 - 1 + G3_3;

    const permX = skewX & 255;
    const permY = skewY & 255;
    const permZ = skewZ & 255;

    const t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
    const n0 = (t0 < 0) ? 0 : gradientContribution(
      t0, permX, permY, permZ, x0, y0, z0,
    );

    const t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
    const n1 = (t1 < 0) ? 0 : gradientContribution(
      t1,
      permX + simplexOrder[simplexOffset],
      permY + simplexOrder[simplexOffset + 1],
      permZ + simplexOrder[simplexOffset + 2],
      x1, y1, z1,
    );

    const t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
    const n2 = (t2 < 0) ? 0 : gradientContribution(
      t2,
      permX + simplexOrder[simplexOffset + 3],
      permY + simplexOrder[simplexOffset + 4],
      permZ + simplexOrder[simplexOffset + 5],
      x2, y2, z2,
    );

    const t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
    const n3 = (t3 < 0) ? 0 : gradientContribution(
      t3, permX + 1, permY + 1, permZ + 1, x3, y3, z3,
    )

    return 32 * (n0 + n1 + n2 + n3);
  }
}
