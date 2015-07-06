if (typeof($) == 'undefined') {
    console.log('Vertebrate.js requires jQuery 1.11+');
}

/**
*

In progress:
* add change events for listening with $ on
* add changed attribute to mark what keys changed
* add delete / remove functions

*change back to functions... extend needs to return the function so we can
  use new Modelname() to construct new models

*
*/

var Vertebrate = {
    settings: {},
    get: function( setting ) {
        return (typeof(setting)) == 'undefined' ?
         this.settings :
         this.settings[setting];
    },
    set: function( setting, value ) {
        return this.settings[setting] = value;
    },
    shared: {
        fn: {
            attributes: {},
            changedattrs: [],
            set: function( attr, value ) {
                this.attributes[attr] = value;
                return true;
            },
            get: function( attr ) {
                if (typeof(attr) == 'undefined') return this.attributes;
                return this.attributes[attr];
            },
            has: function( attr ) {
                return (typeof(this.attributes[attr]) == 'undefined') ? false : true;
            }
        }
    }
};

Vertebrate.Model = function( options ) {
    var self = this;
    $.extend(this,Vertebrate.shared.fn,options);
    this.save = function( callback ) {
        var promise = $.ajax({
            url: typeof(this.get('url')) == 'undefined' ? Vertebrate.get('url') : this.get('url'),
            method: 'POST',
            data: this.get(),
            success: function( data, status, xhr ) {
                if (typeof(callback) == 'function') callback( data, status, xhr );
            }
        });
        return promise;
    };
    this.fetch = function( callback ) {
        var promise = $.ajax({
            url: typeof(this.get('url')) == 'undefined' ? Vertebrate.get('url') : this.get('url'),
            method: 'GET',
            data: this.get(),
            success: function( data, status, xhr ) {
                if (typeof(callback) == 'function') callback( data, status, xhr );
            }
        })
        return promise;
    };
};

Vertebrate.Model.Extend = function( options ) {
    return $.extend(Vertebrate.Model,options);
}

Vertebrate.Collection = {
    Extend: function( options ) {
        var collection = $.extend({},Vertebrate.shared.fn,this,options);
        delete collection.Extend;
        return collection;
    },
    models: [],
    save: function( callback ) {
        var promise = $.ajax({
            url: typeof(this.get('url')) == 'undefined' ? Vertebrate.get('url') : this.get('url'),
            method: 'POST',
            data: JSON.stringify([this.get(),this.models]),
            success: function( data, status, xhr ) {
                if (typeof(callback) == 'function') callback( data, status, xhr );
            }
        });
        return promise;
    },
    fetch: function( callback ) {
        var promise = $.ajax({
            url: typeof(this.get('url')) == 'undefined' ? Vertebrate.get('url') : this.get('url'),
            method: 'GET',
            data: JSON.stringify(this.get()),
            success: function( data, status, xhr ) {
                self.models = [];
                $.each(data,function(i) {
                    self.models.push(new Vertebrate.Model(this));
                })
                if (typeof(callback) == 'function') callback( data, status, xhr );
            }
        })
        return promise;
    },
    find: function( term, attr ) {
        var attr = typeof(attr) == 'undefined' ? false : attr;
        var found = false;
        if (attr) {
            var founds = [];
            $.each(this.models,function(k,v) {
                if (v.attributes[attr] == term) {
                    found = true;
                    founds.push(this);
                }
            })
            if (!found) return false;
            return founds;
        } else {
            $.each(this.models,function(k,v) {
                if (k == term) {
                    found = this;
                    return false;
                }
            });
            return found;
        }

    },
};
