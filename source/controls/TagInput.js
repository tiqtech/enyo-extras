enyo.kind({
    name:"extras.TagInput",
    kind:"extras.AutoCompleteInputDecorator",
    layoutKind:"extras.MinWidthFittableLayout",
    noStretch:true,
    create:function() {
        this.inherited(arguments);
        this.selectedItems = [];
    },
    filter: function(input, value) {
        var match = this.inherited(arguments);
        return match && !this.isSelected(value);
    },
    isSelected: function(value) {
        return enyo.indexOf(value, this.selectedItems) != -1;
    },
    onEnter:function() {
        this.inherited(arguments);
        this.addItem(this.inputField.getValue());
    },
    itemSelected:function(source, event) {
        this.inherited(arguments);
        this.addItem(event.content);
    },
    receiveBlur:function(source, event) {
        this.inherited(arguments);
        
        // defer on blur a bit, part UX, part workaround
        enyo.job("addItem"+this.id, enyo.bind(this, function() {
            this.addItem(source.getValue(), true);
        }), 500);
    },
    addItem:function(value, noFocus) {
        if(!value || enyo.indexOf(value, this.selectedItems) != -1) return;
        
        this.selectedItems.push(value.toLowerCase());
        this.createComponent({kind:"Control", content:value, classes:"extras-item", addBefore:this.inputField, ontap:"removeItem", owner:this}).render();
        this.reflow();
        this.inputField.setValue("");
        this.$.popup.hide();
        noFocus || this.inputField.focus();
    },
    removeItem:function(source) {
        var index = enyo.indexOf(source.content, this.selectedItems);
        if(index != -1) {
            this.selectedItems.splice(index, 1);
        }
        
        source.destroy();
        this.reflow();
        this.inputField.focus();
    }
});