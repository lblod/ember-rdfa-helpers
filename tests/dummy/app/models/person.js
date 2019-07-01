import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  uri: attr(),
  firstName: attr(),
  lastName: attr(),
  nicknames: attr(),
  profilePicture: attr(),
  homepage: attr(),
  currentProject: belongsTo('project', { inverse: 'participants' }),
  projects: hasMany('project', { inverse: 'funders' }),
  accounts: hasMany('account'),

  rdfaBindings: Object.freeze({
    class: 'http://schema.org/Person',
    firstName: 'http://schema.org/givenName',
    lastName: 'http://schema.org/familyName',
    nicknames: 'http://schema.org/alternateName',
    birthDate: {
      property: 'https://schema.org/birthDate',
      datatype: 'xsd:dateTime'
    },
    profilePicture: 'http://schema.org/image',
    homepage: 'http://schema.org/url',
    currentProject: 'http://xmlns.com/foaf/0.1/currentProject',
    accounts: 'http://xmlns.com/foaf/0.1/holdsAccount'
  })
});
