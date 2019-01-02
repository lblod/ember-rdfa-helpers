import { get } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import { computed } from '@ember/object';
import Component from '@ember/component';
import layout from '../templates/components/with-rdfa-context';

export default Component.extend({
  layout,
  // vocab :: specified on current element when set
  scope: true,
  tagName: "div",
  attributeBindings: ["vocab", "maybeResource:resource", "prefix", "typeof", "property"],
  positionalParams: ["model"],
  maybeVocab: computed( "vocab", function() {
    const vocab = this.get('vocab');
    return vocab && `vocab="${vocab}"`;
  }),
  maybeResource: computed( "model.uri", "scope", function(){
    const uri = this.get('model.uri');
    const scope = this.scope;
    return scope && uri;
  }),
  typeof: computed( "model.uri", function() {
    const model = this.get("model");
    if( model && get(model, "uri") )
      return get(model, "rdfaBindings.class");
    else
      return null;
  })
});
