import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | rdfa/data', function (hooks) {
  setupRenderingTest(hooks);

  test('it yields data', async function (assert) {
    const storeService = this.owner.lookup('service:store');

    let birthDate = new Date('1990-07-23');

    let person = storeService.createRecord('person', {
      firstName: 'John',
      birthDate,
      currentProject: storeService.createRecord('project', {
        uri: 'https://github.com/lblod/ember-rdfa-helpers',
        name: 'ember-rdfa-helpers',
      }),
    });

    this.set('person', person);
    this.set('prop', 'firstName');

    await render(hbs`
      <Rdfa::Data
        @model={{this.person}}
        @prop={{this.prop}}
        @rdfaBindings={{this.person.rdfaBindings}}
        as |data|
      >
        <div data-test-value>{{if data.value.name data.value.name data.value}}</div>
        <div data-test-rdfa-property>{{data.rdfaProperty}}</div>
        <div data-test-typeof>{{data.typeof}}</div>
        <div data-test-datatype>{{data.rdfaDatatype}}</div>
        <div data-test-rdfa-content>{{data.rdfaContent}}</div>
      </Rdfa::Data>
    `);

    let value = assert.dom('[data-test-value]').hasText('John');
    let property = assert
      .dom('[data-test-rdfa-property]')
      .hasText('http://schema.org/givenName');
    let rdfaTypeof = assert.dom('[data-test-typeof]').hasNoText();
    let datatype = assert.dom('[data-test-datatype]').hasNoText();
    let content = assert.dom('[data-test-rdfa-content]').hasNoText();

    this.set('prop', 'birthDate');
    await settled();

    value.hasText(birthDate.toString());
    property.hasText('https://schema.org/birthDate');
    rdfaTypeof.hasNoText();
    datatype.containsText('xsd:dateTime');
    content.containsText('1990-07-23T00:00:00.000Z');

    this.set('prop', 'currentProject');
    await settled();

    value.hasText('ember-rdfa-helpers');
    property.hasText('http://xmlns.com/foaf/0.1/currentProject');
    rdfaTypeof.containsText('http://xmlns.com/foaf/0.1/Thing');
    datatype.hasNoText();
    content.hasNoText();
  });

  test('it can override property and datatype values', async function (assert) {
    const storeService = this.owner.lookup('service:store');

    let person = storeService.createRecord('person', {
      firstName: 'John',
    });

    this.set('person', person);

    await render(hbs`
      <Rdfa::Data
        @model={{this.person}}
        @prop="firstName"
        @rdfaBindings={{this.person.rdfaBindings}}
        @property="property-override"
        @datatype="datatype-override"
        as |data|
      >
        <div data-test-rdfa-property>{{data.rdfaProperty}}</div>
        <div data-test-datatype>{{data.rdfaDatatype}}</div>
      </Rdfa::Data>
    `);

    assert.dom('[data-test-rdfa-property]').hasText('property-override');
    assert.dom('[data-test-datatype]').hasText('datatype-override');
  });
});
