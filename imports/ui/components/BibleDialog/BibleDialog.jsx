import React, { PropTypes } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { dialogClose } from '/imports/ui/redux/actions/index.js';

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
          <CircularProgress style={{ verticalAlign: 'bottom' }} />
          <span style={{ marginLeft: '32px', lineHeight: '40px', color: '#222' }}>获取中...</span>
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

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => bindActionCreators({
  bibleDialogClose: dialogClose,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(BibleDialog);
