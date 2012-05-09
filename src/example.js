var _Example = {
	name:"extras.ExampleApp",
	kind:"extras.Accordion",
	components:[
		{kind:"extras.AccordionSection", caption:"Calendar Picker", defaultSection:true, components:[
			{content:"Open by default because otherwise it doesn't render correctly right now"},
			{kind:"extras.CalendarPicker", name:"cal", onSelect:"showDate"},
			{kind:"LabeledContainer", label:"Selected Date:", components:[
				{name:"dt"}
			]}
		]},
		{kind:"extras.AccordionSection", caption:"TouchPad Launch Day", open:false, components:[
			{kind:"extras.Calendar", flex:1, onlyShowingCurrent:true, date:new Date(2011, 6, 1), selection:new Date(2011, 6, 1)}
		]},
		{kind:"extras.AccordionSection", caption:"Animated Grid", open:false, components:[
			{kind:"extras.Grid", name:"grid", cellWidth:75, cellHeight:75, align:"center"}
		]},
		{kind:"extras.AccordionSection", caption:"Timer", open:false, components:[
			{kind:"extras.Timer", name:"timer", onTick:"tick"},
			{name:"timerField", content:"Click to Toggle Timer", onclick:"toggleTimer"}
		]},
		{kind:"extras.PrefExample", name:"prefs", onLoad:"prefsReady"}
	],
	create:function() {
		this.inherited(arguments);
		//this.showDate(null, new Date());
		//this.$.admob.request();
		for(var i=0;i<50;i++) {
			this.$.grid.createComponent({kind:"Button", caption:"Button " + i, className:"grid-button", owner:this, onclick:"collapseButtons"});
		}
	},
	collapseButtons:function() {
		this.$.grid.setCollapsed(!this.$.grid.getCollapsed());
	},
	showDate:function(source, date) {
		this.$.prefs.setSelectedDate(date.getTime());
		this.$.dt.setContent(date.getDate() + "-" + (date.getMonth()+1) + "-" + date.getFullYear());
	},
	tick:function(source, time) {
		var t = this.$.timer.toTime(time);
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
	}
};

enyo.kind(_Example);

enyo.kind({
	name:"extras.PrefExample",
	kind:"extras.AutoPreferencesService",
	published:{
		selectedDate:null
	}
});
