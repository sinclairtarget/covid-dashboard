import * as d3 from 'd3';

import * as util from './util.js';
import StateOutline from './state-outline.js';

// Info box
export default class Box {
  constructor(parentElement, colorScale) {
    this.root = parentElement;
    this.root.append('rect')
             .attr('x', 0)
             .attr('y', 0)
             .attr('width', 416)
             .attr('height', 226)
             .attr('fill', '#eff1f2');

    this.root.append('text')
             .attr('x', 200)
             .attr('y', 30)
             .attr('class', 'title')
             .attr('text-anchor', 'middle')
             .text('Leader in Per-Capita New Cases');

    this.dateLabel = this.root.append('text')
                              .attr('x', 200)
                              .attr('y', 56)
                              .attr('text-anchor', 'middle')
                              .attr('class', 'date-label')
                              .text('01/01/01');

    this.state = this.root.append('text')
                          .attr('x', 95)
                          .attr('y', 206)
                          .attr('class', 'label')
                          .attr('text-anchor', 'middle')
                          .text('Arizona');

    this.root.append('text')
             .attr('x', 220)
             .attr('y', 131)
             .attr('class', 'label')
             .text('New Cases Today');

    this.absoluteNum = this.root.append('text')
                                .attr('x', 220)
                                .attr('y', 106)
                                .attr('class', 'data-num')
                                .text('0');

    this.root.append('text')
             .attr('x', 220)
             .attr('y', 204)
             .attr('class', 'label')
             .text('New Cases Today (Per Cap.)');

    this.capNum = this.root.append('text')
                           .attr('x', 220)
                           .attr('y', 179)
                           .attr('class', 'data-num per-cap-data-num')
                           .text('0');

    this.capLabel = this.root.append('text')
                             .attr('x', 260)
                             .attr('y', 175)
                             .attr('class', 'label')
                             .text('in 100,000');

    this.stateOutline = new StateOutline(this.root, colorScale);
  }

  update(datum) {
    this.state.text(datum['leader_name']);
    this.dateLabel.text(util.formatDate(datum['date']));
    this.absoluteNum.text(d3.format(',')(datum['leader_daily_cases']));
    this.capNum.text(d3.format(',')(datum['leader_daily_cases_per_cap']));
    this.stateOutline.show(datum['leader_fips']);

    if (datum['leader_daily_cases_per_cap'] < 10)
      this.capLabel.attr('x', 244);
    else
      this.capLabel.attr('x', 260);
  }
};
