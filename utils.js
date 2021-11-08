function delta(oldPoint, newPoint) {
  return newPoint - oldPoint;
}

function readPoint(event, isMouse) {
  return isMouse ? event.screenX : (event.changedTouches && event.changedTouches[0].clientX) || event.screenX;
}

function toPercent(value, width) {
  return (value / width) * 100;
}

function invert(value) {
  return value * -1;
}

function isNegative(number) {
  return !Object.is(Math.abs(number), +number);
}

function easeInOutSine(x) {
  return -(Math.cos(Math.PI * x) - 1) / 2;
}

function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function compose(...functions) {
  return function(args) {
    return functions.reduceRight((arg, fn) => fn(arg), args);
  }
}