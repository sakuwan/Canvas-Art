/** === Circle === 
 *
 * * Generate a series of circles with the provided radii and segment counts
 *
 * @param major    Major radius of the circle
 * @param minor    Minor radius of the circle
 * @param segments Number of segments per circle
 * @param circles  Number of circles to in the series
*/

export const circleGeometry = (major, minor, segments, circles) => {
  const indices = new Uint16Array(segments * circles * 6);
  const vertices = new Float32Array((segments + 1) * (circles + 1) * 3);

  const circleStep = (major - minor) / circles;
  const segmentStep = (Math.PI * 2) / segments;

  for (let i = 0; i <= circles; i += 1) {
    const radius = minor + (i * circleStep);

    for (let j = 0; j <= segments; j += 1) {
      const vertexOffset = (i * (segments + 1) + j) * 3;

      const theta = j * segmentStep;

      vertices[vertexOffset + 0] = radius * Math.cos(theta);
      vertices[vertexOffset + 1] = radius * Math.sin(theta);
      vertices[vertexOffset + 2] = 0;
    }
  }

  for (let i = 0; i < circles; i += 1) {
    for (let j = 0; j < segments; j += 1) {
      const indexOffset = (i * segments + j) * 6;
      const vertexOffset = i * (segments + 1) + j;

      indices[indexOffset + 0] = vertexOffset;
      indices[indexOffset + 1] = vertexOffset + segments + 1;
      indices[indexOffset + 2] = vertexOffset + 1;
      indices[indexOffset + 3] = vertexOffset + segments + 1;
      indices[indexOffset + 4] = vertexOffset + segments + 2;
      indices[indexOffset + 5] = vertexOffset + 1;
    }
  }

  return { vertices, indices };
};
