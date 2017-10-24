import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Quill from 'quill';
import '/node_modules/quill/dist/quill.snow.css';
import './Quill.css';

export default class QuillEditor extends Component {
  static propTypes = {
    className: PropTypes.string,
    readOnly: PropTypes.bool,
    placeholder: PropTypes.string,
    theme: PropTypes.oneOf(['snow', 'bubble']),
    modules: PropTypes.object,
    contentType: PropTypes.oneOf(['html', 'delta']),
    content: PropTypes.object,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    className: 'component__QuillEditor',
    readOnly: false,
    theme: 'snow',
    modules: { toolbar: false },
    contentType: 'html',
  }

  constructor(props) {
    super(props);
    this.Quill = undefined;
  }

  componentDidMount() {
    this.initEditor();
  }

  initEditor() {
    const {
      readOnly,
      placeholder,
      theme,
      modules,
      contentType,
      content,
      onChange,
    } = this.props;

    this.Quill = new Quill(this.editor, {
      readOnly,
      placeholder,
      theme,
      modules,
    });

    if (content) this.Quill.setContents(content, 'user');

    if (onChange) {
      this.Quill.on('text-change', () => {
        const outlineText = this.Quill.getText(0, 80);
        if (contentType === 'html') onChange(outlineText, this.Quill.root.innerHTML);
        else if (contentType === 'delta') onChange(outlineText, this.Quill.getContents());
      });
    }
  }

  render() {
    const { className } = this.props;

    return (
      <div className={className}>
        <div
          id="Quill__editor"
          ref={(node) => { this.editor = node; }}
        />
      </div>
    );
  }
}
