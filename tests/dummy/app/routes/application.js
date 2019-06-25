import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    const projectX = this.store.createRecord('project', {
      uri: 'http://data.semte.ch/projects/1',
      name: 'Project X',
      code: 'X'
    });

    const projectY = this.store.createRecord('project', {
      uri: 'http://data.semte.ch/projects/2',
      name: 'Project Y',
      code: 'Y'
    });

    const github = this.store.createRecord('account', {
      uri: 'http://data.semte.ch/accounts/1',
      accountName: 'apple',
      accountServiceHomepage: 'http://www.github.com'
    });
    const docker = this.store.createRecord('account', {
      uri: 'http://data.semte.ch/accounts/2',
      accountName: 'banana',
      accountServiceHomepage: 'http://cloud.docker.com'
    });

    const person = this.store.createRecord('person', {
      uri: 'http://data.semte.ch/persons/1',
      firstName: 'John',
      lastName: 'Doe',
      nicknames: ['JD', 'Mister X', 'Johnie'],
      birthDate: new Date(),
      profilePicture: 'https://pickaface.net/gallery/avatar/nfox.inc537df2da44c30.png',
      homepage: 'http://www.john.doe',
      currentProject: projectX
    });

    person.get('accounts').pushObject(github);
    person.get('accounts').pushObject(docker);

    const richie = this.store.createRecord('person', {
      uri: 'https://en.wikipedia.org/wiki/Richie_Rich_(comics)',
      firstName: 'Richie',
      lastName: 'Rich'
    });

    const tim = this.store.createRecord('person', {
      uri: 'https://www.w3.org/People/Berners-Lee/',
      firstName: 'Tim',
      lastName: 'Berners-Lee'
    });

    projectX.get('funders').pushObject(richie);
    projectX.get('funders').pushObject(tim);

    return {
      person,
      projects: [ projectX, projectY ]
    };
  }
});
