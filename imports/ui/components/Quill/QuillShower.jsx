import React, { Component, PropTypes } from 'react';
import Quill from 'quill';

export default class QuillShower extends Component {

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

QuillShower.displayName = 'QuillShower';

QuillShower.defaultProps = {
  className: 'component__QuillShower',
  theme: 'snow',
  modules: { toolbar: false },
};

QuillShower.propTypes = {
  className: PropTypes.string.isRequired,
  theme: PropTypes.oneOf(['snow', 'bubble']).isRequired,
  modules: PropTypes.object.isRequired,
  content: PropTypes.object.isRequired,
};
