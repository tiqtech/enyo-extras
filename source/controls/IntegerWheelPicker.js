enyo.kind({
    name:"extras.IntegerWheelPicker",
    kind:"extras.WheelPicker",
    classes:"extras-integerwheelpicker",
    published:{
        min:0,
        max:10,
        value:0
    },
    create:function() {
        this.inherited(arguments);
        this.rangeChanged();
        
        this.minChanged = this.maxChanged = this.rangeChanged;
    },
    rendered:function() {
        this.inherited(arguments);
        
        if(this.hasNode()) {
            this.valueChanged();
        }
    },
    rangeChanged:function() {
        // fix range if necessary
        if(this.max < this.min) {
            this.max = this.min;
        }
        
        this.destroyClientControls();
        var c$ = [];
        for(var i=this.min;i<=this.max;i++) {
            c$.push({content:i, classes:"extras-wheelpicker-item", owner:this, value:i})
        }
        
        this.createComponent({name:"wpc", kind:"extras.WheelPickerClient", components:c$, owner:this});
        
        if(this.hasNode()) {
            this.render();
        }
    },
    valueChanged:function() {
        if(!this.hasNode()) return;
        
        this.value = Math.min(this.max, Math.max(this.min, this.value));
        this.setIndex(this.value - this.min);
    },
    itemSelected:function() {
        this.inherited(arguments);
        this.value = this.selectedItem.value;
    },
    selectIndex:function(index) {
        var c = this.$.wpc.getChildren();
        this.doSelect({selected:c[index], content:c[index].getContent(), index:index, value:index+this.min});
    }
});