import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';
import { Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { updateDimension } from '/imports/ui/redux/actions';

class DeviceWatcher extends Component {
  static propTypes = {
    updateDimension: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this._deviceChangeHandler = debounce(this._handleDimensionChange, 150);
  }

  componentDidMount() {
    window.addEventListener('resize', this._deviceChangeHandler, false);
    window.addEventListener('orientationchange', this._deviceChangeHandler, false);
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._deviceChangeHandler, false);
    window.removeEventListener('orientationchange', this._deviceChangeHandler, false);
  }

  _handleDimensionChange = () => {
    const dimension = {
      width: window.screen.width,
      height: window.screen.height,
    };
    this.props.updateDimension(dimension);
  }

  render() {
    return null;
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  updateDimension,
}, dispatch);

export default compose(
  connect(null, mapDispatchToProps),
)(DeviceWatcher);
