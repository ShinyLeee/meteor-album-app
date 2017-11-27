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
});

const { sourceDomain } = settings;

export default class DiaryPage extends PureComponent {
  static propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  }

  state = {
    coverHeight: 266,
  }

  _handleLayout = (height) => {
    this.setState({ coverHeight: height });
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
          <SecondaryNavHeader style={{ background: 'transparent' }}>
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
          </SecondaryNavHeader>
        }
        topbarHeight={this.state.coverHeight}
        loadingType="Circle"
      >
        <AsyncDiaryContent />
      </ViewLayout>
    );
  }
}
