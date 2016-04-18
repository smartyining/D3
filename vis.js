var margin = {top: 20, right: 20, bottom: 30, left: 40},
width = 500 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear().range([0, width]);
var y = d3.scale.linear().range([height, 0]);
var color = d3.scale.category10();

var axisNames = {
    cylinders: 'cylinders',
    mpg: 'mpg',
    displacement: 'displacement',
    horsepower: 'horsepower',
    weight : 'weight',
    acceleration : 'acceleration',
    model_year : 'model_year'

};

var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xAxis = d3.svg.axis().scale(x).orient("bottom");
var yAxis = d3.svg.axis().scale(y).orient("left");

svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("displacement");

svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("mpg");


var draw = function(mpg_min,mpg_max) {

    d3.csv("car.csv", function(error, data) {
        data.forEach(function(d) {
            d.mpg = +d.mpg;
            d.cylinders = +d.cylinders;
            d.displacement = +d.displacement;
            d.horsepower = +d.horsepower;
            d.weight = +d.weight;
            d.acceleration = +d.acceleration;
            d["model.year"] = +d["model.year"];
        });

        data = data.filter(function(d) {
          return d.mpg <= mpg_max && d.mpg >= mpg_min;
        })

        xAxisnow = $('#xAXISid').val();
        yAxisnow = $('#yAXISid').val();

        x.domain(d3.extent(data, function(d) { return d[xAxisnow]; })).nice();
        svg.select(".x.axis").transition().call(xAxis);
        y.domain(d3.extent(data, function(d) { return d[yAxisnow]; })).nice();
        svg.select(".y.axis").transition().call(yAxis);
        //temp = d3.extent(data, function(d) { return d.mpg; });

        var dots =  svg.selectAll(".dot").data(data);
        dots.enter().append("circle");
        dots.attr("class", "dot")
                .attr("r", 3.5)
                .attr("cx", function(d) { return x(d[xAxisnow]); })
                .attr("cy", function(d) { return y(d[yAxisnow]); })
                .style("fill", function(d) { return color; })
                .on("mouseover", function(d) {
                  $('h4').text(d.name);
                })
                .on('mouseout', function(d){
                  $('h4').text('Please hover on a point to see its name.');
                });

        dots.exit().remove();

        d3.select("[name=xAXIS]").on("change", function(){
            xAxy = this.value;
            console.log(xAxy)
            x.domain(d3.extent(data, function(d) { return d[xAxy]; })).nice();
            svg.select(".x.axis").transition().call(xAxis);
            svg.selectAll(".dot").transition().attr("cx", function(d) {
                return x(d[xAxy]);
            });
            svg.selectAll(".x.axis").selectAll("text.label").text(axisNames[xAxy]);
        });

        d3.select("[name=yAXIS]").on("change", function(){
            yAxy = this.value;
            console.log(yAxy)
            y.domain(d3.extent(data, function(d) { return d[yAxy]; })).nice();
            svg.select(".y.axis").transition().call(yAxis);
            svg.selectAll(".dot").transition().attr("cy", function(d) {
                return y(d[yAxy]);
            });
            svg.selectAll(".y.axis").selectAll("text.label").text(axisNames[yAxy]);
        });

    });
}



$(document).ready(function() {
  draw(0,50);
      $('button').click(function(){
        var mpg_min = +$('#mpg-min').val();
        var mpg_max = +$('#mpg-max').val();
        draw(mpg_min,mpg_max);
    });

});
