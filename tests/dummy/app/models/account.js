import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  uri: attr(),
  accountName: attr(),
  accountServiceHomepage: attr(),

  rdfaBindings: Object.freeze({
    class: 'http://xmlns.com/foaf/0.1/OnlineAccount',
    accountName: 'http://xmlns.com/foaf/0.1/accountName',
    accountServiceHomepage: 'http://xmlns.com/foaf/0.1/accountServiceHomepage'
  })
});
