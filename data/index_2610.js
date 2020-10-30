import * as d3 from "d3";
import '../css/style.css';


var sensors;


 var width = d3.select("#map").node().getBoundingClientRect().width
  let height = 500
  const sensitivity = 75

  let projection = d3.geoOrthographic()
  .scale(250)
  .center([0, 0])
  .rotate([0,-30])
  .translate([width / 2, height / 2])


  const initialScale = projection.scale()
  let path = d3.geoPath().projection(projection)
  

  let svg = d3.select("#map")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

  let globe = svg.append("circle")
  .attr("fill", "#EEE")
  .attr("stroke", "#000")
  .attr("stroke-width", "0.2")
  .attr("cx", width/2)
  .attr("cy", height/2)
  .attr("r", initialScale)

  svg.call(d3.drag().on('drag', (event,d) => {
    const rotate = projection.rotate()
    const k = sensitivity / projection.scale()
    projection.rotate([
      rotate[0] + event.dx * k,
      rotate[1] - event.dy * k
    ])
    path = d3.geoPath().projection(projection)
    svg.selectAll("path").attr("d", path)
  }))
    .call(d3.zoom().on('zoom', (event,d) => {
    if(event.transform.k > 0.3) {
      projection.scale(initialScale * event.transform.k)
      path = d3.geoPath().projection(projection)
      svg.selectAll("path").attr("d", path)
      globe.attr("r", projection.scale())
    }
    else {
      event.transform.k = 0.3
    }
  }));
    


//  let pathSel = d3.selectAll("path");
//
//
//pathSel.on("click",function(event,d){
//        
//        console.log(event);
//        console.log(d);
//    });





      
//      svg.on("click",function(event, d){
//      
//      console.log(event);
//      
//  });



  let map = svg.append("g")
  
  
  var colorScale = d3.scaleLinear()
    .domain([1, 100])
    .range(["white", "blue"])
    .interpolate(d3.interpolateRgb);


//
//                    const graticule = d3.geoGraticule()
//                    .step([10, 10]);
//
//                svg.append("path")
//                    .datum(graticule)
//                    .attr("class", "graticule")
//                    .attr("d", path)
//                    .style("fill", "transparent")
//                    .style("stroke", "#ccc");




   var svg2 = d3.select("#chart").append("svg")
            .style("visibility","visible")
            .style("width","100%")
        .attr("id","linechart")

   


var margin = {top: 20, right: 20, bottom: 50, left: 70};
 var   widthChart = d3.select("#chart").node().getBoundingClientRect().width - margin.left - margin.right;
//  var  heightChart = d3.select("#chart").node().getBoundingClientRect().height - margin.top - margin.bottom;
    
  var  heightChart = d3.select("#chart").node().getBoundingClientRect().height - margin.top - margin.bottom;

    

//   var svg2 = d3.select("#chart")
//  .append("svg")
//    .attr("width", widthChart + margin.left + margin.right)
//    .attr("height", heightChart + margin.top + margin.bottom)
//    .append("g")
//   .attr("transform",
//          "translate(" + margin.left + "," + margin.top + ")");
//





  var parseTime = d3.timeParse("%Y-%m-%d");   




    var x = d3.scaleTime().range([0, widthChart]);
  svg2.append("g")
      .attr("transform", "translate("+ margin.left +"," + (heightChart +20) + ")")
    .attr("class", "x_axis");

var y = d3.scaleLinear().range([heightChart, 0]);
  svg2.append("g")
    .attr("transform", "translate(" + margin.left + ",20)")
    .attr("class", "y_axis");



