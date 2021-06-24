/** === Torus ===
 *
 * * Generate a torus with the provided radii and segment counts
 *
 * @param major    Major radius of the torus
 * @param minor    Minor radius of the torus
 * @param rings    Number of rings to form the torus
 * @param segments Number of segments per ring
*/

export const torusGeometry = (major, minor, rings, segments) => {
  const indices = new Uint16Array(rings * segments * 6);
  const vertices = new Float32Array((rings + 1) * (segments + 1) * 3);

  const ringStep = (Math.PI * 2) / rings;
  const segmentStep = (Math.PI * 2) / segments;
  const segmentDifference = (rings + 1) + (segments - rings);

  for (let i = 0; i <= rings; i += 1) {
    const theta = i * ringStep;
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);

    for (let j = 0; j <= segments; j += 1) {
      const vertexOffset = (i * segmentDifference + j) * 3;

      const phi = j * segmentStep;

      vertices[vertexOffset + 0] = (major + minor * cosTheta) * Math.cos(phi);
      vertices[vertexOffset + 1] = (major + minor * cosTheta) * Math.sin(phi);
      vertices[vertexOffset + 2] = minor * sinTheta;
    }
  }

  for (let i = 1; i <= rings; i += 1) {
    for (let j = 1; j <= segments; j += 1) {
      const indexOffset = ((i - 1) * segments + (j - 1)) * 6;

      indices[indexOffset + 0] = (segments + 1) * i + j - 1;
      indices[indexOffset + 1] = (segments + 1) * (i - 1) + j - 1;
      indices[indexOffset + 2] = (segments + 1) * i + j;

      indices[indexOffset + 3] = (segments + 1) * (i - 1) + j - 1;
      indices[indexOffset + 4] = (segments + 1) * (i - 1) + j;
      indices[indexOffset + 5] = (segments + 1) * i + j;
    }
  }

  return { vertices, indices };
};
