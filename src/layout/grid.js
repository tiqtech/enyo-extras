enyo.kind({
	name:"extras.Grid",
	kind:"Control",
	className:"extras-grid",
	published:{
		cellHeight:200,
		cellWidth:150,
		margin:0,
		collapsed:false,
		align:"left"
	},
	create:function() {
		this.inherited(arguments);
		//this.resizeHandler();
	},
	rendered:function() {
		this.inherited(arguments);
		// if(!this.dim) {
		// 	this.resizeHandler();
		// }

		this.positionControls();
	},
	// iterates children and repositions them
	positionControls:function() {
		var c = this.getControls();
		if(c.length === 0) return;
		
		var m2 = this.margin*2,
			d = this.getDimensions(),
			colsPerRow = Math.floor(d.width/(m2+this.cellWidth));

		for(var i=0;i<c.length;i++) {
			this.positionControl(c[i], i, colsPerRow);
		}
		
		var h = Math.floor(c.length/colsPerRow)*(m2+this.cellHeight);
		this.autoHeight && this.applyStyle("height", h + "px");
	},
	// does the position calculation for a control and applies the style
	positionControl:function(control, index, colsPerRow) {
		var m2 = this.margin*2,
			top = (this.collapsed) ? 0 : Math.floor(index/colsPerRow)*(m2+this.cellHeight),
			left = (this.collapsed) ? this.alignmentMargin : (index%colsPerRow)*(m2+this.cellWidth)+this.alignmentMargin;
		
		control.applyStyle("top", top + "px");
		control.applyStyle("left", left + "px");
	    control.applyStyle("opacity", (this.collapsed && index !== 0) ? 0 : 1);
	},
	collapsedChanged:function() {
		this.positionControls();
	},
	justifiedChanged:function() {
		this.positionControls();
	},
	cellWidthChanged:function() {
		this.positionControls();
	},
	cellHeightChanged:function() {
		this.positionControls();
	},
	// reflows controls when window.resize event fires (e.g. device rotation)
	resizeHandler:function() {
		var n = this.hasNode();
		if(!n) return;
		
		this.dim = null;
		enyo.job("position"+this.id, enyo.bind(this, "positionControls"), 250);
	},
	getDimensions:function() {
		if(!this.dim) {
			var s = enyo.fetchControlSize(this)
			this.dim = {width:parseInt(s.w),height:parseInt(s.h)};
			this.calcAlignmentMargin(this.dim);
		}
		
		return this.dim;
	},
	calcAlignmentMargin:function(d) {
		d = d || this.getDimensions();	// fallback to method if not called by getDimensions
		var colsPerRow = Math.floor(d.width/(this.margin*2+this.cellWidth)),
			remainder = d.width-(colsPerRow*(this.margin*2+this.cellWidth));

		if(this.align === "right") {
			this.alignmentMargin = remainder;
		} else if(this.align === "center") {
			this.alignmentMargin = Math.round(remainder/2);
		} else {
			this.alignmentMargin = 0;
		}
	}
});