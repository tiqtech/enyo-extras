var _Timer = {
	name:"extras.Timer",
	kind:"Component",
	published:{
		time:{h:0,m:0,s:0,ms:0},
		frequency:20,
		running:false
	},
	events:{
		onTick:""
	},
	create:function() {
		this.inherited(arguments);
		this.timeChanged();
	},
	update:function() {
		var now = new Date().getTime();
		
		if(!this.startTime) {
			this.startTime = now;
		}
		
		if(this.stopTime !== 0) {
			this.pauseTime += now - this.stopTime;
			this.stopTime = 0;
		}
		
		var diff = now - this.startTime - this.pauseTime;
		this.time = this.toTime(diff)
		
		this.doTick({time:this.time, diff:diff});
		
		return now;
	},
	timeChanged:function() {
		this.setRunning(false);
		
		// reset flags
		this.startTime = undefined;
		this.stopTime = 0;
		this.pauseTime = 0;
	},
	frequencyChanged:function() {
		if(this.interval) {
			this.stop();
			this.start();
		}
	},
	runningChanged:function() {
		if(this.running) {
			this.update();
			this.interval = setInterval(enyo.bind(this, "update"), this.frequency);
		} else if(this.startTime) {
			clearInterval(this.interval);
			this.stopTime = this.update();
		}	
	},
	start:function() {
		this.setRunning(true);
	},
	stop:function() {
		this.setRunning(false);
	},
	reset:function() {
		this.setTime({h:0,m:0,s:0,ms:0});
	},
	toMilli:function(t) {
		return t.ms + (t.s*1000) + (t.m*60000) + (t.h*360000);
	},
	toTime:function(ms) {
		var t = {};
		var divisions = {ms:1000,s:60,m:60,h:60};
		for(var k in divisions) {
			t[k] = ms%divisions[k];
			ms = Math.floor(ms/divisions[k]);
		}
		
		return t;
	}
}

enyo.kind(_Timer);
