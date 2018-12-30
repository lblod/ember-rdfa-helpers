import Component from '@ember/component';
import layout from '../../templates/components/rdfa/ctx-each';
import StandardRdfaComponent from '../../mixins/rdfa/standard';

export default Component.extend( StandardRdfaComponent, {
  layout,
  tagName: '',
  link: false, // can be supplied to force an href
  positionalParams: ["prop"]
});
