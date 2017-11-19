import debounce from 'lodash/debounce';
import times from 'lodash/times';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import queryString from 'query-string';
import IconButton from 'material-ui/IconButton';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import ChevronRightIcon from 'material-ui-icons/ChevronRight';
import ViewLayout from '/imports/ui/layouts/ViewLayout';
import SecondaryNavHeader from '/imports/ui/components/NavHeader/Secondary';
import { ResponsiveCover } from '/imports/ui/components/ProgressiveImage';
import settings from '/imports/utils/settings';
import withLoadable from '/imports/ui/hocs/withLoadable';
import DataLoader from '/imports/ui/components/Loader/DataLoader';
import {
  DiaryHeader,
  DiaryControlCenter,
  DiaryYear,
  DiaryYearText,
  DiaryMonth,
  DiaryMonthText,
  DiaryMonthSelectedText,
} from './styles/DiaryPage.style';

const AsyncDiaryContent = withLoadable({
  loader: () => import('./containers/ContentContainer'),
  loading: DataLoader,
});

const { sourceDomain } = settings;

export default class DiaryPage extends PureComponent {
  static propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this._scrollHandler = debounce(this._handleScroll, 250);
    this._coverHeight = 266;
    this.state = {
      navTitle: null,
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this._scrollHandler, false);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this._scrollHandler, false);
  }

  _handleScroll = () => {
    if (window.scrollY > this._coverHeight) {
      this.setState({ navTitle: '返回顶部' });
    } else {
      this.setState({ navTitle: null });
    }
  }

  _handleLayout = (height) => {
    this._coverHeight = height;
  }

  render() {
    let cYear;
    let cMonth;
    const query = queryString.parse(this.props.location.search);
    if (Object.keys(query).length !== 0) {
      cYear = +query.year;
      cMonth = +query.month;
    } else {
      const date = new Date();
      cYear = date.getFullYear();
      cMonth = date.getMonth() + 1;
    }
    return (
      <ViewLayout
        Topbar={
          <SecondaryNavHeader
            style={{ background: this.state.navTitle ? '#fff' : 'transparent' }}
            title={this.state.navTitle}
            titleStyle={{ color: this.state.navTitle ? '#222' : 'inherit' }}
            iconStyle={{ color: this.state.navTitle ? '#222' : '#fff' }}
          />
        }
      >
        <DiaryHeader>
          <ResponsiveCover
            src={`${sourceDomain}/GalleryPlus/Default/default-diary.jpg`}
            basis={0.4}
            maxHeight={400}
            onLayout={this._handleLayout}
          />
          <DiaryControlCenter>
            <DiaryYear>
              <IconButton
                color="contrast"
                onClick={() => this.props.history.replace(`/diary?year=${cYear - 1}&month=${cMonth}`)}
              ><ChevronLeftIcon />
              </IconButton>
              <DiaryYearText>{cYear}</DiaryYearText>
              <IconButton
                color="contrast"
                onClick={() => this.props.history.replace(`/diary?year=${cYear + 1}&month=${cMonth}`)}
              ><ChevronRightIcon />
              </IconButton>
            </DiaryYear>
            <DiaryMonth>
              {
                times(12, (i) => {
                  const month = i + 1;
                  const props = {
                    key: month,
                    role: 'button',
                    tabIndex: -1,
                    onClick: () => this.props.history.replace(`/diary?year=${cYear}&month=${month}`),
                  };
                  if (cMonth === month) {
                    return <DiaryMonthSelectedText {...props}>{month}</DiaryMonthSelectedText>;
                  }
                  return <DiaryMonthText {...props}>{month}</DiaryMonthText>;
                })
              }
            </DiaryMonth>
          </DiaryControlCenter>
        </DiaryHeader>

        <AsyncDiaryContent />

      </ViewLayout>
    );
  }
}
