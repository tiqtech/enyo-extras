enyo.kind({
    name:"lp.Image",
    kind:"Image",
    published:{
        category:"",
        height:300,
        width:400,
        text:"",
        index:0,
        color:true
    },
    create:function() {
        this.inherited(arguments);
        this.updateSrc();

        // wire up changed handlers to updateSrc
        for(var k in this.published) {
            this[k+"Changed"] = enyo.bind(this, "updateSrc");
        }
    },
    updateSrc:function() {
        src = ["http://lorempixel.com"];
        this.color || src.push('g');
        src.push(this.width, this.height);
        this.category && src.push(this.category);
        this.index !== 0 && src.push(this.index);
        this.text && src.push(this.text);

        this.attributes.src = src.join("/");
        this.attributes.height = this.height;
        this.attributes.width = this.width;

        this.hasNode() && this.render();
    }
});