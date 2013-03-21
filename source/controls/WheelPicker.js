enyo.kind({
    name:"extras.WheelPicker",
    kind:"Scroller",
    touch:true,
    vertical:"hidden",
    horizontal:"scroll",
    classes:"extras-wheel-picker",
    thumb:false,
    published:{
        overlay:true,
        overlayClasses:"",
        index:-1
    },
    events:{
        onSelect:""
    },
    handlers:{
        onSelect:"itemSelected"
    },
    create:function() {
        this.inherited(arguments);

        // tweak scrolling
        enyo.mixin(this.$.scrollMath, {
            kFrictionDamping:0.3,
            kDragDamping:0.25,
            kSnapFriction:0.3
        });
    },
    initComponents:function() {
        var c = this.components;
        this.components = [];
        
        this.overlayChanged();
        this.inherited(arguments);
        
        this.createComponent({name:"wpc", kind:"extras.WheelPickerClient", owner:this}).createComponents(c, {owner:this.owner});
    },
    overlayChanged:function() {
        if(this.overlay && !this.$.overlay) {
            this.createComponent({name:"overlay", kind:"extras.Overlay", classes:this.overlayClasses, isChrome:true, owner:this, delegate:this});
        } else if(!this.overlay && this.$.overlay) {
            this.$.overlay.destroy();
        }
    },
    overlayClassesChanged:function(oldValue) {
        if(this.$.overlay) {
            this.$.overlay.removeClass(oldValue);
            this.$.overlay.addClass(this.overlayClasses);
        }
    },
    rendered:function() {
        this.inherited(arguments);
        this.resizeHandler();
    },
    resizeHandler:function() {
        this.inherited(arguments);
        
        var scrollerNode = this.hasNode();
        if(!scrollerNode) return;
        
        var c = this.$.wpc.getChildren(),
            w = this.getBounds().width,
            c1 = c[0],
            c2 = c[c.length-1];
        
        if(c1) {
            if(this.snap) {
                this.$.wpc.setLeftSpace(Math.round(w/2-c1.getBounds().width/2));
                this.$.wpc.setRightSpace(Math.round(w/2-c2.getBounds().width/2));
            } else {
                this.$.wpc.setLeftSpace(Math.round(w/2));
                this.$.wpc.setRightSpace(Math.round(w/2));
            }
        }
    },
    scrollStart:function(source, event) {
        this.inherited(arguments);
        
        if(this.fixingPosition == 1) {
            this.fixingPosition++;
        } else {
            this.fixingPosition = 0;
        }
    },
    scrollStop:function(source, event) {
        this.inherited(arguments);
        if(this.fixingPosition == 2) return;
        this.centerScroller();
    },
    calcExtents:function(c) {
        var b = c.getBounds();
        var margins = enyo.dom.calcMarginExtents(c.hasNode());
        
        var e = {
            left:b.left - margins.left,
            right:b.left + b.width + margins.right,
            top:b.top - margins.top,
            bottom:b.top + b.height + margins.bottom
        };
        
        e.center = {
            x:e.left+Math.round((e.right-e.left)/2),
            y:e.top+Math.round((e.bottom-e.top)/2)
        };
        
        return e;
    },
    calcMid:function(refresh) {
        var half = this.hasNode().scrollWidth/2,
            center = this.getScrollLeft() + half;
        
        return {
            half:half,
            center:center
        };
    },
    centerScroller:function() {
        if(!this.snap) return;
        
        var c = this.$.wpc.getChildren();
        var mid = this.calcMid();
        
        for(var i=0,l=c.length;i<l;i++) {
            var e = this.calcExtents(c[i]);
            if(mid.center > e.left && mid.center < e.right) {
                this.fixingPosition = 1;
                var left = Math.round(e.center.x - mid.half);
                if(left != this.getScrollLeft()) {
                    this.selectIndex(i);
                    this.scrollTo(left,0);
                }
                break;
            }
        }
    },
    selectIndex:function(index) {
        var c = this.$.wpc.getChildren();
        this.doSelect({selected:c[index], content:c[index].getContent(), index:index});
    },
    itemSelected:function(source, event) {
        if(this.selectedItem) {
            this.selectedItem.removeClass("selected");
        }
        
        this.index = event.index;
        this.selectedItem = event.selected;
        this.selectedItem.addClass("selected");
    }
});