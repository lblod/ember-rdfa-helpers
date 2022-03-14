import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | with-rdfa-context', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders html attributes based on the model data', async function(assert) {
    const storeService = this.owner.lookup('service:store');

    const testPerson = storeService.createRecord('person', {
      uri: 'http://example.com/person/1234',
    });
    this.set('model', testPerson);

    await render(hbs`
      <WithRdfaContext @id="test" @model={{this.model}}>
        template block text
      </WithRdfaContext>
    `);


    let domElement = assert.dom('#test')
    domElement.exists()
      .hasAttribute('resource', 'http://example.com/person/1234')
      .hasAttribute('typeof', 'http://schema.org/Person');

    testPerson.set('uri', null);
    await settled();

    domElement.exists().doesNotHaveAttribute('resource').doesNotHaveAttribute('typeof');
  });

  test('it\'s possible to configure the rendered HTML element ', async function(assert) {
    await render(hbs`
      <WithRdfaContext @id="test">
        template block text
      </WithRdfaContext>
    `);

    assert.dom('#test').hasTagName('div');

    await render(hbs`
      <WithRdfaContext @tagName="section" @id="test">
        template block text
      </WithRdfaContext>
    `);

    assert.dom('#test').hasTagName('section');
  });
});
