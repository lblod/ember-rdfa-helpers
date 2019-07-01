import Component from '@ember/component';
import layout from '../../templates/components/rdfa/ctx-img';
import StandardRdfaComponent from '../../mixins/rdfa/standard';
import { computed } from '@ember/object';

export default Component.extend(StandardRdfaComponent, {
  layout,
  tagName: 'img',
  attributeBindings: ['src', 'rdfaProperty:property', 'alt', 'width', 'height', 'srcset', 'sizes'],
  src: computed('value', function() {
    return this.value && this.value.uri ? this.value.uri : this.value;
  })
});
