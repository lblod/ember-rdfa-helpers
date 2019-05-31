# ember-rdfa-helpers

Provides helpers for adding RDFa in Ember apps.  The predicates are obtained from a meta-model defined on the rendered objects, the output is tackled by using helper components.

## Usage

Useage consists of two portions.  One one side, the correct metamodel needs to be configured on the model for which RDFa will be offered.  For rendering the contents, contextual components need to be injected into the templates.

### metamodel

The metamodel is subject to change.  As it stands, it is a simple key-value mapping for each of the possible properties.  A special `class` property is added to indicate the type of the resource.

It is assumed that each object contains a `uri` property which stores the URI of the specific resource.  An example for a foaf user could look like this.

    export default DS.Model.extend({
      uri: DS.attr(),
      firstName: DS.attr(),
      lastName: DS.attr(),
      profilePicture: DS.attr(),
      accounts: DS.hasMany('account'),

      rdfaBindings: {
        class: "http://schema.org/Person",
        firstName: "http://schema.org/givenName",
        lastName: "http://schema.org/familyName",
        profilePicture: "http://schema.org/image",
        accounts: "foaf:holdsAccount"
      }
    });


### component helpers

The component helpers have evolved between versions.  The library currently supports a modernized and an older syntactic version.

The new version is described by `with-rdfa-context`, `ctx.get` and `ctx.each`.  All other keys describe the new syntax.  Both syntaxes cannot be mixed.

In order to use the helpers, the first object's scope needs to be defined.  This is done by use of the `with-rdfa-resource` component.  Other components can be used by depending on the context object retrieved from this component.

#### `with-rdfa-context`

Sets up a new RDFa context.  This is equivalent to `with-rdfa-resource`.

#### `ctx.get`

Gets a property from the resource and applies the right bindings.

The following can be supplied to `ctx.get`:
- A block which receives a contextual object for fetching content and the property's value as its second argument.
- `link=true` creates a link to the related resource.

#### `ctx.each`

Allows looping over a relationship.

The following can be supplied to `ctx.each`:
- A block which receives a contextual object for fetching content and the property's value as its second argument.
- `link=true` creates a link to the related resource.

#### `with-rdfa-resource`

This is the main entrypoint for using RDFa in your templates.

    {{#with-rdfa-resource resource=person vocab="http://schema.org" as |ctx|}}
       ...
    {{/with-rdfa-resource}}

This component takes the following arguments:

  - _required_ `resource`: object for which the context will be set up.
  - _optional_ `vocab`: Vocabulary to be used by default (for future use).

It returns the following:
  - `ctx`: Context on which nested components are defined (see below).

#### `ctx.prop`

Renders an RDFa property with correct semantics.  If a block is given, no content is rendered and only the semantic property is set.

    {{#with-rdfa-resource resource=person as |ctx|}}
      {{ctx.prop p="name"}}
    {{/with-rdfa-resource}}

This component takes the following arguments:

  - _required_ `p`: JavaScript property of person which will be rendered.
  - _optional_ `property`: Override the property with a different semantic property.
  - _optional_ style: Style is set as an attribute on the tag.
  - _optional_ `block( value )`: If a block is given, it will be yielded rather than the contents.  The block receives the value of the property as an argument.

#### `ctx.each-as-link`

Renders a has-many relationship as a link with correct semantics and yields a block for each of its values.

    {{#with-rdfa-resource resource=person as |ctx|}}
      {{ctx.prop p="name"}}
      {{#ctx.each-as-link p="accounts" as |account actx|}}
        {{actx.prop "name"}}
      {{/ctx.each-as-link}}
    {{/with-rdfa-resource}}

  - _required_ `p`: JavaScript property of person which will be rendered.
  - _optional_ `property`: Override the property with a different semantic property.
  - _optional_ style: Style is set as an attribute on the tag.
  - _required_ `block( value, context )`: A block must be given.  It is yielded for each supplied entity of the relationship and receives the linked value, followed by a new context for that value.  This context can be used to further create nested elements.

#### `ctx.link`

Renders a link to a different resource.  Either because it links to a related object, or because the property contains a URL.
    {{#with-rdfa-resource resource=person as |ctx|}}
      {{#ctx.link p="profilePicture"}}my picture{{/ctx.link}}
    {{/with-rdfa-resource}}

  - _required_ `p`: JavaScript property of person which will be rendered
  - _optional_ `property`: Override the property with a different semantic property
  - _optional_ style: Style is set as an attribute on the tag.
  - _optional_ `block( value, context )`: If a block is given, it is called with the supplied value and a context for further scoping.  This only makes sense when used with a relationship.


#### `ctx.src`

Renders a relationship as an src property.  This can be used to render images with the correct tag.

    {{#with-rdfa-resource resource=person as |ctx|}}
      {{#ctx.src tagName='img' p='profilePicture'}}{{/ctx.src}}
    {{/with-rdfa-resource}}

  - _required_ `p`: JavaScript property of person which will be rendered
  - _optional_ `property`: Override the property with a different semantic property
  - _optional_ style: Style is set as an attribute on the tag.
  - _optional_ `block( value, context )`: If a block is given, it is rendered rather than injecting the contents of the property.

#### `ctx.linked-resource`

Sets up the context and scope for a resource in the relationship.  Yields the resource and a new context for using the related elements.

    {{#with-rdfa-resource resource=person as |ctx|}}
      {{ctx.prop p="name"}}
      {{#ctx.linked-resource p="idCard" as |card ictx|}}
        {{ictx.prop p="number"}}
      {{/ctx.linked-resource}}
    {{/with-rdfa-resource}}

#### `ctx.each-resource`

Sets up the context and scope for each resource in the relationship.  Yields the resource and a new context for using the related elements.

    {{#with-rdfa-resource resource=person as |ctx|}}
      {{ctx.prop p="name"}}
      {{#ctx.each-resource p="accounts" as |account actx|}}
        {{#actx.link p="accountPage"}}{{account.name}}{{/actx.link}} - {{actx.link p="serviceHomepage"}}
      {{/ctx.each-resource}}
    {{/with-rdfa-resource}}

#### `ctx.with-each-context`

Similar to `ctx.each-as-link`, but only returns a context for setting new properties.  This does not set any tags, hence the scope of the object isn't altered.  You probably want to use `ctx.each-resource` instead.

## Development

### Addon structure

The main entrypoint for the addon is the `with-rdfa-resource` component.  This sets up the context for specific RDFa components which generate the necessary output, and creates a new scope for a specific resource.

Components which render output in a supplied context can be found in the `rdfa` namespace.  These components all inherit standard behaviour from the `rdfa/standard` mixin.  When these components are invoked, they receive the `resource` property (by using the parent context), and the `p` attribute which resembles the ember model key which should be rendered.  Additionally, they may all receive a `property` attribute to override the RDFa property to be used.

If new forms of output should be supported, a new component should be made in this namespace and the yielded context should be updated in each of the related components.

### Installation

* `git clone <repository-url>` this repository
* `cd ember-rdfa-helpers`
* `npm install`
