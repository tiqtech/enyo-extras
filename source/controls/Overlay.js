enyo.kind({
    name:"extras.Overlay",
    classes:"extras-overlay",
    published:{
        delegate:""
    },
    dispatchEvent:function(type, event, sender) {
        if(!event.delegated) {
            // dragover fires instead of drag while within overlay bounds
            // so map it to drag as if the overlay weren't there
            if(type === "ondragover") {
                arguments[0] = event.type = "ondrag";
            }
            
            event.delegated = true;
            enyo.call(this.delegate, "waterfall", arguments);
        }
    }
});