/* eslint-disable new-cap */
import Loadable from 'react-loadable';
import { PageLoader } from '/imports/ui/components/Loader';

export default function withLoadable(opts) {
  return Loadable({
    loading: PageLoader,
    delay: 200,
    timeout: 500,
    ...opts,
  });
}
