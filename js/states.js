var margin = { left: 10, right: 10, top: 10, bottom: 160 };

var width = 1000 - margin.left - margin.right,
    height = 850 - margin.top - margin.bottom;

var svgState = d3.select('#chart-area-state')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

// Add x axis
var x = d3.scaleBand()
    .range([0, width])
    .padding(0.4);
var xAxis = svgState.append('g')
    .attr('transform', 'translate(0,' + height + ')')
var xAxisCall = d3.axisBottom(x);

// Initialize y axis
var y = d3.scaleLinear()
    .range([height, 0]);
var yAxis = svgState.append('g')
    .attr('class', 'Frequency')


function updateState(attackVar) {

    d3.csv('data/top_15_states.csv').then(function (stateData) {
        console.log(stateData);
        stateData.forEach(function (d) {
            d.Instances = +d.Instances; 
            d.Kills = +d.Kills;
        })

        // set x axis
        x.domain(stateData.map(function (d) { return d.State; }))
        xAxis.transition().duration(500);


        // set y axis
        y.domain([0, d3.max(stateData, function (d) { return d[attackVar] }) + 5]);
        yAxis.transition().duration(500);

        // tooltip
        var tip = d3.tip().attr('class', 'd3-tip')
            .offset([-10, 10])
            .html(function (d) {
                if (attackVar == 'Instances') {
                    var text = '<strong>Attacks</strong> <span style="color:gray">' + d[attackVar] + "</span><br>";
                    return text;
                } else {
                    var text = '<strong>Fatalities</strong> <span style="color:gray">' + d[attackVar] + "</span><br>";
                    return text;
                }
            });
        svgState.call(tip);


        //map data to existing bars & update
        var barUpdate = svgState.selectAll('rect')
            .data(stateData)

        barUpdate.exit().remove();

        barUpdate
            .enter()
            .append('rect')
            .attr('fill', 'darkred')
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)
            .merge(barUpdate)
            .transition()
            .duration(500)
            .attr('x', function (d) { return x(d.State); })
            .attr('y', function (d) { return y(d[attackVar]); })
            .attr('width', x.bandwidth())
            .attr('height', function (d) { return height - y(d[attackVar]); })


        barUpdate
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)

        svgState.append('g')
            .attr('class', 'x-axis')
            .attr('transform', 'translate(0, ' + height + ')')
            .call(xAxisCall)
            .selectAll('text')
            .attr('y', '7')
            .attr('x', '-10')
            .attr('text-anchor', 'end')
            .attr('transform', 'rotate(-55)')
            .attr('font-size', '17px');
        svgState.append('text')
            .attr('x', width / 2)
            .attr('y', height + 150)
            .attr('font-size', '25px')
            .attr('text-anchor', 'middle')
            .text('State')

    })
}

updateState('Instances')