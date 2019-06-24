import Component from '@ember/component';
import layout from '../../templates/components/rdfa/rdfa-node';

export default Component.extend({
  layout,
  attributeBindings: ['property', 'resource', 'typeof', 'content', 'datatype', 'href', 'src']
});
