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
  top: 40,
  right: 40,
  bottom: 40,
  left: 80
};

const dim = new Dimensions(chartWidth, chartHeight, chartMargin, chartPadding);

window.app = {};
window.app.graph = new Graph(dim);

window.app.renderGraph = (data) => {
  // Parse dates
  data = data.map(record => {
    record['date'] = new Date(record['date']);
    return record;
  });

  console.log(data);
  window.app.graph.draw(data);
};

window.onload = (ev) => {
  console.log("Hello, world!");

  fetch.json('data.json')
    .then((res) => {
      window.app.renderGraph(res);
    })
    .catch((err) => {
      console.error(err);
    });
};
