import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import FadeTransition from '/imports/ui/components/Transition/Fade';
import ErrorOutlineIcon from 'material-ui-icons/ErrorOutline';
import { Wrapper, ErrorHolder } from './ProgressiveImage.style';

export default class ProgressiveImage extends PureComponent {
  static propTypes = {
    src: PropTypes.string.isRequired,
    aspectRatio: PropTypes.number.isRequired,
    max: PropTypes.number,
    color: PropTypes.string,
    style: PropTypes.object,
    disabled: PropTypes.bool,
    onLoad: PropTypes.func,
    onError: PropTypes.func,
    children: PropTypes.element.isRequired,
  }

  static defaultProps = {
    max: 60,
    color: '#eee',
    disabled: false,
  }

  state = {
    loading: true,
    error: false,
  }

  componentDidMount() {
    this.loadImage(this.props.src);
  }

  componentWillUnmount() {
    if (this.image) {
      this.image.onload = null;
      this.image.onerror = null;
    }
  }

  loadImage(src) {
    if (this.image) {
      this.image.onload = null;
      this.image.onerror = null;
    }
    const image = new Image();
    this.image = image;
    image.onload = this.loadHandler;
    image.onerror = this.errorHandler;
    image.src = src;
  }

  loadHandler = () => {
    this.setState({ loading: false });
    if (this.props.onLoad) {
      this.props.onLoad(this.props.src);
    }
  }

  errorHandler = () => {
    this.setState({ error: true });
    if (this.props.onError) {
      this.props.onError();
    }
  }

  renderChildren() {
    const { disabled, children } = this.props;
    return disabled
      ? children
      : (
        <TransitionGroup>
          <FadeTransition>
            { children }
          </FadeTransition>
        </TransitionGroup>
      );
  }

  render() {
    const {
      src,
      aspectRatio,
      max,
      color,
      style,
    } = this.props;
    const plainSrc = src.split('?')[0];
    const fillerStyle = {
      backgroundColor: color,
      paddingBottom: `${aspectRatio * 100}%`,
    };
    return (
      <Wrapper style={style}>
        <span style={fillerStyle} />
        {
          !this.state.error && (
            <img src={`${plainSrc}?imageView2/0/w/${max}`} alt="thumbnail" />
          )
        }
        {
          !this.state.loading && !this.state.error && this.renderChildren()
        }
        {
          this.state.error && (
            <ErrorHolder>
              <ErrorOutlineIcon />
              图片加载失败
            </ErrorHolder>
          )
        }
      </Wrapper>
    );
  }
}
