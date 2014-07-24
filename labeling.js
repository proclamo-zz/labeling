;
d3.labeling = function() {

	var labeling = {}, className, labels, callbacks = [], callbackpos = -1,
		updateLabels = false, _break = false, legend = [],
		scaleds = removeds = passeds = customs = 0;	

	labeling.select = function(_className) {
		className = _className;
		labels = getLabels();
		return labeling;
	}

	var getLabels = function() {

		if (typeof className === "string") {
			return d3.selectAll(className);	
		}
		else {
			return className.call(this);
		}
	}

	labeling.remove = function() {
		callbacks.push(labeling_remove);	
		updateLabels = true;
		return labeling;
	}

	labeling.scale = function(_scaleFactor) {
		
		var scaleFactor = _scaleFactor || .75;

		// currying: https://medium.com/@kbrainwave/currying-in-javascript-ce6da2d324fe
		var fn = function(label) {
			return labeling_scale(label, scaleFactor);
		}

		callbacks.push(fn);

		return labeling;
	}

	labeling.legend = function() {
		callbacks.push(labeling_legend);
		updateLabels = true;
		return labeling;
	}

	labeling.pass = function() {
		callbacks.push(labeling_pass);
		return labeling;
	}

	labeling.custom = function(fn) {
		callbacks.push(function(label) {
			customs++;
			return fn.call(this, label);
		});
		return labeling;
	}

	var labeling_remove = function(label) {
		label.remove();
		removeds++;
	}

	var labeling_scale = function(label,factor) {

		var x = +label.attr("x"), y = +label.attr("y"),
			scaleFactor = factor < 1 ? 1 - factor : - (factor - 1),
			transform = "translate(" + (x * scaleFactor) + "," + (y * scaleFactor) + ") scale(" + factor + ")";

		label.attr("transform", transform);

		scaleds++;
	}

	var labeling_legend = function(label) {

		legend.push(label.text());

		label.text(legend.length);

	}

	var labeling_pass = function(label) {
		passeds++;
	}

	var next = function(label) {

		var labelNode = label[0][0], box = getBox(labelNode);

		var pos = label.attr("data-pos") || 0;

		pos++;

		if (pos === 8) {

			var calls = label.attr("data-calls") || -1;

			calls++;

			label.attr("data-calls", calls);

			if (calls < callbacks.length) {
				var fn = callbacks[calls];
				fn.call(labeling, label);
			}

			pos = 0;
			box = getBox(labelNode);

			// prevent infinite loop
			if (!callbacks.length) {
				_break = true;
			}

		}

		label.attr("data-pos", pos);

		var x = +label.attr("dx") || 0, y = +label.attr("dy") || 0;

		switch(pos) {
			case 0:
			case 1:
				y += box.height/2;
				break;
			case 2:
			case 3:
				x -= box.width/2;
				break;
			case 4:
			case 5:
				y -= box.height/2;
				break;
			case 6: 
			case 7:	
				x += box.width/2;
				break;			
		}

		label.attr("dx", x).attr("dy", y);

	}

	var overlaps = function(a, b) {
		
		return (
			(a.left <= b.left && b.left <= a.right)
			||
			(a.left <= b.right && b.right <= a.right)
		)	
		&&
		(
			(a.top <= b.top && b.top <= a.bottom)
			||
			(a.top <= b.bottom && b.bottom <= a.bottom)
		);
	}	

	var getBox = function(d) {
		return d.getBoundingClientRect();
	}

	labeling.align = function() {

		var overlappeds;
		
		do {
			overlappeds = 0;

			labels.each(function() {
				var current = this;
				var box_text = getBox(current);

				var _overlappeds = labels[0].filter(function(d) {
					if (d === current) return false;
					return overlaps(box_text, getBox(d));
				});

				overlappeds += _overlappeds.length;

				_overlappeds.forEach(function(el) {
					next(d3.select(el));
				});

			});

			if (updateLabels) {
				labels = getLabels(className);
			}

		} while (overlappeds > 0 && !_break);
		
		return labeling;
	}

	labeling.getLegend = function() {

		return legend.map(function(d, i) {
			return { key: i + 1, name: d }
		});
	}

	labeling.getStats = function() {
		return {
			passeds: passeds,
			removeds: removeds,
			customs: customs,
			scaleds: scaleds
		}
	}

	return labeling;

}
