// Set the size of the SVG chart and the margin around the plot area.
const width = 800;
const height = 500;
const margin = {
    top: 40,
    right: 30,
    bottom: 90,
    left: 80
};

// Create the SVG container where the chart will be drawn.
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Load the data from an external CSV file.
d3.csv("data.csv").then(function(data) {

    // Convert the employee count values from text into numbers.
    data.forEach(function(d) {
        d.employees = +d.employees;
    });

    // Create a band scale for the wage band categories on the x-axis.
    const xScale = d3.scaleBand()
        .domain(data.map(function(d) {
            return d.wage_band;
        }))
        .range([margin.left, width - margin.right])
        .padding(0.2);

    // Create a linear scale for the employee counts on the y-axis.
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) {
            return d.employees;
        })])
        .nice()
        .range([height - margin.bottom, margin.top]);

    // Draw one bar for each wage band in the dataset.
    svg.selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", function(d) {
            return xScale(d.wage_band);
        })
        .attr("y", function(d) {
            return yScale(d.employees);
        })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) {
            return height - margin.bottom - yScale(d.employees);
        })
        .attr("class", "bar");

    // Add the x-axis to show the wage band labels.
    svg.append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "rotate(-35)")
        .style("text-anchor", "end");

    // Add the y-axis to show employee counts.
    svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale));

    // Add a chart title inside the SVG.
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 25)
        .attr("class", "chart-title")
        .attr("text-anchor", "middle")
        .text("Seattle Employees by Hourly Wage Band");

    // Add a label for the x-axis.
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height - 20)
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .text("Hourly Wage Band");

    // Add a label for the y-axis.
    svg.append("text")
        .attr("x", -height / 2)
        .attr("y", 25)
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("Number of Employees");
});