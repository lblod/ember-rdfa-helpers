import Component from '@ember/component';
import layout from '../../templates/components/rdfa/ctx-src';
import StandardRdfaComponent from '../../mixins/rdfa/standard';
import { computed } from '@ember/object';

export default Component.extend(StandardRdfaComponent,{
  layout,
  attributeBindings: ["style", "rdfaProperty:property", "maybeSrcAttr:src"],
  maybeSrcAttr: computed( "value", function() {
    const value = this.get("value");
    return value && `value="${value}"`;
  })

});
