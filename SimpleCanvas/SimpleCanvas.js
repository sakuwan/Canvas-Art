const noop = () => {};

export class SimpleCanvas {
  constructor(queryString = '', contextType = '2d') {
    const canvasElement = document.querySelector(
      queryString.length ? queryString : 'canvas'
    );

    if (canvasElement === null) throw new TypeError('No matching or valid canvas found');

    this.canvas = canvasElement;
    this.context = canvasElement.getContext(contextType);

    this.lastDelta = 0;
    this.elapsedTime = 0;

    this.isPaused = true;
    this.rafHandle = null;
    this.rafCallback = this.loop.bind(this);

    this.onPrerender = noop;
    this.onRender = noop;
    this.onPostrender = noop;

    this.resize();
  }

  resize(w = null, h = null) {
    const { canvas, context } = this;

    if (w === null || h === null) {
      const { width, height } = canvas.parentElement.getBoundingClientRect();

      canvas.width = w ?? width;
      canvas.height = h ?? height;
    } else {
      canvas.width = w;
      canvas.height = h;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  loop(delta) {
    const deltaTime = delta - this.lastDelta;

    this.lastDelta = delta;
    this.elapsedTime += deltaTime;

    this.onPrerender(deltaTime, this);
    this.onRender(deltaTime, this);
    this.onPostrender(deltaTime, this);

    if (!this.isPaused) this.rafHandle = requestAnimationFrame(this.rafCallback);
  }

  start() {
    if (!this.isPaused) return;

    this.isPaused = false;
    this.rafHandle = requestAnimationFrame(this.rafCallback);
  }

  stop() {
    if (this.isPaused) return;
    if (this.rafHandle) cancelAnimationFrame(this.rafHandle);

    this.isPaused = true;
    this.rafHandle = null;
  }

  getCanvas() { return this.canvas; }
  getContext() { return this.context; }
  getDimensions() { return [ this.canvas.width, this.canvas.height ]; }

  setPrerender(fn) { this.onPrerender = fn; }
  setRender(fn) { this.onRender = fn; }
  setPostrender(fn) { this.onPostrender = fn; }

  /* === Helper functions === */

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    return this;
  }

  fps(delta, color = 'black') {
    this.context.save();

    this.context.fillStyle = color;
    this.context.fillText(`FPS: ${1000 / delta}`, 16, 16);

    this.context.restore();

    return this;
  }

  axis(gridWidth, gridHeight) {
  	const { context } = this;
  	const { width, height } = this.canvas;

    const lineCountX = Math.floor(height / gridHeight);
    const lineCountY = Math.floor(width / gridWidth);

    const centerAxisX = Math.floor((lineCountX / 2));
    const centerAxisY = Math.floor((lineCountY / 2));

    const offsetX = ((height / gridHeight) / 2) % 1;
    const offsetY = ((width / gridWidth) / 2) % 1;

		context.save();
    context.lineWidth = 1;

    context.strokeStyle = '#E9E9E9'
		context.beginPath();

    for (let i = 0; i <= lineCountX; i += 1) {
    	if (i !== centerAxisX) {
    		const overflowX = i + offsetX;

        context.moveTo(0, gridHeight * overflowX + 0.5);
        context.lineTo(width, gridHeight * overflowX + 0.5);
      }
    }

    for (let i = 0; i <= lineCountY; i += 1) {
    	if (i !== centerAxisY) {
    		const overflowY = i + offsetY;

        context.moveTo(gridWidth * overflowY + 0.5, 0);
        context.lineTo(gridWidth * overflowY + 0.5, height);
      }
    }

    context.stroke();

    context.strokeStyle = '#000000';
    context.beginPath();

		context.moveTo(0, gridHeight * (centerAxisX + offsetX) + 0.5);
		context.lineTo(width, gridHeight * (centerAxisX + offsetX) + 0.5);

		context.moveTo(gridWidth * (centerAxisY + offsetY) + 0.5, 0);
		context.lineTo(gridWidth * (centerAxisY + offsetY) + 0.5, height);

    context.stroke();

    context.restore();

    return this;
  }
}
