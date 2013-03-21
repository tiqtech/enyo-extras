enyo.kind({
    name:"extras.Delegator",
    kind:"Component",
    published:{
        members:"",
        delegatee:""
    },
    delegated: false,
    create:function() {
        this.inherited(arguments);
        this.delegate();
        this.membersChanged = this.delegateeChanged = this.delegate;
    },
    delegate:function() {
        var delegatee = this.delegatee,
            props = this.members;
        
        if(delegatee && props && !this.delegated) {
            enyo.forEach(props, enyo.bind(this.owner, function(p) {
                if(enyo.isFunction(delegatee[p])) {
                    this[p] = enyo.bind(delegatee, p);
                } else {                
                    var _set = "set"+enyo.cap(p),
                        _get = "get"+enyo.cap(p);
                    
                    if(!this[_set] && delegatee[_set]) {
                        this[_set] = enyo.bind(delegatee, _set);
                    }
                    
                    if(!this[_get] && delegatee[_get]) {
                        this[_get] = enyo.bind(delegatee, _get);
                    }
                    
                    // calling the setXXX function after the bind so the proxy
                    // can override if desired and will delegate otherwise
                    if(typeof this[p] != "undefined") {
                        enyo.call(this, _set, [this[p]]);
                    }
                }
            }));
        }
    }
});