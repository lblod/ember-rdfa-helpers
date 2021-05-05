import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class PersonModel extends Model {
  @attr uri;
  @attr firstName;
  @attr lastName;
  @attr nicknames;
  @attr birthDate;
  @attr profilePicture;
  @attr homepage;
  @belongsTo('project', { inverse: 'participants' }) currentProject;
  @hasMany('project', { inverse: 'funders' }) projects;
  @hasMany('account') accounts;

  get rdfaBindings() {
    return {
      class: 'http://schema.org/Person',
      firstName: 'http://schema.org/givenName',
      lastName: 'http://schema.org/familyName',
      nicknames: 'http://schema.org/alternateName',
      birthDate: {
        property: 'https://schema.org/birthDate',
        datatype: 'xsd:dateTime',
      },
      profilePicture: 'http://schema.org/image',
      homepage: 'http://schema.org/url',
      currentProject: 'http://xmlns.com/foaf/0.1/currentProject',
      accounts: 'http://xmlns.com/foaf/0.1/holdsAccount',
    };
  }
}
