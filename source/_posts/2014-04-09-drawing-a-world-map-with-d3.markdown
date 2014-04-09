---
layout: post
title: "Drawing a world map with D3"
date: 2014-04-09 08:31:15 +1000
comments: true
categories: 
---

<div id="style"> 
<style type="text/css">

stroke {
  fill: none;
  stroke: #000;
  stroke-width: 2spx;
}

.fill {
  fill: #0D242B;
}

.graticule {
  fill: none;
  stroke: #777;
  stroke-width: .5px;
  stroke-opacity: .3;
}

.country {
  fill: #2D7F99;
}

.country.code32 {fill: #BF3930;} /*Argentina*/
.country.code36 {fill: #BF3930;} /*Australia*/
.country.code40 {fill: #BF3930;} /*Austria*/
.country.code68 {fill: #BF3930;} /*Bolivia*/
.country.code76 {fill: #BF3930;} /*Brazil*/
.country.code84 {fill: #BF3930;} /*Belize*/
.country.code124 {fill: #BF3930;} /*Canada*/
.country.code144 {fill: #BF3930;} /*Sri Lanka*/

.country.code152 {fill: #BF3930;} /*Chile*/
.country.code170 {fill: #BF3930;} /*Colombia*/
.country.code188 {fill: #BF3930;} /*Costa Rica*/
.country.code191 {fill: #BF3930;} /*Croatia*/
.country.code218 {fill: #BF3930;} /*Ecuador*/

.country.code222 {fill: #BF3930;} /*El Salvador*/
.country.code250 {fill: #BF3930;} /*France*/
.country.code276 {fill: #BF3930;} /*Germany*/
.country.code320 {fill: #BF3930;} /*Guatemala*/
.country.code336 {fill: #BF3930;} /*Vatican*/
.country.code340 {fill: #BF3930;} /*Honduras*/

.country.code356 {fill: #BF3930;} /*India*/
.country.code380 {fill: #BF3930;} /*Italy*/
.country.code458 {fill: #BF3930;} /*Malaysia*/
.country.code484 {fill: #BF3930;} /*Mexico*/
.country.code504 {fill: #BF3930;} /*Morocco*/

.country.code524 {fill: #BF3930;} /*Nepal*/
.country.code528 {fill: #BF3930;} /*Netherlands*/
.country.code558 {fill: #BF3930;} /*Nicaragua*/
.country.code578 {fill: #BF3930;} /*Norway*/
.country.code591 {fill: #BF3930;} /*Panama*/

.country.code604 {fill: #BF3930;} /*Peru*/
.country.code620 {fill: #BF3930;} /*Portugal*/
.country.code702 {fill: #BF3930;} /*Singapore*/
.country.code724 {fill: #BF3930;} /*Spain*/
.country.code756 {fill: #BF3930;} /*Switzerland*/

.country.code784 {fill: #BF3930;} /*United Arab Emirates*/
.country.code826 {fill: #BF3930;} /*United Kingdom*/
.country.code840 {fill: #BF3930;} /*United States*/
.country.code858 {fill: #BF3930;} /*Uruguay*/


.boundary {
  fill: none;
  stroke: #fff;
  stroke-width: .5px;
}

</style>

</div>
<div id="world">

</div>

<script type="text/javascript">
	
var width = 840, height = 555;

var svg = d3.select("#world").append("svg")
    .attr("width", width)
    .attr("height", height);

var projection = d3.geo.baker()
    .scale(122)
    .translate([width / 2, height / 2])
    .precision(.1);

var path = d3.geo.path()
    .projection(projection);

var graticule = d3.geo.graticule();

svg.append("defs").append("path")
    .datum({type: "Sphere"})
    .attr("id", "sphere")
    .attr("d", path);

svg.append("use")
    .attr("class", "stroke")
    .attr("xlink:href", "#sphere");

svg.append("use")
    .attr("class", "fill")
    .attr("xlink:href", "#sphere");

svg.append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path);

d3.json("/assets/data/world-50m.json", function(error, world) {

var countries = topojson.feature(world, world.objects.countries).features,
      neighbors = topojson.neighbors(world.objects.countries.geometries);
 
  svg.selectAll(".country")
      .data(countries)
    .enter().insert("path", ".graticule")
      .attr("class", function(d) { return "country " + "code" + d.id; })
      .attr("d", path);

 svg.insert("path", ".graticule")
      .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
      .attr("class", "boundary")
      .attr("d", path);
});

d3.select(self.frameElement).style("height", height + "px");

</script>

<p class="subtitle"><em>- Where in the world has davo been</em></p>

I've started playing around with geographical maps in D3. 

It's all quite new to me and there were plenty of new parts to get my head around. Of most use was Mike Bostock's excellent tutorial [Let's make a map](http://bost.ocks.org/mike/map/). It covers all the main points to make a map.

I decided to have a go at a simple task - representing the countries I've visited in an elegant D3 map.

The main steps that go into making a map with d3 are:
###1 - Find and prepare your data

A world map is made up of a lot of data. The data is used to draw the map as a path in the browser. It will also contain other properties such as place names, population sizes etc. 

First choice to get this data seems to be [natural earth data](http://www.naturalearthdata.com/downloads/). It can be downloaded in a range of different formats. I downloaded countries using the 50m resolution (as I didn't need too much detail). This is a zip file containing various formats. The SHP (shapefile) can then be converted to geoJSON and then onto topoJSON. This is needed because D3 deals in geoJSON and topoJSON formats. 

You'll need to download GDAL, node.js, topojson. 
Full instructions for how to do this are [here](http://bost.ocks.org/mike/map/#installing-tools).

Note: I had to install GDAL from [here](http://www.kyngchaos.com/software:frameworks) because after using homebrew it wasn't recognising the ogr2ogr command. After installing GDAL I then had to add to .bash_profile: 
{% codeblock %}
export PATH=/Library/Frameworks/GDAL.framework/Versions/1.10/Programs/:$PATH
{% endcodeblock %}

###2 - Draw the map

Once you have the data ready as geoJSON or topoJSON you can then load it into the browser.

The d3.json function takes the json file from where you have saved it on the server.

{% codeblock lang:js %}
d3.json("/data/world-50m.json", function(error, world) {

var countries = topojson.feature(world, world.objects.countries).features
 
  svg.selectAll(".country")
      .data(countries)
    .enter().insert("path", ".graticule")
      .attr("class", function(d) { return "country " + "code" + d.id; })
      .attr("d", path);
});

{% endcodeblock %}

I included the country id in the class as these are [numeric ISO codes](http://en.wikipedia.org/wiki/ISO_3166-1_numeric)

This could then be used to identify countries. 

###3 - Decide on your projection

{% blockquote wiki http://en.wikipedia.org/wiki/Map_projection %}
A map projection is a systematic transformation of the latitudes and longitudes of locations on the surface of a sphere or an ellipsoid into locations on a plane. Map projections are necessary for creating maps. All map projections distort the surface in some fashion.
{% endblockquote %}

D3 contains lots of different projection options. There are the standard [ones](https://github.com/mbostock/d3/wiki/Geo-Projections). 

<table>
<tbody><tr height="146" valign="top">
<td>d3.geo.albersUsa<br><a href="http://bl.ocks.org/mbostock/4090848"><img src="https://camo.githubusercontent.com/2268a4f5bf1729e612c447cdeb39436be58af77c/687474703a2f2f626c2e6f636b732e6f72672f6d626f73746f636b2f7261772f343039303834382f7468756d626e61696c2e706e67" width="202" data-canonical-src="http://bl.ocks.org/mbostock/raw/4090848/thumbnail.png"></a>
</td>
    <td>d3.geo.azimuthalEqualArea<br><a href="http://bl.ocks.org/mbostock/3757101"><img src="https://camo.githubusercontent.com/2aa03c5f99c72a7775341aa86c8322ae67de8421/687474703a2f2f626c2e6f636b732e6f72672f6d626f73746f636b2f7261772f333735373130312f7468756d626e61696c2e706e67" width="202" data-canonical-src="http://bl.ocks.org/mbostock/raw/3757101/thumbnail.png"></a>
</td>
    <td>d3.geo.azimuthalEquidistant<br><a href="http://bl.ocks.org/mbostock/3757110"><img src="https://camo.githubusercontent.com/08a3c5189398880d1d3d9f94694afb6dd52e1366/687474703a2f2f626c2e6f636b732e6f72672f6d626f73746f636b2f7261772f333735373131302f7468756d626e61696c2e706e67" width="202" data-canonical-src="http://bl.ocks.org/mbostock/raw/3757110/thumbnail.png"></a>
</td>
    <td>d3.geo.conicEqualArea<br><a href="http://bl.ocks.org/mbostock/3734308"><img src="https://camo.githubusercontent.com/705780535b279ffc9e48adb93244f1d55b4149b9/687474703a2f2f626c2e6f636b732e6f72672f6d626f73746f636b2f7261772f333733343330382f7468756d626e61696c2e706e67" width="202" data-canonical-src="http://bl.ocks.org/mbostock/raw/3734308/thumbnail.png"></a>
</td>
  </tr>
<tr height="146" valign="top">
<td>d3.geo.conicConformal<br><a href="http://bl.ocks.org/mbostock/3734321"><img src="https://camo.githubusercontent.com/9a9b004d6d6e99e934a0c59973e27c3b89d00fcb/687474703a2f2f626c2e6f636b732e6f72672f6d626f73746f636b2f7261772f333733343332312f7468756d626e61696c2e706e67" width="202" data-canonical-src="http://bl.ocks.org/mbostock/raw/3734321/thumbnail.png"></a>
</td>
    <td>d3.geo.conicEquidistant<br><a href="http://bl.ocks.org/mbostock/3734317"><img src="https://camo.githubusercontent.com/3b51bc98fbddeb73e759d6032aa5b53809950ae4/687474703a2f2f626c2e6f636b732e6f72672f6d626f73746f636b2f7261772f333733343331372f7468756d626e61696c2e706e67" width="202" data-canonical-src="http://bl.ocks.org/mbostock/raw/3734317/thumbnail.png"></a>
</td>
    <td>d3.geo.equirectangular<br><a href="http://bl.ocks.org/mbostock/3757119"><img src="https://camo.githubusercontent.com/510ed66d8c29e34e1010f2167baabd1d01b5fe3b/687474703a2f2f626c2e6f636b732e6f72672f6d626f73746f636b2f7261772f333735373131392f7468756d626e61696c2e706e67" width="202" data-canonical-src="http://bl.ocks.org/mbostock/raw/3757119/thumbnail.png"></a>
</td>
    <td>d3.geo.gnomonic<br><a href="http://bl.ocks.org/mbostock/3757349"><img src="https://camo.githubusercontent.com/3ed0165a82d5ece1428da8817ab58e36027efb5f/687474703a2f2f626c2e6f636b732e6f72672f6d626f73746f636b2f7261772f333735373334392f7468756d626e61696c2e706e67" width="202" data-canonical-src="http://bl.ocks.org/mbostock/raw/3757349/thumbnail.png"></a>
</td>
  </tr>
<tr height="146" valign="top">
<td>d3.geo.mercator<br><a href="http://bl.ocks.org/mbostock/3757132"><img src="https://camo.githubusercontent.com/64176495a5d2700fb37d8099f0385774e729ac97/687474703a2f2f626c2e6f636b732e6f72672f6d626f73746f636b2f7261772f333735373133322f7468756d626e61696c2e706e67" width="202" data-canonical-src="http://bl.ocks.org/mbostock/raw/3757132/thumbnail.png"></a>
</td>
    <td>d3.geo.orthographic<br><a href="http://bl.ocks.org/mbostock/3757125"><img src="https://camo.githubusercontent.com/99ea4d70bc1061f6dc0dacb5c1a8c83eeb19e9fa/687474703a2f2f626c2e6f636b732e6f72672f6d626f73746f636b2f7261772f333735373132352f7468756d626e61696c2e706e67" width="202" data-canonical-src="http://bl.ocks.org/mbostock/raw/3757125/thumbnail.png"></a>
</td>
    <td>d3.geo.stereographic<br><a href="http://bl.ocks.org/mbostock/3757137"><img src="https://camo.githubusercontent.com/c0c64b059b717a8e523289f71e7a8a28c342082f/687474703a2f2f626c2e6f636b732e6f72672f6d626f73746f636b2f7261772f333735373133372f7468756d626e61696c2e706e67" width="202" data-canonical-src="http://bl.ocks.org/mbostock/raw/3757137/thumbnail.png"></a>
</td>
    <td>d3.geo.transverseMercator<br><a href="http://bl.ocks.org/mbostock/5126418"><img src="https://camo.githubusercontent.com/b7679bbce2a6db23b4cbcfdcf26163539f68333e/687474703a2f2f626c2e6f636b732e6f72672f6d626f73746f636b2f7261772f353132363431382f7468756d626e61696c2e706e67" width="202" data-canonical-src="http://bl.ocks.org/mbostock/raw/5126418/thumbnail.png"></a>
</td>
  </tr>
</tbody></table>

There is also an extension of different [projections](https://github.com/d3/d3-geo-projection/).

For the map above I used the baker extension. It allows you to scale and translate.

{% codeblock lang:js %}
var projection = d3.geo.baker()
    .scale(122)
    .translate([width / 2, height / 2])
    .precision(.1);
{% endcodeblock %}

###4 - Styling

Styling is important to the final product of the map. Since the graphic is in SVG it can be targeted using CSS.

I have added in various basic styling.
I also used CSS to colour in different countries based on the classes I had given them.

{% codeblock lang:css %}
.country {
  fill: #2D7F99;
}

.country.code32 {fill: #BF3930;} /*Argentina*/
.country.code36 {fill: #BF3930;} /*Australia*/
.country.code40 {fill: #BF3930;} /*Austria*/
.country.code68 {fill: #BF3930;} /*Bolivia*/

/* etc etc */
{% endcodeblock %}

This was a bit of a shortcut as it may have been easier to update my data in step 1 with the countries I had visited and could then just colour them as a group. 

In any case I really like the finished product. Very elegant. Now I clearly need to get cracking and travel to Africa and Asia. 