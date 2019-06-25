import { on } from '@ember/object/evented';
import { computed, observer } from '@ember/object';
import Mixin from '@ember/object/mixin';

const defaultContentFns = function(datatype) {
  if (datatype == 'xsd:dateTime' || datatype == 'http://www.w3.org/2001/XMLSchema#dateTime')
    return (value) => value && value.toISOString && value.toISOString();
  else if (datatype == 'xsd:date' || datatype == 'http://www.w3.org/2001/XMLSchema#date')
    return (value) => value && value.toISOString && value.toISOString().substring(0, 10);
  else
    return null;
};

export default Mixin.create({

  oldProp: undefined,

  propObserver: on( 'init', observer( 'model', 'prop', function() {
    const oldProp = this.get('oldProp');
    if( oldProp )
      this.removeObserver( `model.${oldProp}`, this, "updatePropertyValue" );

    const prop = this.get('prop');
    if ( prop ) {
      this.addObserver( `model.${prop}`, this, "updatePropertyValue" );
      this.set('oldProp', prop);
    }
    this.updatePropertyValue();
  })),

  /**
   * Called when either the model, the property, or the value of
   * the property in the model, is changed.
   */
  updatePropertyValue: function(){
    const value = this.get(`model.${this.get('prop')}`);
    this.set('value', value);
  },

  /**
   * Normalizes a model's rdfaBindings such that each property key
   * maps to an object with attributes 'property', 'datatype', 'content'
  */
  normalizedRdfaBindings: computed( "model.rdfaBindings", function() {
    const normalizedRdfaBindings = {};

    const rdfaBindings = this.model && this.model.get('rdfaBindings');
    if (rdfaBindings) {
      Object.keys(rdfaBindings).filter(prop => prop != 'class').forEach(function(prop) {
        const binding = rdfaBindings[prop];
        if (typeof(binding) == 'string') {
          normalizedRdfaBindings[prop] = { property: binding };
        } else {
          normalizedRdfaBindings[prop] = binding;
        }

        if (!normalizedRdfaBindings[prop].content) {
          const datatype = normalizedRdfaBindings[prop].datatype;
          normalizedRdfaBindings[prop].content = defaultContentFns(datatype);
        }
      });
    }

    return normalizedRdfaBindings;
  }),

  /**
   * Returns the used RDFa property.  Either by consuming the
   * supplied property argument, or by finding it from the
   * model's `prop` key.
   */
  rdfaProperty: computed( "property", "prop", "normalizedRdfaBindings", function() {
    return this.property || `${this.normalizedRdfaBindings[this.prop].property}`;
  }),

  /**
   * Returns the semantic type of the value if it has one.
   */
  typeof: computed( "value.uri", function() {
    if( this.value && this.value.get('uri') )
      return this.value.get('rdfaBindings.class');
    else
      return null;
  }),

  /**
   * Returns the datatype of the value. Either by consuming the
   * supplied datatype argument, or by finding it from the
   * model's `prop` key.
   */
  rdfaDatatype: computed( "datatype", "prop", "normalizedRdfaBindings", function() {
    return this.datatype || this.normalizedRdfaBindings[this.prop].datatype;
  }),

  /**
   * Returns the content of a value my applying the 'content' function if provided
   */
  rdfaContent: computed( "value", "prop", "normalizedRdfaBindings", function() {
    return this.normalizedRdfaBindings[this.prop].content && this.normalizedRdfaBindings[this.prop].content(this.value);
  })
});
