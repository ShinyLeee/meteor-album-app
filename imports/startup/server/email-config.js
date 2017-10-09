import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  const domain = Meteor.settings.public.domain;
  const smtp = {
    username: 'lshinylee@vip.qq.com',
    password: 'otbhblukwmhsbecj',
    server: 'smtp.qq.com',
    port: 465,
  };

  process.env.MAIL_URL = `smtps://${encodeURIComponent(smtp.username)}:${encodeURIComponent(smtp.password)}@${encodeURIComponent(smtp.server)}:${smtp.port}`;

  // Configures "reset password account" email link
  Accounts.urls.resetPassword = (token) => `${domain}/#/reset-password/${token}`;

  // Configures "enroll account" email link
  Accounts.urls.enrollAccount = (token) => `${domain}/#/enroll-account/${token}`;

  // Configures "verify email" email link
  Accounts.urls.verifyEmail = (token) => `${domain}/#/verify-email/${token}`;

  Accounts.emailTemplates.siteName = 'GalleryPlus';
  Accounts.emailTemplates.from = 'GalleryPlus <lshinylee@vip.qq.com>';

  // 修改默认首次注册验证邮箱邮件模板
  Accounts.emailTemplates.enrollAccount.subject = () => '验证邮箱';
  Accounts.emailTemplates.enrollAccount.text = (user, url) => {
    const text = `
    ${user.username}您好，

    欢迎来到GalleryPlus,
    
    请点击下方链接完成GalleryPlus的账号注册。

    ${url}
    `;
    return text;
  };

  // 修改默认验证邮箱邮件模板
  Accounts.emailTemplates.verifyEmail.subject = () => '验证邮箱';
  Accounts.emailTemplates.verifyEmail.text = (user, url) => {
    const text = `
    ${user.username}您好，
    
    请点击下方链接完成GalleryPlus的邮箱认证。

    ${url}
    `;
    return text;
  };

  // 修改默认重置密码邮件模板
  Accounts.emailTemplates.resetPassword.subject = () => '重置密码';
  Accounts.emailTemplates.resetPassword.text = (user, url) => {
    const text = `
    ${user.username}您好，
    
    请点击下方链接重置你在GalleryPlus注册的账号密码。

    ${url}
    `;
    return text;
  };
});
