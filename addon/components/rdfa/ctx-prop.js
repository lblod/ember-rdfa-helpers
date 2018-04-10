import Component from '@ember/component';
import layout from '../../templates/components/rdfa/ctx-prop';
import StandardRdfaComponent from '../../mixins/rdfa/standard';

export default Component.extend(StandardRdfaComponent, {
  layout,
  attributeBindings: ["style", "rdfaProperty:property"]
});
