/**
    Accordian is a vertical collection of AccordianSection instances in which only one section's content is visible at a time.
	If AccordianSection instance has multiple child components, the first will be moved into the header control.  Not really an ideal approach but functional.
*/
enyo.kind({
	name:"extras.AccordianSection",
	kind:"Control",
	className:"extras-accordian-section",
	chrome:[
		{kind:"Control", name:"header", onclick:"headerClicked", className:"extras-accordian-section-header"},
		{kind:"Control", name:"client", className:"extras-accordian-section-content", style:"height:0px;overflow:hidden"},
		{kind:"Animator", name:"animator", duration:500, tick:20, onAnimate:"animateDrawer"}
	],
	published:{
		height:0,
		caption:""
	},
	events:{
		onActivate:""
	},
	create:function() {
		this.inherited(arguments);
		this.captionChanged();
	},
	createChrome:function() {
		this.inherited(arguments);
		
		// if section is declared inline, children will be in this.components.
		// if declared as its own kind, they'll be in this.kindComponents.
		var comp = this.components || this.kindComponents;
		
		if(comp.length > 1 && !this.caption) {
			var c = comp.splice(0, 1);
			this.$.header.createComponents(c, {owner:this});
		}
	},
	headerClicked:function() {
		// by default, clicking the header will activate the section
		this.doActivate();
	},
	heightChanged:function(oldValue) {
		// strip any trailing characters (e.g. 32px -> 32)
		this.height = parseInt(this.height);
		
		// only animate if height changed
		if(oldValue !== this.height) {
			this.$.animator.play(oldValue, this.height);
		}
	},
	captionChanged:function() {
		var c = this.chrome[0];
		if(this.$.header.getControls().length === 0) {
			this.$.header.setContent(this.caption);
		}
	},
	animateDrawer:function(source, value) {
		// update height with current value (just in case height is changed mid-animation)
		this.height = value;
		this.$.client.applyStyle("height", value + "px");
	}
});

enyo.kind({
	name:"extras.Accordian",
	kind:"Control",
	initComponents:function() {
		this.inherited(arguments);
		
		// register onActivate callback for each AccordianSection
		this.eachSection(function(c) {
			c.onActivate = "sectionActivated";
		});
	},
	// calculate adjusted height and select default section upon render
	rendered:function() {
		this.inherited(arguments);
		
		var n;
		if(n = this.hasNode()) {
			var headerHeights = 0;
			var defaultSection = null;
			this.eachSection(function(c) {
				// sum heights of all section headers (since content is 0px initially)
				headerHeights += c.hasNode().offsetHeight;
				
				// find default section
				if(defaultSection === null || c.defaultSection === true) {
					defaultSection = c;
				}
			});
			
			// store adjustedHeight for later.  will be passed to sections on activation
			this.adjustedHeight = n.offsetHeight - headerHeights;
			
			// will be valid if any sections are included as child components
			if(defaultSection) {
				defaultSection.setHeight(this.adjustedHeight);
			}
		}
	},
	// utility function to iterate all children of this control that are AccordianSection instances
	eachSection:function(f) {
		var c = this.getControls();
		for(var i=0;i<c.length;i++) {
			if(c[i] instanceof extras.AccordianSection) {
				f(c[i], i);
			}
		}
	},
	// onActivate handler
	sectionActivated:function(source) {
		// grow activated section
		source.setHeight(this.adjustedHeight);
		
		// shrink all other sections
		this.eachSection(function(c) {
			if(c !== source) {
				c.setHeight(0);
			}
		});
	}
});
