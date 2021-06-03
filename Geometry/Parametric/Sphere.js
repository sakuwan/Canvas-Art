/** === Sphere === 
 *
 * * Generate a sphere with the provided radius and segment counts
 *
 * @param radius            Radius of the sphere
 * @param azimuthalSegments Number of longitudinal segments
 * @param polarSegments     Number of colatitudinal segments
*/

const sphereGeometry = (radius, azimuthalSegments, polarSegments) => {
  const polarStep = Math.PI / polarSegments;
	const azimuthalStep = (Math.PI * 2) / azimuthalSegments;

	const vertices = [];

  // Polar segments
  for (let i = 0; i <= polarSegments; i++) {
  	const theta = i * polarStep;
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);

		// Azimuthal segments
    for (let j = 0; j < azimuthalSegments; j++) {
    	const phi = j * azimuthalStep;
      const cosPhi = Math.cos(phi);
      const sinPhi = Math.sin(phi);

      // Parametric equation of a sphere
      const x = radius * sinTheta * cosPhi;
      const y = radius * sinTheta * sinPhi;
      const z = radius * cosTheta;

      vertices.push({x, y, z});
    }
  }

  return vertices;
};
