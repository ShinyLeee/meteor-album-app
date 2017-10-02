import _ from 'lodash';
import axios from 'axios';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { dialogFetch, dialogOpen, dialogClose, snackBarOpen } from '/imports/ui/redux/actions/index.js';

class QuillContent extends Component {
  static propTypes = {
    content: PropTypes.string.isRequired,
    dialogFetch: PropTypes.func.isRequired,
    dialogOpen: PropTypes.func.isRequired,
    dialogClose: PropTypes.func.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.anchors = this.content.querySelectorAll('a');
    this.anchors.forEach((a) => {
      const href = a.href;
      const regex = /^https:\/\/getbible.net\/json\?/;
      if (href.search(regex) !== -1) {
        a.addEventListener('click', this.anchorClick, false);
      }
    });
  }

  componentWillUnmount() {
    this.anchors.forEach((a) => {
      const href = a.href;
      const regex = /^https:\/\/getbible.net\/json\?/;
      if (href.search(regex) !== -1) {
        a.removeEventListener('click', this.anchorClick, false);
      }
    });
  }

  anchorClick(e) {
    e.preventDefault();

    const url = e.target.href;
    const chapter = e.target.text;

    this.props.dialogFetch();
    axios({
      method: 'GET',
      url,
    })
    .then((data) => {
      let verses = data.chapter || data.book[0].chapter;
      verses = _.map(verses, (verse) => (
        `<small>${verse.verse_nr}</small> ${verse.verse}`
      ));
      this.props.dialogOpen({ chapter, verses });
    })
    .catch((err) => {
      this.props.dialogClose();
      this.props.snackBarOpen(`获取失败 ${err.reason}`);
      console.log(err);
    });
  }

  render() {
    return (
      <div className="ql-container ql-snow">
        <div
          className="ql-editor"
          ref={(node) => { this.content = node; }}
          dangerouslySetInnerHTML={{ __html: this.props.content }}
        />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  dialogFetch,
  dialogOpen,
  dialogClose,
  snackBarOpen,
}, dispatch);

export default connect(null, mapDispatchToProps)(QuillContent);
