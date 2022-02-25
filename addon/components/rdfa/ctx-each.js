import Component from '@glimmer/component';

export default class CtxEachComponent extends Component {
  get isInAppLink() {
    return Boolean(this.args['link-to'] || this.args['href-to']);
  }
}
