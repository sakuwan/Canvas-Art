const noop = () => {};

export class GLCanvas {
  constructor(queryString = '', contextType = 'webgl') {
    const canvasElement = document.querySelector(
      queryString.length ? queryString : 'canvas'
    );

    if (canvasElement === null) throw new TypeError('No matching or valid canvas found');

    this.canvas = canvasElement;
    this.context = canvasElement.getContext(contextType);
    if (contextType === 'webgl' && !this.context) {
      this.context = canvasElement.getContext('experimental-webgl');
    }

    this.gl = null;
    this.vertex = null;
    this.fragment = null;

    this.lastDelta = 0;
    this.elapsedTime = 0;

    this.isPaused = true;
    this.rafHandle = null;
    this.rafCallback = this.loop.bind(this);

    this.onPrerender = noop;
    this.onRender = noop;
    this.onPostrender = noop;
  }

  initialize(vertexContent, fragmentContent, clearColor = [0, 0, 0, 1]) {
    const { context } = this;

    const vertexShader = context.createShader(context.VERTEX_SHADER);
    const fragmentShader = context.createShader(context.FRAGMENT_SHADER);

    context.shaderSource(vertexShader, vertexContent);
    context.shaderSource(fragmentShader, fragmentContent);

    context.compileShader(vertexShader);
    context.compileShader(fragmentShader);

    const vertexSuccess = !!context.getShaderParameter(vertexShader, context.COMPILE_STATUS);
    if (!vertexSuccess) {
      const shaderError = context.getShaderInfoLog(vertexShader);
      throw new Error(`Failed to compile vertex shader: ${shaderError}`);
    }

    const fragmentSuccess = !!context.getShaderParameter(fragmentShader, context.COMPILE_STATUS);
    if (!fragmentSuccess) {
      const shaderError = context.getShaderInfoLog(fragmentShader);
      throw new Error(`Failed to compile fragment shader: ${shaderError}`);
    }

    const glProgram = context.createProgram();

    context.attachShader(glProgram, vertexShader);
    context.attachShader(glProgram, fragmentShader);
    context.linkProgram(glProgram);

    const programSuccess = !!context.getProgramParameter(glProgram, context.LINK_STATUS);
    if (!programSuccess) {
      const programError = context.getProgramInfoLog(glProgram);
      throw new Error(`Failed to link program: ${programError}`);
    }

    context.useProgram(glProgram);

    context.clearColor(...clearColor);

    this.gl = glProgram;
    this.vertex = vertexShader;
    this.fragment = fragmentShader;

    this.resize();
  }

  resize(w = null, h = null, clear = true) {
    const { canvas } = this;

    if (w === null || h === null) {
      const { width, height } = canvas.parentElement.getBoundingClientRect();

      canvas.width = w ?? width;
      canvas.height = h ?? height;
    } else {
      canvas.width = w;
      canvas.height = h;
    }

    if (clear) this.clear();
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
    const { context } = this;
    context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);

    return this;
  }
}
