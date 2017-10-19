import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import ContentLayout from '/imports/ui/layouts/ContentLayout';
import EmptyHolder from '/imports/ui/components/EmptyHolder';
import JustifiedSelectIcon from '/imports/ui/components/JustifiedLayout/components/snippet/JustifiedSelectIcon';
import ConnectedGridLayout from '/imports/ui/components/JustifiedLayout/components/GridLayout';


export default class RecycleContent extends PureComponent {
  static propTypes = {
    dataIsReady: PropTypes.bool.isRequired,
    images: PropTypes.array.isRequired,
    counter: PropTypes.number.isRequired,
    enableSelectAll: PropTypes.func.isRequired,
    disableSelectAll: PropTypes.func.isRequired,
  }

  state = {
    isEditing: false,
    isAllSelect: false,
  }

  componentWillReceiveProps(nextProps) {
    const { images } = this.props;
    const { counter } = nextProps;
    if (counter > 0) {
      this.setState({
        isEditing: true,
        isAllSelect: images.length === counter,
      });
    } else {
      this.setState({
        isEditing: false,
        isAllSelect: false,
      });
    }
  }

  _handleToggleSelectAll = () => {
    const { images } = this.props;
    if (this.state.isAllSelect) {
      this.props.disableSelectAll();
    } else {
      const counter = images.length;
      this.props.enableSelectAll({
        selectImages: images,
        group: { recycle: counter },
        counter,
      });
    }
  }

  render() {
    const { dataIsReady, images } = this.props;
    const isEmpty = images.length === 0;
    return (
      <ContentLayout loading={!dataIsReady}>
        {
          dataIsReady && (
            <div className="content__recycle">
              {
                isEmpty
                ? <EmptyHolder mainInfo="您的回收站是空的" />
                : [
                  <header key="header" className="recycle__header">
                    <h2 className="recycle__title">回收站</h2>
                    <div className="recycle__desc">回收站中的内容会在 30 天后永久删除</div>
                  </header>,
                  <div key="content" className="recycle__content">
                    <div className="recycle__toolbox">
                      <div
                        className="recycle__toolbox_left"
                        role="button"
                        tabIndex={-1}
                        onClick={this._handleToggleSelectAll}
                      >
                        <JustifiedSelectIcon activate={this.state.isAllSelect} />
                        <h4>选择全部</h4>
                      </div>
                    </div>
                    <ConnectedGridLayout
                      isEditing={this.state.isEditing}
                      images={images}
                    />
                  </div>,
                ]
              }
            </div>
          )
        }
      </ContentLayout>
    );
  }
}
