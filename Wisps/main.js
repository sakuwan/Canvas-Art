import { lerp } from '../Math/utility';
import { SimpleCanvas } from '../SimpleCanvas/SimpleCanvas';

const PARTICLE_CONFIG = {
  particleCount: 2500,

  particleSpeed: { x: 2, y: 1 },
  particleWeight: 0.985,

  particleColor: 'rgba(255, 255, 255, 1)',
};

(function() {
  const simpleCanvas = new SimpleCanvas();
  const { width, height } = simpleCanvas.getCanvas();

  /* Info :: [x, y, x_velocity, y_velocity] */
  const particleInfo = new Float32Array(PARTICLE_CONFIG.particleCount * 4);
  for (let i = 0; i < PARTICLE_CONFIG.particleCount; i += 1) {
    const indexOffset = i * 4;

    particleInfo[indexOffset + 0] = Math.random() * width;
    particleInfo[indexOffset + 1] = Math.random() * height;
  }

  const checkParticleBounds = (index, boundX, boundY) => {
    const particleX = particleInfo[index];
    const particleY = particleInfo[index + 1];

    if (particleX > boundX) particleInfo[index] = 0;
    if (particleX < 0) particleInfo[index] = boundX;
    
    if (particleY > boundY) particleInfo[index + 1] = 0;
    if (particleY < 0) particleInfo[index + 1] = boundY;
  }

  const updateParticleInfo = (index) => {
    const prevPositionX = particleInfo[index];
    const prevPositionY = particleInfo[index + 1];
    const prevVelocityX = particleInfo[index + 2];
    const prevVelocityY = particleInfo[index + 3];
    
    const jitterTheta = (Math.random() * 2 - 1) * Math.PI * 2;

    const velocityX = lerp(
      prevVelocityX, 
      Math.cos(jitterTheta) * PARTICLE_CONFIG.particleSpeed.x,
      1 - PARTICLE_CONFIG.particleWeight,
    );

    const velocityY = lerp(
      prevVelocityY,
      Math.sin(jitterTheta) * PARTICLE_CONFIG.particleSpeed.y,
      1 - PARTICLE_CONFIG.particleWeight,
    );

    const positionX = prevPositionX + velocityX;
    const positionY = prevPositionY + velocityY;

    particleInfo[index + 0] = positionX;
    particleInfo[index + 1] = positionY;
    particleInfo[index + 2] = velocityX;
    particleInfo[index + 3] = velocityY;

    return [prevPositionX, prevPositionY, positionX, positionY];
  }

  const onRender = (_, canvas) => {
    const ctx = canvas.getContext();

    const boundX = canvas.getCanvas().width;
    const boundY = canvas.getCanvas().height;

    ctx.fillRect(0, 0, boundX, boundY);

    for (let i = 0; i < PARTICLE_CONFIG.particleCount; i += 1) {
      const indexOffset = i * 4;

      checkParticleBounds(indexOffset, boundX, boundY);
      const [x1, y1, x2, y2] = updateParticleInfo(indexOffset);

      ctx.beginPath();

      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);

      ctx.stroke();
      ctx.closePath();
    }
  }

  const ctx = simpleCanvas.getContext();

  ctx.lineWidth = 1;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.strokeStyle = PARTICLE_CONFIG.particleColor;

  simpleCanvas.setRender(onRender);
  simpleCanvas.start();
})();
