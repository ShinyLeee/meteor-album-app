import React, { PureComponent, PropTypes } from 'react';
import Quill from 'quill';

export default class QuillHolder extends PureComponent {

  constructor(props) {
    super(props);
    this.Quill = undefined;
  }

  componentDidMount() {
    const {
      readOnly,
      placeholder,
      theme,
      modules,
      onChange,
    } = this.props;

    this.Quill = new Quill(this.editor, {
      readOnly,
      placeholder,
      theme,
      modules,
    });

    this.Quill.on('text-change', () => {
      if (onChange) onChange(this.Quill.root.innerHTML);
    });
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

QuillHolder.displayName = 'QuillHolder';

QuillHolder.defaultProps = {
  className: 'component__Quill',
  readOnly: false,
  theme: 'snow',
  modules: { toolbar: true },
};

QuillHolder.propTypes = {
  className: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
  placeholder: PropTypes.string,
  theme: PropTypes.oneOf(['snow', 'bubble']).isRequired,
  modules: PropTypes.object.isRequired,
  onChange: PropTypes.func,
};
