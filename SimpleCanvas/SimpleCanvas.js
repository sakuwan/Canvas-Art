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

  setPrerender(fn) { this.onPrerender = fn; }
  setRender(fn) { this.onRender = fn; }
  setPostrender(fn) { this.onPostrender = fn; }

  /* === Helper functions === */

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    return this;
  }

  fps(delta) {
    this.context.save();

    this.context.fillStyle = 'black';
    this.context.fillText(`FPS: ${1000 / delta}`, 16, 16);

    this.context.restore();

    return this;
  }
}
