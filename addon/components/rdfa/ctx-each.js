import Component from '@ember/component';
import layout from '../../templates/components/rdfa/ctx-each';
import StandardRdfaComponent from '../../mixins/rdfa/standard';
import { or } from '@ember/object/computed';

export default Component.extend( StandardRdfaComponent, {
  layout,
  tagName: '',
  link: false, // can be supplied to force an href
  isInAppLink: or('link-to', 'href-to')
});
