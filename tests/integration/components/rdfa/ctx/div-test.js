import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

//This is mostly a repeat of the ctx-get tests, except that they should now render in a div instead
//Testing for subcomponents is somewhat rudimentary as their code is almost identical, except for the tagname, however, the <a> subcomponent does add some extra value is that is tested in its own testfile.

module('Integration | Component | ctx/div', function (hooks) {
  setupRenderingTest(hooks);

  test('it annotates html elements based on a data model', async function (assert) {
    const storeService = this.owner.lookup('service:store');

    let birthDate = new Date('1990-07-23');
    birthDate.setFullYear(1990);

    let personWithProject = storeService.createRecord('person', {
      uri: 'http://example.com/person/1234',
      firstName: 'John',
      lastName: 'Doe',
      birthDate: birthDate,
      currentProject: storeService.createRecord('project', {
        uri: 'https://github.com/lblod/ember-rdfa-helpers',
        name: 'ember-rdfa-helpers',
      }),
    });

    this.set('personWithProject', personWithProject);

    await render(hbs`
      <WithRdfaContext id="context" @model={{this.personWithProject}} as |ctx|>
        {{! literal }}
        <div data-test-first-name>
          <ctx.div @prop="firstName" />
        </div>

        {{! literal + block form}}
        <div data-test-last-name>
          <ctx.div @prop="lastName" as |value ctx|>
            {{value}}
          </ctx.div>
        </div>

        {{! literal + datatype}}
        <div data-test-birth-date>
          <ctx.div @prop="birthDate" />
        </div>

        {{! resource }}
        <div data-test-project>
          <ctx.div @prop="currentProject" />
        </div>

        {{! resource + block }}
        <div data-test-project-name>
          <ctx.div @prop="currentProject" as |value ctx|>
            <ctx.div @prop="name" />
          </ctx.div>
        </div>
      </WithRdfaContext>
    `);

    assert
      .dom('[data-test-first-name] div')
      .hasText('John')
      .doesNotHaveAttribute('resource')
      .doesNotHaveAttribute('datatype')
      .doesNotHaveAttribute('typeof')
      .doesNotHaveAttribute('content')
      .hasAttribute('property', 'http://schema.org/givenName');

    assert
      .dom('[data-test-last-name] div')
      .hasText('Doe')
      .doesNotHaveAttribute('resource')
      .doesNotHaveAttribute('datatype')
      .doesNotHaveAttribute('typeof')
      .doesNotHaveAttribute('content')
      .hasAttribute('property', 'http://schema.org/familyName');

    assert
      .dom('[data-test-birth-date] div')
      .doesNotHaveAttribute('resource')
      .doesNotHaveAttribute('typeof')
      .hasAttribute('property', 'https://schema.org/birthDate')
      .hasAttribute('datatype', 'xsd:dateTime')
      .hasAttribute('content', '1990-07-23T00:00:00.000Z');

    assert
      .dom('[data-test-project] div')
      .hasText('https://github.com/lblod/ember-rdfa-helpers')
      .hasAttribute('property', 'http://xmlns.com/foaf/0.1/currentProject')
      .hasAttribute('resource', 'https://github.com/lblod/ember-rdfa-helpers')
      .hasAttribute('typeof', 'http://xmlns.com/foaf/0.1/Thing')
      .doesNotHaveAttribute('datatype');

    assert
      .dom('[data-test-project-name] div')
      .hasAttribute('property', 'http://xmlns.com/foaf/0.1/currentProject')
      .hasAttribute('resource', 'https://github.com/lblod/ember-rdfa-helpers')
      .hasAttribute('typeof', 'http://xmlns.com/foaf/0.1/Thing')
      .doesNotHaveAttribute('datatype');

    assert
      .dom('[data-test-project-name] div div')
      .hasText('ember-rdfa-helpers')
      .hasAttribute('property', 'http://xmlns.com/foaf/0.1/name')
      .doesNotHaveAttribute('resource')
      .doesNotHaveAttribute('datatype')
      .doesNotHaveAttribute('typeof')
      .doesNotHaveAttribute('content');
  });

  test('it properly updates annotations when model data changes', async function (assert) {
    const storeService = this.owner.lookup('service:store');

    let person = storeService.createRecord('person', {
      uri: 'http://example.com/person/1234',
      firstName: 'John',
      lastName: 'Doe',
    });

    this.set('person', person);
    this.set('propName', 'firstName');

    await render(hbs`
      <WithRdfaContext id="context" @model={{this.person}} as |ctx|>
        <div data-test>
          <ctx.div @prop={{this.propName}} />
        </div>
      </WithRdfaContext>
    `);

    const dom = assert.dom('[data-test] div');

    dom.hasText('John').hasAttribute('property', 'http://schema.org/givenName');

    person.set('firstName', 'Joana');

    await settled();
    dom.hasText('Joana');

    this.set('propName', 'lastName');

    await settled();
    dom.hasText('Doe').hasAttribute('property', 'http://schema.org/familyName');
  });
});
