import Component from '@ember/component';
import { computed } from '@ember/object';
import layout from '../../templates/components/rdfa/ctx-get';
import StandardRdfaComponent from '../../mixins/rdfa/standard';
import isRdfaResource from '../../utils/is-rdfa-resource';

export default Component.extend( StandardRdfaComponent, {
  layout,
  tagName: '',
  link: false, // Can be supplied to force an href
  isResource: computed('value', function() { return isRdfaResource(this.value); })
});
