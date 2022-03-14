import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | ctx/a', function (hooks) {
  setupRenderingTest(hooks);

  test('linking to another resource', async function (assert) {
    const storeService = this.owner.lookup('service:store');
    let personWithProject = storeService.createRecord('person', {
      uri: 'http://example.com/person/1234',
      firstName: 'John',
      lastName: 'Doe',
      birthDate: new Date('1990-07-23'),
      currentProject: storeService.createRecord('project', {
        id: "5678",
        uri: 'https://github.com/lblod/ember-rdfa-helpers',
        name: 'ember-rdfa-helpers',
      }),
    });
    this.set('personWithProject', personWithProject);

    await render(hbs`
      <WithRdfaContext @model={{this.personWithProject}} as |ctx|>
        {{! Just create a link to the current project }}
        <div data-test-project-implicit-noblock-link-to>
          <ctx.get @prop="currentProject" @link-to="projects.show" as |value projCtx|>
            {{value.uri}}
          </ctx.get>
        </div>
        <div data-test-project-implicit-noblock-href-to>
          <ctx.get @prop="currentProject" @href-to={{href-to "projects.show" "5678"}} as |value projCtx|>
            {{value.uri}}
          </ctx.get>
        </div>

        {{! Same as before, supplying a subcomponent won't change anything }}
        <div data-test-project-implicit-noblock-link-to-subcomponent>
          <ctx.a @prop="currentProject" @link-to="projects.show" as |value projCtx|>
            {{value.uri}}
          </ctx.a>
        </div>
        <div data-test-project-implicit-noblock-href-to-subcomponent>
          <ctx.a @prop="currentProject" @href-to={{href-to "projects.show" "5678"}} as |value projCtx|>
            {{value.uri}}
          </ctx.a>
        </div>

        {{! A link using the @link mechanism }}
        <div data-test-project-explicit-noblock-link>
          <ctx.get @prop="currentProject" @link={{true}} />
        </div>

        {{! A link with block content }}
        {{! Notice how you need a manual <a> to create a link }}
        <div data-test-project-explicit-block-link>
          <ctx.get @prop="currentProject" @link={{true}} as |attributes value projCtx|>
            <a {{rdfa attributes}}>
              Blockcontent
              <projCtx.get @prop="name" />
            </a>
          </ctx.get>
        </div>

        {{! Making a link with block content, using a subcomponent }}
        <div data-test-project-explicit-block-link-subcomponent>
          <ctx.a @prop="currentProject" @link={{true}} as |value projCtx|>
            Blockcontent
            <projCtx.get @prop="name" />
          </ctx.a>
        </div>
      </WithRdfaContext>
    `)

    assert
      .dom('[data-test-project-implicit-noblock-link-to] a')
      .hasText('https://github.com/lblod/ember-rdfa-helpers')
      .hasAttribute('href', '/projects/5678')
      .hasAttribute('property', 'http://xmlns.com/foaf/0.1/currentProject')
      .hasAttribute('typeof', 'http://xmlns.com/foaf/0.1/Thing');
    assert
      .dom('[data-test-project-implicit-noblock-href-to] a')
      .hasText('https://github.com/lblod/ember-rdfa-helpers')
      .hasAttribute('href', '/projects/5678')
      .hasAttribute('property', 'http://xmlns.com/foaf/0.1/currentProject')
      .hasAttribute('typeof', 'http://xmlns.com/foaf/0.1/Thing');

    assert
      .dom('[data-test-project-implicit-noblock-link-to-subcomponent] a')
      .hasText('https://github.com/lblod/ember-rdfa-helpers')
      .hasAttribute('href', '/projects/5678')
      .hasAttribute('property', 'http://xmlns.com/foaf/0.1/currentProject')
      .hasAttribute('typeof', 'http://xmlns.com/foaf/0.1/Thing');
    assert
      .dom('[data-test-project-implicit-noblock-href-to-subcomponent] a')
      .hasText('https://github.com/lblod/ember-rdfa-helpers')
      .hasAttribute('href', '/projects/5678')
      .hasAttribute('property', 'http://xmlns.com/foaf/0.1/currentProject')
      .hasAttribute('typeof', 'http://xmlns.com/foaf/0.1/Thing');

    assert
      .dom('[data-test-project-explicit-noblock-link] a')
      .hasText('https://github.com/lblod/ember-rdfa-helpers')
      .hasAttribute('href', 'https://github.com/lblod/ember-rdfa-helpers')
      .hasAttribute('property', 'http://xmlns.com/foaf/0.1/currentProject')
      .hasAttribute('typeof', 'http://xmlns.com/foaf/0.1/Thing');

    assert
      .dom('[data-test-project-explicit-block-link] a')
      .hasText('Blockcontent ember-rdfa-helpers')
      .hasAttribute('href', 'https://github.com/lblod/ember-rdfa-helpers')
      .hasAttribute('property', 'http://xmlns.com/foaf/0.1/currentProject')
      .hasAttribute('typeof', 'http://xmlns.com/foaf/0.1/Thing');

    assert
      .dom('[data-test-project-explicit-block-link-subcomponent] a')
      .hasText('Blockcontent ember-rdfa-helpers')
      .hasAttribute('href', 'https://github.com/lblod/ember-rdfa-helpers')
      .hasAttribute('property', 'http://xmlns.com/foaf/0.1/currentProject')
      .hasAttribute('typeof', 'http://xmlns.com/foaf/0.1/Thing');
  });
});
