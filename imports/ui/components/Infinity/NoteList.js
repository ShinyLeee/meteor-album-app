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
    notesNum: PropTypes.number.isRequired,
    disabled: PropTypes.bool,
    showActions: PropTypes.bool,
    onInfiniteLoad: PropTypes.func.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
  }

  static defaultProps = {
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
    return [
      <Infinite
        key="Infinite__NoteList"
        className="inset"
        elementHeight={this.state.heights}
        onInfiniteLoad={this.props.onInfiniteLoad}
        loadingSpinnerDelegate={<DataLoader bottom />}
        infiniteLoadBeginEdgeOffset={this.isDisabled ? undefined : -60}
        useWindowAsScrollContainer
      >
        {this.state.notes}
      </Infinite>,
      this.isDisabled && <Tip key="Infinite_Tip" />,
    ];
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  snackBarOpen,
}, dispatch);

export default connect(null, mapDispatchToProps)(InfiniteNoteList);
