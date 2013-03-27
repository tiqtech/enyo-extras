enyo.kind({
    name:"extras.MenuItem",
    kind:"onyx.MenuItem",
    classes:"extras-menu-item",
    published:{
        highlighted:false
    },
    events:{
        onHighlight:""
    },
    handlers:{
        onenter:"entered",
        onleave:"left"
    },
    entered:function() {
        this.setHighlighted(true);
    },
    left:function() {
        this.setHighlighted(false);
    },
    highlightedChanged:function() {
        this.addRemoveClass("highlight", this.highlighted);
        this.highlighted && this.doHighlight({highlighted:this, content:this.content});
    }
});
