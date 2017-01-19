import React, { PureComponent, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import IconButton from 'material-ui/IconButton';
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import { blue500 } from 'material-ui/styles/colors';
import scrollTo from '/imports/utils/scrollTo.js';

import NavHeader from '/imports/ui/components/NavHeader/NavHeader.jsx';
import EmptyHolder from '/imports/ui/components/EmptyHolder/EmptyHolder.jsx';
import Loading from '/imports/ui/components/Loader/Loading.jsx';
import NoteHolder from '../../components/NoteHolder/NoteHolder.jsx';

export default class AllNotesPage extends PureComponent {

  renderContent() {
    if (this.props.AllNotes.length === 0) return (<EmptyHolder mainInfo="您还未收到消息" />);
    return (
      <div className="content__allNotes">
        {
          this.props.AllNotes.map((note) => this.props.otherUsers.map((user) => note.sender === user.username &&
          (
            <NoteHolder
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
    return (
      <div className="container">
        <NavHeader
          User={this.props.User}
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
            this.props.dataIsReady
            ? this.renderContent()
            : (<Loading />)
          }
        </div>
      </div>
    );
  }

}

AllNotesPage.displayName = 'AllNotesPage';

AllNotesPage.propTypes = {
  User: PropTypes.object,
  // Below Pass from database
  dataIsReady: PropTypes.bool.isRequired,
  otherUsers: PropTypes.array.isRequired,
  AllNotes: PropTypes.array.isRequired,
};
