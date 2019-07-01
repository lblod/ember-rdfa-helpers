import { oneWay } from '@ember/object/computed';
import { computed } from '@ember/object';
import { inject } from '@ember/service';
import Component from '@ember/component';
import layout from '../../templates/components/rdfa/link-to';
import { hrefTo } from 'ember-href-to/helpers/href-to';

export default Component.extend({
  layout,
  tagName: '',
  router: inject(),

  useUri: false,

  typeof: oneWay("value.rdfaBindings.class"),
  uri: oneWay("value.uri"),
  url: computed('link-to', 'value', 'href-to', function() {
    if (this.get('href-to'))
      return this.get('href-to');
    else
      return hrefTo(this, [this.get('link-to'), this.value.get('id')]);
  }),

  actions: {
    transition() {
      this.router.transitionTo(this.url);
    }
  }
});
