import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import FadeTransition from '/imports/ui/components/Transition/Fade';
import ContentLayout from '/imports/ui/layouts/ContentLayout';
import FloatButton from '/imports/ui/components/FloatButton';
import DiaryHolder from './DiaryHolder';


export default class DiaryContent extends Component {
  static propTypes = {
    dataIsReady: PropTypes.bool.isRequired,
    diarys: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired,
    diaryOpen: PropTypes.func.isRequired,
  }

  render() {
    const { dataIsReady, diarys } = this.props;
    return (
      <ContentLayout loading={!dataIsReady} loadingType="Circle" topbarHeight={260}>
        <DiaryHolder />
        <FloatButton onClick={() => this.props.history.push('/diary/write')} />
        <div className="content__diary">
          <TransitionGroup>
            {
              diarys.map((diary) => {
                const diaryTime = moment(diary.updatedAt).format('YYYY.MM.DD A HH:mm');
                const activeDiary = diary;
                activeDiary.time = diaryTime;
                return (
                  <FadeTransition key={diary._id} exit={false}>
                    <article className="diary__item">
                      <header className="diary__title">
                        <h3>{diary.title}</h3>
                      </header>
                      <article className="diary__content" onClick={() => this.props.diaryOpen(activeDiary)}>
                        {diary.outline}
                      </article>
                      <footer className="diary__footer">
                        <time className="diary__time" dateTime={diaryTime}>{diaryTime}</time>
                      </footer>
                    </article>
                  </FadeTransition>
                );
              })
            }
          </TransitionGroup>
        </div>
      </ContentLayout>
    );
  }
}
