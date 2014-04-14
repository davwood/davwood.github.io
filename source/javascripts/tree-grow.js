var width = 440,
    height = 310;

var svg = d3.select("#tree").append("svg")
    .attr("width", width)
    .attr("height", height);

var branches = [];
var seed = {i: 0, x: width/2, y: height - 10, a: 0, l: 55, d:0}; // a = angle, l = length, d = depth
var da = 0.5;
var dl = 0.8;
var ar = 0.7;

var maxDepth = 10; 

function branch(b) {
  var end = endPoint(b), daR, newBranch;

  branches.push(b);

  if (b.d === maxDepth)
    return;

  // Left branch
  daR = ar * Math.random() - ar * 0.5;
  newBranch = {
    i: branches.length,
    x: end.x,
    y: end.y,
    a: b.a - da + daR,
    l: b.l * dl,
    d: b.d + 1,
    parent: b.i
  };
  branch(newBranch);

  // Right branch
  daR = ar * Math.random() - ar * 0.5;
  newBranch = {
    i: branches.length,
    x: end.x, 
    y: end.y, 
    a: b.a + da + daR, 
    l: b.l * dl, 
    d: b.d + 1,
    parent: b.i
  };
  branch(newBranch);
}

function endPoint(b) {
  // Return endpoint of the branch
  var x = b.x + b.l * Math.sin( b.a );
  var y = b.y - b.l * Math.cos( b.a );
  return {x: x, y: y};
}

//D3
function x1(d) {return d.x;}
function y1(d) {return d.y;}
function x2(d) {return endPoint(d).x;}
function y2(d) {return endPoint(d).y;}
function highlightParents(d) {
  var colour = d3.event.type === 'mouseover' ? '#FF9900' : '#975445';
  var depth = d.d;
  for(var i = 0; i <= depth; i++) {
    d3.select('#id-'+parseInt(d.i)).style('stroke', colour);
    d = branches[d.parent];
  }
}

function create() {
  svg
    .selectAll("line")
    .data(branches)
    .enter()
    .append("line")
    .attr("x1", x1)
    .attr("y1", y1)
    .attr("x2", x2)
    .attr("y2", y2)
    .attr("id", function(d) {return 'id-'+d.i;})
    .attr("stroke","white")
    .on("mouseover",highlightParents)
    .on("mouseout",highlightParents)
    .transition()
      .delay(function(d, i) { return parseInt(d.d) * 180 })
      .attr("stroke", function(d) { 
        if (d.d < 11) {return "#975445"} 
          else {return "#18443e"}
        ;})
      .attr("stroke-width", function (d) { 
        if (d.d < 9) {return parseInt(maxDepth + 1 - d.d) + "px"}
          else {return "1px"}
        ;})
      .duration(500);    
}

branch(seed);
create();