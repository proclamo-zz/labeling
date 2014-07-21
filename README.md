labeling
========

A [d3.js](https://github.com/mbostock/d3) plugin for automatic labeling. It tries to resolve [the automatic label placement problem](http://en.wikipedia.org/wiki/Automatic_label_placement) with an heuristic aproach.


#INSTALL

You only have to include the script after calling d3 library.

	<script src="http://d3js.org/d3.v3.min.js"></script>
	<script type="text/javascript" src="labeling.js"></script>

#HOW IT WORKS

Each overlapped label rotates around its position until no more overlaps. If one label reach the last position there are many options: 

* pass(): do nothing. If you consider it can be no overlaps in the next round you can just let it recalculate.
* scale( *factor* ): the label scales *factor* times and run again the algorithm. *scale* can be called multiple times with different parameters. Defaults to .75.
* legend(): transforms the label into a number and builds an internally legend which can be returned with the getLegend() function.
* remove(): the label is removed.
* custom(fn): fn is your own function. Receives the current label as a parameter. The *this* object is the labeling object.

The basic functioning is shown here:


	d3.labeling()
	  .select('.label')
	  .align()
	  
select can be a d3's valid string selector or a function which returns a d3 selection:

	d3.labeling()
	  .select(function() { 
         return d3.selectAll('.place-label')
           .sort(function(a,b) { 
               return d3.geo.area(b.geometry) - d3.geo.area(a.geometry); 
           })
      })
      .align();
      
#EXAMPLES
      
For example we have:

	d3.labeling()
      .select('.place-label')  // className of the labels
      .legend()				    // builds a legend
      .scale(.8)			    // if no fit, scales down 0.8 times the label (or number)
      .scale(.5)			    // idem but scales 0.5 times    
      .remove()				    // else removes
      .align();      			// start
      
You can view this example live [in a block](http://bl.ocks.org/proclamo/0fc304040b7036eb7785).

Two passes:

	d3.labeling()
	  .select('.label')
	  .pass()
	  .align();
	  
Remark the affecteds labels:

	d3.labeling()
	  .select('.label')
	  .custom(function(label){
	  	label.attr('stroke', 'red');
	  })
	  .align();   
	  
#TODO

* add support for rigth to left languages
* the actual radius for rotating the label is derived from the bounding box, this radius might be configurable.
* improve the calculus of remaining overlappeds.