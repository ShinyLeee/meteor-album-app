import moment from 'moment';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import FadeTransition from '/imports/ui/components/Transition/Fade';
import ContentLayout from '/imports/ui/layouts/ContentLayout';
import FloatButton from '/imports/ui/components/FloatButton';
import DiaryHolder from './DiaryHolder';
import DiaryViewer from './DiaryViewer';

export default class DiaryContent extends PureComponent {
  static propTypes = {
    dataIsReady: PropTypes.bool.isRequired,
    diarys: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired,
    diaryOpen: PropTypes.func.isRequired,
  }

  render() {
    const { dataIsReady, diarys } = this.props;
    return (
      <ContentLayout
        loading={!dataIsReady}
        loadingType="Circle"
        delay
      >
        <TransitionGroup style={{ marginTop: -64 }}>
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
        </TransitionGroup>
        <DiaryViewer />
        <FloatButton onClick={() => this.props.history.push('/diary/write')} />
      </ContentLayout>
    );
  }
}
