import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | rdfa/ctx-each', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{rdfa/ctx-each}}`);

    assert.dom(this.element).hasText('');

    // Template block usage:
    await render(hbs`
      {{#rdfa/ctx-each}}
        template block text
      {{/rdfa/ctx-each}}
    `);

    assert.dom(this.element).hasText('template block text');
  });
});
