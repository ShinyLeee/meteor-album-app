import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';
import LinearProgress from 'material-ui/LinearProgress';
import IconButton from 'material-ui/IconButton';
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import { blue500 } from 'material-ui/styles/colors';
import scrollTo from '/imports/utils/scrollTo.js';

import ConnectedNavHeader from '../../containers/NavHeaderContainer.jsx';
import NoteHolder from '../../components/Note/NoteHolder.jsx';

const styles = {
  indeterminateProgress: {
    position: 'fixed',
    backgroundColor: 'none',
    zIndex: 99,
  },
};

export default class AllNotesPage extends Component {

  renderNotes() {
    if (this.props.AllNotes.length === 0) {
      return (
        <div className="Empty">
          <div className="Empty__container">
            <img
              className="Empty__logo"
              src={`${this.props.sourceDomain}/GalleryPlus/Default/empty.png`}
              role="presentation"
            />
            <h2 className="Empty__header">Oops!</h2>
            <p className="Empty__info">您还未收到消息</p>
          </div>
        </div>
      );
    }
    return (
      <div className="note">
        {
          this.props.AllNotes.map((note) => this.props.otherUsers.map((user) => note.sender === user.username &&
          (
            <NoteHolder
              User={this.props.User}
              sender={user}
              note={note}
              isRead
            />
          )))
        }
      </div>
    );
  }

  render() {
    const { User, dataIsReady } = this.props;
    return (
      <div className="container">
        <ConnectedNavHeader
          User={User}
          title="全部消息"
          style={{ backgroundColor: blue500 }}
          onTitleTouchTap={() => scrollTo(0, 1500)}
          iconElementLeft={
            <IconButton onTouchTap={() => browserHistory.goBack()}>
              <ArrowBackIcon />
            </IconButton>
          }
        />
        <div className="content">
          {
            dataIsReady
            ? this.renderNotes()
            : (<LinearProgress style={styles.indeterminateProgress} mode="indeterminate" />)
          }
        </div>
      </div>
    );
  }

}

AllNotesPage.defaultPage = {
  sourceDomain: Meteor.settings.public.sourceDomain,
};

AllNotesPage.propTypes = {
  User: PropTypes.object,
  sourceDomain: PropTypes.string.isRequired,
  // Below pass from database
  dataIsReady: PropTypes.bool.isRequired,
  otherUsers: PropTypes.array.isRequired,
  AllNotes: PropTypes.array.isRequired,
};
