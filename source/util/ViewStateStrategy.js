enyo.kind({
    name:"extras.ViewStateStrategy",
    kind:"Component",
    depth:0,
    create:function() {
        this.inherited(arguments);

        this.tree = {
            paths: []
        };
    },
    //* @public
    push: function(path, data) {
        this.depth++;
        var paths = this.split(path);
        this.bubble({
            state: [{
                path: paths.pop(),
                data: data}],
            paths: paths
        });
    },
    pop:function() {
        this.depth = Math.max(0, this.depth-1);
        this.restoreState(this.getState());

        return true;
    },
    register:function(path, handler) {
        // first registered default handler will receive empty path restores
        if(handler.defaultHandler && !this.defaultHandler) {
            this.defaultHandler = handler;
        }

        var node = this.findNode(path, true);

        if (!node) {
            throw "Unable to find node at path: " + path;
        } else if (node.handler) {
            throw "Handler already registered for path: " + path;
        } else {
            node.handler = handler;
        }
    },
    hasViewState:function() {
        return this.depth > 0;
    },
    //* override in a subkind to do real work
    setState:function(viewState) {},
    getState:function() {},
    activate:function() {},
    //* @protected
    bubble: function(viewState) {
        if (viewState.paths.length > 0) {
            var node = this.findNode(viewState.paths),
                path = viewState.paths.pop();

            if (node.handler) {
                var event = {
                    path:path,
                    data:{key:"-"}
                };
                
                node.handler.doSaveState(event);
                delete event.originator;
                viewState.state.unshift(event);
            }

            this.bubble(viewState);
        } else {
            this.saveState(viewState);
        }
    },
    restoreState:function(state) {
        if(state.length === 1 && !state[0].path && this.defaultHandler) {
            this.defaultHandler.restore();
        } else {
            var node = this.tree;
            for(var i=0;i<state.length;i++) {
                node = this.getChildNode(node, state[i].path);
                if(node) {
                    if(node.handler) {
                        node.handler.restore(state[i].data);
                    }
                } else {
                    break;
                }
            }
        }
    },
    split: function(path) {
        return path.replace(/\/*(.*?)\/*$/, "$1").split("/");
    },
    getChildNode:function(node, name) {
        for(var i=0;i<node.paths.length;i++) {
            if(node.paths[i].name === name) {
                return node.paths[i];
            }
        }
    },
    findNode: function(path, create) {
        var paths = enyo.isArray(path) ? path : this.split(path),
            node = this.tree;

        for (var i = 0; i < paths.length; i++) {
            var p = paths[i];
            if (!p) continue;

            var found = false;
            for (var j = 0; j < node.paths.length && !found; j++) {
                var p2 = node.paths[j];
                if (p2.name === p) {
                    found = true;
                    node = p2;
                }
            }

            if (!found) {
                if (create) {
                    var n = {
                        name: p,
                        paths: []
                    };
                    node.paths.push(n);
                    node = n;
                } else {
                    return;
                }
            }
        }

        return node;
    }
});