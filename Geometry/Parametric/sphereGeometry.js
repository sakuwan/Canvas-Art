/** === Sphere === 
 *
 * * Generate a sphere with the provided radius and segment counts
 *
 * @param radius            Radius of the sphere
 * @param azimuthalSegments Number of longitudinal segments
 * @param polarSegments     Number of colatitudinal segments
*/

export const sphereGeometry = (radius, azimuthalSegments, polarSegments) => {
  const indices = new Uint16Array();
  const vertices = new Float32Array((azimuthalSegments + 1) * (polarSegments + 1) * 3);

  const polarStep = Math.PI / polarSegments;
	const azimuthalStep = (Math.PI * 2) / azimuthalSegments;

  // Polar segments
  for (let i = 0; i <= polarSegments; i += 1) {
  	const theta = i * polarStep;
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);

		// Azimuthal segments
    for (let j = 0; j <= azimuthalSegments; j += 1) {
      const vertexOffset = (i * polarSegments + j) * 3;

    	const phi = j * azimuthalStep;
      const cosPhi = Math.cos(phi);
      const sinPhi = Math.sin(phi);

      // Parametric equation of a sphere
      vertices[vertexOffset + 0] = radius * sinTheta * cosPhi;
      vertices[vertexOffset + 1] = radius * sinTheta * sinPhi;
      vertices[vertexOffset + 2] = radius * cosTheta;
    }
  }

  return vertices;
};
