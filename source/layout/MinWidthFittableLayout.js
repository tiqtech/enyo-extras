enyo.kind({
    name: "extras.MinWidthFittableLayout",
    kind: "FittableColumnsLayout",
    layoutClass:"enyo-fittable-columns-layout enyo-min-width-fittable-layout",
    reflow:function(retry) {
        retry || this.container.applyStyle("white-space", null);
        this.inherited(arguments);
    },
    applyFitSize:function(measure, total, before, after) {
        var f = this.getFitControl(),
            size = total - (before+after);
        
        if(size < 0) {
            this.container.applyStyle("white-space", "normal");
            f.applyStyle("width", "1px");
            enyo.asyncMethod(this, "reflow", true);
        } else if(f.minWidth && f.minWidth > size) {
            f.applyStyle("width", total + "px");
            this.container.applyStyle("white-space", "normal");
        } else {
            this.inherited(arguments);
        }
    }
});