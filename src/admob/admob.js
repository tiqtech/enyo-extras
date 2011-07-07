/**
 * Port of AdMob webOS SDK from Mojo to Enyo frameworks - ryanjduffy
 *
 * Copyright (c) 2009 AdMob, Inc.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */


var _AdMob = {
	name:"extras.AdMob",
	kind:"Control",
	tiles:['chat', 'affilateoffers', 'contests', 'generic', 'healthfitness', 'toolsutilities', 'portal2'],
	published:{
		pubId:"",
		testMode:false,
		bgColor:"#fff",
		textColor:"#000",
		udid:null
	},
	events:{
		onSuccess:"",
		onFailure:""
	},
	components:[
		{className:"_AdMobAd", name:"wrapper", onclick:"onClick", components:[
			{name:"cpc", kind:"HFlexBox", showing:false, components:[
				{kind:"Image", name:"tile", base:"http://mm.admob.com/static/pre/img/"},
				{flex:1, name:"cpcWrapper", height:"30px", components:[
					{name:"text"},
					{name:"tag", content:"Ads by AdMob"}
				]},
				{kind:"Image", name:"action", className:"_AdMobAction", src:"http://mm.admob.com/static/pre/img/action_web.png"}
			]},
			{name:"cpm", showing:false, components:[
				{kind:"Image", name:"tracking", showing:false},
				{kind:"Image", name:"cpmImage"}
			]}
		]},
		{kind:"WebService", name:"getAd", method:"POST", onSuccess:"success", onFailure:"failure", url:"http://r.admob.com/ad_source.php"},
	],
	create: function(options) {
		this.inherited(arguments);
		
		if(this.pubId == null || this.pubId === "") {
			enyo.log('AdMob Publisher ID required.');
			return;
		}
		
		if(this.udid === null) {
			var deviceInfo = enyo.fetchDeviceInfo();
			this.udid = (deviceInfo) ? deviceInfo.serialNumber : "UNKNOWN";
		}
	},
	request: function(options) {
		enyo.log('AdMob Ad Request Pub Id: ', this.pubId);
		var params = {
			s: this.pubId,
			u: navigator.userAgent, // user agent
			ex: 1, // use client's ip address for i field
			o: this.udid, // uuid
			v: '20091118-WEBOSSDK-3cd2b53620088ef8',
			f: 'jsonp'
		}
		if(this.testMode) params.m = 'test';

		this.$.getAd.call(params);
	},
	success:function(sender, response, request) {
		var ad = response;
		
		if (ad.text) {
			enyo.log('AdMob Ad Request WIN!');
			this.$.wrapper.url = ad.url;
			this.$.wrapper.setStyle("clear:none;outline:none;margin:0;border:none;padding: 4px; background-color: " + this.bgColor);
						
			var ad_markup = null;
			if (!ad[20] && ad.banner) { // banner ad
				this.$.cpm.setStyle("padding: 0; margin: 0; height: 48px;background:url('" + ad.banner + "')");
				
				this.$.cpm.setShowing(true);
				this.$.cpc.setShowing(false);
			} else { // cpc ad
				// set bg and text color
				this.$.cpcWrapper.setStyle("float: left; padding: 3px 5px; overflow: hidden;color:" + this.textColor + ";background-color:" + this.bgColor + ";");
				
				this.$.text.setContent(ad.text);
				this.$.text.setStyle("line-height: 17px; font: bold 12px helvetica;");
				this.$.tile.setSrc(this.tiles[Math.floor(Math.random() * this.tiles.length)] + ".png");
				this.$.action.setStyle("padding: 5px 0");
				this.$.tag.setStyle("padding-top: 5px; width: 100%; text-align: right;line-height: 13px; font: normal 9.5px helvetica;");
				
				this.$.cpm.setShowing(false);
				this.$.cpc.setShowing(true);
			}
			
			this.doSuccess();
		} else {
			this.failure(sender, response, request);
		}
	},
	failure:function(sender, response, request) {
		enyo.log('AdMob Ad Request FAIL - no response from server!');
		this.doFailure();
	},
	onClick:function(sender, event) {
		if(sender.url) {
			window.open(sender.url);
		}
	}
}

enyo.kind(_AdMob);