/** === Cuboid === 
 *
 * * Generate a cuboid with the provided dimensions and segment counts
 *
 * @param width    Width of the cuboid
 * @param height   Height of the cuboid
 * @param depth    Depth of the cuboid
 * @param segments Number of segments per face
*/

const CUBOID_FACES = [
  ['zyx', [-1, -1]],
  ['zyx', [1, -1]],
  ['xzy', [1, 1]],
  ['xzy', [1, -1]],
  ['xyz', [1, -1]],
  ['xyz', [-1, -1]],
];

const getFaceDimensions = (axis, width, height, depth, index) => {
  switch (axis) {
    case 'zyx':
      return [depth / 2, height / 2, (index % 2 > 0) ? -width / 2 : width / 2];
    case 'xzy':
      return [width / 2, depth / 2, (index % 2 > 0) ? -height / 2 : height / 2];
    case 'xyz':
      return [width / 2, height / 2, (index % 2 > 0) ? -depth / 2 : depth / 2];
    
    default:
      throw new TypeError(`Invalid axis: ${axis}`);
  }
}

export const cuboidGeometry = (width, height, depth, segments) => {
  const makeFace = (geometry, [axis, direction], index) => {
    const { vertices, indices } = geometry;

    const [x, y, z] = axis;
    const [xDir, yDir] = direction;

    const [w, h, d] = getFaceDimensions(axis, width, height, depth, index);

    const xSegment = (w * 2) / segments;
    const ySegment = (h * 2) / segments;

    const vertexOffset = vertices.length;

    for (let i = 0; i < segments + 1; i += 1) {
      const yStep = i * ySegment - h;

      for (let j = 0; j < segments + 1; j += 1) {
        const xStep = j * xSegment - w;

        vertices.push({
          [x]: xStep * xDir,
          [y]: yStep * yDir,
          [z]: d,
        });
      }
    }

    for (let i = 0; i < segments; i += 1) {
      const offsetY1 = vertexOffset + (segments + 1) * i;
      const offsetY2 = vertexOffset + (segments + 1) * (i + 1);

      for (let j = 0; j < segments; j += 1) {
        const a = offsetY1 + j;
        const b = offsetY2 + j;
        const c = offsetY2 + (j + 1);
        const d = offsetY1 + (j + 1);

        indices.push(a, b, d, b, c, d);
      }
    }

    return geometry;
  };

  return CUBOID_FACES.reduce(makeFace, { vertices: [], indices: [] });
};
