import EmberObject from '@ember/object';
import RdfaStandardMixin from 'ember-rdfa-helpers/mixins/rdfa/standard';
import { module, test } from 'qunit';

module('Unit | Mixin | rdfa/standard');

// Replace this with your real tests.
test('it works', function(assert) {
  let RdfaStandardObject = EmberObject.extend(RdfaStandardMixin);
  let subject = RdfaStandardObject.create();
  assert.ok(subject);
});
