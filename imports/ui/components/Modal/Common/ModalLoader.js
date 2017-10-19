import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import CircleLoader from '/imports/ui/components/Loader/CircleLoader';
import { modalClose, snackBarOpen } from '/imports/ui/redux/actions';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Message = styled.p`
  font-size: 14px;
  color: #222;
  margin-left: 36px;
`;

class ModalLoader extends Component {
  static propTypes = {
    message: PropTypes.string.isRequired,
    autoHideDuration: PropTypes.number,
    errMsg: PropTypes.string,
    modalClose: PropTypes.func.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
  }

  static defaultProps = {
    autoHideDuration: 5000,
    errMsg: '请求超时',
  }

  constructor(props) {
    super(props);
    this._autoHideTimer = null;
  }

  componentDidMount() {
    this.setTimer();
  }

  componentWillUnmount() {
    this.clearTimer();
  }

  setTimer() {
    const { autoHideDuration } = this.props;
    this._autoHideTimer = setTimeout(
      this.timeoutHandler,
      autoHideDuration,
    );
  }

  clearTimer() {
    if (this._autoHideTimer) {
      clearTimeout(this._autoHideTimer);
      this._autoHideTimer = null;
    }
  }


  timeoutHandler = () => {
    const { errMsg } = this.props;
    this.props.modalClose();
    this.props.snackBarOpen(errMsg);
  }

  render() {
    const { message } = this.props;
    return (
      <Wrapper>
        <CircleLoader />
        <Message>{message}</Message>
      </Wrapper>
    );
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  modalClose,
  snackBarOpen,
}, dispatch);


export default connect(null, mapDispatchToProps)(ModalLoader);
