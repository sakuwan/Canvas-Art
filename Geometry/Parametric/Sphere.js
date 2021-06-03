/* === Sphere === 
 *
 * Generate a sphere with the provided radius and segment counts
 *
 * Parameters:
 *
 * radius - Radius of the generated sphere
 * azimuthalSegments - Longitudinal segment count for the generated sphere
 * polarSegments - Colatitudinal segment count for the generated sphere
*/

const sphereGeometry = (radius, azimuthalSegments, polarSegments) => {
	const azimuthalSteps = (Math.PI * 2) / azimuthalSegments;
  const polarSteps = Math.PI / polarSegments;

	const vertices = [];

  // Polar segments
  for (let i = 0; i <= polarSegments; i++) {
  	const theta = i * polarSteps;
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);

		// Azimuthal segments
    for (let j = 0; j < azimuthalSegments; j++) {
    	const phi = j * azimuthalSteps;
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
