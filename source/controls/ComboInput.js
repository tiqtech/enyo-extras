enyo.kind({
    name:"extras.ComboInput",
    kind:"extras.AutoCompleteInputDecorator",
    published:{
        inputClasses:"",
    },
    comboTools:[
        {name:"input", kind:"extras.TypeAheadInput", onAcceptSuggestion:"accept"},
        {name:"delegator", kind:"extras.Delegator", members:["placeholder", "value", "type", "disabled", "selectOnFocus", "clear", "focus", "hasFocus", "selectContents"]}
    ],
    create:function() {
        this.inherited(arguments);
        this.$.delegator.setDelegatee(this.$.input);
        this.inputClassesChanged();
    },
    initComponents:function() {
        this.inherited(arguments);
        this.createComponents(this.comboTools, {owner:this});
    },
    inputClassesChanged:function(oldClasses) {
        if(this.$.input) {
            if(oldClasses) {
                this.$.input.removeClass(oldClasses);
            }
            this.$.input.addClass(this.inputClasses);
        }
    },
    filter:function(input, value) {
        var ok = (this.caseSensitive && String(value).indexOf(input) === 0) || (!this.caseSensitive && String(value).toLowerCase().indexOf(String(input).toLowerCase()) === 0);
        return ok;
    },
    renderValues:function() {
        this.inherited(arguments);
        
        if(this.$.popup.getShowing()) {
            // assuming first is valid as popup is only shown when there are values
            var first = this.$.popup.getClientControls()[0].content,
                v = this.$.input.getValue();
            
            this.$.input.setSuggestion(v + first.substring(v.length));
        }
    },
    accept:function() {
        this.waterfall("onRequestHideMenu", {activator: this});
    },
    itemHighlighted:function() {
        this.inherited(arguments);
        this.$.input.setSuggestion("");
    }
});