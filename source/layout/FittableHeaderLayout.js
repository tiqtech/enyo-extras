enyo.kind({
  name: "extras.FittableHeaderLayout",
  kind: "FittableColumnsLayout",
  applyFitSize:function(measure, total, before, after) {
    var padding = before-after;
    var f = this.getFitControl();
        
    if(padding < 0) {
      f.applyStyle("padding-left", Math.abs(padding) + "px");
      f.applyStyle("padding-right", null);
    } else if(padding > 0) {
      f.applyStyle("padding-left", null);
      f.applyStyle("padding-right", Math.abs(padding) + "px");
    } else {
      f.applyStyle("padding-left", null);
      f.applyStyle("padding-right", null);
    }
    
    this.inherited(arguments);
  }
});