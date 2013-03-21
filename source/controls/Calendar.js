var _CalendarPicker = {
	name:"extras.CalendarPicker",
	kind:"Control",
	className:"enyo-extras-calendar-picker",
	index:0,
	published:{
		date:""
	},
	events:{
		onSelect:""
	},
	components:[
		{kind:"Carousel", name:"carousel", onSnapFinish:"viewChanged", onGetLeft:"getPreviousMonth", onGetRight:"getNextMonth"}
	],
	create:function() {
		this.inherited(arguments);
		this.dateChanged();
	},
	dateChanged:function() {
		this.date = (this.date instanceof Date) ? this.date : new Date();
		this.$.carousel.setCenterView(this.getMonth(0));
	},
	getPreviousMonth:function(source, snap) {
		snap && this.index--;
		return this.getMonth(this.index-1);
	},
	getNextMonth:function(source, snap) {
		snap && this.index++;
		return this.getMonth(this.index+1);
	},
	getMonth:function(offset) {
		var d = new Date( this.date.getTime() );
		d.setMonth(d.getMonth()+offset);
		d.setDate(1);
		
		return {kind:"extras.Calendar", includeNavigation:true, date:d, selection:this.date, onSelect:"selectDate", owner:this};
	},
	resize:function() {
		this.$.carousel.resize();
	},
	previous:function() {
		this.index--;
		this.resetCenter();
	},
	next:function() {
		this.index++;
		this.resetCenter();
	},
	resetCenter:function() {
		this.$.carousel.setCenterView(this.getMonth(this.index));
	},
	selectDate:function(source, date) {
		var monthDelta = this.date.getMonth() - date.getMonth();
		this.date = date;
		
		var views = this.$.carousel.getControls();
		for(var i=0;i<views.length;i++) {
			var v = views[i];
			if(v.kind === "extras.Calendar") {
				if(v !== source) {
					v.setSelection(date);
				}
			}
		}
		
		if(monthDelta !== 0) {
			this.index = 0;
			this.resetCenter();
		}
		
		this.doSelect(date);
	}
};

var _Calendar = {
	name:"extras.Calendar",
	kind:"Control",
	className:"enyo-extras-calendar",
	months:["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	published:{
		date:new Date(),
		selection:null,
		onlyShowingCurrent:false,
		includeNavigation:false
	},
	events:{
		onSelect:""
	},
	components:[
		{kind:"HFlexBox", components:[
			{name:"prevMonth", kind:"Button", onclick:"previousMonth", caption:"<", width:"20px"},
			{name:"label", flex:1, className:"label"},
			{name:"nextMonth", kind:"Button", onclick:"nextMonth", caption:">", width:"20px"}
		]}
	],
	create:function() {
		this.inherited(arguments);
		this.includeNavigationChanged();
		
		this.$.label.setContent(this.months[this.date.getMonth()] + " " + this.date.getFullYear());
		
		var dt = new Date(this.date.getTime());
		dt.setDate(dt.getDate()-dt.getDay());
		
		// shift back a week 1st of month is on Sunday
		if(dt.getDate() === 1) {
			dt.setDate(dt.getDate()-7);
		}
		
		var rows = [];
		
		for(var i=0;i<6;i++) {
			var row = [];
			for(var j=0;j<7;j++) {
				var d = new Date(dt.getTime());
				d.setDate(dt.getDate()+(i*7)+j);
				var content = d.getDate();
				var className = "date";
				
				var currentMonth = d.getMonth() === this.date.getMonth();
				
				if(!currentMonth && this.onlyShowingCurrent) {
					content = "";
				} else {
					if(!currentMonth) {
						className += " fade"
					}
					
					if(this.isSelected(d)) {
						className += " selected"
					}
				}
				
				
				row.push({content:content, flex:1, date:d, onclick:"dateClicked", className:className});
			}
			rows.push({kind:"HFlexBox", components:row});
		}
		
		this.createComponents(rows, {owner:this});
		
	},
	selectionChanged:function() {
		var controls = this.getComponents();
		for(var i=0;i<controls.length;i++) {
			if(!controls[i].date) continue;
			
			if(this.isSelected(controls[i].date)) {
				controls[i].addClass("selected");
			} else {
				controls[i].removeClass("selected");
			}
		}		
	},
	includeNavigationChanged:function() {
		this.$.nextMonth.setShowing(this.includeNavigation);
		this.$.prevMonth.setShowing(this.includeNavigation);
	},
	isSelected:function(d) {
		return 	d && this.selection &&
				d.getMonth() === this.selection.getMonth() &&
				d.getDate() === this.selection.getDate() &&
				d.getFullYear() === this.selection.getFullYear();
	},
	dateClicked:function(source, event) {
		if(this.isSelected(source.date)) return;
		
		this.setSelection(source.date);
		this.doSelect(source.date);
	},
	previousMonth:function(source, event) {
		this.owner.previous && this.owner.previous();
	},
	nextMonth:function(source, event) {
		this.owner.next && this.owner.next();
	}
};

enyo.kind(_CalendarPicker);
enyo.kind(_Calendar);