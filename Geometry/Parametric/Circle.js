/** === Circle === 
 *
 * * Generate a series of circles with the provided radii and segment counts
 *
 * @param major    Major radius of the circle
 * @param minor    Minor radius of the circle
 * @param segments Number of segments per circle
 * @param circles  Number of circles to in the series
*/

const circleGeometry = (major, minor, segments, circles) => {
  const circleStep = (major - minor) / circles;
  const segmentStep = (Math.PI * 2) / segments;

  const vertices = [];

  for (let i = 0; i <= circles; i += 1) {
    const radius = minor + (i * circleStep);

    for (let j = 0; j <= segments; j += 1) {
      const theta = j * segmentStep;

      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = 0;

      vertices.push({x, y, z});
    }
  }

  return vertices;
};
