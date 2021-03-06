/**
*  VertebrateJS v 0.3.3 by Michael Smith @psalmody
*  https://github.com/psalmody/vertebratejs
*/
var Vertebrate = (function($) {

    if (typeof($) == 'undefined') {
        console.log('%cError:','color:red;font-weight:bold','Vertebrate.js requires jQuery 1.11+');
        return false;
    }

    var Vertebrate = {
        settings: {},
        get: function(setting) {
            return (typeof(setting)) == 'undefined' ?
                this.settings :
                this.settings[setting];
        },
        set: function(setting, value) {
            return this.settings[setting] = value;
        },
        shared: {
            fn: function() {
                this.attributes = {};
                this.changedattrs = [];
                this.set = function(attr, value) {
                    this.attributes[attr] = value;
                    if (this.changedattrs.indexOf(attr) == -1) this.changedattrs.push(attr);
                    $([this]).trigger('vertebrate:changeattr', [this, this.attributes, this.changedattrs]);
                    $(document).trigger('vertebrate:changeattr', [this, this.attributes, this.changedattrs]);
                    return true;
                };
                this.get = function(attr) {
                    if (typeof(attr) == 'undefined') return this.attributes;
                    return this.attributes[attr];
                };
                this.has = function(attr) {
                    return (typeof(this.attributes[attr]) == 'undefined') ? false : true;
                };
                this.hasChanged = function(attr) {
                    var attr = typeof(attr) == 'undefined' ? false : attr;
                    if (!attr) {
                        return this.changedattrs.length > 0 ? true : false;
                    }
                    return this.changedattrs.indexOf(attr) >= 0 ? true : false;
                };
            }
        }
    };

    Vertebrate.Model = function(options) {
        var self = this;
        Vertebrate.shared.fn.call(this);
        var options = typeof(options) == 'undefined' ? false : options;
        if (options) {
            $.each(options,function(k,v){
                if (typeof(v) == 'object') {
                    self[k] = $.extend(self[k],v);
                } else {
                    self[k] = v;
                }
            })
        }
        this.save = function(callback) {
            var promise = $.ajax({
                url: typeof(this.url) == 'undefined' ? Vertebrate.get('url') : this.url,
                method: 'POST',
                data: {"model":this.get()},
                dataType: 'JSON',
                success: function(data, status, xhr) {
                    self.changedattrs = [];
                    if (typeof(callback) == 'function') callback.call(self,data, status, xhr);
                }
            });
            return promise;
        };
        this.fetch = function(callback) {
            var promise = $.ajax({
                url: typeof(this.url) == 'undefined' ? Vertebrate.get('url') : this.url,
                method: 'GET',
                dataType: 'JSON',
                data: {"model":this.get()},
                success: function(data, status, xhr) {
                    self.changedattrs = [];
                    self.attributes = $.extend(self.attributes, data[0]);
                    if (typeof(callback) == 'function') callback.call(self, data, status, xhr);
                }
            });
            return promise;
        };
        this.delete = function(callback) {
            var promise = $.ajax({
                url: typeof(this.url) == 'undefined' ? Vertebrate.get('url') : this.url,
                method: 'DELETE',
                data: {"model":this.get()},
                dataType: 'JSON',
                success: function(data, status, xhr) {
                    $([self]).trigger('vertebrate:deleted', [self, self.attributes, data, status, xhr]);
                    $(document).trigger('vertebrate:deleted', [self, self.attributes, data, status, xhr]);
                    if (typeof(callback) == 'function') callback.call(self,data, status, xhr);
                }
            });
            return promise;
        };
    };

    Vertebrate.Model.prototype = Object.create(Vertebrate.shared.fn);
    Vertebrate.Model.prototype.constructor = Vertebrate.Model;

    Vertebrate.Model.Extend = function(options) {
        var model = function(opts) {
            Vertebrate.Model.call(this, options);
            var self = this;
            var opts = typeof(opts) == 'undefined' ? false : opts;
            if (opts) {
                self.attributes = $.extend(self.attributes,opts);
            }
            return this;
        }
        model.prototype = Object.create(Vertebrate.Model.prototype);
        model.prototype.constructor = model;
        return model;
    };

    Vertebrate.Collection = function(options) {
        Vertebrate.shared.fn.call(this, options);
        this.model = false;
        this.models = [];
        this.added = [];
        this.removed = [];
        var self = this;
        $.each(options,function(k,v){
            if (typeof(v) == 'object') {
                $.extend(self[k],v);
            } else {
                self[k] = v;
            }
        })
        /**
        * this.save() - post all models to url (this.url or Vertebrate.get('url')
        *  if not defined)
        *
        * clears this.removed[]
        */
        this.save = function(callback) {
            var postdata = {
                "collection": {
                    "attributes": this.get(),
                    "models": JSON.stringify(this.models)
                }
            };
            var promise = $.ajax({
                url: typeof(this.url) == 'undefined' ? Vertebrate.get('url') : this.url,
                method: 'POST',
                data: postdata,
                dataType: 'JSON',
                success: function(data, status, xhr) {
                    self.removed = [];
                    if (typeof(callback) == 'function') callback.call(self, data, status, xhr);
                }
            });
            return promise;
        };
        /**
        * this.fetch() - get models from url (this.url or Vertebrate.get('url')
        *  if not defined)
        *
        * wipes existing models from collection
        */
        this.fetch = function(callback) {
            if (!self.model) {
                console.log('No model defined. Models must be defined before fetch call.');
                return false;
            }
            var promise = $.ajax({
                url: typeof(this.url) == 'undefined' ? Vertebrate.get('url') : this.url,
                method: 'GET',
                dataType: 'JSON',
                data: {"collection":this.get()},
                success: function(data, status, xhr) {
                    self.models = [];
                    $.each(data, function(i) {
                        self.models.push(new self.model(data[i]));
                    });
                    self.removed = [];
                    $([self]).trigger('vertebrate:fetched',[self.models]);
                    $(document).trigger('vertebrate:fetched',[self,self.models]);
                    if (typeof(callback) == 'function') callback.call(self,data, status, xhr);
                }
            });
            return promise;
        };
        /**
        * this.find() returns the first model which matches
        *
        * this.find( term ) returns collection.models[term]
        *
        * this.find( term, attr ) searches through the collection
        *  and returns the first model where model[attr] = term
        */
        this.find = function(term, attr) {
            var attr = (typeof(attr) == 'undefined') ? false : attr;
            var found = false;
            if (attr) {
                $.each(self.models, function(k, v) {
                    if (v.attributes[attr] == term) {
                        found = this;
                        return false;
                    }
                });
                if (!found) return false;
                return found;
            } else {
                return self.models[term];
            }
        };
        /**
        * this.findAll() returns an array of models from the collection
        *
        * this.findAll() can be a bit tricky depending on your JSON attributes
        *  from this.fetch()
        *
        * MySQL -> PHP returns integers as strings, so PHP with json_encode()
        *  means we get strings in this.attributes which can cause it to be
        *  tricky with .findAll()
        */
        this.findAll = function(term, attr) {
            var found = false;
            var founds = [];
            $.each(self.models, function(k, v) {
                if (v.attributes[attr] == term) {
                    found = true;
                    founds.push(this);
                }
            });
            if (!found) return false;
            return founds;
        };
        this.count = function() {
            return self.models.length;
        }
        this.add = function(model) {
            self.added.push(model);
            self.models.push(model);
            $([self]).trigger('vertebrate:added', [model, self.added]);
            $(document).trigger('vertebrate:added', [self, model, self.added]);
            return self.models.length;
        };
        this.remove = function(model) {
            var newmodels = self.models.filter(function(m) {
                return m != model;
            });
            self.models = newmodels;
            self.removed.push(model);
            $([self]).trigger('vertebrate:removed', [model, self.removed]);
            $(document).trigger('vertebrate:removed', [self, model, self.removed]);
            return self.models.length;
        };
        /**
        * returns max value of numerical
        */
        this.max = function(attr) {
            if (typeof(attr) == 'undefined') return false;
            var greatest = 0;
            $.each(self.models,function(k,v) {
                if (Number(v.attributes[attr]) > greatest) {
                    greatest = v.attributes[attr];
                }
            });
            return greatest;
        };
        /**
        * Returns the next value of an attribute .max() + 1
        */
        this.next = function( attr ) {
            var m = self.max( attr );
            return Number(m)+1;
        }
    };

    Vertebrate.Collection.prototype = Object.create(Vertebrate.shared.fn);
    Vertebrate.Collection.prototype.constructor = Vertebrate.Collection;

    Vertebrate.Collection.Extend = function(options) {
        function collection(opts) {
            Vertebrate.Collection.call(this, options);
            var self = this;
            if (typeof(opts) != 'undefined') {
                $.each(opts,function(k,v){
                    if (typeof(v) == 'object') {
                        $.extend(self[k],v);
                    } else {
                        self[k] = v;
                    }
                })
            }
        }
        collection.prototype = Object.create(Vertebrate.Collection.prototype);
        collection.prototype.constructor = collection;
        return collection;
    };

    return Vertebrate;

}($));
