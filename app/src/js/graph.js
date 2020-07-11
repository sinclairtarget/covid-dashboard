import * as d3 from 'd3';

import * as util from './util.js';
import Box from './box.js';

export default class Graph {
  constructor(dimensions) {
    this.dim = dimensions;
  }

  setUp(data) {
    this.data = data;

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
    let yDomain = [0, 3000000];

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

    this.yTitle =
      this.panel.append("text")
                .attr("x", 0)
                .attr("y", plotHeight / 2)
                .attr("text-anchor", "middle")
                .attr("class", "axis-title y-axis-title")
                .text("National Cases (Cumulative)")
                .attr("transform", util.rot(-90, 12, plotHeight / 2));

    // Add plot
    this.plot = d3.select(".panel")
                  .append("g")
                  .attr("transform", util.transl(this.dim.padding.left,
                                                 this.dim.padding.top))
                  .attr("class", "plot");

    this.plot.append("g")
             .attr("class", "grid")
             .call(yGrid);

    // Add leader areas
    this.colorScale = d3.scaleOrdinal(d3.schemeTableau10);

    this.data = this.split(data);
    this.data.forEach(areaData => {
      this.plot.append('path')
               .attr('class', `cases-area period-${areaData[0]['period']}`)
               .datum(areaData)
               .attr('fill', '#eee')
               .attr('stroke', '#ccc')
               .attr('d', d3.area()
                 .x(d => this.xScale(d['date']))
                 .y0(this.yScale(0))
                 .y1(d => this.yScale(d['cases_national'])));
    });

    // Add indicator line
    this.line = this.panel.append('line')
                          .attr('class', 'indicator-line')
                          .attr('stroke-width', 1)
                          .attr('stroke', '#111')
                          .attr('x1', 0)
                          .attr('y1', this.dim.padding.top - 12)
                          .attr('x2', 0)
                          .attr('y2', this.dim.padding.top +
                                      this.dim.plotHeight() + 26);

    this.dateLabel = this.panel.append('text')
                               .attr('class', 'date-label')
                               .attr('x', 0)
                               .attr('y', this.dim.panelHeight() - 20)
                               .attr('text-anchor', 'middle')
                               .text('01/01/01');

    // Add info box
    this.box = new Box(
      this.panel.append("g")
                .attr('class', 'info-box')
                .attr("transform", util.transl(this.dim.padding.left + 20,
                                               this.dim.padding.top + 12)),
      this.colorScale
    );

    this.update(plotWidth / 2, 0);

    return this.svg;
  }

  handleMouse() {
    let [x, y] = d3.mouse(this.plot.node());
    this.update(x, y);
  }

  update(x, y) {
    this.reset();

    if (x >= 0 && x <= this.dim.plotWidth())
    {
      let date = this.xScale.invert(x);
      let datum = this.findDatum(date);

      // Move indicator line
      this.line.attr('x1', this.dim.padding.left + x)
               .attr('x2', this.dim.padding.left + x);
      this.dateLabel.attr('x', this.dim.padding.left + x)
                    .text(this.formatDate(date));

      // Activate segment
      this.plot.select(`.period-${datum['period']}`)
               .attr('fill', d => this.colorScale(d[0]['leader_fips']));

      this.box.update(datum);
    }
  }

  reset() {
    this.plot.selectAll('.cases-area')
             .attr('fill', '#eee')
             .attr('stroke', '#ccc');
  }

  // Split data into contiguous segments/periods
  split(data) {
    let splitData = [];
    let lastFips = null;
    let period = 1;               // Unique period index
    data.forEach(d => {

      if (d['leader_fips'] != lastFips)
      {
        if (splitData.length > 0)
        {
          // Make sure period overlap so there are no holes in the graph
          // "Close" last period with first date of this period
          let copy = Object.assign({}, d);
          copy['period'] = period;
          copy['leader_fips'] = lastFips;
          splitData.slice(-1)[0].push(copy);

          period += 1;
        }

        splitData.push([]);
      }

      d['period'] = period;
      splitData.slice(-1)[0].push(d);
      lastFips = d['leader_fips'];
    });

    return splitData;
  }

  findDatum(date) {
    // Strip out time part
    for (const d of this.data) {
      for (const e of d) {
        if (e['date'].toDateString() == date.toDateString())
          return e;
      }
    }

    return null;
  }

  formatDate(date) {
    return `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`;
  }
}
