import isRdfaResource from 'dummy/utils/is-rdfa-resource';
import { module, test } from 'qunit';

module('Unit | Utility | is-rdfa-resource', function() {

  // Replace this with your real tests.
  test('it works', function(assert) {
    assert.notOk(isRdfaResource("string"));
    assert.notOk(isRdfaResource(1234));
    assert.notOk(isRdfaResource(new Date()));
    assert.ok(isRdfaResource({
      firstName: 'John'
    }));
  });
});
