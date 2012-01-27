var _Grid = {
	name:"extras.Grid",
	kind:"Control",
	className:"extras-grid",
	published:{
		cellHeight:200,
		cellWidth:150,
		margin:0,
		collapsed:false
	},
	create:function() {
		this.inherited(arguments);
		this.resizeHandler();
	},
	rendered:function() {
		this.inherited(arguments);
		if(!this.dim) {
			this.resizeHandler();
		}
	},
	// iterates children and repositions them
	positionControls:function() {
		var c = this.getControls();
		if(c.length === 0) return;
		
		var colsPerRow = Math.floor(this.dim.width/this.cellWidth);
		
		for(var i=0;i<c.length;i++) {
			this.positionControl(c[i], i, colsPerRow);
		}
		
		var h = Math.floor(c.length/colsPerRow)*this.cellHeight;
		this.applyStyle("height", h + "px")
	},
	// does the position calculation for a control and applies the style
	positionControl:function(control, index, colsPerRow) {
		var top = (this.collapsed) ? 0 : Math.floor(index/colsPerRow)*this.cellHeight;
		var left = (this.collapsed) ? 0 : (index%colsPerRow)*this.cellWidth;
		
		control.applyStyle("top", top + this.margin + "px");
		control.applyStyle("left", left + this.margin + "px");
	},
	collapsedChanged:function() {
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
		
		var s = enyo.dom.getComputedStyle(n);
		this.dim = {width:parseInt(s.width)-this.margin*2,height:parseInt(s.height)-this.margin*2};
		this.positionControls();
	}
}

enyo.kind(_Grid);