import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { insertCollection } from '/imports/api/collections/methods.js';
import { getRandomInt } from '/imports/utils/utils.js';
import NavHeader from '/imports/ui/components/NavHeader/NavHeader.jsx';
import Recap from '/imports/ui/components/Recap/Recap.jsx';
import EmptyHolder from '/imports/ui/components/EmptyHolder/EmptyHolder.jsx';
import Loading from '/imports/ui/components/Loader/Loading.jsx';
import FloatButton from '/imports/ui/components/FloatButton/FloatButton.jsx';
import CollHolder from './components/CollHolder/CollHolder.jsx';

export default class AllCollectionPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      newCollName: '',
      errorText: '',
      location: 'collection',
    };
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.handleChangeCollName = this.handleChangeCollName.bind(this);
    this.handleAddCollection = this.handleAddCollection.bind(this);
  }

  componentWillMount() {
    if (this.props.colls) {
      const existCollNames = this.props.colls.map((col) => col.name);
      this.setState({ existCollNames });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.colls !== nextProps.colls) {
      const existCollNames = nextProps.colls.map((coll) => coll.name);
      this.setState({ existCollNames });
    }
  }

  handleCloseDialog() {
    this.setState({ open: false, newCollName: '', errorText: '' });
  }

  handleChangeCollName(e) {
    const newCollName = e.target.value;
    if (newCollName.length > 10) {
      this.setState({ errorText: '相册名不能超过十个字符' });
    } else if (this.state.existCollNames.indexOf(newCollName) >= 0) {
      this.setState({ errorText: '该相册已存在' });
    } else {
      this.setState({ newCollName, errorText: '' });
    }
  }

  handleAddCollection() {
    if (this.state.errorText) {
      this.props.snackBarOpen(this.state.errorText);
      this.handleCloseDialog();
      return;
    }
    this.handleCloseDialog();
    insertCollection.callPromise({
      name: this.state.newCollName,
      user: this.props.User.username,
      cover: `/img/pattern/VF_ac${getRandomInt(1, 28)}.jpg`,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .then(() => {
      this.props.snackBarOpen('新建相册成功');
    })
    .catch((err) => {
      console.log(err); // eslint-disable-line no-console
      this.props.snackBarOpen('新建相册失败');
      throw new Meteor.Error(err);
    });
  }

  renderContent() {
    const { isGuest, colls } = this.props;
    if (!isGuest && colls.length === 0) {
      return (
        <EmptyHolder
          mainInfo="你还尚未创建相册"
          secInfo="点击右下角按钮创建属于自己的相册吧"
        />
      );
    }
    return (
      <div className="content__allCollection">
        {
          colls.map((coll) => (
            <CollHolder
              key={coll._id}
              User={this.props.curUser}
              coll={coll}
            />
          ))
        }
      </div>
    );
  }

  render() {
    const { isGuest, curUser, dataIsReady, colls } = this.props;
    return (
      <div className="container">
        <NavHeader
          title={isGuest ? `${curUser.username}的相册` : '我的相册'}
          secondary
        />
        <main className="content">
          { !dataIsReady && (<Loading />) }
          { isGuest
            ? (
              <Recap
                title={curUser.username}
                detailFir={curUser.profile.intro || '暂无简介'}
              />
            )
            : colls.length > 0 && (
              <Recap
                title="我的相册"
                detailFir="所有创建相册都在这里"
                detailSec="可以点击右下角的按钮添加相册"
              />
            )
          }
          { dataIsReady && this.renderContent() }
          <Dialog
            title="新建相册"
            actions={[
              <FlatButton
                label="取消"
                onTouchTap={this.handleCloseDialog}
                primary
              />,
              <FlatButton
                label="新建"
                onTouchTap={this.handleAddCollection}
                disabled={!this.state.newCollName}
                primary
              />,
            ]}
            open={this.state.open}
            onRequestClose={this.handleCloseDialog}
            modal
          >
            <TextField
              hintText="相册名"
              onChange={this.handleChangeCollName}
              errorText={this.state.errorText}
              fullWidth
            />
          </Dialog>
        </main>
        { !isGuest && <FloatButton onBtnClick={() => this.setState({ open: true })} />}
      </div>
    );
  }

}

AllCollectionPage.displayName = 'AllCollectionPage';

AllCollectionPage.propTypes = {
  User: PropTypes.object,
  // Below Pass from Database
  dataIsReady: PropTypes.bool.isRequired,
  isGuest: PropTypes.bool.isRequired, // based on isGuest render different content
  curUser: PropTypes.object.isRequired,
  colls: PropTypes.array.isRequired,
  // Below Pass from Redux
  snackBarOpen: PropTypes.func.isRequired,
};
