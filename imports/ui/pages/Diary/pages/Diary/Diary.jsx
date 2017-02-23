import moment from 'moment';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import IconButton from 'material-ui/IconButton';
import ChevronLeftIcon from 'material-ui/svg-icons/navigation/chevron-left';
import ChevronRightIcon from 'material-ui/svg-icons/navigation/chevron-right';
import NavHeader from '/imports/ui/components/NavHeader/NavHeader.jsx';
import Loading from '/imports/ui/components/Loader/Loading.jsx';
import FloatButton from '/imports/ui/components/FloatButton/FloatButton.jsx';
import DiaryHolder from '../../components/DiaryHolder/DiaryHolder.jsx';

export default class DiaryPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      navTitle: undefined,
      iconColor: '#fff',
    };
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll, false);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll, false);
  }

  handleScroll() {
    if (window.scrollY > 292) this.setState({ navTitle: '返回顶部', iconColor: '#222' });
    else this.setState({ navTitle: '', iconColor: '#fff' });
  }

  renderContent() {
    const { sourceDomain, date, diarys } = this.props;
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
              style={{ padding: 0 }}
              iconStyle={{ width: '32px', height: '32px', color: '#fff' }}
              onTouchTap={() => browserHistory.replace(`/diary?year=${currentYear - 1}`)}
            ><ChevronLeftIcon />
            </IconButton>
            <h1>{currentYear}</h1>
            <IconButton
              style={{ padding: 0 }}
              iconStyle={{ width: '32px', height: '32px', color: '#fff' }}
              onTouchTap={() => browserHistory.replace(`/diary?year=${currentYear + 1}`)}
            ><ChevronRightIcon />
            </IconButton>
          </div>
          <div className="diary__month">
            {
              _.times(12, (i) => (
                <span
                  key={i + 1}
                  className={currentMonth === i ? 'diary__month_select' : ''}
                  onTouchTap={() => browserHistory.replace(`/diary?year=${currentYear}&month=${i + 1}`)}
                >
                  {i + 1}
                </span>
              ))
            }
          </div>
        </header>
        <div className="diary__body">
          {
            diarys.map((diary, i) => {
              const diaryTime = moment(diary.updatedAt).format('YYYY.MM.DD A HH:mm');
              const activeDiary = diary;
              activeDiary.time = diaryTime;
              return (
                <ReactCSSTransitionGroup
                  key={i}
                  transitionName="fade"
                  transitionAppear
                  transitionAppearTimeout={375}
                  transitionEnterTimeout={375}
                  transitionLeave={false}
                >
                  <article key={i} className="diary__item">
                    <header className="diary__title">
                      <h3>{diary.title}</h3>
                    </header>
                    <article className="diary__content" onTouchTap={() => this.props.diaryOpen(activeDiary)}>
                      {diary.outline}
                    </article>
                    <footer className="diary__footer">
                      <time className="diary__time" dateTime={diaryTime}>{diaryTime}</time>
                    </footer>
                  </article>
                </ReactCSSTransitionGroup>
              );
            })
          }
        </div>
      </div>
    );
  }

  render() {
    const {
      navTitle,
      iconColor,
    } = this.state;
    return (
      <div className="container">
        <NavHeader
          style={{ backgroundColor: 'transparent' }}
          title={navTitle}
          titleStyle={navTitle ? { color: '#222' } : {}}
          iconColor={iconColor}
          secondary
        />
        <main className="content">
          {
            this.props.dataIsReady
            ? this.renderContent()
            : (<Loading style={{ top: 0 }} />)
          }
          <DiaryHolder />
        </main>
        <FloatButton onBtnClick={() => browserHistory.push('/diary/write')} />
      </div>
    );
  }

}

DiaryPage.displayName = 'DiaryPage';

DiaryPage.defaultProps = {
  sourceDomain: Meteor.settings.public.sourceDomain,
};

DiaryPage.propTypes = {
  User: PropTypes.object,
  sourceDomain: PropTypes.string.isRequired,
  // Below Pass from Database and Redux
  dataIsReady: PropTypes.bool.isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
  diarys: PropTypes.array.isRequired,
  diaryOpen: PropTypes.func.isRequired,
  snackBarOpen: PropTypes.func.isRequired,
};
