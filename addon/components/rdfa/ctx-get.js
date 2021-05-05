import Component from '@glimmer/component';

export default class CtxGetComponent extends Component {
  get isInAppLink() {
    return Boolean(this.args['link-to'] || this.args['href-to']);
  }
}
