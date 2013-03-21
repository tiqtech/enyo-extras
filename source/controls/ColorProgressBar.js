enyo.kind({
    name:"extras.ColorProgressBar",
    kind:"onyx.ProgressBar",
    published:{
        minColor:"#00ff00",
        colorStops:0,
        maxColor:"#ff0000",
        easing:enyo.easing.linear
    },
    create:function() {
        this.inherited(arguments);
        this.refreshColor();
    },
    minColorChanged:function() {
        this.refreshColor(true);
    },
    maxColorChanged:function() {
        this.refreshColor(true);
    },
    colorStopsChanged:function() {
        this.refreshColor(true);
    },
    toDec:function(c) {
        var parts = c.match(/#?([a-f0-9]{1,2})([a-f0-9]{1,2})([a-f0-9]{1,2})/i);
        for(var i=1,l=parts.length;i<l;i++) {
            if(parts[i].length == 1) {
                parts[i] = parts[i]+parts[i];
            }
        }
        
        return {
            r:parseInt(parts[1], 16),
            g:parseInt(parts[2], 16),
            b:parseInt(parts[3], 16)
        };
    },
    getColor:function(stop) {
        var ls = this._cs[0],
            color;
        
        for(var i=1,l=this._cs.length;i<l;i++) {
            var s = this._cs[i];
            if(stop == s.stop) {
                color = s.color;
                break;
            } else if(stop < s.stop) {
                var lerp = (stop-ls.stop)/(s.stop-ls.stop);
                lerp = Math.max(0, Math.min(1, this.easing(lerp)));
                
                color = {r:0, g:0, b:0};
                for(var k in color) {
                    color[k] = Math.abs(Math.round((s.color[k]-ls.color[k])*lerp)+ls.color[k]);
                }
                break;
            } else {
                ls = s;
            }
        }
        
        return color;        
    },
    refreshColor:function(forceRefresh) {
        if(forceRefresh || !this._cs) {
            this._cs = enyo.isArray(this.colorStops) ? this.colorStops.concat() : [];
            this._cs.sort(function(a,b) {
                return a.stop - b.stop;
            });
            
            if(!this._cs[0] || this._cs[0].stop > 0) {
                this._cs.unshift({stop:0, color:this.minColor});
            }
            
            var last = this._cs[this._cs.length-1];
            if(last.stop < 1) {
                this._cs.push({stop:1, color:this.maxColor});
            }
            
            // convert hex to decimal map
            for(var i=0,l=this._cs.length;i<l;i++) {
                this._cs[i].color = this.toDec(this._cs[i].color);
            }
            
            this.log(this._cs);
        }
        
        var barColor = ["#"],
            lerp = (this.progress-this.min)/(this.max-this.min),
            color = this.getColor(lerp);
        
        for(var k in {r:1, g:1, b:1}) {
            var c = color[k].toString(16);
            barColor.push(c.length == 2 ? c : "0"+c);
        }
        
        this.log(lerp, barColor);
        
        this.$.bar.applyStyle("background-color", barColor.join(""));
    },
    progressChanged:function() {
        this.inherited(arguments);
        this.refreshColor();
    }
});