import { oneWay } from '@ember/object/computed';
import { computed } from '@ember/object';
import { inject } from '@ember/service';
import Component from '@ember/component';
import layout from '../../templates/components/rdfa/link-to';

export default Component.extend({
  layout,
  tagName: '',
  router: inject(),

  positionalParams: ["link-to", "value"],

  typeof: oneWay("value.rdfaBindings.class"),
  uri: oneWay("value.uri"),

  transitionUrl: computed('router', 'link-to', 'value.id', function() {
    const id = this.get('value.id');
    try {
      return this.router.urlFor( this.get('link-to'), id );
    } catch(e) {
      return null;
    }
  }),
  actions: {
    transition(route, argument) {
      this.router.transitionTo(route, argument);
    }
  }
});
