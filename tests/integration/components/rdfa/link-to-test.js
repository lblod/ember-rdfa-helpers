import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | rdfa/link-to', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    const storeService = this.owner.lookup('service:store');

    let project = storeService.createRecord('project', {
      uri: 'https://github.com/lblod/ember-rdfa-helpers',
      name: 'ember-rdfa-helpers',
      id: '1234',
    });

    this.set('project', project);

    await render(hbs`
      <Rdfa::LinkTo
        @value={{this.project}}
        @useUri={{true}}
      >
        useUri
      </Rdfa::LinkTo>

      {{!-- TODO
        <Rdfa::LinkTo
          @value={{this.project}}
          @link-to="projects.show"
        >
          link-to
        </Rdfa::LinkTo>

        <Rdfa::LinkTo
          @value={{this.project}}
          @href-to={{href-to "projects.show" "1234"}}
        >
          href-to
        </Rdfa::LinkTo>
      --}}
    `);

    assert
      .dom('a')
      .hasText('useUri')
      .hasAttribute('href', 'https://github.com/lblod/ember-rdfa-helpers')
      .hasAttribute('typeof', 'http://xmlns.com/foaf/0.1/Thing');
  });
});
