import _ from 'lodash';
import PropTypes from 'prop-types';
import jsonp from 'jsonp';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { modalOpen, modalClose, snackBarOpen } from '/imports/ui/redux/actions';
import ModalLoader from '/imports/ui/components/Modal/Common/ModalLoader';
import '/node_modules/quill/dist/quill.snow.css';
import './Quill.css';

class QuillContent extends Component {
  static propTypes = {
    content: PropTypes.string.isRequired,
    modalOpen: PropTypes.func.isRequired,
    modalClose: PropTypes.func.isRequired,
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

  _handleAnchorClick = (e) => {
    this.renderLoadModal('获取中');

    e.preventDefault();

    const url = e.target.href;
    const chapter = e.target.text;

    jsonp(url, null, (err, data) => {
      if (err) {
        console.log(err);
        this.props.modalClose();
        this.props.snackBarOpen(`获取失败 ${err}`);
      } else {
        let verses = data.chapter || data.book[0].chapter;
        verses = _.map(verses, (verse) => (
          `<small>${verse.verse_nr}</small> ${verse.verse}`
        ));
        this.renderModal({
          title: chapter,
          content: <div dangerouslySetInnerHTML={{ __html: verses }} />,
        });
      }
    });
  }

  renderModal({ title, content }) {
    this.props.modalOpen({ title, content });
  }

  renderLoadModal = (message, errMsg = '请求超时') => {
    this.props.modalOpen({
      content: <ModalLoader message={message} errMsg={errMsg} />,
      ops: { ignoreBackdropClick: true },
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
  modalOpen,
  modalClose,
  snackBarOpen,
}, dispatch);

export default connect(null, mapDispatchToProps)(QuillContent);
