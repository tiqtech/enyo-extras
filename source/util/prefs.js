// needs rework to generalize beyond webOS
// like the idea of auto-wiring published properties but perhaps data layer should be extensible

var _AutoPref = {
	name : "extras.AutoPreferencesService",
	kind : "Component",
	components : [{
		kind : "SystemService",
		name : "getPreferences",
		method : "getPreferences",
		onResponse : "getPrefs"
	}, {
		kind : "SystemService",
		name : "setPreferences",
		method : "setPreferences",
		onResponse : "setPrefs"
	}, {
		kind:"extras.Singleton",
		name:"singleton",
		base:"autoprefs"
	}],
	events : {
		onLoad : "",
		onSet : "",
		onError : ""
	},
	deferUpdate:false,
	create : function() {
		this.inherited(arguments);

		var props = [];
		for ( var prop in this.published) {
			props.push(prop);
			this["get" + enyo.cap(prop)] = enyo.bind(this, "getProp", prop);
			this[prop + "Changed"] = enyo.bind(this, "changeHandler", prop);
		}

		this.$.getPreferences.call({
			keys : props
		});
	},
	getProp:function(prop) {
		var p = this.$.singleton.get(prop);
		
		if(p) {
			this[prop] = p;
			return p;
		} else {
			return this[prop];
		}
	},
	changeHandler : function(prop) {
		if (this.deferUpdate)
			return;
		
		this.$.singleton.set(prop, this[prop]);
		
		var o = {};
		o[prop] = this[prop];
		this.$.setPreferences.call(o);
	},
	defer : function(disable) {
		this.deferUpdate = !!disable;
	},
	update : function() {
		var o = {};
		for ( var prop in this.published) {
			o[prop] = this[prop];
		}

		this.$.setPreferences.call(o);
	},
	setPrefs : function(source, response) {
		if (!response.returnValue)
			this.doError(response);

		this.doSet();
	},
	getPrefs : function(source, response) {
		if (!response.returnValue)
			this.doError(response);
		
		for ( var prop in this.published) {
			if(response[prop] !== undefined) {
				this[prop] = response[prop];
			}
		}

		this.doLoad();
	}
}

enyo.kind(_AutoPref);