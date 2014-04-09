enyo.kind({
	name:"extras.TypeAheadInput",
	classes:"extras-typeahead-input",
	events:{
		onAcceptSuggestion:""
	},
	published:{
		suggestion:""
	},
	tools:[
		{name:"shadow", kind:"onyx.Input", classes:"shadow", oninput:"shadowInput", onfocus:"shadowFocused", attributes:{tabindex:"-1"}},
		{name:"main", kind:"onyx.Input", classes:"primary", onkeydown:"mainKeydown", onflick:"flicked", onblur:"blurred", onfocus:"mainFocused", oninput:"mainInput", ontap:"mainTapped"},
		{name:"delegator", kind:"extras.Delegator", members:["placeholder", "value", "type", "disabled", "selectOnFocus", "clear", "focus", "hasFocus", "selectContents"]}
	],
	create:function() {
		this.inherited(arguments);
		this.$.delegator.setDelegatee(this.$.main);
	},
	initComponents:function() {
		this.createComponents(this.tools, {owner:this});
		this.inherited(arguments);
	},
	suggestionChanged:function() {
		this.$.shadow.setValue(this.suggestion);
	},
	shadowFocused:function(source, event) {
		this.$.main.focus();
	},
	mainFocused:function() {
		this.suggestionChanged();
	},
	mainKeydown:function(source, event) {
		if(event.which == 9 && this.suggestion) {
			this.applySuggestion();
			event.preventDefault();
			return true;
		}
	},
	shadowInput:function() {
		// should never be hit
		return true;
	},
	mainInput:function() {
		this.setSuggestion("");
	},
	mainTapped: function() {
		var v = this.$.shadow.get("value");
		if(v) {
			this.applySuggestion();
		}
	},
	flicked:function(source, event) {
		var x = event.xVelocity,
			y = event.yVelocity,
			m = (x) ? y/x : Infinity;

		if( x > 0 && (m < 1 && m > -1) && enyo.platform.touch ) {
			this.applySuggestion();
			return true;
		}
	},
	blurred:function() {
		this.$.shadow.setValue("");
	},
	applySuggestion:function() {
		var v = this.$.main.getValue();
		this.$.main.setValue(this.suggestion);
		this.setSuggestion("");
		this.doAcceptSuggestion({priorValue:v, value:this.$.main.getValue()});
	}
});
