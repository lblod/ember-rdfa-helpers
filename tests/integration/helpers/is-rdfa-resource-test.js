import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | is-rdfa-resource', function(hooks) {
  setupRenderingTest(hooks);

  // Replace this with your real tests.
  test('it renders', async function(assert) {

    this.set('literal', 'john');

    await render(hbs`{{is-rdfa-resource this.literal}}`);
    assert.dom(this.element).hasText('false');

    const storeService = this.owner.lookup('service:store');
    let person = storeService.createRecord('person', {
      uri: 'http://example.com/person/1234',
      profilePicture: 'https://pickaface.net/gallery/avatar/nfox.inc537df2da44c30.png'
    });

    this.set('resource', person);
    await render(hbs`{{is-rdfa-resource this.resource}}`);
    assert.dom(this.element).hasText('true');
  });
});
