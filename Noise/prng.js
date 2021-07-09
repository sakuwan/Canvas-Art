/**
 * @function mulberry32
 * @description Create a mulberry32 PRNG instance
 *
 * @param {uint32} [startSeed=0] - Initial seed
 * @returns {float} - A single [0..1] normalized float
 *
 * @see https://gist.github.com/tommyettinger/46a874533244883189143505d203312c
 */
export const mulberry32 = (startSeed = 0) => {
  const mulberryConstant = 0x6D2B79F5 | 0;

  let seed = startSeed | 0;
  return () => {
   	seed += mulberryConstant;

    const bitsA = Math.imul(seed ^ seed >>> 15, seed | 1);
    const bitsB = bitsA + Math.imul(bitsA ^ bitsA >>> 7, bitsA | 61) ^ bitsA;

    return ((bitsB ^ bitsB >>> 14) >>> 0) * 2.3283064365386963e-10;
  }
}
