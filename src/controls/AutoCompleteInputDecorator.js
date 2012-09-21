// requires enyo v2 and onyx
enyo.kind({
    name: "extras.AutoCompleteInputDecorator",
    kind: "onyx.InputDecorator",
    handlers: {
        oninput: "input",
        onSelect: "itemSelected",
    },
    published: {
        values: "",
        delay: 200,
        //* private ... needed to support Menu ...
        active: false
    },
    events: {
        onInputChanged: "",
        onValueSelected: ""
    },
    components:[
        {name: "popup", kind: "onyx.Menu", floating: true}
    ],
    input: function(source, event) {
        // cache input instance. means we only support a single input but that's probably okay.
        // works around a bug where originator is Menu rather than Input
        this.inputField = this.inputField || event.originator;
        enyo.job(null, enyo.bind(this, "fireInputChanged"), this.delay);
    },
    fireInputChanged: function() {
        this.doInputChanged({value: this.inputField.getValue()});
    },
    valuesChanged: function() {
        if (!this.values || this.values.length === 0) {
            this.waterfall("onRequestHideMenu", {activator: this});
            return;
        }

        this.$.popup.destroyClientControls();
        var c = [];
        for (var i = 0; i < this.values.length; i++) {
            c.push({content: this.values[i]});
        }
        this.$.popup.createComponents(c);
        this.$.popup.render();

        this.waterfall("onRequestShowMenu", {activator: this});
    },
    itemSelected: function(source, event) {
        this.inputField.setValue(event.content);
    }
});