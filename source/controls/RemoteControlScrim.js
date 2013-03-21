enyo.kind({
    name:"extras.RemoteControlScrim",
	kind:"onyx.Scrim",
	classes:"onyx-scrim-translucent",
	style:"text-align:center",
	showing:false,
	components:[
		{kind:"onyx.Spinner", style:"position:absolute;top:50%;margin-top:-30px;display:inline-block"}
	]
});