Promise.all([
    d3.json('./../json/world_map.json'),
        d3.json('./../json/data.json'),
    d3.json('./../json/countrycodes.json')
        ]).then( ([data1, data2, data3]) => {
    
//    
//    var maxValue = d3.max(data2["DE"], function(d) { 
//        
//        
//        return d["2018-03-29"]
//    
//    
//    });
//    
//    console.log(maxValue);
//    
//    
                    
    
    map.append("g")
      .attr("class", "countries" )
      .selectAll("path")
      .data(data1.features)
      .enter().append("path")
      .attr("class", "country")
      .attr("d", path)
      .attr("fill", function(d){
        var code = data3[d.id];
        if (data2[code] != undefined){
            console.log(data2[code]["2018-03-29"])
            return colorScale (data2[code]["2018-03-29"]);
        }else {return "transparent"}
    })
    .attr("id",d=> data3[d.id])
      .style('stroke', 'black')
      .style('stroke-width', 0.3)
      .style("opacity",1.0)
    .on("click", function(event,d){
        
    console.log(d);
        
    var code = data3[d.id];
        if (data2[code] != undefined){
            
            
            console.log(data2[code]);
            drawGraph(data2[code]);
       
            
            
            
        }else {console.log("NO DATA")}
        
        
        
        
    });
      
    
    sensors = data2;
    console.log(data1, data2, data3);
    
    
    
    
    
    
//    
//    
//var colorScaleLin = d3.scaleLinear()
//          .domain([0, newData.length-1])
//          .interpolate(d3.interpolateLab)
//          .range([col_range_low, col_range_high]);
//    
//    
//  
//var colorScale = d3.scaleLinear()
//    .domain([-15, 7.5, 30])
//    .range(["#2c7bb6", "#ffff8c", "#d7191c"])
//    .interpolate(d3.interpolateHcl);
//    
    
    
    
        }).catch(err => console.log('Error loading or parsing data.'))





  d3.timer(function(elapsed) {
    const rotate = projection.rotate()
    const k = sensitivity / projection.scale()
    projection.rotate([
      rotate[0] - 1 * k,
      rotate[1]
    ])
    path = d3.geoPath().projection(projection)
    svg.selectAll("path").attr("d", path)
  },200)



function drawGraph(data){
    
    var formatedData = [];   
   
    Object.entries(data).forEach(function(item){
        var dataItem = {"date":parseTime(item[0]),"value":+item[1]}
        formatedData.push(dataItem);
    });
    
console.log(formatedData);
    
x.domain(d3.extent(formatedData, function(d) { return d.date; }));    
y.domain([0, d3.max(formatedData, function(d) { return d.value; })]);
    
    var xAxis = d3.axisBottom().scale(x);
    var yAxis = d3.axisLeft().scale(y);

//    var x = d3.scaleTime().range([0, widthChart]);
//    var y = d3.scaleLinear().range([heightChart, 0]);
//    
    
 
    svg2.selectAll(".x_axis")
    .transition()
    .duration(3000)
    .call(xAxis);

    svg2.selectAll(".y_axis")
    .transition()
    .duration(3000)
    .call(yAxis);
    
    var update = svg2.selectAll(".line")
    .data([formatedData]);
    
      update
    .enter()
    .append("path")
    .attr("class","line")
    .merge(update)
    .transition()
    .duration(3000)
    .attr("d", d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.value); }))
    .attr("transform", "translate(" + margin.left + ",20)");
    
    
    
//        var valueline = d3.line()
//    .curve(d3.curveBasis)
//    .x(function(d) { return x(d.date); })
//    .y(function(d) { return y(d.value); });
    
    
    
    

//    svg2.append("path")
//      .data([formatedData])
//      .attr("class", "line")
//      .attr("d", valueline)
//    .attr("transform", "translate(" + margin.left + ",20)");
//    
//    // Add the x Axis
//  svg2.append("g")
//      .attr("transform", "translate("+ margin.left +"," + (height +20) + ")")
//    .attr("class", "x_axis")
//      .call(d3.axisBottom(x));
//
//  // Add the y Axis
//  svg2.append("g")
//    .attr("transform", "translate(" + margin.left + ",20)")
//    .attr("class", "y_axis")
//      .call(d3.axisLeft(y));

  };



