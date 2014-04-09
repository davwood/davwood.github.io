---
layout: post
title: "Makers Academy Rewound"
date: 2014-01-18 20:55:03 +1100
comments: true
categories: general,makers-academy,d3.js
---

<script type="text/javascript" src="http://code.jquery.com/jquery-1.7.2.min.js"></script>
<div id="style">              
    

<style type="text/css">
.svg-section {
	background-color: #25383C;
}

text#green {
	fill: white;
	font-size: 12px;
}

text#red {
	fill: white;
	font-size: 12px;
}
.axis path,
.axis line {
  shape-rendering: crispEdges;
}


.x.axis path {
  display: none;
}

.line {
  fill: none;
  stroke: url(#col-gradient);
  stroke-width: 2px;
}

.axis .domain
{
opacity: 0;
}


.tick {
	fill: white;
}

.tick line {
	stroke: white;
}

#weeks {
	font-size: 14px; 
	fill: white;

}

rect {
	opacity: 0.5;
	stroke: grey;
}

.subtitle {
	font-size: 0.9em;
	padding-left: 10px;
}

#option {
	margin-bottom: 15px;
}
</style>
</div>
<div id="option">
    <input name="updateButton" 
                 type="button" 
                value="Update" 
                onclick="redrawLine()" />
</div>
<div id="body">
</div>	

<script type="text/javascript">

function draw() {

$("#body").empty();

var margin = {top: 20, right: 25, bottom: 50, left: 100},
    width = 660 - margin.left - margin.right,
    height = 260 - margin.top - margin.bottom;

// var parseDate = d3.time.format("%d-%b-%y").parse;


var data = [5,8,6,3,6,4,5,8,3,2,3,7,9]

var x = d3.scale.linear()
    .domain([0, data.length - 1])
    .range([0, width]);

var y = d3.scale.linear()
    .domain([0,d3.max(data)])
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .tickSize(5)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .ticks(1)
    .tickFormat(function (d) { return ''; }) //hides the tick value
    .tickSize(10)
    .orient("left")
    

var line = d3.svg.line()
    .interpolate("cardinal")
    .x(function(d,i) { return x(i); })
    .y(function(d) { return y(d); });

var svg = d3.select("#body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "svg-section")
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("linearGradient")
      .attr("id", "col-gradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0).attr("y1", y(3))
      .attr("x2", 0).attr("y2", y(6))
    .selectAll("stop")
      .data([
        {offset: "0%", color: "red"},
        {offset: "50%", color: "orange"},
        {offset: "100%", color: "green"}
      ])
    .enter().append("stop")
      .attr("offset", function(d) { return d.offset; })
      .attr("stop-color", function(d) { return d.color; });


//Draw XAxis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("x", width/2)
      .attr("y", "30")
      .attr("dy", "0.71em")
      .attr("id", "weeks")
      .style("text-anchor", "middle")
      .text("Weeks");

//Draw YAxis
var yAxisdraw = svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)

yAxisdraw.append("rect")
    .attr("width", 95)
    .attr("height", 40)
    .attr("x", -90)
    .attr("y", height-70)
    .style("fill", "red")

yAxisdraw.append("text")
      .attr("y", height-55)
      .attr("x",-2)
      .attr("dy", ".71em")
      .attr("id", "red")
      .style("text-anchor", "end")
      .text("I know nothing");

yAxisdraw.append("rect")
    .attr("width", 95)
    .attr("height", 40)
    .attr("x", -90)
    .attr("y", 25)
    .style("fill", "green")

yAxisdraw.append("text")
      .attr("y", 40)
      .attr("x", -15)
      .attr("dy", ".71em")
      .attr("id", "green")
      .style("text-anchor", "end")
      .text("I know lots");



var path = svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);

var totalLength = path.node().getTotalLength();
  
path
      .attr("stroke-dasharray", totalLength+","+totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(2500)
      .ease("linear-in-out")
      .attr("stroke-dashoffset", 0);

}

draw();

function redrawLine() {
  draw();
}

// $(window).resize(function() {
//   draw();
// });

   
</script>

<p class="subtitle"><em>- The ups and downs of learning at Makers Academy :)</em></p>


<br>
We had 2 weeks. 2 weeks to build a web application. A good web application. One that attempted to solve a problem. One that was usable, looked ok, with limited 'technical debt' and developed using test-driven development (TDD) principles. One that we would present (in our team of 5) in front of 150 people. Woo and dazzle them. Be so good that we all get acquired by google for millions of pounds.  
Well.. maybe not quite the last line but it cetainly seemed like I wasn't going to be doing much else in the next 2 weeks. 

It was the final 2 weeks of the [Makers Academy](www.makersacademy.com) course - a 12 week intensive web development course in London. A course that had been relentless in the amount of new material being thrown around each and every day. A constant battle to try and stay up on it. To try not to sink. A regular battle where you just felt like you were starting to catch up and kind of 'get it' - only to then be blind-sided by a whole bunch of new information, concepts and ideas. 

