import * as d3 from 'd3';

import * as util from './util.js';

export default class Graph {
  constructor(dimensions) {
    this.dim = dimensions;
  }

  draw(data) {
    // Create plot area and grid lines
    let panelWidth = this.dim.panelWidth();
    let panelHeight = this.dim.panelHeight();
    let plotWidth = this.dim.plotWidth();
    let plotHeight = this.dim.plotHeight();

    this.svg = d3.select('.graph-container')
                 .insert('svg');

    this.panel = this.svg
                   .attr('viewBox', `0 0 ${this.dim.width} ${this.dim.height}`)
                   .append('g')
                   .attr('transform', util.transl(this.dim.margin.left,
                                                  this.dim.margin.top))
                   .attr('class', 'panel');

    let xDomain = [d3.min(data, d => d['date']),
                   d3.max(data, d => d['date'])];
    let yDomain = [0, d3.max(data, d => d['cases_national'])];

    this.xScale = d3.scaleTime()
                    .domain(xDomain)
                    .range([0, plotWidth]);
    this.yScale = d3.scaleLinear()
                    .domain(yDomain)
                    .range([plotHeight, 0]);

    let xAxis = d3.axisBottom(this.xScale);
    let xGrid = d3.axisBottom(this.xScale)
                  .tickSize(-plotHeight, 0, 0)
                  .tickFormat("");

    let yAxis = d3.axisLeft(this.yScale);
    let yGrid = d3.axisLeft(this.yScale)
                  .tickSize(-plotWidth, 0, 0)
                  .tickFormat("");

    // Add axes
    this.panel.append("g")
              .attr("transform", util.transl(this.dim.padding.left,
                                             this.dim.padding.top + plotHeight))
              .attr("class", "axis x-axis")
              .call(xAxis);

    this.panel.append("g")
              .attr("transform", util.transl(this.dim.padding.left,
                                             this.dim.padding.top))
              .attr("class", "axis y-axis")
              .call(yAxis);

    // Add plot and area
    this.plot = d3.select(".panel")
                  .append("g")
                  .attr("transform", util.transl(this.dim.padding.left,
                                                 this.dim.padding.top))
                  .attr("class", "plot");

    this.area = this.plot.append('path')
                         .attr('class', 'cases-area')
                         .datum(data)
                         .attr('d', d3.area()
                           .x(d => this.xScale(d['date']))
                           .y0(this.yScale(0))
                           .y1(d => this.yScale(d['cases_national'])));
  }
}
