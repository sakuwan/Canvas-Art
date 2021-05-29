const [canvasEl] = [...document.getElementsByClassName('fg')];
const canvasCtx = canvasEl.getContext('2d');

let noiseImage = null;
let noiseBuffer = null; 

const resizeHandler = () => {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  canvasEl.width = windowWidth / 2;
  canvasEl.height = windowHeight / 2;
  canvasEl.style.width = `${windowWidth}px`;
  canvasEl.style.height = `${windowHeight}px`;

  noiseImage = canvasCtx.createImageData(windowWidth / 2, windowHeight / 2);
  noiseBuffer = new Uint32Array(noiseImage.data.buffer);
};

resizeHandler();
window.addEventListener('resize', resizeHandler);

const createNoise = () => {
  const { length } = noiseBuffer;
  for (let i = 0; i < length; i += 1) {
    noiseBuffer[i] = (255 * Math.pow(Math.random(), 0.2)) << 24;
  }

  canvasCtx.putImageData(noiseImage, 0, 0);
};

let currentFrame = -1;
(function mainLoop() {
  currentFrame += 1;
  if (currentFrame % 50) {
    return requestAnimationFrame(mainLoop);
  }

  currentFrame = 0;
  createNoise();

  requestAnimationFrame(mainLoop);
})();