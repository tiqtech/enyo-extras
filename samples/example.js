enyo.kind({
	name:"extras.ExampleApp",
	kind:"extras.Accordion",
    classes:"enyo-unselectable",
	components:[
//		{kind:"extras.AccordionSection", caption:"Calendar Picker", defaultSection:true, components:[
//			{content:"Open by default because otherwise it doesn't render correctly right now"},
//			{kind:"extras.CalendarPicker", name:"cal", onSelect:"showDate"},
//			{kind:"LabeledContainer", label:"Selected Date:", components:[
//				{name:"dt"}
//			]}
//		]},
//		{kind:"extras.AccordionSection", caption:"TouchPad Launch Day", open:false, components:[
//			{kind:"extras.Calendar", flex:1, onlyShowingCurrent:true, date:new Date(2011, 6, 1), selection:new Date(2011, 6, 1)}
//		]},
		{kind:"extras.AccordionSection", caption:"Animated Grid", open:false, components:[
			{kind:"extras.Grid", name:"grid", cellWidth:75, cellHeight:75, gridAlign:"center"}
		]},
		{kind:"extras.AccordionSection", caption:"Timer", open:false, components:[
			{kind:"extras.Timer", name:"timer", onTick:"tick"},
			{name:"timerField", content:"Click to Toggle Timer", onclick:"toggleTimer"}
		]},
        {kind:"extras.AccordionSection", caption:"Input Fields", components:[
            {kind:"onyx.Groupbox", style:"margin:1em;", components:[
                {kind:"extras.AutoCompleteInputDecorator", style:"width:100%;box-sizing:border-box;", values:["enyo", "onyx", "layout", "canvas"], components:[
                    {kind:"onyx.Input", placeholder:"Enyo Libs (AutoCompleteInputDecorator)", style:"width:100%"}
                ]},
                {kind:"extras.TagInput", style:"width:100%;box-sizing:border-box;", values:["dog", "cat", "fish", "lizard", "hamster", "chicken", "frog", "elephant"], components:[
                    {kind:"onyx.Input", fit:true, minWidth:200, placeholder:"Animals (TagInput)"}
                ]},
                {kind:"extras.PrefixedTagInput", prefix:"#", style:"width:100%;box-sizing:border-box;", values:["broccoli", "carrot", "lettuce", "snow pea", "green bean", "lima bean"], components:[
                    {kind:"onyx.Input", fit:true, minWidth:200, placeholder:"Vegetables (PrefixedTagInput)"}
                ]},
                {kind:"onyx.InputDecorator", style:"width:100%;box-sizing:border-box;", components:[
                    {name:"si", kind:"extras.TypeAheadInput", style:"width:100%", placeholder:"Minerals (TypeAheadInput)", oninput:"inputChanged"}
                ]},
                {kind:"extras.ComboInput", placeholder:"'M' Names (ComboInput)", values:["Mary", "Martin", "Matthew", "Mark", "Marvin", "Myra", "Maureen", "Michael"]}
            ]}
        ]},
        {kind:"extras.AccordionSection", caption:"Wheel Pickers", components:[
            {kind:"onyx.Groupbox", style:"margin:1em;width:250px", components:[
                {kind:"onyx.InputDecorator", style:"width:100%;box-sizing:border-box;", components:[
                    {name:"r", kind:"RGBPicker", style:"height:30px;width:100%", component:"r", onScroll:"rgbScroll"},
                    {name:"g", kind:"RGBPicker", style:"height:30px;width:100%", component:"g", onScroll:"rgbScroll"},
                    {name:"b", kind:"RGBPicker", style:"height:30px;width:100%", component:"b", onScroll:"rgbScroll"},
                    {name:"result", content:"resulting color", style:"width:100%;text-align:center;padding:3px;box-sizing: border-box;-moz-box-sizing: border-box"}
                ]},
                {kind:"onyx.InputDecorator", style:"width:100%;box-sizing:border-box;", components:[
                    {kind:"extras.WheelPicker", components:[
                        {kind:"onyx.Button", content:"Washington"},
                        {kind:"onyx.Button", content:"Adams"},
                        {kind:"onyx.Button", content:"Jefferson"},
                        {kind:"onyx.Button", content:"Madison"},
                        {kind:"onyx.Button", content:"Monroe"},
                        {kind:"onyx.Button", content:"JQ Adams"},
                        {kind:"onyx.Button", content:"Jackson"},
                        {kind:"onyx.Button", content:"Van Buren"},
                        {kind:"onyx.Button", content:"Harrison"},
                        {kind:"onyx.Button", content:"Tyler"}
                        
                    ]}
                ]},
                {kind:"onyx.InputDecorator", style:"width:100%;box-sizing:border-box;", components:[
                    {kind:"extras.IntegerWheelPicker", min:-10, max:10, value:0, style:"width:100%"}
                ]}
            ]}
        ]},
        {kind:"extras.AccordionSection", caption:"Color Progress Bar", components:[
            {kind:"FittableColumns", noStretch:true, style:"padding:20px;", components:[
                {kind:"onyx.Button", content:"-", ontap:"dec", classes:"onyx-affirmative"},
                {name:"cpb", kind:"extras.ColorProgressBar", fit:true, maxColor:"#f44", minColor:"#40f040", colorStops:[
                    {stop:0.5, color:"#40f040"},
                    {stop:0.75, color:"#f0f040"},
                    {stop:0.9, color:"#f44"}
                ]},
                {kind:"onyx.Button", content:"+", ontap:"inc", classes:"onyx-negative"}
            ]}
        ]}
	],
	create:function() {
		this.inherited(arguments);
		//this.showDate(null, new Date());
		for(var i=0;i<50;i++) {
			this.$.grid.createComponent({kind:"onyx.Button", content:"Button " + i, classes:"grid-button onyx-blue", owner:this, ontap:"collapseButtons"});
		}
	},
	collapseButtons:function() {
		this.$.grid.setCollapsed(!this.$.grid.getCollapsed());
	},
	showDate:function(source, date) {
		this.$.prefs.setSelectedDate(date.getTime());
		this.$.dt.setContent(date.getDate() + "-" + (date.getMonth()+1) + "-" + date.getFullYear());
	},
	tick:function(source, event) {
		var t = this.$.timer.toTime(event.diff);
		this.$.timerField.setContent(t.h+":"+t.m+":"+t.s+":"+t.ms);
	},
	toggleTimer:function() {
		if(this.$.timer.getRunning()) {
			this.$.timer.stop();
		} else {
			this.$.timer.start();
		}
	},
	prefsReady:function() {
		this.$.cal.setDate(new Date(this.$.prefs.getSelectedDate()));
	},
    inputChanged:function(source, event) {
       var minerals = ["arsenic", "beryl", "chromium", "diamond", "emery", "fluorite" , "gold", "halite"];
        
        var v = source.getValue().toLowerCase(),
            suggestion = "";
        
        if(v) {
            for(var i=0;i<minerals.length;i++) {
                if(minerals[i].indexOf(v) === 0) {
                    suggestion = minerals[i];
                    break;
                }
            }
        }
        
        this.$.si.setSuggestion(suggestion);
    },
    rgbScroll:function(source, event) {
        if(!this.defer) {
            this.$.result.applyStyle("background-color", "rgb("+this.$.r.r+","+this.$.g.g+","+this.$.b.b+")");
            this.$.result.applyStyle("color", (this.$.r.r+this.$.g.g+this.$.b.b)/3 < 100 ? "#fff" : "#000");
            
            for(var k in {r:1, g:1, b:1}) {
                if(k !== event.component) {
                    this.$[k].setPropertyValue(event.component, event.value, "draw");
                }
            }
            
            this.defer = true;
            setTimeout(enyo.bind(this, function() {
                this.defer = false;
            }), 500);
        }
    },
    inc:function() {
        this.$.cpb.animateProgressTo(this.$.cpb.progress+5);
    },
    dec:function() {
        this.$.cpb.animateProgressTo(this.$.cpb.progress-5);
    }
});

