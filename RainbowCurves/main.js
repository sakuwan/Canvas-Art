class ArtCanvas {
  constructor(queryString = '', contextType = '2d') {
    const canvasElement = queryString.length ?
      document.getElementById(queryString) :
      document.querySelector('canvas');

    if (!canvasElement) throw new TypeError('No valid canvas element found');

    this.canvas = canvasElement;
    this.context = canvasElement.getContext(contextType);

    this.resize();
  }

  resize(w = null, h = null) {
    const parentElement = this.canvas.closest('div') ?? this.canvas.parentElement;
    const { width, height } = window.getComputedStyle(parentElement);

    this.canvas.width = w ?? parseInt(width);
    this.canvas.height = h ?? parseInt(height);

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  getCanvas() { return this.canvas; }
  getContext() { return this.context; }
}

class BezierCurve {
  constructor(width, height, offset, duration) {
    const adjustedHeight = height - offset;
  
    const halfWidth = width / 2;
    const halfHeight = adjustedHeight / 2;

    const randomPointX = (v = 0) => v + (Math.random() * halfWidth);
    const randomPointY = (v = 0) => v + (Math.random() * halfHeight - halfHeight / 2) + halfHeight;

    this.x1 = Math.floor(-width / 2);
    this.y1 = Math.floor(randomPointY(offset));
    this.d1 = Math.random() * (halfHeight / 2) + halfHeight / 2;

    this.x2 = Math.floor(width * 1.5);
    this.y2 = Math.floor(randomPointY(offset));
    this.d2 = Math.random() * (halfHeight / 2) + halfHeight / 2;

    this.cp1 = this.weightedControlPoint(
      randomPointX(), randomPointY(offset), halfWidth, halfHeight
    );

    this.cp2 = this.weightedControlPoint(
      randomPointX(halfWidth), randomPointY(offset), halfWidth, halfHeight
    );

    this.elapsedTime = 0;
    this.currentFreq = Math.random() * Math.PI * 2;
    this.duration = (duration * 1000);
  }

  update(delta) {
    const scaledDelta = (delta - this.elapsedTime) / this.duration;
    
    this.elapsedTime = delta;
    this.currentFreq += scaledDelta * Math.PI * 2;
    if (this.currentFreq > Math.PI * 2) this.currentFreq = scaledDelta;
  }
  
  render(ctx) {
    const y1 = this.y1 + this.d1 * Math.sin(this.currentFreq + Math.PI);
    const y2 = this.y2 + this.d2 * Math.sin(this.currentFreq - Math.PI);
  
    ctx.save();
    ctx.beginPath();
    
    ctx.moveTo(this.x1, y1);
    ctx.bezierCurveTo(...this.interpolateControlPoints(), this.x2, y2);

    ctx.stroke();
    ctx.closePath();
    
    ctx.restore();
  }

  weightedControlPoint(startX, startY, width, height) {
    const theta = Math.random() * Math.PI * 2;

    const offsetX = width + Math.sin(theta);
    const offsetY = height * Math.sin(theta);

    const endX = startX + offsetX < 0 ? startX - offsetX : startX + offsetX;
    const endY = (startY + offsetY < 0 || startY + offsetY > (height * 2)) 
                    ? startY - offsetY
                    : startY + offsetY;

    return { startX, startY, endX, endY };
  }

  interpolateControlPoints() {
    const { cp1, cp2 } = this;

    return [
      cp1.startX + (cp1.endX - cp1.startX) * (0.5 + 0.5 * Math.sin(this.currentFreq)),
      cp1.startY + (cp1.endY - cp1.startY) * (0.5 + 0.5 * Math.sin(this.currentFreq)),

      cp2.startX + (cp2.endX - cp2.startX) * (0.5 + 0.5 * Math.sin(this.currentFreq)),
      cp2.startY + (cp2.endY - cp2.startY) * (0.5 + 0.5 * Math.sin(this.currentFreq)),
    ]
  }
}

const createRainbowPhaser = (duration) => {
  let freqDelta = 0;
  let elapsedTime = 0;

  return (delta) => {
    const scaledDelta = (delta - elapsedTime) / (1000 * duration);

    elapsedTime = delta;
    freqDelta += scaledDelta;
    if (freqDelta > 1) freqDelta -= 1;

    const colorPhase = (Math.PI * 2) * freqDelta;
    const r = Math.sin(colorPhase) * 127 + 128;
    const g = Math.sin(colorPhase + 2.0943951023931953) * 127 + 128;
    const b = Math.sin(colorPhase + 4.1887902047863905) * 127 + 128;

    return `rgba(${r}, ${g}, ${b}, 0.05)`;
  }
};

(function() {
  const artCanvas = new ArtCanvas();

  const canvasEl = artCanvas.getCanvas();
  const canvasCtx = artCanvas.getContext();

  /* === Height offset ===
   *
   * Since this is being used for my website, I didn't want to bother with
   * fully bounds-checking the bezier curves (quite expensive!), so this simply
   * adjusts the canvas element to be a bit larger and offsets the curves lower
   * to prevent them from poking out over text too much
   * 
   * Overkill, but it's fun to write
  */
  const { width, height } = canvasEl;
  const { height: neighborHeight } = window.getComputedStyle(document.querySelector('main'));
  const heightOffset = Math.floor(parseInt(neighborHeight) / 3);

  canvasEl.style.setProperty('top', `${canvasEl.offsetTop - heightOffset}px`);
  canvasEl.style.setProperty('height', `${height + heightOffset}px`);
  artCanvas.resize(width, height + heightOffset);
  
  const bCurves = Array.from({ length: 5 }, () => (
    new BezierCurve(width, height + heightOffset, heightOffset, 30)
  ));
  
  const rainbowPhaser = createRainbowPhaser(5);
  canvasCtx.globalCompositeOperation = 'xor';

  const renderCurves = (delta) => {
    canvasCtx.strokeStyle = rainbowPhaser(delta);

    for (const curve of bCurves) {
      curve.update(delta);
      curve.render(canvasCtx);
    }

    window.requestAnimationFrame(renderCurves);
  };
  
  window.requestAnimationFrame(renderCurves);
})();
