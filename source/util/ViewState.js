enyo.kind({
    name: "extras.ViewState",
    kind: "Component",
    published: {
        path: ""
    },
    events: {
        onSaveState: "",
        onRestoreState: ""
    },
    statics:{
        strategy:"extras.HashViewStateStrategy",
        manager:null,
        selectStrategy:function() {
            if(this.strategy === "auto") {
                // algorithm to select a strategy (e.g. feature detection)
            } else {
                return this.strategy;
            }
        },
        getManager:function() {
            if(!this.manager) {
                var c = enyo.constructorForKind(this.selectStrategy());
                this.manager = (typeof(c) === "function") ? new c() : c;
                this.manager.activate();
            }

            return this.manager;
        },
        push:function(path, state) {
            this.getManager().push(path, state);
        },
        pop:function() {
            if(this.getManager().hasViewState()) {
                return this.getManager().pop();
            }
        },
        register:function(path, handler) {
            this.getManager().register(path, handler);
        }
    },
    create: function() {
        this.inherited(arguments);
        this.pathChanged();
    },
    pathChanged: function() {
        extras.ViewState.register(this.path, this);
    },
    save: function(data) {
        this.noSave || extras.ViewState.push(this.path, data)
    },
    restore:function(data) {
        this.noSave = true;
        this.doRestoreState({data:data});
        this.noSave = false;
    },
    back:function() {
        return extras.ViewState.pop();
    }
});