import get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Infinite from 'react-infinite';
import { readNote } from '/imports/api/notes/methods';
import DataLoader from '/imports/ui/components/Loader/DataLoader';
import { snackBarOpen } from '/imports/ui/redux/actions';
import NoteHolder from '/imports/ui/components/NoteHolder';
import GetHeightWrapper from './GetHeightWrapper';
import Tip from './Tip';

class InfiniteNoteList extends PureComponent {
  static propTypes = {
    notes: PropTypes.array.isRequired,
    offset: PropTypes.number,
    disabled: PropTypes.bool,
    isLoadedAll: PropTypes.bool,
    showActions: PropTypes.bool,
    onInfiniteLoad: PropTypes.func.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
  }

  static defaultProps = {
    offset: -32,
    disabled: false,
    isLoadedAll: false,
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

  generateNotes(notes) {
    const { showActions } = this.props;
    const heights = [];
    const notesAlias = notes.map((note, i) => {
      heights[i] = get(this, `state.heights[${i}]`) || 200;
      return (
        <GetHeightWrapper
          key={note._id}
          getHeight={(height) => {
            if (heights[i] !== height) {
              this.setState((prevState) => {
                const newHeights = [...prevState.heights];
                newHeights[i] = height;
                return { heights: newHeights };
              });
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
    } catch (err) {
      console.warn(err);
      this.props.snackBarOpen(`标记已读失败 ${err.reason}`);
    }
  }

  render() {
    const {
      offset,
      disabled,
      isLoadedAll,
    } = this.props;
    return [
      <Infinite
        key="Infinite__NoteList"
        className="inset"
        elementHeight={this.state.heights}
        onInfiniteLoad={this.props.onInfiniteLoad}
        loadingSpinnerDelegate={<DataLoader bottom />}
        infiniteLoadBeginEdgeOffset={disabled ? undefined : offset}
        useWindowAsScrollContainer
      >
        {this.state.notes}
      </Infinite>,
      isLoadedAll && <Tip key="Infinite_Tip" />,
    ];
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  snackBarOpen,
}, dispatch);

export default connect(null, mapDispatchToProps)(InfiniteNoteList);
