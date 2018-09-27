import { observer } from '@ember/object';
import { get } from '@ember/object';
import { computed } from '@ember/object';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  maybeStyleAttr: computed( "style", function() {
    const style = this.get("style");
    return style && `style="${style}"`;
  }),

  oldP: undefined,

  pObserver: observer( 'resource', 'p', function() {
    const oldP = this.get('oldP');
    if( oldP )
      this.removeObserver( `resource.${oldP}`, this, "updateResourceValue" );

    const p = this.get('p');
    if ( p ) {
      this.addObserver( `resource.${p}`, this, "updateResourceValue" );
      this.set('oldP', p);
    }
    this.updateResourceValue();
  }).on('init'),

  /**
   * Called when either the resource, the property, or the value of
   * the property in the resource, is changed.
   */
  updateResourceValue: function(){
    const value = this.get(`resource.${this.get('p')}`);
    this.set('value', value);
  },

  /**
   * Yields the RDFa property as an attribute if there is one
   * available.
   */
  maybeRdfaPropertyAttr: computed( "rdfaProperty", function() {
    const rdfaProperty = this.get("rdfaProperty");
    return rdfaProperty && `property="${rdfaProperty}"`;
  }),

  /**
   * Returns the used RDFa property.  Either by consuming the
   * supplied property argument, or by finding it from the
   * resource's `p` key.
   */
  rdfaProperty: computed( "property", "p", "resource", function() {
    const property = this.get("property");
    const p = this.get("p");
    const resource = this.get("resource");
    return property || get(resource, `rdfaBindings.${p}`);
  }),

  /**
   * Returns the semantic type of the value if it has one.
   */
  typeof: computed( "value.uri", function() {
    const value = this.get("value");
    if( value && get(value, "uri") )
      return get(value, "rdfaBindings.class");
    else
      return null;
  })
});
