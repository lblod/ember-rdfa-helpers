# ember-rdfa-helpers

Provides helpers for adding RDFa in Ember apps. The predicates are obtained from a meta-model defined on the rendered objects, the output is tackled by using helper components.

## Compatibility

* Ember.js v3.24 or above
* Ember CLI v3.24 or above
* Node.js v12 or above

## Usage

Usage consists of two portions. On one side, the correct metamodel needs to be configured on the model class for which RDFa will be offered. For rendering the contents, contextual components need to be injected into the templates.

### Metamodel

The metamodel is subject to change. As it stands, it is a simple key-value mapping for each of the possible properties. A special `class` property is added to indicate the type of the resource.

It is assumed that each model also contains a `uri` property which stores the URI of the specific resource. An example for a foaf user could look like this:

```javascript
export default class PersonModel extends Model {
  @attr uri;
  @attr firstName;
  @attr lastName;
  @attr profilePicture;
  @belongsTo('project') currentProject;
  @hasMany('account')   accounts;

  rdfaBindings = {
    class:          'http://schema.org/Person',
    firstName:      'http://schema.org/givenName',
    lastName:       'http://schema.org/familyName',
    profilePicture: 'http://schema.org/image',
    currentProject: 'foaf:currentProject',
    accounts:       'foaf:holdsAccount'
  };
}
```

For properties that must be annotated with a datatype, an object containing a `property` and `datatype` key can be passed in the mapping. The content of properties defined with datatype `xsd:date` or `xsd:dateTime` will be automatically formatted according to the ISO8601 standard.

E.g.

```javascript
export default class SomethingModel extends Model {
  @attr('string') uri;
  @attr('string') title;
  @attr('date')   created;

  rdfaBindings = {
    class:   'http://schema.org/Something',
    title:   'dc:title',
    created: {
      property: 'dc:created',
      datatype: 'xsd:dateTime'
    }
  };
};
```

### Component helpers (>= v0.2.0)

The component helpers have evolved between versions. The library currently supports a modernized and an older syntactic version.

The new version is described by:
- `with-rdfa-context` with nested components `ctx.get`, `ctx.each.get` and `ctx.img`.
- `rdfa/link-to`

Both syntaxes cannot be mixed.

The dummy application of this addon contains plently of examples. To see it in action:

    git clone <repository-url>
    cd ember-rdfa-helpers
    ember serve

#### `with-rdfa-context`

Sets up a new RDFa context. This is equivalent to the old `with-rdfa-resource`.

This component takes the following arguments:
- _required_ `model`: object for which the context will be set up.
- _optional_ `vocab`: Vocabulary to be used by default (for future use).
- _optional_ `tagName`: tagname used for the wrapping component. Defaults to `div`.

It returns the following:
- `ctx`: Context on which nested components are defined (see below).

Example:

```handlebars
<WithRdfaContext @model={{person}} @vocab="http://schema.org" as |ctx|>
  ...
</WithRdfaContext>
```

The following paragraphs explain the different ways of constructing RDFa data using the received context `ctx`. We made the distinction between `get` and other accessors that look like common HTML-tags such as `div` and `span`. `get` doesn't create an HTML element, but trusts the user to use the `{{rdfa}}` modifier on the correct tag in the body to add the RDFa attributes, while the other accessors do create the elements with attributes automatically. **Keep in mind that modifiers do not run during Ember FastBoot, so using the `{{rdfa}}` modifier does not work. Use the other accessors like `div` and `span` to create elements with RDFa properties during FastBoot.** This does in fact create more nested components in Ember and could possibly negatively impact performance, compared to using the modifier.

#### `ctx.get` and others

Gets a property/relation from the context and applies the right bindings.

