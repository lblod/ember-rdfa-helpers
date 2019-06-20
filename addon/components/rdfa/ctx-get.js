import { get } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import { computed } from '@ember/object';
import Component from '@ember/component';
import layout from '../../templates/components/rdfa/ctx-get';
import StandardRdfaComponent from '../../mixins/rdfa/standard';

export default Component.extend( StandardRdfaComponent, {
  layout,
  tagName: '',
  link: false, // Can be supplied to force an href
  positionalParams: ["prop"],
  isResource: computed('value', function(){
    return (typeof get(this, 'value')) === "object" && !(get(this, 'value') instanceof Date);
  })
});
