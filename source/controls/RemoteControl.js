enyo.kind({
    name: "extras.RemoteControl",
	kind: "Control",
	loadState: 0,
	scrimKind:"extras.RemoteControlScrim",
	published:{
		animate:true
	},
	events:{
		onLoad:"",
		onLoadFailed:""
	},
	components:[
		{name:"ani", kind:"Animator", startValue:65, endValue:1, onStep:"aniStep", onStop:"aniStop", onEnd:"aniStop"}
	],
	getScrim:function() {
		// defer scrim creation ...
		return this.$.scrim || this.createComponent({name:"scrim", kind:this.scrimKind || "Control", owner:this}).render();
	},
	refresh: function() {
		this.setLoadState(0);
		this.load();
	},
	setLoadState:function(state) {
		this.loadState = state;
		if(this.loadState == 1) {
			this.getScrim().show();
		} else if(this.loadState == 2) {	// what about errors?
			if(this.animate) {
				this.$.ani.play();
			} else {
				this.aniStop();
			}
		}
	},
	load: function() {
		if(this.href && this.loadState == 0) {
			this.setLoadState(1);
			enyo.load([this.href], enyo.bind(this, "loaded"));
		}
	},
	loaded: function(block) {
		// should be null unless my pull is changed to always created the failed member
		if(!block.failed || block.failed.length === 0) {
			this.setLoadState(2);
			this.remote = this.createComponent({kind:this.remoteKind, classes:(this.fit) ? "enyo-fit" : ""}).render();

			this.doLoad({remote:this.remote});
		} else {
			this.setLoadState(-1);
			this.doLoadFailed({failed:block.failed});
		}
	},
	aniStep:function(source) {
		this.getScrim().applyStyle("opacity", source.value/100)
	},
	aniStop:function(source) {
		this.getScrim().hide();
	}
});