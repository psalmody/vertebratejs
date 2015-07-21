# Vertebrate JS 0.3.0

A simple no-frills toolkit for managing data in models and
collections. Views can be created through something like
jQuery or React JS.

See my [post on writing in VertebrateJS](http://psalmody.net/2015/07/17/writing-vertebratejs-a-simpler-approach-to-models-and-collections/).

## Requirements

Just jQuery.

## Vertebrate object

The Vertebrate object has two methods, `.get()` and `.set()` for it's top-level settings.

Probably the most important setting would be `url` for the handler script. For example:

```JavaScript
Vertebrate.set('url','php/handler.php');
```

### Multiple Collections

When using multiple collections with different types of models
(where multiple server-side handlers might be needed) it is
important to set the url both at the collection and model
level. When setting model/collection type, add an url
property.

```JavaScript
var model = Vertebrate.Model.Extend({
    attributes: {
        ...
    },
    url: 'somescript.php'
})
```

## Models

### Model Types

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

### Creating New Models

New models may be created by:

```JavaScript
var joe = new player({
    //joe's personal attributes here
})
```

At the moment of model creation (not type definition), the attributes passed to the model will be extended with the default attributes from the model type.

In other words, when setting type, define default attributes like:

```JavaScript
var player = Vertebrate.Model.Extend({
    attributes: {
        "name":"",
        // some attributes here
    },
    //override or add any other properties or method in the model
})
```

When a new model is created, define it's attributes at creation time by:

```JavaScript
var joe = new player({
    "name":"joe"
})
```

This means `joe`'s individual methods or object properties may
be overriden only AFTER `joe`'s creation.

### Methods

Models have a number of methods including:

#### .set( attribute, value )

Set an attribute. Triggers `vertebrate.changeattr` and logs in `model.changedattrs` array.

#### .get( attribute )

> Returns value of specified attribute.

#### .has( attribute )

> Returns true if attribute is set, false if not.

This is useful to test if the model has an attribute which is set to `false`.

#### .hasChanged( attribute )

> Returns true if that attribute has been changed since last fetch.

#### .save( callback )

> Returns a jQuery deferred object.

Uses `$.ajax` POST request to the handler script.

Callback is run only on success. Clears `model.changedattrs`.

Sends entire model. (e.g. in PHP, `json_decode($_POST['data'])` would be an easy way to access the data)

#### .fetch( callback )

> Returns a jQuery deferred object.

Gets the data for this attribute via `$.ajax` GET request. Sends all the current model attributes as arguments.

Callback is run only on success. Clears `model.changedattrs`.

#### .delete( callback )

> Returns a jQuery deferred object.

Sends `$.ajax` DELETE request. Sends all current model attributes as arguments.

(e.g. in PHP, `$data = json_decode(file_get_contents("php://input"));` could be used to access data)

Callback is run only on success. Clears `model.changedattrs`.


## Collections

A collection is a group of models which allows handling of
multiple models, searching through them, and exposes them in ways
that would be easy to create views.

### Collection Types

 Define the type of collection before creating a collection.
 Specify which model type the collection will hold at this time.

```JavaScript
var team = Vertebrate.Collection.Extend({
    model: player,
    attributes: {
        // define any attributes for the collection
        // all attributes are sent to the server-side
        // handler when .fetch() or .save() are called
    }
});
```

### Creating New Collections

New collections may be created from collection types:

```
var dabears = new team({
    //override type definition here
})
```

### Difference from Model

When new models are created, the object passed is extended
with the model's attributes (`model.attribute`).

In contrast, when a collection is created, the object passed
is extended with the collection type.

### Methods

Collections also share the same `.set(), .get(), .has(), hasChanged()` methods with models.

Additionally, collections have the following methods.

#### .save( callback )

> Returns a jQuery deferred object.

Sends the entire set of models (`collection.models` array) along with any `collection.attributes` to the server via POST for saving.

Callback is run only on success. Clears `collection.removed` array.

#### .fetch( callback )

> Returns a jQuery deferred object.

Clears out `collection.models` and fills with new models obtained via GET request.

Creates new models based on `collection.model` as defined by
collection type definition.

Callback is run only on success. Clears `collection.removed` array.

#### .find( term [, attribute] )

> Returns a model.

If attribute is specified, iterates through all models until `model[attribute] == term` and returns the first model.

If only term is specified, returns collection.models[term].

#### .findAll( term, attribute )

> Returns an array of models.

Searches through `collection.models` and returns all models where
`model[term] == attribute`.

#### .count()

> Returns number of models in collection.

#### .add( model )

> Returns number of models in collection after addition.

Pushes a new model into the `collection.models` array.

#### .remove( model )

> Returns number of models after removal.

Searches `collection.models` for the model and removes from the models array. Stores removed models in `collection.removed` until `.fetch()` or `.save()` is called.

#### .max( attr )

> Returns maximum value of a numerical attribute.

Iterates through `collection.models` and returns maximum value of
specified attribute. Attempts (with `Number()`) to convert
strings to numbers first, but returns the attribute (so a string
if attribute is stored as string).

#### .next( attr )

> Returns `collection.max(attr)` + 1.

Always numerical type. Uses `collection.max(attr)` to find
maximum value for attribute, convert to number and add 1.

## Events

Vertebrate has several custom events that may be listened for the sake of changing the view.

### Collection Events

The following events are triggered on the collection and the
`$(document)`.

##### Binding to a Collection

It may be useful to bind to specific collections
when there are more than one in use. To bind to a specific
collection, make sure to explicitly wrap the collection in an
array or jQuery will not trigger the event as
`$(collection).length` will return 0. An example:

```JavaScript
$([collection]).on('vertebrate:added',function(event, model, collection.added) {
    //added a collection
});
```

>Note that the collection itself will not be passed to the
callback function as `this` will refer to the collection within
the callback.

#### vertebrate:added

Triggered when a `collection.add()` is called. Example:

```JavaScript
$(document).on('vertebrate:added',function(event, collection, model, collection.added) {
    //deal with add in view
})
```

#### vertebrate:removed

Triggered when a `collection.remove()` is called. Example:

```JavaScript
$(document).on('vertebrate:removed',function(event, collection, model, collection.removed) {
    //deal with the removal in view
});
```

#### vertebrate:fetched

Triggered when `collection.fetch()` is completed. Example:

```JavaScript
$(document).on('vertebrate:fetched',function(event, collection, collection.models) {
    //deal with fetch
})
```

### Model Events

#### vertebrate:changedattr

Triggered when a `model.set()` is changed. Example:

```JavaScript
$(document).on('vertebrate:changeattr',function(event, model, model.attributes, model.changedattrs) {
    //handle change in view
});
```

#### vertebrate:deleted

Triggered when `model.delete()` is called. Example:

```JavaScript
$(document).on('vertebrate:deleted',function(event, model, model.attributes, ajax_data, ajax_status, ajax_xhr_object) {
    //handle delete callback
});
```
