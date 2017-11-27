import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Delta from 'quill-delta';
import Divider from 'material-ui/Divider';
import Input from 'material-ui/Input';
import { QuillEditor } from '/imports/ui/components/Quill';
import AutocompleteWrapper from './Autocomplete';

export default class SendNoteContent extends PureComponent {
  static propTypes = {
    initReceiver: PropTypes.string,
    otherUsers: PropTypes.array.isRequired,
    classes: PropTypes.object.isRequired,
    onNoteChange: PropTypes.func.isRequired,
  }

  state = {
    receiver: '',
    title: '',
  }

  componentDidMount() {
    const { initReceiver } = this.props;
    if (initReceiver) {
      this._handleReceiverChange(initReceiver);
    }
  }

  get quillModulesConfig() {
    return {
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ['bold', 'blockquote', { align: [false, 'center', 'right'] }],
          ['link', 'image'],
        ],
        handlers: {
          image: this.imageHandler,
        },
      },
    };
  }

  imageHandler() {
    // add limit image size feature to quill default image handler
    let fileInput = this.container.querySelector('input.ql-image[type=file]');
    if (fileInput == null) {
      const img = document.createElement('img');
      fileInput = document.createElement('input');
      fileInput.setAttribute('type', 'file');
      fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon, image/svg+xml');
      fileInput.classList.add('ql-image');
      fileInput.addEventListener('change', () => {
        if (fileInput.files != null && fileInput.files[0] != null) {
          const reader = new FileReader();
          reader.onload = (e) => {
            img.src = e.target.result;
            fileInput.value = '';

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            const MAX_WIDTH = 800;
            const MAX_HEIGHT = 600;
            let { width, height } = img;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
            canvas.width = width;
            canvas.height = height;
            const nCtx = canvas.getContext('2d');
            nCtx.drawImage(img, 0, 0, width, height);

            const dataUrl = canvas.toDataURL('image/jpeg');
            const range = this.quill.getSelection(true);
            this.quill.updateContents(new Delta()
              .retain(range.index)
              .delete(range.length)
              .insert({ image: dataUrl })
              , 'user');
          };
          reader.readAsDataURL(fileInput.files[0]);
        }
      });
      this.container.appendChild(fileInput);
    }
    fileInput.click();
  }

  _handleReceiverChange = (value) => {
    this.setState({ receiver: value });
    this.props.onNoteChange({
      ...this.state,
      receiver: value,
    });
  }

  _handleTitleChange = (e) => {
    const title = e.target.value;
    this.setState({ title });
    this.props.onNoteChange({
      ...this.state,
      title,
    });
  }

  _handleContentChange = (outline, content) => {
    this.props.onNoteChange({
      ...this.state,
      content,
    });
  }

  render() {
    const { otherUsers, classes } = this.props;
    return (
      <div>
        <AutocompleteWrapper
          value={this.state.receiver}
          data={otherUsers}
          onChange={this._handleReceiverChange}
          onComplete={this._handleReceiverChange}
        />
        <Divider />
        <Input
          className={classes.input}
          placeholder="标题"
          value={this.state.title}
          onChange={this._handleTitleChange}
          disableUnderline
          fullWidth
        /><Divider />
        <QuillEditor
          placeholder="内容"
          modules={this.quillModulesConfig}
          onChange={this._handleContentChange}
        />
      </div>
    );
  }
}
