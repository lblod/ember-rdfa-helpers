import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | rdfa/link-to', function (hooks) {
  setupRenderingTest(hooks);

  test('basic usage without href', async function (assert) {
    const storeService = this.owner.lookup('service:store');
    let project = storeService.createRecord('project', {
      uri: 'https://github.com/lblod/ember-rdfa-helpers',
      name: 'ember-rdfa-helpers',
      id: '1234',
    });
    this.set('project', project);

    await render(hbs`
      <Rdfa::LinkTo
        class="someClass"
        @value={{this.project}}
      >
        basic usage without href
      </Rdfa::LinkTo>
    `);

    assert
      .dom('a')
      .hasText('basic usage without href')
      .hasClass('someClass') //testing ...attributes
      .doesNotHaveAttribute('href')
      .doesNotHaveAttribute('property')
      .hasAttribute('typeof', 'http://xmlns.com/foaf/0.1/Thing')
      .hasAttribute('resource', 'https://github.com/lblod/ember-rdfa-helpers');
  });

  test('basic usage', async function (assert) {
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
        @link-to="projects.show"
      >
        basic usage
      </Rdfa::LinkTo>
    `);

    assert
      .dom('a')
      .hasText('basic usage')
      .hasAttribute('href', '/projects/1234')
      .doesNotHaveAttribute('property')
      .hasAttribute('typeof', 'http://xmlns.com/foaf/0.1/Thing')
      .hasAttribute('resource', 'https://github.com/lblod/ember-rdfa-helpers');
  });

  test('use uri', async function (assert) {
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
    `);

    assert
      .dom('a')
      .hasText('useUri')
      .hasAttribute('href', 'https://github.com/lblod/ember-rdfa-helpers')
      .doesNotHaveAttribute('property')
      .hasAttribute('typeof', 'http://xmlns.com/foaf/0.1/Thing')
      .doesNotHaveAttribute('resource');
  });

  test('using link-to and href-to', async function (assert) {
    const storeService = this.owner.lookup('service:store');
    let project = storeService.createRecord('project', {
      uri: 'https://github.com/lblod/ember-rdfa-helpers',
      name: 'ember-rdfa-helpers',
      id: '1234',
    });
    this.set('project', project);

    await render(hbs`
        <Rdfa::LinkTo
          data-test-linkto
          @value={{this.project}}
          @link-to="projects.show"
        >
          link-to
        </Rdfa::LinkTo>

        <Rdfa::LinkTo
          data-test-hrefto
          @value={{this.project}}
          @href-to={{href-to "projects.show" "1234"}}
        >
          href-to
        </Rdfa::LinkTo>

        <Rdfa::LinkTo
          data-test-linktoUri
          @value={{this.project}}
          @link-to="projects.show"
          @useUri={{true}}
        >
          link-to-uri
        </Rdfa::LinkTo>

        <Rdfa::LinkTo
          data-test-hreftoUri
          @value={{this.project}}
          @href-to={{href-to "projects.show" "1234"}}
          @useUri={{true}}
        >
          href-to-uri
        </Rdfa::LinkTo>
    `);

    assert
      .dom('[data-test-linkto]')
      .hasText('link-to')
      .hasAttribute('href', '/projects/1234')
      .doesNotHaveAttribute('property')
      .hasAttribute('typeof', 'http://xmlns.com/foaf/0.1/Thing')
      .hasAttribute('resource', 'https://github.com/lblod/ember-rdfa-helpers');
    assert
      .dom('[data-test-hrefto]')
      .hasText('href-to')
      .hasAttribute('href', '/projects/1234')
      .doesNotHaveAttribute('property')
      .hasAttribute('typeof', 'http://xmlns.com/foaf/0.1/Thing')
      .hasAttribute('resource', 'https://github.com/lblod/ember-rdfa-helpers');
    assert
      .dom('[data-test-linktoUri]')
      .hasText('link-to-uri')
      .hasAttribute('href', 'https://github.com/lblod/ember-rdfa-helpers')
      .doesNotHaveAttribute('property')
      .hasAttribute('typeof', 'http://xmlns.com/foaf/0.1/Thing')
      .doesNotHaveAttribute('resource');
    assert
      .dom('[data-test-hreftoUri]')
      .hasText('href-to-uri')
      .hasAttribute('href', 'https://github.com/lblod/ember-rdfa-helpers')
      .doesNotHaveAttribute('property')
      .hasAttribute('typeof', 'http://xmlns.com/foaf/0.1/Thing')
      .doesNotHaveAttribute('resource');
  });

  test('override uri', async function (assert) {
    const storeService = this.owner.lookup('service:store');
    let project = storeService.createRecord('project', {
      uri: 'https://github.com/lblod/ember-rdfa-helpers',
      name: 'ember-rdfa-helpers',
      id: '1234',
    });
    this.set('project', project);

    await render(hbs`
        <Rdfa::LinkTo
          data-test-linkto
          @value={{this.project}}
          @link-to="projects.show"
          @overrideUri={{true}}
        >
          link-to
        </Rdfa::LinkTo>

        <Rdfa::LinkTo
          data-test-hrefto
          @value={{this.project}}
          @href-to={{href-to "projects.show" "1234"}}
          @overrideUri={{true}}
        >
          href-to
        </Rdfa::LinkTo>
    `);

    assert
      .dom('[data-test-linkto]')
      .hasText('link-to')
      .hasAttribute('href', '/projects/1234')
      .doesNotHaveAttribute('property')
      .hasAttribute('typeof', 'http://xmlns.com/foaf/0.1/Thing')
      .hasAttribute('resource', '/projects/1234');
    assert
      .dom('[data-test-hrefto]')
      .hasText('href-to')
      .hasAttribute('href', '/projects/1234')
      .doesNotHaveAttribute('property')
      .hasAttribute('typeof', 'http://xmlns.com/foaf/0.1/Thing')
      .hasAttribute('resource', '/projects/1234');
  });
});
