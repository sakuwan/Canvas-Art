class PixelView {
  constructor(canvasWidth = null, canvasHeight = null) {
    const width = canvasWidth ?? window.innerWidth;
    const height = canvasHeight ?? window.innerHeight;

    const canvasElement = this.createCanvas(width, height);
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

  getPixel(x, y) {
    return this.pixelData.getUint32(this.fetchIndex(x, y));
  }

  setPixel(x, y, color) {
    this.pixelData.setUint32(this.fetchIndex(x, y), color);

    return this;
  }

  clear() {
    this.uint32Data.fill(0);

    return this;
  }

  fetchIndex(x, y) {
    const { width, height } = this.imageData;
    if ((x >= width || x < 0) || (y >= height || y < 0)) {
      throw RangeError(`[PixelView::fetchIndex] Index (${x}, ${y}) out of bounds`);
    }

    return (x + y * this.imageData.width) * 4;
  }

  createCanvas(width, height) {
    if (typeof OffscreenCanvas !== undefined) {
      return new OffscreenCanvas(width, height);
    }

    const canvasElement = document.createElement('canvas');

    canvasElement.width = width;
    canvasElement.height = height;

    return canvasElement;
  }
}
