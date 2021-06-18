const noop = () => {};

export class GLCanvas {
  constructor(queryString = '', contextType = 'webgl2') {
    const canvasElement = document.querySelector(
      queryString.length ? queryString : 'canvas'
    );

    if (canvasElement === null) throw new TypeError('No matching or valid canvas found');

    this.canvas = canvasElement;
    this.context = canvasElement.getContext(contextType);
    if (contextType === 'webgl2' && !this.context) {
      this.context = canvasElement.getContext('webgl');
    }

    this.state = {};

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

  shader(content, type) {
    const { context } = this;

    const shaderInstance = context.createShader(type);

    context.shaderSource(shaderInstance, content);
    context.compileShader(shaderInstance);

    const compileError = !context.getShaderParameter(shaderInstance, context.COMPILE_STATUS);
    if (compileError) {
      const shaderError = context.getShaderInfoLog(shaderInstance);
      throw new Error(`Failed to compile vertex shader: ${shaderError}`);
    }

    return shaderInstance;
  }

  initialize(programOptions = {}) {
    const { context } = this;

    const glOptions = Object.assign({
      is2D: true,
      vertexContent: null,
      fragmentContent: null,

      clearColor: [0, 0, 0, 1],
    }, programOptions);

    let vertexContent = glOptions.is2D ? `
      #version 300 es
      precision highp float;

      layout (location = 0) in vec2 aPos;

      void main(void) {
        gl_Position = vec4(aPos.xy, 0, 1);
      }`.trim() : glOptions.vertexContent;

    let fragmentContent = glOptions.is2D ? `
      #version 300 es
      precision highp float;

      uniform float uTime;
      uniform vec2 uResolution;

      out vec4 outColor;

      float float01(uint base) {
        return uintBitsToFloat((base >> 9) | 0x3F800000u) - 1.0;
      }

      // LCG values from Numerical Recipes
      uint LCG(uint seed) {
          seed = 1664525u * seed + 1013904223u;
          return seed;
      }

      // Xorshift algorithm from George Marsaglia's paper
      uint xorShift(uint seed) {
          seed ^= (seed << 13);
          seed ^= (seed >> 17);
          seed ^= (seed << 5);
          return seed;
      }

      // Hash by Thomas Wang
      // http://www.burtleburtle.net/bob/hash/integer.html
      uint hash(uint seed) {
          seed = (seed ^ 61u) ^ (seed >> 16);
          seed *= 9u;
          seed = seed ^ (seed >> 4);
          seed *= 0x27D4EB2Du;
          seed = seed ^ (seed >> 15);
          return seed;
      }

      vec2 screenUV(in vec2 frag, in vec2 res) {
        return (-res.xy + 2.0 * frag) / res.y;
      }

      ${glOptions.fragmentContent}
      
      void main(void) {
        outColor = vec4(0, 0, 0, 1);
        shaderMain(gl_FragCoord.xy, outColor);
      }`.trim() : glOptions.fragmentContent;

    const vertexShader = this.shader(vertexContent, context.VERTEX_SHADER);
    const fragmentShader = this.shader(fragmentContent, context.FRAGMENT_SHADER);

    const glProgram = context.createProgram();

    context.attachShader(glProgram, vertexShader);
    context.attachShader(glProgram, fragmentShader);
    context.linkProgram(glProgram);

    const linkError = !context.getProgramParameter(glProgram, context.LINK_STATUS);
    if (linkError) {
      const programError = context.getProgramInfoLog(glProgram);
      throw new Error(`Failed to link program: ${programError}`);
    }

    context.useProgram(glProgram);

    context.clearColor(...glOptions.clearColor);

    this.state = {
      glProgram,
      vertexShader,
      fragmentShader,

      uniforms: null,

      is2D: glOptions.is2D,
    };

    if (glOptions.is2D) {
      const fsTriangle = new Float32Array([-1, 3, -1, -1, 3, -1]);

      const triangleBuffer = context.createBuffer();
      context.bindBuffer(context.ARRAY_BUFFER, triangleBuffer);
      context.bufferData(context.ARRAY_BUFFER, fsTriangle, context.STATIC_DRAW);

      const posAttribute = context.getAttribLocation(glProgram, "aPos");
      context.vertexAttribPointer(posAttribute, 2, context.FLOAT, false, 0 , 0);
      context.enableVertexAttribArray(posAttribute);
  
      const timeUniform = context.getUniformLocation(glProgram, 'uTime');
      const resUniform = context.getUniformLocation(glProgram, 'uResolution');
  
      this.state.uniforms = {
        time: timeUniform,
        resolution: resUniform,
      };
    }
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

    if (this.state.is2D) {
      const { canvas, context, state } = this;

      const currentWidth = canvas.width;
      const currentHeight = canvas.height;

      context.viewport(0, 0, currentWidth, currentHeight);

      context.uniform1f(state.uniforms.time, this.elapsedTime / 1000);
      context.uniform2f(state.uniforms.resolution, currentWidth, currentHeight);
    
      context.drawArrays(context.TRIANGLES, 0, 3);
    }

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
