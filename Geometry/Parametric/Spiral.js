/** === Spiral ===
 *
 * * Generate a spherical spiral with the provided radius, segments, and curve
 *
 * @param radius   Radius of the spiral
 * @param segments Number of vertices / steps
 * @param curve    Number of twists around the axis
*/

export const spiralGeometry = (radius, segments, curve) => {
  const segmentStep = Math.PI / segments;

  const vertices = [];

  for (let i = 0; i <= segments; i++) {
  	const theta = i * segmentStep;
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);

    const x = radius * sinTheta * Math.cos(curve * theta);
    const y = radius * sinTheta * Math.sin(curve * theta);
    const z = radius * cosTheta;

    vertices.push({x, y, z});
  }

  return vertices;
}
