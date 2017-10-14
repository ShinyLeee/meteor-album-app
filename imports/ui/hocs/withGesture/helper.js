export const delay = function delayFunc(func, timeout = 0, args = []) {
  return setTimeout(() => func.apply(null, [...args]), timeout);
};

export const now = Date.now || function legacy() {
  return new Date().getTime();
};

export const getEmptyPoint = double => (
  !double
    ? { x: null, y: null }
    : { x1: null, y1: null, x2: null, y2: null }
);

export const isValidPoint = point => (point.x !== null && point.y !== null);

export const isClickableElement = element => (element.tagName === 'A' || element.tagName === 'BUTTON');
