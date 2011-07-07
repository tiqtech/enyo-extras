var _Example = {
	name:"extras.ExampleApp",
	kind:"Control",
	components:[
		{kind:"DividerDrawer", caption:"Calendar Picker", open:true, components:[
			{content:"Open by default because otherwise it doesn't render correctly right now"},
			{kind:"extras.CalendarPicker", onSelect:"showDate"},
			{kind:"LabeledContainer", label:"Selected Date:", components:[
				{name:"dt"}
			]}
		]},
		{kind:"DividerDrawer", caption:"TouchPad Launch Day", open:false, components:[
			{kind:"extras.Calendar", flex:1, onlyShowingCurrent:true, date:new Date(2011, 6, 1), selection:new Date(2011, 6, 1)}
		]},
		{kind:"DividerDrawer", caption:"AdMob (Experimental)", open:false, components:[
			{kind:"extras.AdMob", name:"admob", testMode:true, pubId:"YOURPUBID", testMode:true}
		]},
		{kind:"DividerDrawer", caption:"Timer", open:false, components:[
			{kind:"extras.Timer", name:"timer", onTick:"tick"},
			{name:"timerField", content:"Click to Toggle Timer", onclick:"toggleTimer"}
		]}
	],
	create:function() {
		this.inherited(arguments);
		this.showDate(null, new Date());
		this.$.admob.request();
	},
	showDate:function(source, date) {
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
	}
};

enyo.kind(_Example);
