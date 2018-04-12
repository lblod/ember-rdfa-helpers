import Component from '@ember/component';
import layout from '../../templates/components/rdfa/ctx-linked-resource';
import StandardRdfaComponent from '../../mixins/rdfa/standard';

export default Component.extend(StandardRdfaComponent,{
  layout,
  tagName: ''
});
