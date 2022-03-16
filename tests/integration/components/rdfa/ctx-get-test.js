import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | rdfa/ctx-get', function(hooks) {
  setupRenderingTest(hooks);

  test('it annotates html elements based on a data model', async function(assert) {
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
        name: 'ember-rdfa-helpers'
      })
    });

    this.set('personWithProject', personWithProject);

    await render(hbs`
      <WithRdfaContext id="context" @model={{this.personWithProject}} as |ctx|>
        {{! literal }}
        <div data-test-first-name>
          <ctx.get @prop="firstName" />
        </div>

        {{! literal + block form}}
        <div data-test-last-name>
          <ctx.get @prop="lastName" as |attributes value ctx|>
            <b
              property={{attributes.property}}
              typeof={{attributes.typeof}}
              content={{attributes.content}}
            >
              {{value}}
            </b>
          </ctx.get>
        </div>

        {{! literal + datatype}}
        <div data-test-birth-date>
          <ctx.get @prop="birthDate" />
        </div>

        {{! resource }}
        <div data-test-project>
          <ctx.get @prop="currentProject" />
        </div>

        {{! resource + block }}
        <div data-test-project-name>
          <ctx.get @prop="currentProject" as |attributes value ctx|>
            <div
              property={{attributes.property}}
              resource={{attributes.resource}}
              typeof={{attributes.typeof}}
            >
              <ctx.get @prop="name" />
            </div>
          </ctx.get>
        </div>
      </WithRdfaContext>
    `);

    assert.dom("[data-test-first-name] span")
      .hasText('John')
      .hasAttribute('property', 'http://schema.org/givenName');

    assert.dom("[data-test-last-name] b")
      .hasText('Doe')
      .hasAttribute('property', 'http://schema.org/familyName')
      .doesNotHaveAttribute('datatype')
      .doesNotHaveAttribute('content');

    assert.dom("[data-test-birth-date] span")
      .hasAttribute('property', 'https://schema.org/birthDate')
      .hasAttribute('datatype', 'xsd:dateTime')
      .hasAttribute('content', '1990-07-23T00:00:00.000Z');

    // await this.pauseTest();

    assert.dom("[data-test-project] span")
      .hasText('https://github.com/lblod/ember-rdfa-helpers')
      .hasAttribute('property', 'http://xmlns.com/foaf/0.1/currentProject')
      .hasAttribute('resource', 'https://github.com/lblod/ember-rdfa-helpers')
      .hasAttribute('typeof', 'http://xmlns.com/foaf/0.1/Thing');

    assert.dom("[data-test-project-name] div")
      .hasAttribute('property', 'http://xmlns.com/foaf/0.1/currentProject')
      .hasAttribute('resource', 'https://github.com/lblod/ember-rdfa-helpers')
      .hasAttribute('typeof', 'http://xmlns.com/foaf/0.1/Thing');

    assert.dom("[data-test-project-name] div span")
      .hasAttribute('property', 'http://xmlns.com/foaf/0.1/name');
  });

  test('it properly updates annotations when model data changes', async function(assert) {
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
          <ctx.get @prop={{this.propName}} />
        </div>
      </WithRdfaContext>
    `);

    const dom = assert.dom("[data-test] span");

    dom.hasText('John')
      .hasAttribute('property', 'http://schema.org/givenName');

    person.set('firstName', "Joana");

    await settled();
    dom.hasText('Joana');

    this.set('propName', 'lastName');

    await settled();
    dom.hasText('Doe')
      .hasAttribute('property', 'http://schema.org/familyName');
  });

  test('it annotates html elements with the rdfa modifier', async function (assert) {
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
        {{! literal + block form}}
        <div data-test-last-name>
          <ctx.get @prop="lastName" as |attributes value ctx|>
            <b {{rdfa attributes}}>
              {{value}}
            </b>
          </ctx.get>
        </div>

        {{! resource + block }}
        <div data-test-project-name>
          <ctx.get @prop="currentProject" as |attributes value ctx|>
            <div {{rdfa attributes}}>
              <ctx.get @prop="name" />
            </div>
          </ctx.get>
        </div>
      </WithRdfaContext>
    `);

    assert
      .dom('[data-test-last-name] b')
      .hasText('Doe')
      .hasAttribute('property', 'http://schema.org/familyName')
      .doesNotHaveAttribute('datatype')
      .doesNotHaveAttribute('content');

    assert
      .dom('[data-test-project-name] div')
      .hasAttribute('property', 'http://xmlns.com/foaf/0.1/currentProject')
      .hasAttribute('resource', 'https://github.com/lblod/ember-rdfa-helpers')
      .hasAttribute('typeof', 'http://xmlns.com/foaf/0.1/Thing');
  });
});
