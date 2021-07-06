class PropertyArray {
  constructor(count, props, arrayType = Float32Array) {
    this.count = count;
    this.stride = props;

    this.data = arrayType === null
      ? null
      : new arrayType(count * props);
  }

  get(index) {
    const { count, stride, data } = this;
    if (index >= count) {
      throw RangeError(`[PropArray::get] Index (${index}) out of bounds`);
    }

    return stride > 1
      ? data.slice(index * stride, (index + 1) * stride)
      : data[index];
  }

  set(index, value) {
    const { count, stride, data } = this;
    if (index >= count) {
      throw RangeError(`[PropArray::set] Index (${index}) out of bounds`);
    }

    if (stride > 1) {
      data.set(value, index * stride);
    } else {
      data[index] = value;
    }
  }

  map(fn) {
    const { count, stride, data } = this;
    const clonedArray = new data.constructor(data);

    if (stride > 1) {
      for (let i = 0; i < count; i += 1) {
        const indexOffset = i * stride;
        const currentSlice = clonedArray.slice(indexOffset, indexOffset + stride);

        clonedArray.set(fn(currentSlice, i, clonedArray), indexOffset);
      }
    } else {
      for (let i = 0; i < count; i += 1) {
        clonedArray[i] = fn(clonedArray[i], i, clonedArray);
      }
    }

    const mappedArray = new this.constructor(count, stride, null);
    mappedArray.data = clonedArray;

    return mappedArray;
  }

  transform(fn) {
    const { count, stride, data } = this;

    if (stride > 1) {
      for (let i = 0; i < count; i += 1) {
        const indexOffset = i * stride;
        const currentSlice = data.slice(indexOffset, indexOffset + stride);

        data.set(fn(currentSlice, i, data), indexOffset);
      }
    } else {
      for (let i = 0; i < count; i += 1) {
        data[i] = fn(data[i], i, data);
      }
    }

    return this;
  }

  range(fn, start = 0, end = null) {
    const { count, stride, data } = this;

    const last = end ?? count;
    if (stride > 1) {
      for (let i = start; i < last; i += 1) {
        const indexOffset = i * stride;
        const currentSlice = data.slice(indexOffset, indexOffset + stride);

        fn(currentSlice, i, data);
      }
    } else {
      for (let i = start; i < last; i += 1) {
        fn(data[i], i, data);
      }
    }

    return this;
  }
}
