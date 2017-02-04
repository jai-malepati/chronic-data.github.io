//Loading the Data
d3.json("patient.json").get(function(error,data){ 
    plotChart(data)
});


//Plotting the data
function plotChart(data){

  pulse = data["pulse"]
  sbp = data["sbp"]
  dbp = data["dbp"]
  alt = data["alanine_alt"]
  akp = data["ALKALINE_PHOSPHATASE"]

  var height = 400;
  var width = 800;

  var margin = {left:50,right:50,top:40,bottom:0};


  // Parse the date & time
  var parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");
  var formatTime = d3.timeFormat("%e %B");

  //Loading the data
  pulse.forEach(function(d){
    d.contactDate = parseDate(d.contactDate)
    d.eventValue = +parseInt(d.eventValue);
    d.rangeLow = d.rangeLow
    d.rangeHigh = d.rangeHigh
  }); 


  sbp.forEach(function(d){
    d.contactDate = parseDate(d.contactDate)
    d.eventValue = +parseInt(d.eventValue);
    d.rangeLow = d.rangeLow
    d.rangeHigh = d.rangeHigh
  }); 

  dbp.forEach(function(d){
    d.contactDate = parseDate(d.contactDate)
    d.eventValue = +parseInt(d.eventValue);
    d.rangeLow = d.rangeLow
    d.rangeHigh = d.rangeHigh
  }); 

  alt.forEach(function(d){
    d.contactDate = parseDate(d.contactDate)
    d.eventValue = +parseInt(d.eventValue);
    d.rangeLow = d.rangeLow
    d.rangeHigh = d.rangeHigh
  }); 

  akp.forEach(function(d){
    d.contactDate = parseDate(d.contactDate)
    d.eventValue = +parseInt(d.eventValue);
    d.rangeLow = d.rangeLow
    d.rangeHigh = d.rangeHigh
  }); 



  //Filtering the data
  pulse = pulse.filter(function(d) {
    return d.eventValue > 0;
  })




  //Setting  up the Scale
  var x = d3.scaleTime()
              .domain([d3.min(dbp,function(d){ return d.contactDate; }),d3.max(pulse,function(d){ return d.contactDate; })])
              .range([0,width]);

  var y1 = d3.scaleLinear()
              .domain([0,d3.max(pulse, function(d){return d.eventValue; })])
              .range([height,0]);
  
  var y2 = d3.scaleLinear()
              .domain([0,d3.max(sbp, function(d){return d.eventValue; })])
              .range([height,0]);

  var y3 = d3.scaleLinear()
              .domain([0,d3.max(dbp, function(d){return d.eventValue; })])
              .range([height,0]);

  var y4 = d3.scaleLinear()
              .domain([0,d3.max(alt, function(d){return d.eventValue; })])
              .range([height,0]);

  var y5 = d3.scaleLinear()
              .domain([0,d3.max(akp, function(d){return d.eventValue; })])
              .range([height,0]);


  //Setting up the axis
  var yAxis = d3.axisLeft(y1).ticks(10).tickPadding(10).tickSize(10);
  var xAxis = d3.axisBottom(x);


  // add the tooltip area to the webpage
  var tooltip = d3.select("#shapes").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)


  //Adding the canvas
  var svg = d3.select("#shapes")
                    .append("svg")
                    .attr("width", "100%") 
                    .attr("height", "600"); 


  //Declaring the Chart group and its properties
  var chartGroup = svg.append("g").attr("transform","translate("+margin.left+","+margin.top+")");


  //Function to plot the values
  var line1 = d3.line()
      .x(function(d) { return x(d.contactDate); })
      .y(function(d) { if(y1(d.eventValue > 0)) {return y1(d.eventValue);} });

  var line2 = d3.line()
        .x(function(d) { return x(d.contactDate); })
        .y(function(d) { return y2(d.eventValue); });

  var line3 = d3.line()
        .x(function(d) { return x(d.contactDate); })
        .y(function(d) { return y3(d.eventValue); });

  var line4 = d3.line()
        .x(function(d) { return x(d.contactDate); })
        .y(function(d) { return y4(d.eventValue); });

  var line5 = d3.line()
        .x(function(d) { return x(d.contactDate); })
        .y(function(d) { return y5(d.eventValue); });

  // Line Chart
  chartGroup.append("path")
        .datum(pulse)
        .attr("fill", "none")
        .attr("id", "pulseLine")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 3)
        .attr("d", line1);

  chartGroup.append("path")
        .datum(sbp)
        .attr("fill", "none")
        .attr("id", "sbpLine")
        .attr("stroke", "green")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 3)
        .attr("d", line2);

  chartGroup.append("path")
        .datum(dbp)
        .attr("fill", "none")
        .attr("id", "dbpLine")
        .attr("stroke", "purple")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 3)
        .attr("d", line3);


  chartGroup.append("path")
        .datum(alt)
        .attr("fill", "none")
        .attr("id", "altLine")
        .attr("stroke", "orange")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 3)
        .attr("d", line4);


  chartGroup.append("path")
        .datum(akp)
        .attr("fill", "none")
        .attr("id", "akpLine")
        .attr("stroke", "orangered")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 3)
        .attr("d", line5);


  // Dot Chart
    chartGroup.selectAll("dot")
        .data(pulse)
        .enter().append("circle").attr("id", "pulseDots")
        .attr("r", 3.5)
        .style("fill", function(d) {        
            if (d.eventValue < d.rangeLow) {return "red"}  
            else if (d.eventValue > d.rangeHigh) {return "red"} // <== Right here 
            else { return "black" }             
        ;})
        .attr("cx", function(d) { return x(d.contactDate); })
        .attr("cy", function(d) { return y1(d.eventValue); })

        .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html("Heart Rate" + "<br/>" + formatTime(d.contactDate) + "<br/>" + d.eventValue)
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });

    chartGroup.selectAll("dot")
        .data(sbp)
        .enter().append("circle").attr("id", "sbpDots")
        .attr("r", 3.5)
        .style("fill", function(d) {        
            if (d.eventValue < d.rangeLow) {return "red"}  
            else if (d.eventValue > d.rangeHigh) {return "red"} // <== Right here 
            else { return "black" }             
        ;})
        .attr("cx", function(d) { return x(d.contactDate); })
        .attr("cy", function(d) { return y2(d.eventValue); })
        .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html("Systolic BP" + "<br/>" + formatTime(d.contactDate) + "<br/>" + d.eventValue)
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });


    chartGroup.selectAll("dot")
        .data(dbp)
        .enter().append("circle").attr("id", "dbpDots")
        .attr("r", 3.5)
        .style("fill", function(d) {        
            if (d.eventValue < d.rangeLow) {return "red"}  
            else if (d.eventValue > d.rangeHigh) {return "red"} // <== Right here 
            else { return "black" }             
        ;})
        .attr("cx", function(d) { return x(d.contactDate); })
        .attr("cy", function(d) { return y3(d.eventValue); })
        .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html("Diastolic BP" + "<br/>" + formatTime(d.contactDate) + "<br/>" + d.eventValue)
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });


    chartGroup.selectAll("dot")
        .data(alt)
        .enter().append("circle").attr("id", "altDots")
        .attr("r", 3.5)
        .style("fill", function(d) {        
            if (d.eventValue < d.rangeLow) {return "red"}  
            else if (d.eventValue > d.rangeHigh) {return "red"} // <== Right here 
            else { return "black" }             
        ;})
        .attr("cx", function(d) { return x(d.contactDate); })
        .attr("cy", function(d) { return y4(d.eventValue); })
        .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html("Aminotrans" + "<br/>" +formatTime(d.contactDate) + "<br/>" + d.eventValue)
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });


    chartGroup.selectAll("dot")
        .data(akp)
        .enter().append("circle").attr("id", "akpDots")
        .attr("r", 3.5)
        .style("fill", function(d) {        
            if (d.eventValue < d.rangeLow) {return "red"}  
            else if (d.eventValue > d.rangeHigh) {return "red"} // <== Right here 
            else { return "black" }             
        ;})
        .attr("cx", function(d) { return x(d.contactDate); })
        .attr("cy", function(d) { return y5(d.eventValue); })
        .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html("Phosphatase" + "<br/>" +formatTime(d.contactDate) + "<br/>" + d.eventValue)
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });
 
  chartGroup.append("g")
        .attr("class","axis y")
        .call(yAxis);
  chartGroup.append("g")
        .attr("class","axis x")
        .attr("transform","translate(0,"+height+")")
        .call(xAxis);


      // Add the Pulse line title
    svg.append("text")
      .attr("x", 20)             
      .attr("y", height + margin.top + 50)    
      .attr("class", "legend")
      .style("fill", "steelblue")
      .style("font-size","20px")   
      .on("click", function(){
        // Determine if current line is visible
        var active   = pulseLine.active ? false : true,
          newOpacity = active ? 0 : 1;
        // Hide or show the elements
        d3.select("#pulseLine").style("opacity", newOpacity);
        d3.selectAll("#pulseDots").style("opacity", newOpacity);
        // Update whether or not the elements are active
        pulseLine.active = active;
        pulseDots.active = active;
      })
      .text("Heart Rate");   


    svg.append("text")
      .attr("x", 140)             
      .attr("y", height + margin.top + 50)    
      .attr("class", "legend")
      .style("fill", "green")  
      .style("font-size","20px")       
      .on("click", function(){
        // Determine if current line is visible
        var active   = sbpLine.active ? false : true,
          newOpacity = active ? 0 : 1;
        // Hide or show the elements
        d3.select("#sbpLine").style("opacity", newOpacity);
        d3.selectAll("#sbpDots").style("opacity", newOpacity);
        // Update whether or not the elements are active
        sbpLine.active = active;
      })
      .text("Systolic BP");      

    svg.append("text")
      .attr("x", 280)             
      .attr("y", height + margin.top + 50)    
      .attr("class", "legend")
      .style("fill", "purple") 
      .style("font-size","20px")        
      .on("click", function(){
        // Determine if current line is visible
        var active   = dbpLine.active ? false : true,
          newOpacity = active ? 0 : 1;
        // Hide or show the elements
        d3.select("#dbpLine").style("opacity", newOpacity);
        d3.selectAll("#dbpDots").style("opacity", newOpacity);
        // Update whether or not the elements are active
        dbpLine.active = active;
      })
      .text("Diastolic BP");      


    svg.append("text")
      .attr("x", 420)             
      .attr("y", height + margin.top + 50)    
      .attr("class", "legend")
      .style("fill", "orange")  
      .style("font-size","20px")
      .on("click", function(){
        // Determine if current line is visible
        var active   = altLine.active ? false : true,
          newOpacity = active ? 0 : 1;
        // Hide or show the elements
        d3.select("#altLine").style("opacity", newOpacity);
        d3.selectAll("#altDots").style("opacity", newOpacity);
        // Update whether or not the elements are active
        altLine.active = active;
      })
      .text("Alanine Aminotrans(ALT)");      
 
    svg.append("text")
      .attr("x", 680)             
      .attr("y", height + margin.top + 50)    
      .attr("class", "legend")
      .style("fill", "orangered")  
      .on("click", function(){
        // Determine if current line is visible
        var active   = akpLine.active ? false : true,
          newOpacity = active ? 0 : 1;
        // Hide or show the elements
        d3.select("#akpLine").style("opacity", newOpacity);
        d3.selectAll("#akpDots").style("opacity", newOpacity);
        // Update whether or not the elements are active
        akpLine.active = active;
      })
      .style("font-size","20px")
      .text("Alkaline Phosphatase");  


    svg.append("text")
      .attr("x", 550)             
      .attr("y", height + margin.top + 100)    
      .attr("class", "legend")
      .style("fill", "deeppink")  
      .on("click", function(){
        // Determine if current line is visible
        var active   = pulseDots.active ? false : true,
          newOpacity = active ? 0 : 1;
        // Hide or show the elements
        d3.selectAll("#pulseDots").style("opacity", newOpacity);
        d3.selectAll("#sbpDots").style("opacity", newOpacity);
        d3.selectAll("#dbpDots").style("opacity", newOpacity);
        d3.selectAll("#altDots").style("opacity", newOpacity);
        d3.selectAll("#akpDots").style("opacity", newOpacity);
        // Update whether or not the elements are active
        pulseDots.active = active;
      })
      .style("font-size","20px")
      .text("Dot Chart");      


    svg.append("text")
      .attr("x", 250)             
      .attr("y", height + margin.top + 100)    
      .attr("class", "legend")
      .style("fill", "crimson")  
      .on("click", function(){
        // Determine if current line is visible
        var active   = pulseLine.active ? false : true,
          newOpacity = active ? 0 : 1;
        // Hide or show the elements
        d3.select("#pulseLine").style("opacity", newOpacity);
        d3.select("#sbpLine").style("opacity", newOpacity);
        d3.select("#dbpLine").style("opacity", newOpacity);
        d3.select("#altLine").style("opacity", newOpacity);
        d3.select("#akpLine").style("opacity", newOpacity);
        // Update whether or not the elements are active
        pulseLine.active = active;
      })
      .style("font-size","20px")
      .text("Line Chart");          

}



