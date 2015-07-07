# Vertebrate JS

A simple no-frills toolkit for managing data in models and
collections. Views can be created through something like
jQuery or React JS.

## Requirements

Just jQuery.

## Vertebrate object

The Vertebrate object has two methods, `.get()` and `.set()` for it's top-level settings.

Probably the most important setting would be `url` for the handler script. For example:

```JavaScript
Vertebrate.set('url','php/handler.php');
```

## Models

Model types are defined with a built-in extend method like:

```JavaScript
var player = Vertebrate.Model.Extend({
    attributes: {
        id: 0,
        first_name: '',
        mi: '',
        last_name: '',
        age: 0,
        address: '',
        city: '',
        state: '',
        zip: '',
        email: ''
    }
});
```

Then new models may be initialized like

```JavaScript
var joe = new player({
    //joe's personal attributes here
})
```

#### Methods

Models have a number of methods including:

###### .set( attribute, value )

Set an attribute. Triggers `vertebrate.changeattr` and logs in `model.changedattrs` array.

###### .get( attribute )

Returns value of specified attribute.

###### .has( attribute )

Returns true if attribute is set, false if not. This is useful to test if the model has an attribute which is set to `false`.

###### .hasChanged( attribute )

Returns true if that attribute has been changed since last fetch.

###### .save( callback )

Uses `$.ajax` POST request to the handler script. Returns a jQuery deferred object. Callback is run only on success. Clears `model.changedattrs`.

Sends entire model. (e.g. in PHP, `json_decode($_POST['data'])` would be an easy way to access the data)

###### .fetch( callback )

Gets the data for this attribute via `$.ajax` GET request. Sends all the current model attributes as arguments.

Returns a jQuery deferred object. Callback is run only on success. Clears `model.changedattrs`.

###### .delete( callback )

Sends `$.ajax` DELETE request. Sends all current model attributes as arguments.

(e.g. in PHP, `$data = json_decode(file_get_contents("php://input"));` could be used to access data)

Returns a jQuery deferred object. Callback is run only on success. Clears `model.changedattrs`.


## Collections

A collection is a group of models. Define the type of model on initiation.

```JavaScript
var team = Vertebrate.Collection.Extend({
    model: player,
    attributes: {
        //define any attributes for the collection
        //all attributes are sent to the handler script
        //when .fetch() or .save() are called
    }
});
```

#### Methods

Collections also share the same `.set(), .get(), .has(), hasChanged()` methods with models.

Additionally, collections have the following methods.

###### .save( callback )

Sends the entire set of models (`collection.models` array) along with any `collection.attributes` to the server via POST for saving.

Returns a jQuery deferred object. Callback is run only on success. Clears `collection.removed` array.

###### .fetch( callback )

Clears out `collection.models` and fills with new models obtained via GET request.

Returns a jQuery deferred object. Callback is run only on success. Clears `collection.removed` array.

###### .find( term [, attribute] )

Returns the model by array key from `collection.models[term]`.

If attribute is specified, iterates through all models until `model[attribute] == term` and returns that model.

###### .add( model )

Pushes a new model into the `collection.models` array.

###### .remove( model )

Searches `collection.models` for the model and removes from the models array. Stores removed models in `collection.removed` until `.fetch()` or `.save()` is called.

## Events

Vertebrate has several custom events that may be listened for the sake of changing the view.

#### vertebrate.removed

Triggered when a `collection.remove()` is called. Example:

```JavaScript
$('body').on('vertebrate.removed',function(collection, collection.removed, collection.models) {
    //deal with the removal in view
});
```

#### vertebrate.changedattr

Triggered when a `model.set()` is changed. Example:

```JavaScript
$('body').on('vertebrate.changeattr',function(model,model.attributes,model.changedattrs) {
    //handle change in view
});
```

#### vertebrate.deleted

Triggered when `model.delete()` is called. Example:

```JavaScript
$('body').on('vertebrate.deleted',function(model,model.attributes,ajax_data,ajax_status,ajax_xhr_object) {
    //handle delete callback
});
```
