/* eslint-disable ember/no-classic-components, ember/no-classic-classes, ember/require-tagless-components */
// This component supports `tagName` as public api, so it might be better to keep it Classic component for now
import Component from '@ember/component';
import { computed } from '@ember/object';
import { and } from '@ember/object/computed';

export default Component.extend({
  scope: true,
  tagName: 'div',
  attributeBindings: ['vocab', 'resource', 'prefix', 'typeof', 'property'],
  resource: and('scope', 'model.uri'),
  typeof: computed('model.uri', function() {
    if( this.model && this.model.get('uri') )
      return this.model.get('rdfaBindings.class');
    else
      return null;
  })
});
