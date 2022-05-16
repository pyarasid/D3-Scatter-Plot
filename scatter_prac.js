
async function drawScatter()
{

//Access data
let dataset= await d3.json("my_weather_data.json")
//console.table(dataset[0])

const xAccessor= d => d.dewPoint
const yAccessor= d => d.humidity

// Create chart dimensions
const width = d3.min([
    window.innerWidth*0.9,
    window.innerWidth*0.9
])

let dimensions= {
    width: width,
    height: width,
    margin: {
        top : 10,
        right:10,
        bottom: 50,
        left:50,
    },
}

dimensions.boundedwidth= dimensions.width- dimensions.margin.right- dimensions.margin.left
dimensions.boundedheight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

// Draw canvas
const wrapper = d3.select("#wrapper")
    .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)

const bound = wrapper.append("g")
    .style("transform", `translate(${
        dimensions.margin.left
    }px, ${
        dimensions.margin.top
    }px)`)

// Create scales
xScale = d3.scaleLinear()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedwidth])
    .nice()

yScale= d3.scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([dimensions.boundedwidth, 0])
    .nice()

// Draw data



}

drawScatter()