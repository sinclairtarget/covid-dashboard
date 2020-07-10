import * as d3 from 'd3';

export function densityKey(day, period, direction) {
  let key = 'density';
  if (day && period && direction) {
    key = `density_${day}_${period}_${direction}`;
  }
  else if (day && period) {
    key = `density_${day}_${period}`;
  }
  else if (day) {
    key = `density_${day}`;
  }

  return key;
}

export function transl(x, y) {
  return "translate(" + x + "," + y + ")";
}

export function rot(degrees, x, y) {
  return "rotate(" + degrees + "," + x + "," + y + ")";
}

// https://www.d3-graph-gallery.com/graph/density_basic.html
export function kernelDensityEstimator(kernel, X) {
  return function(V) {
    return X.map(function(x) {
      return [x, d3.mean(V, function(v) { return kernel(x - v); })];
    });
  };
}

export function kernelEpanechnikov(bandwidth) {
  return function(v) {
    return Math.abs(v /= bandwidth) <= 1 ? 0.75 * (1 - v * v) / bandwidth : 0;
  };
}
