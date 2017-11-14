import PropTypes from 'prop-types';
import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import ViewLayout from '/imports/ui/layouts/ViewLayout';
import Modal from '/imports/ui/components/Modal';
import CustomNavHeader from '/imports/ui/components/NavHeader/Custom';
import withLoadable from '/imports/ui/hocs/withLoadable';

const AsyncResetPasswordContent = withLoadable({
  loader: () => import('./containers/ContentContainer'),
});

export default class ResetPasswordPage extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  renderPrompt = () => {
    Modal.showPrompt({
      message: '是否确认离开此页面？',
      onCancel: Modal.close,
      onConfirm: () => {
        this.props.history.replace('/');
        Modal.close();
      },
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
