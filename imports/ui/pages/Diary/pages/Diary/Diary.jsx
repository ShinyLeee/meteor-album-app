import moment from 'moment';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import AddIcon from 'material-ui/svg-icons/content/add';
import ChevronLeftIcon from 'material-ui/svg-icons/navigation/chevron-left';
import ChevronRightIcon from 'material-ui/svg-icons/navigation/chevron-right';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { grey400 } from 'material-ui/styles/colors';
import { removeDiary } from '/imports/api/diarys/methods.js';

import NavHeader from '/imports/ui/components/NavHeader/NavHeader.jsx';
import Loading from '/imports/ui/components/Loader/Loading.jsx';
import DiaryHolder from '../../components/DiaryHolder/DiaryHolder.jsx';

export default class DiaryPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isAlertOpen: false,
      removeDiaryId: undefined,
      navTitle: undefined,
      iconColor: '#fff',
      isDiaryOpen: false,
      diaryTitle: undefined,
      diaryContent: undefined,
      diaryTime: undefined,
    };
    this.handleScroll = this.handleScroll.bind(this);
    this.handleRemoveDiary = this.handleRemoveDiary.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll, false);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll, false);
  }

  handleScroll() {
    if (window.scrollY > 292) this.setState({ title: '返回顶部', iconColor: '#222' });
    else this.setState({ title: '', iconColor: '#fff' });
  }

  handleRemoveDiary(e) {
    e.preventDefault();
    const { removeDiaryId } = this.state;

    if (!removeDiaryId) {
      this.props.snackBarOpen('请选择要删除的日记');
      return;
    }
    removeDiary.callPromise({ diaryId: removeDiaryId })
    .then(() => {
      this.setState({ isAlertOpen: false, removeDiaryId: undefined });
      this.props.snackBarOpen('删除成功');
    })
    .catch((err) => {
      this.setState({ isAlertOpen: false, removeDiaryId: undefined });
      console.log(err); // eslint-disable-line no-console
      this.props.snackBarOpen(err.reason || '删除日记失败');
      throw new Meteor.Error(err);
    });
  }

  handleOpenDiary(e, diary, diaryTime) {
    this.setState({
      isDiaryOpen: true,
      diaryTitle: diary.title,
      diaryContent: diary.content,
      diaryTime,
    });
  }

  renderContent() {
    const { sourceDomain, date, diarys } = this.props;
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth();
    return (
      <div className="content__diary">
        <div
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
        </div>
        <div className="diary__body">
          {
            diarys.map((diary, i) => {
              const diaryTime = moment(diary.createdAt).format('YYYY.MM.DD A HH:mm');
              return (
                <ReactCSSTransitionGroup
                  key={i}
                  transitionName="fade"
                  transitionAppear
                  transitionAppearTimeout={375}
                  transitionEnterTimeout={375}
                  transitionLeave={false}
                >
                  <div
                    key={i}
                    className="diary__item"
                  >
                    <div className="diary__title">
                      <h3>{diary.title}</h3>
                      <IconMenu
                        style={{ position: 'absolute', right: 0, top: '12px' }}
                        iconButtonElement={<IconButton><MoreVertIcon color={grey400} /></IconButton>}
                      >
                        <MenuItem onTouchTap={(e) => this.handleOpenDiary(e, diary, diaryTime)}>查看</MenuItem>
                        {/* <MenuItem onTouchTap={() => browserHistory.push(`/diary/edit/${diary._id}`)}>编辑</MenuItem>*/}
                        <MenuItem onTouchTap={() => this.setState({ isAlertOpen: true, removeDiaryId: diary._id })}>删除</MenuItem>
                      </IconMenu>
                    </div>
                    <p className="diary__content">{diary.content}</p>
                    <p className="diary__footer">
                      <span className="diary__time">{diaryTime}</span>
                    </p>
                  </div>
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
      isDiaryOpen,
      diaryTitle,
      diaryContent,
      diaryTime,
    } = this.state;
    const actions = [
      <FlatButton
        label="取消"
        onTouchTap={() => this.setState({ isAlertOpen: false, removeDiaryId: undefined })}
        keyboardFocused
        primary
      />,
      <FlatButton
        label="确认"
        onTouchTap={this.handleRemoveDiary}
        primary
      />,
    ];
    return (
      <div className="container">
        <NavHeader
          style={{ backgroundColor: 'transparent' }}
          title={navTitle}
          titleStyle={navTitle ? { color: '#222' } : {}}
          iconColor={iconColor}
          secondary
        />
        <div className="content">
          { this.props.dataIsReady ? this.renderContent() : <Loading style={{ top: 0 }} /> }
          <DiaryHolder
            open={isDiaryOpen}
            title={diaryTitle}
            content={diaryContent}
            time={diaryTime}
            onRequestClose={() => this.setState({ isDiaryOpen: false })}
          />
          <Dialog
            title="提示"
            titleStyle={{ border: 'none' }}
            actions={actions}
            actionsContainerStyle={{ border: 'none' }}
            open={this.state.isAlertOpen}
            modal
          >您是否确认删除此日记？
          </Dialog>
        </div>
        <div className="component__FloatBtn">
          <FloatingActionButton
            onTouchTap={() => browserHistory.push('/diary/write')}
            secondary
          ><AddIcon />
          </FloatingActionButton>
        </div>
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
  snackBarOpen: PropTypes.func.isRequired,
};
