import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import settings from '/imports/utils/settings';
import {
  Wrapper,
  Title,
  Image,
  Message,
} from './ErrorHolder.style';

const { sourceDomain } = settings;

const ErrorHolder = ({ title, type, message }) => (
  <Wrapper>
    <Title>{title}</Title>
    <Image>
      <img
        src={`${sourceDomain}/GalleryPlus/Error/${type}.png`}
        alt={type}
      />
    </Image>
    <Message>{message}</Message>
    <Message>
      请检查地址是否输入正确&nbsp;
      <Link to="/">返回首页</Link>，或向管理员汇报这个问题
    </Message>
  </Wrapper>
);

ErrorHolder.propTypes = {
  title: PropTypes.string.isRequired,
  type: PropTypes.oneOf([
    'Construction',
    '403',
    '404',
    '500',
  ]).isRequired,
  message: PropTypes.string.isRequired,
};

export default ErrorHolder;
