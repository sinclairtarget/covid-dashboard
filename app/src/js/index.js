import "../scss/main.scss";

import * as fetch from './fetch.js';
import Dimensions from './dimensions.js';
import Graph from './graph.js';

const chartWidth = 1200;
const chartHeight = 600;
const chartMargin = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
};

const chartPadding = {
  top: 70,
  right: 40,
  bottom: 60,
  left: 94
};

const dim = new Dimensions(chartWidth, chartHeight, chartMargin, chartPadding);

window.app = {};
window.app.graph = new Graph(dim);

window.app.setUpGraph = (data) => {
  // Parse dates
  window.app.data = data.map(record => {
    record['date'] = new Date(record['date']);
    return record;
  });

  console.log(window.app.data);
  let svg = window.app.graph.setUp(window.app.data);

  // Register mouse listener
  svg.on('mousemove', () => {
    window.app.graph.handleMouse();
  });
};

window.onload = (ev) => {
  console.log("Hello, world!");

  fetch.json('data.json')
    .then((res) => {
      window.app.setUpGraph(res);
    })
    .catch((err) => {
      console.error(err);
    });
};
