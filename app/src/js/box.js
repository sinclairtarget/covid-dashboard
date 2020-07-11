import * as d3 from 'd3';

// Info box
export default class Box {
  constructor(parentElement) {
    this.root = parentElement;
    this.root.append('rect')
             .attr('x', 0)
             .attr('y', 0)
             .attr('width', 400)
             .attr('height', 200)
             .attr('fill', '#eff1f2');

    this.root.append('text')
             .attr('x', 200)
             .attr('y', 30)
             .attr('class', 'title')
             .attr('text-anchor', 'middle')
             .text('Leader in Daily New Cases');

    this.state = this.root.append('text')
                          .attr('x', 95)
                          .attr('y', 180)
                          .attr('class', 'label')
                          .attr('text-anchor', 'middle')
                          .text('Arizona');

    this.root.append('text')
             .attr('x', 220)
             .attr('y', 105)
             .attr('class', 'label')
             .text('Absolute Number');

    this.absoluteNum = this.root.append('text')
                                .attr('x', 220)
                                .attr('y', 80)
                                .attr('class', 'data-num')
                                .text('0');

    this.root.append('text')
             .attr('x', 220)
             .attr('y', 178)
             .attr('class', 'label')
             .text('Per Capita (in 100,000)');

    this.capNum = this.root.append('text')
                           .attr('x', 220)
                           .attr('y', 153)
                           .attr('class', 'data-num')
                           .text('0');
  }

  update(datum) {
    this.state.text(datum['leader_name']);
    this.absoluteNum.text(d3.format(',')(datum['leader_daily_cases']));
    this.capNum.text(d3.format(',')(datum['leader_daily_cases_per_cap']));
  }
};
