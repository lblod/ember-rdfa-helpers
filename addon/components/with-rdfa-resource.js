import Component from '@ember/component';
import layout from '../templates/components/with-rdfa-resource';
import { oneWay } from '@ember/object/computed';
import { computed, get } from '@ember/object';

export default Component.extend({
  layout,
  // vocab :: specified on current element when set
  tagName: "span",
  attributeBindings: ["vocab", "maybeResource:resource", "typeof"],
  maybeVocab: computed( "vocab", function() {
    const vocab = this.get('vocab');
    return vocab && `vocab="${vocab}"`;
  }),
  maybeResource: oneWay("resource.uri"),
  typeof: computed( "value.uri", function() {
    const value = this.get("value");
    if( value && get(value, "uri") )
      return get(value, "rdfaBindings.class");
    else
      return null;
  })
});
