enyo.kind({
    name:"extras.PrefixedTagInput",
    kind:"extras.TagInput",
    published:{
        prefix:""
    },
    prefixChanged:function() {
        this.valuesChanged();
    },
    isSelected:function(value) {
        arguments[0] = this.prefix+value;
        return this.inherited(arguments);
    },
    addItem:function(value) {
        if(this.prefix && value && value.indexOf(this.prefix) == -1) {
            arguments[0] = this.prefix+value;
        }
        
        this.inherited(arguments);
    }
});