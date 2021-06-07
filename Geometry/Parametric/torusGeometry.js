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
  const ringStep = (Math.PI * 2) / rings;
  const segmentStep = (Math.PI * 2) / segments;

  const vertices = [];

  for (let i = 0; i < rings; i += 1) {
    const theta = i * ringStep;

    for (let j = 0; j < segments; j += 1) {
      const phi = j * segmentStep;

      const x = (major + minor * Math.cos(phi)) * Math.cos(theta);
      const y = (major + minor * Math.cos(phi)) * Math.sin(theta);
      const z = minor * Math.sin(phi);

      vertices.push({x, y, z});
    }
  }

  return vertices;
};
