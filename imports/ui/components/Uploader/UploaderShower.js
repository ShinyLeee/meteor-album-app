import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Portal from '../Portal';
import {
  Wrapper,
  Inner,
  ThumbnailSection,
  DetailSection,
  Message,
  Title,
  StopButton,
  Progress,
} from './Uploader.style';

export default class UploaderShower extends Component {
  static propTypes = {
    thumb: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    progress: PropTypes.string.isRequired,
    onCancel: PropTypes.func.isRequired,
  }

  render() {
    const {
      thumb,
      title,
      message,
      progress,
    } = this.props;
    return (
      <Portal name="Uploading">
        <Wrapper>
          <Inner>
            <ThumbnailSection style={{ backgroundImage: `url(${thumb})` }} />
            <DetailSection>
              <Message>正在上传至</Message>
              <Title>{title}</Title>
              <Message>{message}</Message>
              <StopButton onClick={this.props.onCancel}>停止</StopButton>
              <Progress style={{ width: progress }} />
            </DetailSection>
          </Inner>
        </Wrapper>
      </Portal>
    );
  }
}
