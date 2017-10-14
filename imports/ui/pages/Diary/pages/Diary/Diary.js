import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { TransitionGroup } from 'react-transition-group';
import IconButton from 'material-ui/IconButton';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import ChevronRightIcon from 'material-ui-icons/ChevronRight';
import FadeTransition from '/imports/ui/components/Transition/Fade';
import ViewLayout from '/imports/ui/layouts/ViewLayout';
import { SecondaryNavHeader } from '/imports/ui/components/NavHeader';
import settings from '/imports/utils/settings';
import FloatButton from '/imports/ui/components/FloatButton';
import DiaryHolder from '../../components/DiaryHolder';

const { sourceDomain } = settings;

export default class DiaryPage extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    dataIsReady: PropTypes.bool.isRequired,
    date: PropTypes.instanceOf(Date).isRequired,
    diarys: PropTypes.array.isRequired,
    diaryOpen: PropTypes.func.isRequired,
  }

  state = {
    navTitle: undefined,
  }

  componentDidMount() {
    window.addEventListener('scroll', this._handleScroll, false);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this._handleScroll, false);
  }

  _handleScroll = () => {
    if (window.scrollY > 292) {
      this.setState({ navTitle: '返回顶部' });
    } else {
      this.setState({ navTitle: undefined });
    }
  }

  renderContent() {
    const { history, date, diarys } = this.props;
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth();
    return (
      <div className="content__diary">
        <header
          className="diary__header"
          style={{ backgroundImage: `url(${sourceDomain}/GalleryPlus/Default/default-diary.jpg)` }}
        >
          <div className="diary__background" />
          <div className="diary__year">
            <IconButton
              color="contrast"
              onClick={() => history.replace(`/diary?year=${currentYear - 1}`)}
            >
              <ChevronLeftIcon />
            </IconButton>
            <h1>{currentYear}</h1>
            <IconButton
              color="contrast"
              onClick={() => history.replace(`/diary?year=${currentYear + 1}`)}
            >
              <ChevronRightIcon />
            </IconButton>
          </div>
          <div className="diary__month">
            {
              _.times(12, (i) => (
                <span
                  key={i + 1}
                  role="button"
                  tabIndex={-1}
                  className={currentMonth === i ? 'diary__month_select' : ''}
                  onClick={() => history.replace(`/diary?year=${currentYear}&month=${i + 1}`)}
                >
                  {i + 1}
                </span>
              ))
            }
          </div>
        </header>
        <div className="diary__body">
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
      </div>
    );
  }

  render() {
    const { dataIsReady, history } = this.props;
    return (
      <ViewLayout
        Topbar={
          <SecondaryNavHeader
            style={{ backgroundColor: 'transparent' }}
            title={this.state.navTitle}
            titleStyle={this.state.navTitle ? { color: '#222' } : null}
            iconStyle={this.state.navTitle ? { color: '#222' } : { color: '#fff' }}
          />
        }
      >
        { dataIsReady && this.renderContent() }
        <DiaryHolder />
        <FloatButton onClick={() => history.push('/diary/write')} />
      </ViewLayout>
    );
  }
}
