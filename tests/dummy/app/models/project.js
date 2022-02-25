import Model, { attr, hasMany } from '@ember-data/model';

export default class ProjectModel extends Model {
  @attr uri;
  @attr name;
  @hasMany('person') funders;
  @hasMany('person') participants;

  get rdfaBindings() {
    return {
      class: 'http://xmlns.com/foaf/0.1/Thing',
      name: 'http://xmlns.com/foaf/0.1/name',
      funders: 'http://xmlns.com/foaf/0.1/fundedBy',
    };
  }
}
