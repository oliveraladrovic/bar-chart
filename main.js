const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
const headerHeight = document.querySelector('header').offsetHeight;
const footerHeight = document.querySelector('footer').offsetHeight;

const card = document.querySelector('.card');
const cardHeight = windowHeight - headerHeight - footerHeight - 40;
card.style.height = `${cardHeight}px`;

const sourceHeight = document.querySelector('.source').offsetHeight;
const svgContainer = document.querySelector('#svg-container');
svgContainerHeight = cardHeight - sourceHeight - 20;
svgContainer.style.height = `${svgContainerHeight}px`;

let svgContainerWidth = svgContainer.offsetWidth;

d3.select('#svg-container')
  .append('svg')
  .attr('height', svgContainerHeight)
  .attr('width', svgContainerWidth);

const svg = d3.select('svg');

fetch(
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
)
  .then(response => response.json())
  .then(data => showData(data));

const showData = data => {
  const dataset = data.data;
  const dateValue = d => d[0];
  const gdpValue = d => d[1];
  const margin = { top: 5, right: 18, bottom: 20, left: 40 };
  const innerWidth = svgContainerWidth - margin.left - margin.right;
  const innerHeight = svgContainerHeight - margin.top - margin.bottom;

  const xScale = d3
    .scaleBand()
    .domain(dataset.map(dateValue))
    .range([0, innerWidth])
    .padding(0.2);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, gdpValue)])
    .range([innerHeight, 0]);

  const group = svg
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  group
    .append('g')
    .call(d3.axisLeft(yScale))
    .attr('id', 'y-axis');

  const xAxis = d3.axisBottom(xScale).tickValues(
    xScale.domain().filter(date => {
      return (
        parseInt(date.substring(0, 4)) % 5 === 0 &&
        date.substring(5, 7) === '01'
      );
    })
  );

  group
    .append('g')
    .call(xAxis)
    .attr('transform', `translate(0, ${innerHeight})`)
    .attr('id', 'x-axis');

  group
    .selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('x', d => xScale(dateValue(d)))
    .attr('y', d => yScale(gdpValue(d)))
    .attr('width', xScale.bandwidth())
    .attr('height', d => innerHeight - yScale(gdpValue(d)))
    .attr('class', 'bar')
    .attr('data-date', d => dateValue(d))
    .attr('data-gdp', d => gdpValue(d))
    .attr(
      'onmouseover',
      d => `showTooltip("${dateValue(d)}", "${gdpValue(d)}")`
    )
    .attr('onmouseout', 'hideTooltip()');
};

const showTooltip = (dateValue, gdpValue) => {
  const tooltip = document.querySelector('#tooltip');
  tooltip.setAttribute('data-date', dateValue);
  tooltip.style.display = 'block';
  tooltip.innerHTML = `${dateValue}: $${gdpValue}`;
};

const hideTooltip = () => {
  document.querySelector('#tooltip').style.display = 'none';
};
