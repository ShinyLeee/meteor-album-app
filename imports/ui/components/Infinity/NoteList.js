import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Infinite from 'react-infinite';
import { Notes } from '/imports/api/notes/note';
import { readNote } from '/imports/api/notes/methods';
import DataLoader from '/imports/ui/components/Loader/DataLoader';
import { snackBarOpen } from '/imports/ui/redux/actions';
import NoteHolder from '/imports/ui/components/NoteHolder';
import GetHeightWrapper from './GetHeightWrapper';

class InfiniteNoteList extends Component {
  static propTypes = {
    notes: PropTypes.array.isRequired,
    notesNum: PropTypes.number.isRequired,
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    showActions: PropTypes.bool,
    onInfiniteLoad: PropTypes.func.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
  }

  static defaultProps = {
    loading: false,
    disabled: false,
    showActions: false,
  }

  constructor(props) {
    super(props);
    const { notes, heights } = this.generateNotes(props.notes);
    this.state = {
      notes,
      heights,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.notes !== nextProps.notes) {
      const { notes, heights } = this.generateNotes(nextProps.notes);
      this.setState({ notes, heights });
    }
  }

  get isDisabled() {
    return this.props.disabled || this.state.notes.length === this.props.notesNum;
  }

  generateNotes(notes) {
    const { showActions } = this.props;

    const heights = [];
    const notesAlias = notes.map((note, i) => {
      heights[i] = _.get(this, `state.heights[${i}]`) || 200;
      return (
        <GetHeightWrapper
          key={note._id}
          getHeight={(height) => {
            if (heights[i] !== height) {
              heights[i] = height;
              this.setState({ heights });
            }
          }}
        >
          <NoteHolder
            note={note}
            showActions={showActions}
            onRead={this._handleReadNote}
          />
        </GetHeightWrapper>
      );
    });
    return {
      notes: notesAlias,
      heights,
    };
  }

  _handleReadNote = async (id) => {
    try {
      await readNote.callPromise({ noteId: id });
      const newNotes = Notes.find(
        { isRead: { $ne: true } },
        { sort: { sendAt: -1 }, limit: this.state.notes.length - 1 },
      ).fetch();
      const { notes, heights } = this.generateNotes(newNotes);
      this.setState({ notes, heights });
    } catch (err) {
      console.log(err);
      this.props.snackBarOpen(`标记已读失败 ${err.reason}`);
    }
  }

  render() {
    const { loading } = this.props;
    return [
      <Infinite
        key="Infinite__NoteList"
        isInfiniteLoading={loading}
        elementHeight={this.state.heights}
        onInfiniteLoad={this.props.onInfiniteLoad}
        loadingSpinnerDelegate={<DataLoader bottom />}
        infiniteLoadBeginEdgeOffset={this.isDisabled ? undefined : -60}
        useWindowAsScrollContainer
      >
        {this.state.notes}
      </Infinite>,
      this.isDisabled && <div key="Infinite__bottom" className="bottom">已经到底部啦</div>,
    ];
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  snackBarOpen,
}, dispatch);

export default connect(null, mapDispatchToProps)(InfiniteNoteList);
