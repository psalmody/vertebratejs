if (typeof($) == 'undefined') {
    console.log('Vertebrate.js requires jQuery 1.11+');
}

var Vertebrate = {
    get: function( setting ) {
        return this.settings[setting];
    }
};

Vertebrate.settings = {
    url: 'json/test.json'
}

Vertebrate.Model = function( options ) {
    var self = this;
    this.attributes = $.extend({}, options);
    this.set = function( attr, value ) {
        this.attributes[attr] = value;
        return true;
    };
    this.get = function( attr ) {
        if (typeof(attr) == 'undefined') return this.attributes;
        return this.attributes[attr];
    };
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
    }
    return this;
};

Vertebrate.Collection = function( options ) {
    var self = this;
    this.models = typeof(this.models) == 'undefined' ? [] : this.models;
    this.attributes = $.extend({},options);
    this.set = function( attr, value ) {
        this.attributes[attr] = value;
        return true;
    };
    this.get = function( attr ) {
        if (typeof(attr) == 'undefined') return this.attributes;
        return this.attributes[attr];
    };
    this.save = function( callback ) {
        var promise = $.ajax({
            url: typeof(this.get('url')) == 'undefined' ? Vertebrate.get('url') : this.get('url'),
            method: 'POST',
            data: JSON.stringify([this.get(),this.models]),
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

    };
    this.find
};
