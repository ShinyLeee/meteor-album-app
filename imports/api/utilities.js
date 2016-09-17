/* Detect User's Platform */
const browser = {
  versions: (function testVersion() {
    const u = navigator.userAgent;
    return {
      trident: u.indexOf('Trident') > -1, // IE内核
      presto: u.indexOf('Presto') > -1, // Opera内核
      webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1, // 火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // Ios终端
      android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // Android终端或者UC浏览器
      iPhone: u.indexOf('iPhone') > -1, // 是否为IPhone或者QQHD浏览器
      iPad: u.indexOf('iPad') > -1, // 是否IPad
      webApp: u.indexOf('Safari') === -1, // 是否web程序，没有头部与底部
      weixin: u.indexOf('MicroMessenger') > -1, // 是否微信 （2015-01-22新增）
      qq: u.match(/\sQQ/i) === ' qq', //是否QQ
    };
  }()),
  language: (navigator.browserLanguage || navigator.language).toLowerCase(),
};

export default browser;
