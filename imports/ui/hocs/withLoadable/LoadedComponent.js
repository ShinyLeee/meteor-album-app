import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import withModules from '../withModules';

class LoadedComponent extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    modules: PropTypes.object.isRequired,
    loadedModule: PropTypes.func.isRequired,
    children: PropTypes.func.isRequired,
    preserved: PropTypes.object.isRequired,
  }

  componentWillMount() {
    const { name, modules } = this.props;
    if (
      modules.loading &&
      modules.loaded.indexOf(name) < 0
    ) {
      this.props.loadedModule(name);
    }
  }

  render() {
    const { children, preserved } = this.props;
    return children(preserved);
  }
}

export default withModules(LoadedComponent);
