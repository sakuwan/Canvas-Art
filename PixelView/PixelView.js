class PixelView {
  constructor(canvasWidth = null, canvasHeight = null) {
    const width = canvasWidth || window.innerWidth;
    const height = canvasHeight || window.innerHeight;

    const canvasElement = (typeof OffscreenCanvas === undefined)
      ? createDOMCanvas(width, height)
      : new OffscreenCanvas(width, height);

    const canvasContext = canvasElement.getContext('2d', {
      desynchronized: true,
    });

    const imageData = canvasContext.createImageData(width, height);
    const pixelData = new DataView(imageData.data.buffer);
    const uint32Data = new Uint32Array(imageData.data.buffer);

    this.canvas = canvasElement;
    this.context = canvasContext;
    
    this.imageData = imageData;
    this.pixelData = pixelData;
    this.uint32Data = uint32Data;
  }

  setPixel(x, y, color) {
    const pixelOffset = (x + y * this.imageData.width) * 4;
    this.pixelData.setUint32(pixelOffset, color);

    return this;
  }

  clear() {
    this.uint32Data.fill(0);

    return this;
  }

  createDOMCanvas(width, height) {
    const canvasElement = document.createElement('canvas');

    canvasElement.width = width;
    canvasElement.height = height;

    return canvasElement;
  }
}
