import qiniu from 'qiniu';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // We need to set ACCESS_KEY & SECRET_KEY in Advance
  qiniu.conf.ACCESS_KEY = Meteor.settings.private.qiniu.ACCESS_KEY;
  qiniu.conf.SECRET_KEY = Meteor.settings.private.qiniu.SECRET_KEY;

  Accounts.emailTemplates.siteName = 'GalleryPlus';
  Accounts.emailTemplates.from = 'GalleryPlus <lshinylee@vip.qq.com>';
  Accounts.emailTemplates.verifyEmail.subject = () => '验证邮箱';
  Accounts.emailTemplates.verifyEmail.text = (user, url) => {
    const text = `
    ${user.username}您好，
    
    请点击下方链接完成GalleryPlus的邮箱认证。

    ${url}
    `;
    return text;
  };

  const smtp = {
    username: 'lshinylee@vip.qq.com',
    password: 'otbhblukwmhsbecj',
    server: 'smtp.qq.com',
    port: 465,
  };

  process.env.MAIL_URL = `smtp://${encodeURIComponent(smtp.username)}:${encodeURIComponent(smtp.password)}@${encodeURIComponent(smtp.server)}:${smtp.port}`;
});
