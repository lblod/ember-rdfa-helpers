import { helper } from '@ember/component/helper';

export function formatDate([date]) {
  if (date)
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  else return null;
}

export default helper(formatDate);
