import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';

export default class LinkToComponent extends Component {
  @service router;

  get uri() {
    return this.args.value.get('uri');
  }

  get url() {
    if (this.args['href-to']) return this.args['href-to'];
    if (this.args['link-to'])
      return this.router.urlFor(this.args['link-to'], this.args.value);
    else return '';
  }

  @action
  transition() {
    this.router.transitionTo(this.url);
  }
}
