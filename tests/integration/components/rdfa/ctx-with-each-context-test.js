import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('rdfa/ctx-with-each-context', 'Integration | Component | rdfa/ctx with each context', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{rdfa/ctx-with-each-context}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#rdfa/ctx-with-each-context}}
      template block text
    {{/rdfa/ctx-with-each-context}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