enyo.kind({
    name:"RGBPicker",
    kind:"extras.WheelPicker",
    snap:false,
    overlay:false,
    published:{
        r:0,
        g:0,
        b:0,
        component:"r" // r, g, or b
    },
    tools:[
        {name:"canvas", tag:"canvas"}
    ],
    create:function() {
        this.inherited(arguments);
        this.$.wpc.createComponents(this.tools, {owner:this});
        
        this.rChanged = this.gChanged = this.bChanged = this.draw;
    },
    rendered:function() {
        this.inherited(arguments);
        
        this.resizeHandler();
    },
    resizeHandler:function() {
        var n = this.$.canvas.hasNode();
        if(!n) {
            this.inherited(arguments);
            return;
        }
        
        var bounds = this.getBounds();
        n.width = bounds.width;
        n.height = bounds.height;
        this.draw();
        
        this.$.wpc.setLeftSpace(bounds.width/2);
        this.$.wpc.setRightSpace(bounds.width/2);
    },
    draw:function() {
        var n = this.$.canvas.hasNode();
        if(!n) return;
        
        var context = n.getContext('2d');
        context.rect(0, 0, n.width, n.height);
        
        // add linear gradient
        var grd = context.createLinearGradient(0, 0, n.width, n.height);
        grd.addColorStop(0, this.toHex(true));   
        grd.addColorStop(1, this.toHex());
        context.fillStyle = grd;
        context.fill();
    },
    toHex:function(start) {
        var s = ["#"];
        for(var k in {r:1, g:1, b:1}) {
            s.push( (k === this.component) ? (start ? "00" : "ff") : this[k].toString(16).replace(/^([a-f0-9])$/i, "0$1"));
        }
        return s.join("");
    },
    scroll:function(source, event) {
        var n = this.$.canvas.hasNode();
        if(n) {
            event.component = this.component;
            event.value = Math.min(255, Math.max(0, Math.round(255*this.getScrollLeft()/n.width)));
            this[this.component] = event.value;
        }
        
        this.inherited(arguments);
    }
});