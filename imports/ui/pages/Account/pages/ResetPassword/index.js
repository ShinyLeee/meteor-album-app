import PropTypes from 'prop-types';
import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import ViewLayout from '/imports/ui/layouts/ViewLayout';
import ModalActions from '/imports/ui/components/Modal/Common/ModalActions';
import CustomNavHeader from '/imports/ui/components/NavHeader/Custom';
import withLoadable from '/imports/ui/hocs/withLoadable';

const AsyncResetPasswordContent = withLoadable({
  loader: () => import('./containers/ContentContainer'),
});

export default class ResetPasswordPage extends Component {
  static propTypes = {
    modalOpen: PropTypes.func.isRequired,
    modalClose: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  renderPrompt = () => {
    this.props.modalOpen({
      content: '是否确认离开此页面？',
      actions: (
        <ModalActions
          sClick={this.props.modalClose}
          pClick={() => {
            this.props.history.replace('/');
            this.props.modalClose();
          }}
        />
      ),
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <ViewLayout
        Topbar={
          <CustomNavHeader
            classnames={{ root: classes.navheader__root, content: classes.navheader__content }}
            title="修改密码"
            Left={
              <IconButton color="contrast" onClick={this.renderPrompt}>
                <ArrowBackIcon />
              </IconButton>
            }
          />
        }
      >
        <AsyncResetPasswordContent />
      </ViewLayout>
    );
  }
}
