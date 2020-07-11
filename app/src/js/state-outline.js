import * as d3 from 'd3';

// The only ones we know how to handle
const KNOWN_FIPS = [
  '53', // Washington
  '17', // Illinois
  '11', // District of Columbia
  '36', // New York
  '34', // New Jersey
  '44', // Rhode Island
  '10', // Delaware
  '24', // Maryland
  '04'  // Arizona
];

export default class StateOutline {
  constructor(parentElement, colorScale) {
    this.root = parentElement;
    this.colorScale = colorScale;
    this.currentFips = null;

    KNOWN_FIPS.forEach(fips => {
      this.fetch(fips);
    });
  }

  show(fips) {
    this.currentFips = fips;
    this.reset();
    this.root.select(`svg.fips-${fips}`)
             .classed('active', true);
  }

  reset() {
    KNOWN_FIPS.forEach(fips => {
      this.root.selectAll(`svg.fips-${fips}`)
               .classed('active', false);
    });
  }

  fetch(fips) {
    console.log('Beginning fetch.');

    d3.svg(`/images/${fips}.svg`)
      .then(fragment => {
        let svg = fragment.getElementsByTagName('svg')[0];
        let child = this.root.node()
                             .appendChild(fragment.getElementsByTagName('svg')[0]);
        child.setAttribute('class', `fips-${fips}`);
        this.root.select(`svg.fips-${fips}`)
                 .attr('x', 8)
                 .attr('y', 17)
                 .attr('width', 180)
                 .attr('height', 180)
                 .style('fill', this.colorScale(fips));

        this.reset();

        if (this.currentFips)
          this.show(this.currentFips);
      })
      .catch(err => {
        console.log(err);
      });
  }
}
