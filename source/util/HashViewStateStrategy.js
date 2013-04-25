enyo.kind({
    name:"extras.HashViewStateStrategy",
    kind:"extras.ViewStateStrategy",
    activate:function() {
        this.inherited(arguments);

        enyo.dispatcher.listen(window, "hashchange", enyo.bind(this, "loadHash"));

        if(window.location.hash) {
            this.loadHash();
        }
    },
    loadHash:function() {
        if(this.suppress) {
            this.suppress = false;
            return;
        }
        
        var paths = window.location.hash.substring(2).split("/"),
            state = [];

        for(var i=0;i<paths.length;i+=2) {
            state.push({
                path:paths[i],
                data:{key:paths[i+1]}
            });
        }

        enyo.asyncMethod(this, function() {
            this.restoreState(state);
        });
    },
    pop:function() {
        this.depth = Math.max(0, this.depth-1);
        window.history.back();
        return true;
    },
    buildPath:function(viewState) {
        var path = [""];
        enyo.forEach(viewState.state, function(s) {
            path.push(s.path);
            path.push(s.data.key);
        });

        return "#"+path.join("/");
    },
    saveState:function(viewState, replace) {
        this.suppress = true;
        if(replace) {
            window.location.replace(window.location.protocol + "//" + window.location.host + window.location.pathname + this.buildPath(viewState));
        } else {
            window.location.hash = this.buildPath(viewState);
        }
    }
});