import PropTypes from 'prop-types';
import React from 'react';
import Dialog from 'material-ui/Dialog';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { dialogClose } from '/imports/ui/redux/actions/index.js';
import { LoadingCircularProgress, LoadingMessage } from './BibleDialog.style.js';

const BibleDialog = ({ open, bible, bibleDialogClose }) => (
  <Dialog
    open={open}
    title={bible && bible.chapter}
    onRequestClose={bible && bibleDialogClose}
    bodyStyle={{ padding: '24px' }}
    autoScrollBodyContent
  >
    {
      bible
      ? (<div dangerouslySetInnerHTML={{ __html: bible && bible.verses }} />)
      : (
        <div className="text-center">
          <LoadingCircularProgress color="#3F51B5" />
          <LoadingMessage>获取中...</LoadingMessage>
        </div>
      )
    }
  </Dialog>
);

BibleDialog.displayName = 'BibleDialog';

BibleDialog.defaultProps = {
  open: false,
};

BibleDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  bible: PropTypes.shape({
    chapter: PropTypes.string,
    verses: PropTypes.array,
  }),
  bibleDialogClose: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  open: state.dialog.open,
  bible: state.dialog.bible,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  bibleDialogClose: dialogClose,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(BibleDialog);
