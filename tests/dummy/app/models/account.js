import Model, { attr } from '@ember-data/model';

export default class AccountModel extends Model {
  @attr uri;
  @attr accountName;
  @attr accountServiceHomepage;

  get rdfaBindings() {
    return {
      class: 'http://xmlns.com/foaf/0.1/OnlineAccount',
      accountName: 'http://xmlns.com/foaf/0.1/accountName',
      accountServiceHomepage:
        'http://xmlns.com/foaf/0.1/accountServiceHomepage',
    };
  }
}
