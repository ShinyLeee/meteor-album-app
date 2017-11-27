import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ErrorLayout from '/imports/ui/layouts/ErrorLayout';
import withModules from '../withModules';

class LoadingComponent extends Component {
  static propTypes = {
    modules: PropTypes.object.isRequired,
    error: PropTypes.object,
    timeout: PropTypes.number,
    loadingModule: PropTypes.func.isRequired,
    loadingModuleError: PropTypes.func.isRequired,
  }

  componentWillMount() {
    if (!this.props.error) {
      this.props.loadingModule();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      !this.props.error && nextProps.error &&
      this.props.modules.loading
    ) {
      this.props.loadingModuleError();
    }
  }

  shouldComponentUpdate(nextProps) {
    return this.props.error !== nextProps.error ||
    this.props.timeout !== nextProps.timeout;
  }

  render() {
    const { error, timeout } = this.props;
    if (error || timeout) {
      return (
        <ErrorLayout
          title={error ? '模块加载失败' : '模块加载超时'}
          message={error ? error.toString() : '您的网络状况似乎不太好~'}
        />
      );
    }
    return null;
  }
}

export default withModules(LoadingComponent);
