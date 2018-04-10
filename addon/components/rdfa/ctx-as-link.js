import Component from '@ember/component';
import layout from '../../templates/components/rdfa/ctx-as-link';
import { computed, get } from '@ember/object';
import StandardRdfaComponent from '../../mixins/rdfa/standard';

export default Component.extend(StandardRdfaComponent, {
  layout,
  attributeBindings: ["style", "rdfaProperty:property", "resourceUri:href", "typeof"],
  tagName: 'a',
  resourceUri: computed( "value", function() {
    const value = this.get("value");
    value && ( get( value, 'uri' ) || value );
  })
});
