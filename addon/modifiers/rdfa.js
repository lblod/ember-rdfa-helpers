import Modifier from 'ember-modifier';

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

export default class RdfaModifier extends Modifier {

  constructor(){
    super(...arguments)
  }

  get rdfaAttributes(){
    return this.args.positional[0]
  }

  didReceiveArguments() {
    for (let key of rdfaKeywords) {
      if (this.rdfaAttributes[key])
        this.element.setAttribute(key, this.rdfaAttributes[key]);
    }
  }

}
