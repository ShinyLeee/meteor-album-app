import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadingData, loadedData } from '/imports/ui/redux/actions';

const defaultOps = {
  delay: 200,
  placeholder: null,
  wait: true, // 是否等到数据加载完毕后再显示
  loose: true, // 是否移除data相关props
};

const withDataReadyHandler = (ops) => (WrappedComponent) => {
  const options = Object.assign({}, defaultOps, ops);
  class C extends PureComponent {
    static displayName = `withDataReadyHandler(${WrappedComponent.displayName || WrappedComponent.name})`

    static propTypes = {
      isDataReady: PropTypes.bool.isRequired,
      loadingData: PropTypes.func.isRequired,
      loadedData: PropTypes.func.isRequired,
    }

    constructor(props) {
      super(props);
      this._timeout = null;
      this.state = {
        pastDelay: false,
      };
    }

    componentWillMount() {
      if (!this.props.isDataReady) {
        this.props.loadingData();
      }
      if (options.placeholder) {
        this._timeout = setTimeout(() => this.setState({ pastDelay: true }), options.delay);
      }
    }

    componentWillReceiveProps(nextProps) {
      if (this.props.isDataReady !== nextProps.isDataReady) {
        if (nextProps.isDataReady) {
          this.props.loadedData();
        } else {
          this.props.loadingData();
        }
      }
    }

    componentWillUnmount() {
      if (!this.props.isDataReady) {
        this.props.loadedData();
      }
      if (this._timeout) {
        clearTimeout(this._timeout);
        this._timeout = null;
      }
    }

    render() {
      const {
        placeholder,
        wait,
        loose,
      } = options;
      const {
        isDataReady,
        loadingData, // eslint-disable-line no-shadow
        loadedData, // eslint-disable-line no-shadow
        ...rest
      } = this.props;
      const remainedProps = loose ? rest : this.props;
      return wait
        ? isDataReady
          ? <WrappedComponent {...remainedProps} />
          : this.state.pastDelay && placeholder
        : <WrappedComponent {...remainedProps} />;
    }
  }

  const mapDispatchToProps = (dispatch) => bindActionCreators({
    loadingData,
    loadedData,
  }, dispatch);

  return connect(null, mapDispatchToProps)(C);
};

export default withDataReadyHandler;
