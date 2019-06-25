import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';

export default Model.extend({
  uri: attr(),
  name: attr(),
  funders: hasMany('person'),
  participants: hasMany('person'),

  rdfaBindings: Object.freeze({
    class: 'http://xmlns.com/foaf/0.1/Thing',
    name: 'http://xmlns.com/foaf/0.1/name',
    funders: 'http://xmlns.com/foaf/0.1/fundedBy'
  })
});
