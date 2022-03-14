import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | rdfa/ctx-each', function (hooks) {
  setupRenderingTest(hooks);

  test('it supports lists of nested resources', async function (assert) {
    const storeService = this.owner.lookup('service:store');

    let personWithProjects = storeService.createRecord('person', {
      uri: 'http://example.com/person/1234',
      projects: [
        storeService.createRecord('project', {
          uri: 'https://github.com/lblod/ember-rdfa-helpers',
          name: 'ember-rdfa-helpers',
        }),
        storeService.createRecord('project', {
          uri: 'https://github.com/emberjs/ember.js',
          name: 'ember',
        }),
      ],
    });

    this.set('personWithProjects', personWithProjects);

    await render(hbs`
      <WithRdfaContext
        @model={{this.personWithProjects}}
        as |ctx|
      >
        <ul data-test-projects>
          <ctx.each.get @prop="projects" as |attributes value projectCtx|>
            <li
              property={{attributes.property}}
              resource={{attributes.resource}}
              typeof={{attributes.typeof}}
            >
              <projectCtx.get @prop="name" />
            </li>
          </ctx.each.get>
        </ul>
      </WithRdfaContext>
    `);

    assert.dom('[data-test-projects] li').exists({ count: 2 });

    assert
      .dom('[data-test-projects] li span')
      .hasAttribute('property', 'http://xmlns.com/foaf/0.1/name');

    assert
      .dom('[data-test-projects] li:nth-of-type(1)')
      .hasAttribute('typeof', 'http://xmlns.com/foaf/0.1/Thing')
      .hasAttribute('resource', 'https://github.com/lblod/ember-rdfa-helpers')
      .doesNotHaveAttribute('property')
      .hasText('ember-rdfa-helpers');

    assert
      .dom('[data-test-projects] li:nth-of-type(2)')
      .hasAttribute('typeof', 'http://xmlns.com/foaf/0.1/Thing')
      .hasAttribute('resource', 'https://github.com/emberjs/ember.js')
      .doesNotHaveAttribute('property')
      .hasText('ember');
  });

  test('it updates annotations when the nested resources change', async function (assert) {
    const storeService = this.owner.lookup('service:store');

    let project = storeService.createRecord('project', {
      uri: 'https://github.com/lblod/ember-rdfa-helpers',
      name: 'ember-rdfa-helpers',
    });

    let personWithProjects = storeService.createRecord('person', {
      uri: 'http://example.com/person/1234',
      projects: [project],
    });

    this.set('personWithProjects', personWithProjects);

    await render(hbs`
      <WithRdfaContext
        @model={{this.personWithProjects}}
        as |ctx|
      >
        <ul data-test-projects>
          <ctx.each.get @prop="projects" as |attributes value projectCtx|>
            <li
              property={{attributes.property}}
              resource={{attributes.resource}}
              typeof={{attributes.typeof}}
            >
              <projectCtx.get @prop="name" />
            </li>
          </ctx.each.get>
        </ul>
      </WithRdfaContext>
    `);

    let dom = assert.dom('[data-test-projects] li:nth-of-type(1)');
    dom
      .hasAttribute('typeof', 'http://xmlns.com/foaf/0.1/Thing')
      .hasAttribute('resource', 'https://github.com/lblod/ember-rdfa-helpers')
      .doesNotHaveAttribute('property')
      .hasText('ember-rdfa-helpers');

    project.setProperties({
      name: 'ember-rdfa-utils',
      uri: 'https://github.com/lblod/ember-rdfa-utils',
    });

    await settled();

    dom
      .hasAttribute('typeof', 'http://xmlns.com/foaf/0.1/Thing')
      .hasAttribute('resource', 'https://github.com/lblod/ember-rdfa-utils')
      .doesNotHaveAttribute('property')
      .hasText('ember-rdfa-utils');
  });
});
