import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('rdfa/ctx-each-resource', 'Integration | Component | rdfa/ctx each resource', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{rdfa/ctx-each-resource}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#rdfa/ctx-each-resource}}
      template block text
    {{/rdfa/ctx-each-resource}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
