import { Modifier } from 'ember-oo-modifiers';

const rdfaKeywords = [
  'resource',
  'src',
  'href',
  'about',
  'typeof',
  'property',
  'rel',
  'content',
  'datatype',
  'vocab',
  'prefix'
];

const RdfaModifier = Modifier.extend({
  didReceiveArguments( [rdfaAttributes] ) {
    for (let key of rdfaKeywords) {
      if (rdfaAttributes[key])
        this.element.setAttribute(key, rdfaAttributes[key]);
    }
  }
});

export default Modifier.modifier(RdfaModifier);
