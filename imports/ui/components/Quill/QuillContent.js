import _ from 'lodash';
import PropTypes from 'prop-types';
import jsonp from 'jsonp';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { snackBarOpen } from '/imports/ui/redux/actions';
import Modal from '/imports/ui/components/Modal';
import '/node_modules/quill/dist/quill.snow.css';
import './Quill.css';

class QuillContent extends Component {
  static propTypes = {
    content: PropTypes.string.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.anchors = this.content.querySelectorAll('a');
    this.anchors.forEach((a) => {
      const href = a.href;
      const regex = /^https:\/\/getbible.net\/json\?/;
      if (href.search(regex) !== -1) {
        a.addEventListener('click', this._handleAnchorClick, false);
      }
    });
  }

  componentWillUnmount() {
    this.anchors.forEach((a) => {
      const href = a.href;
      const regex = /^https:\/\/getbible.net\/json\?/;
      if (href.search(regex) !== -1) {
        a.removeEventListener('click', this._handleAnchorClick, false);
      }
    });
  }

  _handleAnchorClick = async (e) => {
    e.preventDefault();

    await Modal.showLoader('获取中');

    const url = e.target.href;
    const chapter = e.target.text;

    jsonp(url, null, (err, data) => {
      if (err) {
        console.warn(err);
        Modal.close();
        this.props.snackBarOpen(`获取失败 ${err}`);
      } else {
        let verses = data.chapter || data.book[0].chapter;
        verses = _.map(verses, (verse) => (
          `<small>${verse.verse_nr}</small> ${verse.verse}`
        ));
        Modal.show({
          title: chapter,
          content: <div dangerouslySetInnerHTML={{ __html: verses }} />,
        });
      }
    });
  }

  render() {
    const { content } = this.props;
    return (
      <div className="ql-container ql-snow">
        <div
          className="ql-editor"
          ref={(node) => { this.content = node; }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  snackBarOpen,
}, dispatch);

export default connect(null, mapDispatchToProps)(QuillContent);
