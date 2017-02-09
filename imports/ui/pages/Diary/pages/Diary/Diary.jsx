import moment from 'moment';
import { _ } from 'meteor/underscore';
import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import AddIcon from 'material-ui/svg-icons/content/add';
import ChevronLeftIcon from 'material-ui/svg-icons/navigation/chevron-left';
import ChevronRightIcon from 'material-ui/svg-icons/navigation/chevron-right';

import NavHeader from '/imports/ui/components/NavHeader/NavHeader.jsx';
import Loading from '/imports/ui/components/Loader/Loading.jsx';

export default class DiaryPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  renderContent() {
    const { diarys } = this.props;
    return (
      <div className="content__diary">
        <div className="diary__header">
          <div className="diary__background" />
          <div className="diary__year">
            <IconButton
              style={{ padding: 0 }}
              iconStyle={{ width: '32px', height: '32px', color: '#fff' }}
            ><ChevronLeftIcon />
            </IconButton>
            <h1>2017</h1>
            <IconButton
              style={{ padding: 0 }}
              iconStyle={{ width: '32px', height: '32px', color: '#fff' }}
            ><ChevronRightIcon />
            </IconButton>
          </div>
          <div className="diary__month">
            {
              _.times(12, (i) => (<div key={i}><span>{i + 1}</span></div>))
            }
          </div>
        </div>
        <div className="diary__body">
          <div className="diary__item">
            <h3 className="diary__title">什么是Lorem Ipsum?</h3>
            <p className="diary__content">Lorem Ipsum，也称乱数假文或者哑元文本， 是印刷及排版领域所常用的虚拟文字。由于曾经一台匿名的打印机刻意打乱了一盒印刷字体从而造出一本字体样品书，Lorem Ipsum从西元15世纪起就被作为此领域的标准文本使用。它不仅延续了五个世纪，还通过了电子排版的挑战，其雏形却依然保存至今。在1960年代，”Leatraset”公司发布了印刷着Lorem Ipsum段落的纸张，从而广泛普及了它的使用。最近，计算机桌面出版软件”Aldus PageMaker”也通过同样的方式使Lorem Ipsum落入大众的视野。</p>
            <p className="diary__footer">
              <span className="diary__time">2017.02.09 AM 16:50</span>
            </p>
          </div>
          {
            diarys.map((diary, i) => (
              <div key={i} className="diary__item">
                <h3 className="diary__title">{diary.title}</h3>
                <p className="diary__content">{diary.content}</p>
                <p className="diary__footer">
                  <span className="diary__time">{moment(diary.createdAt).format('YYYY.MM.DD A HH:mm') }</span>
                </p>
              </div>
            ))
          }
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="container">
        <NavHeader style={{ backgroundColor: 'transparent' }} secondary />
        <div className="content">
          {
            this.props.dataIsReady
            ? this.renderContent()
            : (<Loading />)
          }
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
  dataIsReady: true,
};

DiaryPage.propTypes = {
  User: PropTypes.object,
  // Below Pass from Database and Redux
  dataIsReady: PropTypes.bool.isRequired,
  diarys: PropTypes.array.isRequired,
  snackBarOpen: PropTypes.func.isRequired,
};
