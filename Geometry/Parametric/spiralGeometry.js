/** === Spiral ===
 *
 * * Generate a spherical spiral with the provided radius, segments, and curve
 *
 * @param radius   Radius of the spiral
 * @param segments Number of vertices / steps
 * @param curve    Number of twists around the axis
*/

export const spiralGeometry = (radius, segments, curve) => {
  const vertices = new Float32Array((segments + 1) * 3);

  const segmentStep = Math.PI / segments;

  for (let i = 0; i <= segments; i++) {
    const vertexOffset = i * 3;

  	const theta = i * segmentStep;
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);

    vertices[vertexOffset + 0] = radius * sinTheta * Math.cos(curve * theta);
    vertices[vertexOffset + 1] = radius * sinTheta * Math.sin(curve * theta);
    vertices[vertexOffset + 2] = radius * cosTheta;
  }

  return { vertices, indices: null };
}
