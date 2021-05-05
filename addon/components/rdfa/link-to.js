import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { hrefTo } from 'ember-href-to/helpers/href-to';

export default class LinkToComponent extends Component {
  @service router;

  get uri() {
    return this.args.value.get('uri');
  }

  get url() {
    if (this.args['href-to']) {
      return this.args['href-to'];
    }

    return hrefTo(this, [this.args['link-to'], this.args.value.get('id')]);
  }

  @action
  transition() {
    this.router.transitionTo(this.url);
  }
}
