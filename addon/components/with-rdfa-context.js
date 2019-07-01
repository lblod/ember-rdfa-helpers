import { computed } from '@ember/object';
import Component from '@ember/component';
import layout from '../templates/components/with-rdfa-context';

export default Component.extend({
  layout,
  scope: true,
  tagName: 'div',
  attributeBindings: ['vocab', 'resource', 'prefix', 'typeof', 'property'],
  resource: computed('model.uri', 'scope', function(){
    return this.scope && this.get('model.uri');
  }),
  typeof: computed('model.uri', function() {
    if( this.model && this.model.get('uri') )
      return this.model.get('rdfaBindings.class');
    else
      return null;
  })
});
