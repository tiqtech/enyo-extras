enyo.kind({
    name: "extras.LazyPanels",
	kind: "enyo.Panels",
	defaultKind: "extras.RemoteControl",
	initComponents:function() {
		for(var i=0,c;c=this.components[i];i++) {
			var ctor = enyo.constructorForKind(c.kind || "enyo.Control");
			if(!ctor && c.href) {
				c.remoteKind = c.kind;
				c.kind = this.defaultKind;
			}
		}

		this.inherited(arguments);
	},
	indexChanged:function(oldIndex) {
		var panel = this.getClientControls()[this.index];
		if(panel instanceof extras.RemoteControl) {
			panel.load();				
		}

		this.inherited(arguments);
	}
});