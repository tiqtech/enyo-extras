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
	}, ],
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
			this[prop + "Changed"] = enyo.bind(this, "changeHandler", prop);
		}

		this.$.getPreferences.call({
			keys : props
		});
	},
	changeHandler : function(prop) {
		if (this.deferUpdate)
			return;
		
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