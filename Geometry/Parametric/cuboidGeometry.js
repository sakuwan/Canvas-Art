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
  const makeFace = (vertices, [axis, direction], index) => {
    const [x, y, z] = axis;
    const [xDir, yDir] = direction;

    const [w, h, d] = getFaceDimensions(axis, width, height, depth, index);

    const xSegment = (w * 2) / segments;
    const ySegment = (h * 2) / segments;

    for (let i = 0; i < segments + 1; i += 1) {
      const yStep = i * ySegment - h;

      for (let j = 0; j < segments + 1; j += 1) {
        const xStep = j * xSegment - w;

        let vertex = {};

        vertex[x] = xStep * xDir;
        vertex[y] = yStep * yDir;
        vertex[z] = d;

        vertices.push(vertex);
      }
    }

    return vertices;
  };

  return CUBOID_FACES.reduce(makeFace, []);
};
