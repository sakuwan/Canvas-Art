const P1 = 0.7548776662466927;
const P2 = 0.5698402909980532;

export const plastic = (index) => [(P1 * index) % 1, (P2 * index) % 1];

export const halton = (index, base) => {
  let sequenceElement = 0;
  for (let i = index, fractional = 1; i > 0; i = Math.floor(i / base)) {
    fractional /= base;
    sequenceElement += fractional * (i % base);
  }

  return sequenceElement;
}

export const halton23 = (index) => [halton(index, 2), halton(index, 3)];