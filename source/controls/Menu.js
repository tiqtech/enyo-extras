enyo.kind({
    name:"extras.Menu",
    kind:"onyx.Menu",
    defaultKind:"extras.MenuItem",
    classes:"extras-menu",
    modal:false,
    published:{
        index:-1
    },
    handlers:{
        onHighlight:"itemHighlighted"
    },
    previousItem:function() {
        this.setIndex(this.index-1);
    },
    nextItem:function() {
        this.setIndex(this.index+1);
    },
    select:function() {
        enyo.call(c$[this.index], "tap", [this]);
    },
    itemHighlighted: function(source, event) {
        var c$ = this.getClientControls();
        var i = this.index;
        this.index = enyo.indexOf(event.originator, c$);
        
        if(i !== this.index) {
            enyo.call(c$[i], "setHighlighted", [false]);
        }
    },
    indexChanged:function(oldIndex) {
        var c$ = this.getClientControls();
        this.index = Math.min(c$.length, Math.max(-1, this.index));

        enyo.call(c$[this.index], "setHighlighted", [true]);
        enyo.call(c$[oldIndex], "setHighlighted", [false]);
    },
    showingChanged:function() {
        if(this.showing) {
            this.index = -1;
        }
        this.inherited(arguments);
    }
});