The following can be supplied to `ctx.get`:
- _required_ `prop`: name of the JavaScript property of context which will be rendered.
- _optional_ `property`: override the property with a different semantic property.
- _optional_ `link=true`: creates a link to the related resource. The related resource URI will be set as `href` attribute. This should be used for URLs outside your application. Otherwise, use the `link-to` or `href-to` option.
- _optional_ `link-to`: creates a link to the related resource using an Ember Route path. The related resource URI will be set as `resource` attribute, while the passed route path, with the related resource id as argument, will be set as `href` attribute.
- _optional_ `href-to`: creates a link to the related resource using an Ember Route URL. The related resource URI will be set as `resource` attribute, while the passed route URL will be set as `href` attribute. Use the `{{href-to}}` helper of [ember-href-to](https://github.com/intercom/ember-href-to) to construct the URL.
- _optional_ `useUri=false`: only applicable if `link-to` or `href-to` are set. Sets the resource URI as `href` instead of `resource` attribute on the created link.
- _optional_ `overrideUri=false`: use this option to replace the URI of the resource with the `href` supplied via `link-to` of `href-to`. Use this to refer to a part of the web application as a resource. Most likely used with an overriden `property` as well.

The component supports a block format as well as a non-block format. Only in case `link-to` is used, a block must be passed.

##### Non-block format

The non-block format doesn't allow any customization of the rendered output (e.g. tag name, CSS classes).

Examples:

```handlebars
<WithRdfaContext @model={{person}} as |ctx|>
  <ctx.get @prop="name" />
</WithRdfaContext>

<WithRdfaContext @model={{account}} as |ctx|>
  <ctx.get @prop="accountServiceHomepage" @link={{true}} />
</WithRdfaContext>
```

Alternatively, use one of the supported subcomponents to create an element other than a simple span. Supported subcomponents are `span`, `div`, `link`, `a` and `p`.

Example:

```handlebars
<WithRdfaContext @model={{person}} as |ctx|>
  <ctx.div @prop="name" />
</WithRdfaContext>
```

This example will do exactly as above, but by creating a `div` instead of an implicit `span`. Note that when creating a link with `@link={{true}}`, you should be carefull to use `ctx.a` to explicitely create a link or `ctx.get` to implicitely create a link. Other elements won't create a proper link.


##### Block format

**`ctx.get`**

The block format using `ctx.get` receives the following params:
- `elements`: RDFa attributes to apply on a node using the `{{rdfa}}` modifier
- `value`: value of the property
- `ctx`: new context to create nested annotations (only passed in case the value is a resource, not a literal)

The block format with `get` offers more flexibility in terms of layout and rendering, but the user is responsible to apply the RDFa attributes it receives as a param on a node in the block using the `{{rdfa}}` modifier. If the `elements` param is not applied on a node, the content will not be annotated.

Examples:

```handlebars
<WithRdfaContext @model={{person}} as |ctx|>
  <ctx.get @prop="name" as |elements value|>
    <div {{rdfa elements}} class="some-custom-css-class">{{value}}</div>
  </ctx.get>
</WithRdfaContext>

<WithRdfaContext @model={{person}} as |ctx|>
  <ctx.get @prop="birthDate" as |elements value|>
    <span {{rdfa elements}}>{{format-date value}}</span>
  </ctx.get>
</WithRdfaContext>

<WithRdfaContext @model={{person}} as |ctx|>
  <ctx.get @prop="homepage" @link={{true}} as |elements|>
    <a {{rdfa elements}}>my homepage</a>
  </ctx.get>
</WithRdfaContext>

<WithRdfaContext @model={{person}} as |ctx|>
  <ctx.get @prop="currentProject" as |elements value projectCtx|>
    <div {{rdfa elements}}>
      <projectCtx.get @prop="name" />
      <projectCtx.get @prop="budget" as |elements value|>
        <span {{rdfa elements}}>{{format-amount budget}}</span>
      </projectCtx.get>
    </div>
  </ctx.get>
</WithRdfaContext>

<WithRdfaContext @model={{person}} as |ctx|>
  <!-- Link to the project detail pages on /projects/:id -->
  <ctx.get @prop="currentProject" @link-to="projects.show" as |value|>
    {{value.name}}
  </ctx.get>
</WithRdfaContext>

<WithRdfaContext @model={{person}} as |ctx|>
  <!-- Link to the project detail pages on /persons/:person_id/projects/:project_code -->
  <ctx.get @prop="currentProject" @href-to=(href-to "persons.person.projects.show" person.id person.currentProject.code) as |value|>
    {{value.name}}
  </ctx.get>
</WithRdfaContext>
```

Warning: Even though the `elements` property can be renamed by the user, when using `ctx.get` in its angle brackets form, don't replace it by `attrs`.
This keyword is already used by the core code of components in Ember Octane.

**`ctx.span`, `ctx.div`, `ctx.p`, `ctx.li`, `ctx.a`, `ctx.link`, ...**

The block format using these subcomponents receives the following params:
- `value`: value of the property
- `ctx`: new context to create nested annotations (only passed in case the value is a resource, not a literal)

*Note the missing `elements` parameter from `ctx.get`. This is because an HTML element is spawned with the correct RDFa properties attached and is does not make sense to place those properties more than once in the HTML.*

The mechanism for all supported subcomponents is similar to `get`. The following example shows two equivalent blocks, one using `ctx.get` and one using `ctx.div` to demonstrate their use.

```handlebars
<WithRdfaContext @model={{person}} as |ctx|>
  <ctx.get @prop="name" as |elements value|>
    <div {{rdfa elements}} class="some-custom-css-class">The value is: {{value}}</div>
  </ctx.get>
</WithRdfaContext>

<WithRdfaContext @model={{person}} as |ctx|>
  <ctx.div @prop="name" class="some-custom-css-class" as |value|>
    The value is: {{value}}
  </ctx.div>
</WithRdfaContext>
```

#### `ctx.each.get`

Allows looping over a relationship. The interface is very similar to `ctx.get`.

The following can be supplied to `ctx.each.get`:
- _required_ `prop`: name of the JavaScript property of context which will be rendered.
- _optional_ `property`: override the property with a different semantic property.
- _optional_ `link=true`: creates a link to the related resource. The related resource URI will be set as `href` attribute. This should be used for URLs outside your application. Otherwise, use the `link-to` or `href-to` option.
- _optional_ `link-to`: creates a link to the related resource using an Ember Route path. The related resource URI will be set as `resource` attribute, while the passed route path, with the related resource id as argument, will be set as `href` attribute.
- _optional_ `href-to`: creates a link to the related resource using an Ember Route URL. The related resource URI will be set as `resource` attribute, while the passed route URL will be set as `href` attribute. Use the `{{href-to}}` helper of [ember-href-to](https://github.com/intercom/ember-href-to) to construct the URL.
- _optional_ `useUri=false`: only applicable if `link-to` or `href-to` are set. Sets the resource URI as `href` instead of `resource` attribute on the created link.
- _optional_ `overrideUri=false`: use this option to replace the URI of the resource with the `href` supplied via `link-to` of `href-to`. Use this to refer to a part of the web application as a resource. Most likely used with an overriden `property` as well.

The component supports a block format as well as a non-block format.

##### Non-block format

The non-block format places a `span` in the HTML with the proper RDFa properties attached, containing the value of the property.

Example:

```handlebars
<WithRdfaContext @model={{person}} as |ctx|>
  <ctx.each.get @prop="nicknames" />
</WithRdfaContext>

<WithRdfaContext @model={{person}} as |ctx|>
  <ctx.each.get @prop="homepages" @link={{true}} />
</WithRdfaContext>
```

##### Block format

**`ctx.each.get`**

The block format using `ctx.each.get` receives the following params:
- `elements`: RDFa attributes to apply on a node using the `{{rdfa}}` modifier
- `value`: value of the property
- `ctx`: new context to create nested annotations (only passed in case the value is a resource, not a literal)
- `index`: index of the value in the array

The block format using `ctx.each.get` offers more flexibility in terms of layout and rendering, but the user is responsible to apply the RDFa attributes it receives as a param on a node in the block using the `{{rdfa}}` modifier. If the `elements` param is not applied on a node, the content will not be annotated.

Examples:

```handlebars
<WithRdfaContext @model={{project}} @tagName="ul" as |ctx|>
  <ctx.each.get @prop="funders" @link={{true}} as |elements funder|>
    <li><a {{rdfa elements}}>{{funder.firstName}} {{funder.lastName}}</a></li>
  </ctx.each.get>
</WithRdfaContext>

<WithRdfaContext @model={{person}} @tagName="ul" as |ctx|>
  <ul>
    <ctx.each.get @prop="accounts" as |elements account accountCtx|>
      <li {{rdfa elements}}>
        <accountCtx.get @prop="accountServiceHomepage" @link={{true}} />
      </li>
    </ctx.each.get>
  </ul>
</WithRdfaContext>
```

**`ctx.each.span`, `ctx.each.div`, `ctx.each.p`, `ctx.each.link`, `ctx.each.a`, `ctx.each.li`, `ctx.each.lia`, ...**

The block format using these subcomponents receives the following params:
- `value`: value of the property
- `ctx`: new context to create nested annotations (only passed in case the value is a resource, not a literal)
- `index`: index of the value in the array

*Note the missing `elements` parameter from `ctx.get`. This is because an HTML element is spawned with the correct RDFa properties attached and is does not make sense to place those properties more than once in the HTML.*

The mechanism for all supported subcomponents is similar to `get`. The following example shows two equivalent blocks, one using `ctx.each.get` and one using `ctx.each.div` to demonstrate their use.

```handlebars
<WithRdfaContext @model={{project}} @tagName="ul" as |ctx|>
  <ctx.each.get @prop="funders" @link={{true}} as |elements funder|>
    <li><a {{rdfa elements}}>{{funder.firstName}} {{funder.lastName}}</a></li>
  </ctx.each.get>
</WithRdfaContext>

<WithRdfaContext @model={{project}} @tagName="ul" as |ctx|>
  <ctx.each.lia @prop="funders" @link={{true}} as |funder|>
    {{funder.firstName}} {{funder.lastName}}
  </ctx.each.lia>
</WithRdfaContext>
```

#### `ctx.img`

Displays a property as an image and applies the right bindings. In case the value is a resource, the resource URI will be set as `src` attribute. Otherwise the value itself will be set as `src`.

The following can be supplied to `ctx.img`:
- _required_ `prop`: name of the JavaScript property of context which will be rendered.
- _optional_ `property`: override the property with a different semantic property.

The following arguments can be passed and will be applied on the `img` tag: `altName`, `width`, `height`, `srcset`, `sizes`

Example:

```handlebars
<WithRdfaContext @model={{model.person}} as |ctx|>
  <ctx.img @prop="profilePicture" alt="Profile pic" width=100 height=100 />
</WithRdfaContext>
```

### `rdfa/link-to`

Creates an annotated link in the app.

The component takes the following arguments:
- _required_ `value`: resource to link to
- _optional_ `link-to`: creates a link to the value using an Ember Route path. The value URI will be set as `resource` attribute, while the passed route path, with the value id as argument, will be set as `href` attribute.
- _optional_ `href-to`: creates a link to the value using an Ember Route URL. The value URI will be set as `resource` attribute, while the passed route URL will be set as `href` attribute. Use the `{{href-to}}` helper of [ember-href-to](https://github.com/intercom/ember-href-to) to construct the URL.
- _optional_ `useUri=false`: Sets the value URI as `href` instead of `resource` attribute on the created link.
- _optional_ `overrideUri=false`: use this option to replace the URI of the resource with the `href` supplied via `link-to` of `href-to`. Use this to refer to a part of the web application as a resource. Most likely used with an overriden `property` as well.

Example:

```handlebars
<ul>
  {{#each model.projects as |project|}}
    <li>
      <Rdfa::LinkTo @href-to=(href-to "projects.show" project.code) @value=project}}
        {{project.name}}
      </Rdfa::LinkTo>
    </li>
  {{/each}}
</ul>
```

### Component helpers (v0.1.x)

In order to use the helpers, the first object's scope needs to be defined. This is done by use of the `with-rdfa-resource` component. Other components can be used by depending on the context object retrieved from this component.

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

Renders an RDFa property with correct semantics. If a block is given, no content is rendered and only the semantic property is set.

    {{#with-rdfa-resource resource=person as |ctx|}}
      {{ctx.prop p="name"}}
    {{/with-rdfa-resource}}

This component takes the following arguments:
- _required_ `p`: JavaScript property of person which will be rendered.
- _optional_ `property`: Override the property with a different semantic property.
- _optional_ style: Style is set as an attribute on the tag.
- _optional_ `block( value )`: If a block is given, it will be yielded rather than the contents. The block receives the value of the property as an argument.

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
- _required_ `block( value, context )`: A block must be given. It is yielded for each supplied entity of the relationship and receives the linked value, followed by a new context for that value. This context can be used to further create nested elements.

#### `ctx.link`

Renders a link to a different resource. Either because it links to a related object, or because the property contains a URL.

    {{#with-rdfa-resource resource=person as |ctx|}}
      {{#ctx.link p="profilePicture"}}my picture{{/ctx.link}}
    {{/with-rdfa-resource}}

- _required_ `p`: JavaScript property of person which will be rendered
- _optional_ `property`: Override the property with a different semantic property
- _optional_ style: Style is set as an attribute on the tag.
- _optional_ `block( value, context )`: If a block is given, it is called with the supplied value and a context for further scoping. This only makes sense when used with a relationship.


#### `ctx.src`

Renders a relationship as an src property. This can be used to render images with the correct tag.

    {{#with-rdfa-resource resource=person as |ctx|}}
      {{#ctx.src tagName='img' p='profilePicture'}}{{/ctx.src}}
    {{/with-rdfa-resource}}

- _required_ `p`: JavaScript property of person which will be rendered
- _optional_ `property`: Override the property with a different semantic property
- _optional_ style: Style is set as an attribute on the tag.
- _optional_ `block( value, context )`: If a block is given, it is rendered rather than injecting the contents of the property.

#### `ctx.linked-resource`

Sets up the context and scope for a resource in the relationship. Yields the resource and a new context for using the related elements.

    {{#with-rdfa-resource resource=person as |ctx|}}
      {{ctx.prop p="name"}}
      {{#ctx.linked-resource p="idCard" as |card ictx|}}
        {{ictx.prop p="number"}}
      {{/ctx.linked-resource}}
    {{/with-rdfa-resource}}

#### `ctx.each-resource`

Sets up the context and scope for each resource in the relationship. Yields the resource and a new context for using the related elements.

    {{#with-rdfa-resource resource=person as |ctx|}}
      {{ctx.prop p="name"}}
      {{#ctx.each-resource p="accounts" as |account actx|}}
        {{#actx.link p="accountPage"}}{{account.name}}{{/actx.link}} - {{actx.link p="serviceHomepage"}}
      {{/ctx.each-resource}}
    {{/with-rdfa-resource}}

#### `ctx.with-each-context`

Similar to `ctx.each-as-link`, but only returns a context for setting new properties. This does not set any tags, hence the scope of the object isn't altered. You probably want to use `ctx.each-resource` instead.

## Development

### Addon structure

The main entrypoint for the addon is the `with-rdfa-context` component. This sets up the context for specific RDFa components which generate the necessary output, and creates a new scope for a specific resource.

Components which render output in a supplied context can be found in the `rdfa` namespace. These components all inherit standard behaviour from the `rdfa/standard` mixin. When these components are invoked, they receive the `model` property (by using the parent context), and the `prop` attribute which resembles the Ember model key which should be rendered. Additionally, they may all receive a `property` attribute to override the RDFa property to be used.

If new forms of output should be supported, a new component should be made in this namespace and the yielded context should be updated in each of the related components.

### Installation

* `git clone <repository-url>` this repository
* `cd ember-rdfa-helpers`
* `npm install`

### Wishlist

* Support for inverse relations as RDFa
* Support for computed/composable values (e.g. sorted hasMany relation)

