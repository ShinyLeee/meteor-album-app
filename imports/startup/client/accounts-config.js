import { Accounts } from 'meteor/accounts-base';
import history from '/imports/utils/history';

Accounts.onLogout(() => history.replace('/login'));

Accounts.onEmailVerificationLink((token) => {
  Accounts.verifyEmail(token, (err) => {
    if (err) {
      console.warn(err);
      return history.replace({
        pathname: `/${err.error || 500}`,
        state: { message: `服务器内部错误 ${err.error}` },
      });
    }
    return history.replace('/accounts/verifyEmail');
  });
});

Accounts.onResetPasswordLink((token) => history.replace({
  pathname: '/accounts/resetPassword',
  state: { token },
}));
