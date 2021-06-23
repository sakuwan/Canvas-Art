/** === Sphere === 
 *
 * * Generate a sphere with the provided radius and segment counts
 *
 * @param radius            Radius of the sphere
 * @param azimuthalSegments Number of longitudinal segments
 * @param polarSegments     Number of colatitudinal segments
*/

export const sphereGeometry = (radius, azimuthalSegments, polarSegments) => {
  const indexCount = (polarSegments < 3)
    ? polarSegments * azimuthalSegments * 3
    : (polarSegments - 1) * azimuthalSegments * 6;

  const indices = new Uint16Array(indexCount);
  const vertices = new Float32Array((azimuthalSegments + 1) * (polarSegments + 1) * 3);

  const sphereFaces = Array.from({ length: polarSegments + 1 },
    (_, i) => 
      Array.from({ length: azimuthalSegments + 1 },
        (__, j) => i * (azimuthalSegments + 1) + j
      )
  );

  const polarStep = Math.PI / polarSegments;
  const azimuthalStep = (Math.PI * 2) / azimuthalSegments;
  const segmentDifference = (polarSegments + 1) + (azimuthalSegments - polarSegments);

  // Polar segments
  for (let i = 0; i <= polarSegments; i += 1) {
  	const theta = i * polarStep;
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);

		// Azimuthal segments
    for (let j = 0; j <= azimuthalSegments; j += 1) {
      const vertexOffset = (i * segmentDifference + j) * 3;

    	const phi = j * azimuthalStep;
      const cosPhi = Math.cos(phi);
      const sinPhi = Math.sin(phi);

      // Parametric equation of a sphere
      vertices[vertexOffset + 0] = radius * sinTheta * cosPhi;
      vertices[vertexOffset + 1] = radius * sinTheta * sinPhi;
      vertices[vertexOffset + 2] = radius * cosTheta;
    }
  }

  let indexOffset = 0;
  for (let i = 0; i < polarSegments; i += 1) {
    for (let j = 0; j < azimuthalSegments; j += 1) {
      if (i > 0) {
        indices[indexOffset + 0] = sphereFaces[i][j + 1];
        indices[indexOffset + 1] = sphereFaces[i][j];
        indices[indexOffset + 2] = sphereFaces[i + 1][j + 1];

        indexOffset += 3;
      }

      if (i < polarSegments - 1) {
        indices[indexOffset + 0] = sphereFaces[i][j];
        indices[indexOffset + 1] = sphereFaces[i + 1][j];
        indices[indexOffset + 2] = sphereFaces[i + 1][j + 1];

        indexOffset += 3;
      }
    }
  }

  return { vertices, indices };
};
