import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | rdfa/ctx-img', function (hooks) {
  setupRenderingTest(hooks);

  test('it annotates an img with the proper attributes', async function (assert) {
    const storeService = this.owner.lookup('service:store');

    let person = storeService.createRecord('person', {
      uri: 'http://example.com/person/1234',
      profilePicture:
        'https://pickaface.net/gallery/avatar/nfox.inc537df2da44c30.png',
    });

    this.set('person', person);
    const NO_OVERRIDE = null;
    this.set('propertyOverride', NO_OVERRIDE);

    await render(hbs`
      <WithRdfaContext id="" @model={{this.person}} as |ctx|>
        <ctx.img
          @prop="profilePicture"
          @alt="Profile pic"
          @width={{100}}
          @height={{100}}
          @property={{this.propertyOverride}}
        />
      </WithRdfaContext>
    `);

    assert
      .dom('img')
      .hasAttribute(
        'src',
        'https://pickaface.net/gallery/avatar/nfox.inc537df2da44c30.png'
      )
      .hasAttribute('property', 'http://schema.org/image')
      .hasAttribute('width', '100')
      .hasAttribute('height', '100')
      .hasAttribute('alt', 'Profile pic');

    this.set('propertyOverride', 'https://some-other-vocabulary/image');
    await settled();

    assert
      .dom('img')
      .hasAttribute('property', 'https://some-other-vocabulary/image');
  });
});
