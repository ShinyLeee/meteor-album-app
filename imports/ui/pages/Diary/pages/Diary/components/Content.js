import moment from 'moment';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import FadeTransition from '/imports/ui/components/Transition/Fade';
import FloatButton from '/imports/ui/components/FloatButton';
import DiaryHolder from './DiaryHolder';
import DiaryViewer from './DiaryViewer';

export default class DiaryContent extends PureComponent {
  static propTypes = {
    diarys: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired,
    diaryOpen: PropTypes.func.isRequired,
  }

  _navToWritePage = () => {
    this.props.history.push('/diary/write');
  }

  render() {
    const { diarys } = this.props;
    return [
      <TransitionGroup key="DiaryList">
        {
          diarys.map((diary) => {
            const diaryTime = moment(diary.updatedAt).format('YYYY.MM.DD A HH:mm');
            const diaryWithTime = diary;
            diaryWithTime.time = diaryTime;
            return (
              <FadeTransition key={diary._id} exit={false}>
                <DiaryHolder
                  diary={diaryWithTime}
                  onDiaryClick={(d) => this.props.diaryOpen(d)}
                />
              </FadeTransition>
            );
          })
        }
      </TransitionGroup>,
      <FloatButton key="NavButton" onClick={this._navToWritePage} />,
      <DiaryViewer key="DiaryViewer" />,
    ];
  }
}
