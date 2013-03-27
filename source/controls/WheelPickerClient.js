enyo.kind({
    name:"extras.WheelPickerClient",
    classes:"extras-wheelpicker-client",
    published:{
        leftSpace:0,
        rightSpace:0
    },
    components:[
        {name:"lSpace", style:"display:inline-block"},
        {name:"client", classes:"extras-wheelpicker-internal"},
        {name:"rSpace", style:"display:inline-block"}
    ],
    create:function() {
        this.inherited(arguments);
        this.leftSpaceChanged();
        this.rightSpaceChanged();
    },
    leftSpaceChanged:function() {
        this.$.lSpace.applyStyle("width", this.leftSpace+"px");
    },
    rightSpaceChanged:function() {
        this.$.rSpace.applyStyle("width", this.rightSpace+"px");
    },
    getChildren:function() {
        return this.$.client.children;
    }
});