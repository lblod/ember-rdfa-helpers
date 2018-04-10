import Component from '@ember/component';
import layout from '../../templates/components/rdfa/ctx-each-as-link';
import StandardRdfaComponent from '../../mixins/rdfa/standard';

export default Component.extend(StandardRdfaComponent,{
  layout,
  tagName: ''
});
