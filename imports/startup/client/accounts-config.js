import { Accounts } from 'meteor/accounts-base';
import { browserHistory } from 'react-router';

Accounts.onLogout(() => {
  browserHistory.replace('/login');
});

Accounts.onEmailVerificationLink((token) => {
  Accounts.verifyEmail(token, (err) => {
    if (err) {
      console.log(err); // eslint-disable-line no-console
      return browserHistory.replace({
        pathname: `/${err.error || 500}`,
        state: { message: err.reason || '服务器内部错误' },
      });
    }
    return browserHistory.replace('/accounts/verifyEmail');
  });
});

Accounts.onResetPasswordLink((token) => {
  browserHistory.replace({
    pathname: '/accounts/resetPassword',
    state: { token },
  });
});
