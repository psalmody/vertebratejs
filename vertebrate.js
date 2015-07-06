if (typeof($) == 'undefined') {
    console.log('Vertebrate.js requires jQuery 1.11+');
}

/**
*

In progress:
* add delete functions

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
                var self = this;
                this.attributes[attr] = value;
                this.changedattrs.push(attr);
                $('body').trigger('vertebrate.changeattr',[self,self.attributes,self.changedattrs]);
                return true;
            },
            get: function( attr ) {
                if (typeof(attr) == 'undefined') return this.attributes;
                return this.attributes[attr];
            },
            has: function( attr ) {
                return (typeof(this.attributes[attr]) == 'undefined') ? false : true;
            },
            hasChanged: function( attr ) {
                var attr = typeof(attr) == 'undefined' ? false : attr;
                if (!attr) {
                    return this.changedattrs.length > 0 ? true : false;
                }
                return this.changedattrs.indexOf(attr) >= 0 ? true : false;
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
                self.changedattrs = [];
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
                self.changedattrs = [];
                if (typeof(callback) == 'function') callback( data, status, xhr );
            }
        });
        return promise;
    };
    this.delete = function( callback ) {
        var promise = $.ajax({
            url: typeof(this.get('url')) == 'undefined' ? Vertebrate.get('url') : this.get('url'),
            method: 'DELETE',
            data: this.get(),
            success: function( data, status, xhr ) {
                if (typeof(callback) == 'function') callback( data, status, xhr );
            }
        });
        return promise;
    };
};

Vertebrate.Model.Extend = function( options ) {
    function model( opts ) {
        Vertebrate.Model.call(this,options);
        $.extend(this,opts);
    }
    model.prototype = Object.create(Vertebrate.Model.prototype);
    model.prototype.constructor = model;
    return model;
};

Vertebrate.Collection = function(options) {
    this.model = false;
    this.models = [];
    this.added = [];
    this.removed = [];
    var self = this;
    $.extend(this,Vertebrate.shared.fn,options);
    this.save = function( callback ) {
        var promise = $.ajax({
            url: typeof(this.get('url')) == 'undefined' ? Vertebrate.get('url') : this.get('url'),
            method: 'POST',
            data: {"data":JSON.stringify([this.get(),this.models])},
            success: function( data, status, xhr ) {
                if (typeof(callback) == 'function') callback( data, status, xhr );
            }
        });
        return promise;
    };
    this.fetch = function( callback ) {
        if (!self.model) {
            console.log('No model defined. Models must be defined before fetch call.');
            return false;
        }
        var promise = $.ajax({
            url: typeof(this.get('url')) == 'undefined' ? Vertebrate.get('url') : this.get('url'),
            method: 'GET',
            dataType: 'JSON',
            data: JSON.stringify(this.get()),
            success: function( data, status, xhr ) {
                self.models = [];
                $.each(data,function(i) {
                    self.models.push(new self.model({"attributes":data[i]}));
                });
                if (typeof(callback) == 'function') callback( data, status, xhr );
            }
        });
        return promise;
    };
    this.find = function( term, attr ) {
        var attr = typeof(attr) == 'undefined' ? false : attr;
        var found = false;
        if (attr) {
            var founds = [];
            $.each(this.models,function(k,v) {
                if (v.attributes[attr] == term) {
                    found = true;
                    founds.push(this);
                }
            });
            if (!found) return false;
            return founds;
        } else {
            $.each(self.models,function(k) {
                if (k == term) {
                    found = this;
                    return false;
                }
            });
            return found;
        }
    };
    this.add = function( model ) {
        self.models.push( model );
        self.added.push( model );
    };
    this.remove = function( model ) {
        if (self.models.indexOf(model) == -1) {
            return false;
        }
        self.removed.push(model);
        self.models = self.models.filter(function() {
            return this != model;
        });
        $('body').trigger('vertebrate.removed',[self,self.removed,self.models]);
        return true;
    };
};

Vertebrate.Collection.Extend = function( options ) {
    function collection( opts ) {
        Vertebrate.Collection.call(this,options);
        $.extend(this,opts);
    }
    collection.prototype = Object.create(Vertebrate.Collection.prototype);
    collection.prototype.constructor = collection;
    return collection;
};
