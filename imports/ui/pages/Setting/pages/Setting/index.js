import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import DoneIcon from 'material-ui-icons/Done';
import { updateProfile } from '/imports/api/users/methods';
import ViewLayout from '/imports/ui/layouts/ViewLayout';
import CustomNavHeader from '/imports/ui/components/NavHeader/Custom';
import SecondaryNavHeader from '/imports/ui/components/NavHeader/Secondary';
import Modal from '/imports/ui/components/Modal';
import withLoadable from '/imports/ui/hocs/withLoadable';

const AsyncSettingContent = withLoadable({
  loader: () => import('./containers/ContentContainer'),
});

export default class SettingPage extends Component {
  static propTypes = {
    User: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      profile: props.User.profile,
    };
    this._initState = this.state;
  }

  _handleQuitEditing = () => {
    const { User } = this.props;
    const { avatar, cover } = this.state.profile;
    const keys = [];

    // if has uploaded, we need to remove it before quit
    if (avatar !== User.profile.avatar) {
      const regex = /\.com\/(.*)\?imageView2/;
      const avatarKey = avatar.split(regex)[1];
      keys.push(avatarKey);
    }
    if (cover !== User.profile.cover) {
      const regex = /\.com\/(.*)/;
      const coverKey = cover.split(regex)[1];
      keys.push(coverKey);
    }

    if (keys.length !== 0) {
      Meteor.call(
        'Qiniu.remove',
        { keys },
        (err) => err && console.warn(err),
      );
    }
    Modal.close();
    this.setState(this._initState);
  }

  _handleSubmit = () => {
    const { profile } = this.state;
    updateProfile.callPromise({
      nickname: profile.nickname,
      intro: profile.intro,
      cover: profile.cover,
      avatar: profile.avatar,
      settings: {
        allowVisitColl: profile.settings.allowVisitColl,
        allowVisitHome: profile.settings.allowVisitHome,
        allowNoti: profile.settings.allowNoti,
        allowMsg: profile.settings.allowMsg,
      },
    })
      .then(() => {
        this.setState({ isEditing: false });
        this.props.snackBarOpen('设置保存成功');
      })
      .catch((err) => {
        console.warn(err);
        this.props.snackBarOpen(`设置保存失败 ${err.reason}`);
      });
  }

  _handleSettingChange = (profile) => {
    this.setState({
      isEditing: true,
      profile,
    });
  }

  renderPrompt = () => {
    Modal.showPrompt({
      message: '您还有尚未保存的设置，是否确认退出？',
      onCancel: Modal.close,
      onConfirm: this._handleQuitEditing,
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <ViewLayout
        Topbar={
          this.state.isEditing
          ? (
            <CustomNavHeader
              classnames={{ root: classes.navheader__root, content: classes.navheader__content }}
              title="修改设置中"
              Left={
                <IconButton color="contrast" onClick={this.renderPrompt}>
                  <CloseIcon />
                </IconButton>
              }
              Right={
                <IconButton color="contrast" onClick={this._handleSubmit}>
                  <DoneIcon />
                </IconButton>
              }
            />
          )
          : <SecondaryNavHeader title="个人设置" />
        }
      >
        <AsyncSettingContent
          profile={this.state.profile}
          onProfileChange={this._handleSettingChange}
        />
      </ViewLayout>
    );
  }
}
