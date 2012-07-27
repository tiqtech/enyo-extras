// updates only tested for enyo v2
enyo.kind({
    name:"extras.GridLayout",
    kind:"Layout",
    layoutClass:"extras-grid",
    // iterates children and repositions them
    positionControls:function() {
        // check for enyo v1 method
        var c = (this.container.getControls) ? this.container.getControls() : this.container.getClientControls();
        if(c.length === 0) return;
        
        var m2 = this.margin*2,
            d = this.getDimensions(),
            colsPerRow = Math.floor(d.width/(m2+this.width));

        for(var i=0;i<c.length;i++) {
            this.positionControl(c[i], i, colsPerRow);
        }
        
        var h = Math.floor(c.length/colsPerRow)*(m2+this.height);
        this.container.applyStyle("height", h + "px");
    },
    // does the position calculation for a control and applies the style
    positionControl:function(control, index, colsPerRow) {
        var m2 = this.margin*2,
            top = (this.collapsed) ? 0 : Math.floor(index/colsPerRow)*(m2+this.height),
            left = (this.collapsed) ? this.alignmentMargin : (index%colsPerRow)*(m2+this.width)+this.alignmentMargin;

        control.applyStyle("top", top + "px");
        control.applyStyle("left", left + "px");
        control.applyStyle("opacity", (this.collapsed && index !== 0) ? 0 : 1);
    },
    // reflows controls when window.resize event fires (e.g. device rotation)
    reflow:function() {
        this.dim = null;

        // import properties from container
        this.margin = this.container.cellMargin || 0;
        this.collapsed = this.container.gridCollapsed || false;
        this.height = this.container.cellHeight || 100;
        this.width = this.container.cellWidth || 100;
        this.deferTime = this.container.deferTime || 0;
        this.align = this.container.gridAlign || "left";

        if(!this.deferTime) {
            this.positionControls();
        } else {
            enyo.job("extras.GridLayout.defer" + this.container.id, enyo.bind(this, "positionControls"), this.deferTime);
        }        
    },
    getDimensions:function() {
        if(!this.dim) {
            var s = enyo.dom.getComputedStyle(this.container.hasNode());           
            this.dim = {width:parseInt(s.width),height:parseInt(s.height)};
            this.calcAlignmentMargin(this.dim);
        }
        
        return this.dim;
    },
    calcAlignmentMargin:function(d) {
        d = d || this.getDimensions();    // fallback to method if not called by getDimensions
        var colsPerRow = Math.floor(d.width/(this.margin*2+this.width)),
            remainder = d.width-(colsPerRow*(this.margin*2+this.width));

        if(this.align === "right") {
            this.alignmentMargin = remainder;
        } else if(this.align === "center") {
            this.alignmentMargin = Math.round(remainder/2);
        } else {
            this.alignmentMargin = 0;
        }
    }
});

enyo.kind({
	name:"extras.Grid",
	kind:"Control",
	layoutKind:"extras.GridLayout"
});