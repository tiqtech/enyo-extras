/**
	Accordion is a vertical collection of AccordionSection instances in which only one section's content is visible at a time.
	If AccordionSection instance has multiple child components, the first will be moved into the header control.  Not really an ideal approach but functional.
*/
enyo.kind({
	name:"extras.AccordionSection",
	kind:"Control",
	classes:"extras-accordian-section",
	chrome:[
		{kind:"Control", name:"header", ontap:"headerClicked", classes:"extras-accordian-section-header"},
		{kind:"Control", name:"client", classes:"extras-accordian-section-content", style:"height:0px;overflow:hidden"},
		{kind:"Animator", name:"animator", duration:500, onStep:"animateDrawer"}
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
	initComponents:function() {
		this.createComponents(this.chrome, {owner:this});
		
		// if section is declared inline, children will be in this.components.
		// if declared as its own kind, they'll be in this.kindComponents.
		var comp = this.components || this.kindComponents;
		
		if(comp.length > 1 && !this.caption) {
			var c = comp.splice(0, 1);
			this.$.header.createComponent(c);
		}
		
		this.inherited(arguments);
	},
	headerClicked:function() {
		// by default, clicking the header will activate the section
		this.doActivate();
	},
	heightChanged:function(oldValue) {		
		this.$.animator.setStartValue(oldValue);
		this.$.animator.setEndValue(this.height);
		this.$.animator.play();
	},
	captionChanged:function() {
		if(this.$.header.getClientControls().length === 0) {
			this.$.header.setContent(this.caption);
		}
	},
	animateDrawer:function(source, value) {
		// update height with current value (just in case height is changed mid-animation)
		//this.height = source.value;
		this.$.client.applyStyle("height", Math.round(source.value) + "px");
	},
	getHeaderHeight:function() {
		return this.$.header.getBounds().height;
	}
});

enyo.kind({
	name:"extras.Accordion",
	kind:"Control",
	handlers:{
		onActivate:"sectionActivated"
	},
	// calculate adjusted height and select default section upon render
	rendered:function() {
		this.inherited(arguments);
		
		this.resizeHandler();
	},
	resizeHandler:function() {
		var n = this.hasNode();
		if(n) {
			var headerHeights = 0;
			var defaultSection = this.activeSection;
			this.eachSection(function(c) {
				// sum heights of all section headers (since content is 0px initially)
				headerHeights += c.getHeaderHeight();
				
				// find default section
				if((defaultSection === null || defaultSection === undefined) && c.defaultSection === true) {
					defaultSection = c;
				}
			});
			
			// store adjustedHeight for later.  will be passed to sections on activation
			this.adjustedHeight = this.getBounds().height - headerHeights;
			
			// will be valid if any sections are included as child components
			if(defaultSection) {
				defaultSection.setHeight(this.adjustedHeight);
			}
		}
	},
	// utility function to iterate all children of this control that are AccordionSection instances
	eachSection:function(f) {
		var c = this.getControls();
		for(var i=0;i<c.length;i++) {
			if(c[i] instanceof extras.AccordionSection) {
				f(c[i], i);
			}
		}
	},
	// onActivate handler
	sectionActivated:function(source, event) {
		if(!(event.originator instanceof extras.AccordionSection)) return;
		
		var s = event.originator;
		this.activeSection = s;
		
		// grow activated section
		s.setHeight(this.adjustedHeight);
		
		// shrink all other sections
		this.eachSection(function(c) {
			if(c !== s) {
				c.setHeight(0);
			}
		});
	}
});
