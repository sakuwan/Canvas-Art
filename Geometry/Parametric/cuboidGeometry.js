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
};

export const cuboidGeometry = (width, height, depth, segments) => {
  const vertexSegments = segments + 1;

  const makeFace = (geometry, [axis, direction], index) => {
    const { vertices, indices } = geometry;

    const [x, y, z] = axis;
    const [xDir, yDir] = direction;

    const [w, h, d] = getFaceDimensions(axis, width, height, depth, index);

    const xSegment = (w * 2) / segments;
    const ySegment = (h * 2) / segments;

    const vertexGroup = (vertexSegments ** 2) * index * 3;

    for (let i = 0; i < vertexSegments; i += 1) {
      const yStep = i * ySegment - h;

      for (let j = 0; j < vertexSegments; j += 1) {
        const xStep = j * xSegment - w;

        const currentStride = (i * vertexSegments + j) * 3;
        const currentOffset = vertexGroup + currentStride;

        const orderedVertex = {
          [x]: xStep * xDir,
          [y]: yStep * yDir,
          [z]: d,
        };

        vertices[currentOffset + 0] = orderedVertex.x;
        vertices[currentOffset + 1] = orderedVertex.y;
        vertices[currentOffset + 2] = orderedVertex.z;
      }
    }

    const indexGroup = (segments ** 2) * index * 6;
    const vertexOffset = (vertexSegments ** 2) * index;

    for (let i = 0; i < segments; i += 1) {
      const offsetY1 = vertexOffset + vertexSegments * i;
      const offsetY2 = vertexOffset + vertexSegments * (i + 1);

      for (let j = 0; j < segments; j += 1) {
        const currentStride = (i * segments + j) * 6;
        const currentOffset = indexGroup + currentStride;

        indices[currentOffset + 0] = offsetY1 + j;
        indices[currentOffset + 1] = offsetY2 + j;
        indices[currentOffset + 2] = offsetY1 + (j + 1);

        indices[currentOffset + 3] = offsetY2 + j;
        indices[currentOffset + 4] = offsetY2 + (j + 1);
        indices[currentOffset + 5] = offsetY1 + (j + 1);
      }
    }

    return geometry;
  };

  const indexCount = (segments ** 2) * 6 * 6;
  const vertexCount = (vertexSegments ** 2) * 6 * 3;

  return CUBOID_FACES.reduce(makeFace, {
    indices: new Uint16Array(indexCount),
    vertices: new Float64Array(vertexCount),
  });
};
