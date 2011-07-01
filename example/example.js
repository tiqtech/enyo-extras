var _Example = {
	name:"extras.ExampleApp",
	kind:"Control",
	components:[
		{kind:"DividerDrawer", caption:"Calendar Picker", open:true, components:[
			{kind:"extras.CalendarPicker", onSelect:"showDate"},
			{kind:"LabeledContainer", label:"Selected Date:", components:[
				{name:"dt"}
			]}
		]},
		{kind:"DividerDrawer", caption:"TouchPad Launch Day", open:false, components:[
			{kind:"extras.Calendar", flex:1, onlyShowingCurrent:true, date:new Date(2011, 6, 1), selection:new Date(2011, 6, 1)}
		]}
	],
	create:function() {
		this.inherited(arguments);
		this.showDate(null, new Date());
	},
	showDate:function(source, date) {
		this.$.dt.setContent(date.getDate() + "-" + (date.getMonth()+1) + "-" + date.getFullYear());
	}
};

enyo.kind(_Example);
