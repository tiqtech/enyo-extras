/** patches FittableLayout for extension **/

enyo.kind({
    name: "enyo.FittableLayout",
    kind: "Layout",
    //* @protected
	calcFitIndex: function() {
		for (var i=0, c$=this.container.children, c; (c=c$[i]); i++) {
			if (c.fit && c.showing) {
				return i;
			}
		}
	},
	getFitControl: function() {
		var c$=this.container.children;
		var f = c$[this.fitIndex];
		if (!(f && f.fit && f.showing)) {
			this.fitIndex = this.calcFitIndex();
			f = c$[this.fitIndex];
		}
		return f;
	},
	getLastControl: function() {
		var c$=this.container.children;
		var i = c$.length-1;
		var c = c$[i];
		while ((c=c$[i]) && !c.showing) {
			i--;
		}
		return c;
	},
	_reflow: function(measure, cMeasure, mAttr, nAttr) {
		this.container.addRemoveClass("enyo-stretch", !this.container.noStretch);
		var f = this.getFitControl();
		// no sizing if nothing is fit.
		if (!f) {
			return;
		}
		//
		// determine container size, available space
		var s=0, a=0, b=0, p;
		var n = this.container.hasNode();
		// calculate available space
		if (n) {
			// measure 1
			p = enyo.dom.calcPaddingExtents(n);
			// measure 2
			s = n[cMeasure] - (p[mAttr] + p[nAttr]);
			//enyo.log("overall size", s);
		}
		//
		// calculate space above fitting control
		// measure 3
		var fb = f.getBounds();
		// offset - container padding.
		a = fb[mAttr] - ((p && p[mAttr]) || 0);
		//enyo.log("above", a);
		//
		// calculate space below fitting control
		var l = this.getLastControl();
		if (l) {
			// measure 4
			var mb = enyo.dom.getComputedBoxValue(l.hasNode(), "margin", nAttr) || 0;
			if (l != f) {
				// measure 5
				var lb = l.getBounds();
				// fit offset + size
				var bf = fb[mAttr] + fb[measure];
				// last offset + size + ending margin
				var bl = lb[mAttr] + lb[measure] + mb;
				// space below is bottom of last item - bottom of fit item.
				b = bl - bf;
			} else {
				b = mb;
			}
		}
    
    this.applyFitSize(measure, s, a, b);
	},
  applyFitSize:function(measure, total, before, after) {
    // calculate appropriate size for fit control
		var fs = total - (before + after);
    var f = this.getFitControl();
		// note: must be border-box;
		f.applyStyle(measure, fs + "px");
  },
	//* @public
	/**
		Updates the layout to reflect any changes to contained components or the
		layout container.
	*/
	reflow: function() {
		if (this.orient == "h") {
			this._reflow("width", "clientWidth", "left", "right");
		} else {
			this._reflow("height", "clientHeight", "top", "bottom");
		}
	}
});

enyo.kind({
	name: "enyo.FittableColumnsLayout",
	kind: "FittableLayout",
	orient: "h",
	layoutClass: "enyo-fittable-columns-layout"
});