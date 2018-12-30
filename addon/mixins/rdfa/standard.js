import { observer } from '@ember/object';
import { getProperties } from '@ember/object';
import { get } from '@ember/object';
import { computed } from '@ember/object';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  maybeStyleAttr: computed( "style", function() {
    const style = this.get("style");
    return style && `style="${style}"`;
  }),

  oldProp: undefined,

  propObserver: observer( 'model', 'prop', function() {
    const oldProp = this.get('oldProp');
    if( oldProp )
      this.removeObserver( `model.${oldProp}`, this, "updatePropertyValue" );

    const prop = this.get('prop');
    if ( prop ) {
      this.addObserver( `model.${prop}`, this, "updatePropertyValue" );
      this.set('oldProp', prop);
    }
    this.updatePropertyValue();
  }).on('init'),

  /**
   * Called when either the model, the property, or the value of
   * the property in the model, is changed.
   */
  updatePropertyValue: function(){
    const value = this.get(`model.${this.get('prop')}`);
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
   * model's `prop` key.
   */
  rdfaProperty: computed( "property", "prop", "model", function() {
    const property = this.get("property");
    const prop = this.get("prop");
    const model = this.get("model");
    return property || get(model, `rdfaBindings.${prop}`);
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
