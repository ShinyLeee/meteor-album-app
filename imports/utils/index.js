// Wrap a Promise in order to make it Cancelable.
export const makeCancelable = (promise) => {
  let hasCanceled_ = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then((val) => // eslint-disable-line no-confusing-arrow
      hasCanceled_ ? reject({ isCanceled: true }) : resolve(val)
    );
    promise.catch((error) => // eslint-disable-line no-confusing-arrow
      hasCanceled_ ? reject({ isCanceled: true }) : reject(error)
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
    },
  };
};

export const getRandomArbitrary = (min, max) => (Math.random() * (max - min)) + min;

export const getRandomInt = (min, max) => Math.floor(Math.random() * ((max - min) + 1)) + min;

export const randomId = () => Math.random().toString(36).split('.')[1];

export const platform = () => {
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
};

export const language = () => (
  navigator.languages[0] ||
  navigator.language ||
  navigator.browserLanguage ||
  navigator.userLanguage ||
  'zh-CN'
);

export const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line max-len
  return re.test(email);
};

export const limitStrLength = (str, limit) => {
  if (str.length <= limit) return str;
  return str.slice(0, limit);
};

export const noop = () => {};
