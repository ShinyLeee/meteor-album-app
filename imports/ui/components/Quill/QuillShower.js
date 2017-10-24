import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Quill from 'quill';
import '/node_modules/quill/dist/quill.snow.css';
import './Quill.css';

export default class QuillShower extends Component {
  static propTypes = {
    content: PropTypes.object.isRequired,
    className: PropTypes.string,
    theme: PropTypes.oneOf(['snow', 'bubble']),
    modules: PropTypes.object,
  }

  static defaultProps = {
    className: 'component__QuillShower',
    theme: 'snow',
    modules: { toolbar: false },
  }

  constructor(props) {
    super(props);
    this.Quill = undefined;
  }

  componentDidMount() {
    this.initShower();
  }

  componentWillReceiveProps(nextProps) {
    const { content } = nextProps;

    const isEqual = JSON.stringify(this.props.content) === JSON.stringify(content);
    if (!isEqual) {
      this.Quill.enable();
      this.Quill.setContents(content, 'user');
      this.Quill.disable();
    }
  }

  initShower() {
    const { theme, modules, content } = this.props;
    this.Quill = new Quill(this.editor, { theme, modules });
    this.Quill.setContents(content, 'user');
    this.Quill.disable();
  }

  render() {
    const { className } = this.props;

    return (
      <div className={className}>
        <div
          id="Quill__shower"
          ref={(node) => { this.editor = node; }}
        />
      </div>
    );
  }
}
