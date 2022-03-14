import { helper } from '@ember/component/helper';
import { isRdfaResource as isRdfaResourceUtil } from '../utils/is-rdfa-resource';

export function isRdfaResource([value]/*, hash*/) {
  return isRdfaResourceUtil(value);
}

export default helper(isRdfaResource);
