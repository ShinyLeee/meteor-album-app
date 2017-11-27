import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { compose } from 'redux';
import { setDisplayName } from 'recompose';
import { withStyles } from 'material-ui/styles';
import Divider from 'material-ui/Divider';
import Input from 'material-ui/Input';
import QuillEditor from '/imports/ui/components/Quill/QuillEditor';

const quillConfig = {
  toolbar: {
    container: [
      [{ header: [1, 2, false] }],
      ['bold', { color: [] }, { align: [false, 'center', 'right'] }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
    ],
  },
};

class WriteContent extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onTitleChange: PropTypes.func.isRequired,
    onContentChange: PropTypes.func.isRequired,
  }

  state = {
    title: '',
  }

  _handleTitleChange = (e) => {
    const title = e.target.value;
    this.setState({ title });
    this.props.onTitleChange(title);
  }

  render() {
    const { classes } = this.props;
    return [
      <Input
        key="Input"
        className={classes.input}
        value={this.state.title}
        placeholder="标题"
        onChange={this._handleTitleChange}
        disableUnderline
        fullWidth
      />,
      <Divider key="Divider" />,
      <QuillEditor
        key="Editor"
        style={{ flex: 1 }}
        placeholder="内容"
        modules={quillConfig}
        contentType="delta"
        onChange={this.props.onContentChange}
      />,
    ];
  }
}

const styles = {
  input: {
    display: 'flex',
    alignItems: 'center',
    height: 48,
    padding: '0 20px',
  },
};

export default compose(
  setDisplayName('DiaryWriteContentContainer'),
  withStyles(styles),
)(WriteContent);
