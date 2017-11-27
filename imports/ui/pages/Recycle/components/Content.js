import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import EmptyHolder from '/imports/ui/components/EmptyHolder';
import JustifiedSelectIcon from '/imports/ui/components/JustifiedLayout/components/snippet/JustifiedSelectIcon';
import ConnectedGridLayout from '/imports/ui/components/JustifiedLayout/components/GridLayout';
import {
  Toolbar,
  ToolbarLeft,
} from '/imports/ui/components/JustifiedLayout/components/ToolBar/ToolBar.style';
import { Header, Title, SubTitle } from '../../Collection/pages/Collection/styles';

export default class RecycleContent extends PureComponent {
  static propTypes = {
    images: PropTypes.array.isRequired,
    counter: PropTypes.number.isRequired,
    enableSelectAll: PropTypes.func.isRequired,
    disableSelectAll: PropTypes.func.isRequired,
  }

  state = {
    isAllSelect: false,
  }

  componentWillReceiveProps(nextProps) {
    const { images } = this.props;
    const { counter } = nextProps;
    if (counter > 0) {
      this.setState({ isAllSelect: images.length === counter });
    } else {
      this.setState({ isAllSelect: false });
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
    const { images } = this.props;
    return images.length === 0
      ? <EmptyHolder mainInfo="您的回收站是空的" />
      : (
        <div className="recycle__content">
          <Header>
            <Title>回收站</Title>
            <SubTitle>回收站中的内容会在 30 天后永久删除</SubTitle>
          </Header>
          <Toolbar>
            <ToolbarLeft visible onClick={this._handleToggleSelectAll}>
              <JustifiedSelectIcon activate={this.state.isAllSelect} />
              <h4>选择全部</h4>
            </ToolbarLeft>
          </Toolbar>
          <ConnectedGridLayout
            images={images}
            isEditing
          />
        </div>
      );
  }
}
