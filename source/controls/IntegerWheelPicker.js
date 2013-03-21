enyo.kind({
    name:"extras.IntegerWheelPicker",
    kind:"extras.WheelPicker",
    classes:"integer-wheel-picker",
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
            var n = this.max;
            this.max = this.min;
            this.min = n;
        }
        
        this.destroyClientControls();
        var c$ = [];
        for(var i=this.min;i<=this.max;i++) {
            c$.push({content:i, classes:"wheel-picker-item", owner:this, value:i})
        }
        
        this.createComponent({name:"wpc", kind:"extras.WheelPickerClient", components:c$, owner:this});
        
        if(this.hasNode()) {
            this.render();
        }
    },
    valueChanged:function() {
        if(!this.hasNode()) return;
        
        this.value = Math.min(this.max, Math.max(this.min, this.value));
        var index = this.value - this.min;
        
        var c = this.$.wpc.getChildren()[index];
        var left = Math.round(this.calcExtents(c).center.x - this.calcMid().half);
        
        this.doSelect({selected:c, content:c.getContent()});
        this.scrollTo(left,0);
    },
    itemSelected:function() {
        this.inherited(arguments);
        this.value = this.selectedItem.value;
    }
});