import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Button from 'material-ui/Button';
import blue from 'material-ui/colors/blue';
import RootLayout from '/imports/ui/layouts/RootLayout';
import { followUser, unFollowUser } from '/imports/api/users/methods.js';
import SecondaryNavHeader from '/imports/ui/components/NavHeader/Secondary';

class UserFansPage extends PureComponent {
  static propTypes = {
    dataIsReady: PropTypes.bool.isRequired,
    isGuest: PropTypes.bool.isRequired, // based on isGuest render different content
    curUser: PropTypes.object.isRequired,
    initialFans: PropTypes.array.isRequired,
    User: PropTypes.object, // not required bc guest can visit this page
    snackBarOpen: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      wholeFans: props.initialFans,
      fans: props.initialFans,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.initialFans && nextProps.initialFans) {
      this.setState({ fans: nextProps.initialFans });
    }
  }

  _handleSearchChange = (e) => {
    const filteredFans = this.state.wholeFans.filter((fan) => fan.toLowerCase().indexOf(e.target.value) !== -1);
    this.setState({ fans: filteredFans });
  }

  _handleFollow = (isFollowed, fanObject) => {
    if (!this.props.User) {
      this.props.snackBarOpen('您还尚未登录');
      return;
    }
    const api = isFollowed ? unFollowUser : followUser;
    const data = {
      targetId: fanObject._id,
      targetName: fanObject.username,
    };
    api.callPromise(data)
    .then(() => {
      this.props.snackBarOpen(`${isFollowed ? '取消关注' : '关注'}成功`);
    })
    .catch((err) => {
      console.log(err);
      this.props.snackBarOpen(`${isFollowed ? '取消关注' : '关注'}失败 ${err.reason}`);
    });
  }

  renderListItem(fanObject) {
    const { isGuest, User, history, classes } = this.props;
    const isFollowed = !isGuest && fanObject.profile.followers.indexOf(User.username) !== -1;
    return (
      <ListItem disableRipple button>
        <Avatar
          src={fanObject && fanObject.profile.avatar}
          onClick={() => history.push(`/user/${fanObject.username}`)}
        />
        <ListItemText
          primary={fanObject && fanObject.username}
          secondary={fanObject && fanObject.profile.nickname}
        />
        <Button
          className={isFollowed ? classes.btn__blue : classes.btn__white}
          onClick={() => this._handleFollow(isFollowed, fanObject)}
          disableRipple
          raised
        >
          { isFollowed ? '已关注' : '关注' }
        </Button>
      </ListItem>
    );
  }

  renderFansList() {
    if (this.state.wholeFans.length === 0) {
      return <div className="userFans__emptyItem">暂无关注者</div>;
    }
    if (this.state.fans.length === 0) {
      return <div className="userFans__emptyItem">未找到用户</div>;
    }
    return this.state.fans.map((fan, i) => {
      const fanObject = Meteor.users.findOne({ username: fan });
      return (
        <div key={i} className="userFans__listItem">
          { this.renderListItem(fanObject) }
          <Divider inset />
        </div>
      );
    });
  }

  render() {
    const { isGuest, curUser, dataIsReady } = this.props;
    return (
      <RootLayout
        loading={!dataIsReady}
        Topbar={<SecondaryNavHeader title={isGuest ? `${curUser.username}的关注者` : '我的关注者'} />}
      >
        {
          dataIsReady && (
            <div className="content__userFans">
              <section className="userFans__search">
                <input type="text" placeholder="搜索" onChange={this._handleSearchChange} />
              </section>
              <section className="userFans__list">
                <List>{ this.renderFansList() }</List>
              </section>
            </div>
          )
        }
      </RootLayout>
    );
  }
}

const styles = {
  btn__blue: {
    backgroundColor: blue.A400,
    color: '#fff',
    '&:hover': {
      backgroundColor: blue.A200,
    },
  },

  btn__white: {
    backgroundColor: '#fff',
    color: '#000',
  },
};

export default withStyles(styles)(UserFansPage);
