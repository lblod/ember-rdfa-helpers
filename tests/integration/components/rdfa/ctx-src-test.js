import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('rdfa/ctx-src', 'Integration | Component | rdfa/ctx src', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{rdfa/ctx-src}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#rdfa/ctx-src}}
      template block text
    {{/rdfa/ctx-src}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
