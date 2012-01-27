var _Singleton = {
	name:"extras.Singleton",
	kind:"Component",
	root:"extras.singleton.data",
	published:{
		base:"",
	},
	create:function() {
		this.inherited(arguments);
		this.window = enyo.windows.getRootWindow();
		enyo.getObject(this.root, this.window);
	},
	set:function(prop, value) {
		enyo.setObject(this.getPath(prop), value, this.window);
	},
	get:function(prop) {
		return enyo.getObject(this.getPath(prop), false, this.window);
	},
	getPath:function(prop) {
		var r = [this.root];
		if(this.base && this.base.length > 0) {
			r.push(this.base);
		}
		
		r.push(prop);
		
		return r.join(".");
	}
};

enyo.kind(_Singleton);