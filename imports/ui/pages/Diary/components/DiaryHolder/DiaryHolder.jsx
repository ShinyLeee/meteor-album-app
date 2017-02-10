import React, { PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import ArrowBackIcon from 'material-ui/svg-icons/navigation/close';

import QuillContent from '/imports/ui/components/Quill/QuillContent.jsx';

const DiaryHolder = ({ open, title, content, time, onRequestClose }) => (
  <ReactCSSTransitionGroup
    transitionName="zoomer"
    transitionEnterTimeout={300}
    transitionLeaveTimeout={300}
  >
    {
      open && (
        <div className="component__DiaryHolder">
          <AppBar
            title={title}
            titleStyle={{ color: '#666' }}
            style={{ backgroundColor: '#fff' }}
            iconElementLeft={<IconButton onTouchTap={onRequestClose}><ArrowBackIcon color="#666" /></IconButton>}
          />
          <div className="DiaryHolder__body">
            <div className="DiaryHolder__content">
              <QuillContent content={content} />
            </div>
            <div className="DiaryHolder__footer">
              <span className="DiaryHolder__time">{time}</span>
            </div>
          </div>
        </div>
      )
    }
  </ReactCSSTransitionGroup>
);

DiaryHolder.defaultProps = {
  open: false,
};

DiaryHolder.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string,
  content: PropTypes.string,
  time: PropTypes.string,
  onRequestClose: PropTypes.func.isRequired,
};

export default DiaryHolder;