Of course don't get me wrong - it was still fun. It was a great environment to learn with a ping pong table, muesli bars, lots of coffee and plenty of jokes. Hearing a german in a heavy accent tell everyone he was going to 'fork it' (in reference to his git account) meant I was now also well up to speed on nerdy jokes. 

###A Normal Day

A normal day went something like this:

* 9am - arrive
* 9:30am - morning 'lecture'
* 11am - coffee walk (we often went to Ozone coffee)
* 11:15am - start coding based on what we'd covered in the morning
* 1pm - take lunch. ping pong championships
* 2pm - get back to coding practice 
* 3pm - maybe an afternoon 'lecture' or a Q & A session
* 4pm - keep going with whatever your working
* 7pm - leave (it was common to do some at home too)

*Makers Academy was generally open from around 8:30am - 9pm so you could stay back if you wanted to.*

<img src="{{ root_url }}/blog/images/makersacademy.png" />

###Fridays

Each Friday was a test day. Basically you got given a challenge based around what you'd been learning that week. These ranged from short 1 hour challenges right through to building a site over the course of the weekend. It helped to just focus on the learning aspect rather than the exact outcome especially because some of the websites were too big to do in a weekend so you just had to get done what you could. I enjoyed them on the whole as it let you go at your own pace, reinforce the material and give you a reasonable idea as to how your were tracking. It was all 'open internet', so you could search for what you want - just don't go fooling yourself and copying too much. 

### Our Cohort

All 15 of us in the group were in this together and helped and supported each other throughout. We regularly pair programmed and switched pairs often. We had started in the August cohort bright and energetic quickly overcoming that momentary awkwardness of a new group of people. There were lots of different backgrounds. University graduates, accountant, entrepreneur, poet, venture capitalist, scientist, theatre manager to name a few. Different ages too. 19 yrs old - right up to 40yrs+ all with different motivations for being there but a common goal to learn. Looking back I think we were a particularly lucky group as we all fitted together better than normal. Not sure why exactly - maybe a good girl / guy ratio helped. Maybe because we could bring different perspectives to the table from our different backgrounds.

###Learning style

We worked through an evolving syllabus that was up to date with the latest in web technologies. We would cover a general topic (javascript for example) for a week and do exercises relating to it often culminating in a small project. Due to the interlinked nature of the things we were learning it was all meant to build on top of each other. So learning git (a version control system) early on was then a skill that we used daily from then on. Teacher interaction was through a combination of group lectures, Q & A lectures, a hackpad online resource and questions. We ended with a system of writing our name on the board (a very non-tech queuing system!) that the teacher would then come around and deal with the issues you had. This worked well most of the time. Often a fellow student could help you out also and sometimes a game of ping pong was all that was needed to change focus and come back to the problem to discovered you were missing a dot! 

Special mention to our teachers throughout this whole 12 weeks. [Evgeny](https://github.com/shadchnev) started us out, [Enrique](https://github.com/ecomba) kicked us along and [Alex](https://github.com/alexpeattie) brought us home in a calm, composed flurry.  I was particularly impressed by the selfless attitude of the teachers. They were genuinely interested in helping you and were quite happy to keep going back over things again and again until you got it.  A very different attitude to those bored lecturers at university or people training you at a bank who are just a bit tired of their job. 

The teachers at [Makers Academy](www.makersacademy.com) definitely love what they do and it shows. It helps that Makers Academy is a new startup (about a year old) and is flexible with change and open to new ideas. I hope they become rigid in future as the business matures.

**I would highly recommend this course to someone who is keen to learn and wants to work hard. You just have to be willing to dig deep and push out of your comfort zone.**

Like many things this definitely falls into the category of the more you put into it the more you'll get out of it. Oh and tell your partner you might be a bit busy so they should take up knitting and/or golf! 

If you're interested our final 2 week project was [Set it forget it](http://www.setforget.it). 

###Afterwards (and Jobs)

There were 2 broad groups of people at the course.

1. Those looking for Junior web development roles
2. Everyone else

For those in group 1 that were looking for web development roles they have largely found them. Many got jobs withing the first 2 months of looking. Some who feel they are not quite up to scratch are continuing to practice at home. There are plenty of jobs out there in the field. However, some employers will take some convincing that someone after just 12 weeks is worth hiring. [Makers Academy](www.makersacademy.com) is trying to help convince them by bringing them along to events to see for themselves and pair programming with students to see what we know.

For group 2 - everyone was pretty happy with the course and I think most people got out of the course what they wanted. 

For me personally, I have moved back to Australia (after 5 years away) and have been enjoying sunshine, beaches, catching up with family and friends. My coding took a break for a few weeks (I also dropped into say hello to friends in America) but am now back on the horse and working on a few projects of my own so I'm somewhere between groups 1 & 2. Will be looking for some web development work soon! 

Have starting learning [d3.js](http://d3js.org/). I've used in the chart at the top. It's one of the things I'm hoping to progress further with.
