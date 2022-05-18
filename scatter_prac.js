
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
const dots= bound.selectAll("circle")
    .data(dataset)
    .enter().append("circle")
    .attr("cx", d=> xScale(xAccessor(d)))
    .attr("cy", d=> yScale(yAccessor(d)))
    .attr("r", 5)
    .attr("fill", "cornflowerblue")

// Draw peripherals

const xAxisGenerator= d3.axisBottom()
    .scale(xScale)

const xAxis = bound.append("g")
    .call(xAxisGenerator)
        .style("transform", `translateY(${dimensions.boundedheight}px)`)

const xAxisLabel= xAxis.append("text")
    .attr("x", dimensions.boundedwidth/2)
    .attr("y", dimensions.margin.bottom-10)
    .attr("fill", "black")
    .style("font-size", "1.4em")
    .html("Dew Point (&deg;F)")

const yAxisGenerator = d3.axisLeft() 
    .scale(yScale)
    .ticks(4)      

const yAxis = bound.append("g")
    .call(yAxisGenerator)
 
 const yAxisLabel= yAxis.append("text")
    .attr("x", -dimensions.boundedheight/2) 
    .attr("y", -dimensions.margin.left + 10)
    .attr("fill", "black")
    .style("font-size", "1.4em")
    .text("Relative humidity")
    .style("transform", "rotate(-90deg)") 
    .style("text-anchor", "middle") 

// Interactions 


bound.selectAll("circle")
    .on("mouseenter", onMouseEnter)
    .on("mouseleave", onMouseLeave)

const tooltip= d3.select("#tooltip")

function onMouseEnter(e, d){
    
    const formatdewpoint= d3.format(".2f")
    tooltip.select("#dew-point")
        .text(formatdewpoint(xAccessor(d)))
    
    const formathumidity= d3.format(".2f")
    tooltip.select("#humidity")
        .text(formathumidity(yAccessor(d)))
        
    const dateParser = d3.timeParse("%Y-%m-%d")
    const formatDate= d3.timeFormat("%B %A %-d %Y")
        
    tooltip.select("#date")
        .text(formatDate(dateParser(d.date)))

    const x= xScale(xAccessor(d)) +
        dimensions.margin.left
    const y= yScale(yAccessor(d)) +
        dimensions.margin.top

    console.log(x)

    tooltip.style("transform", `translate(`
        + `calc(-50% + ${x}px),`   
        + `calc(-100% + ${y}px)`
        + `)` )

    tooltip.style("opacity", 1)
}

function onMouseLeave(e, d){
    tooltip.style("opacity", 0)
}



}

drawScatter()