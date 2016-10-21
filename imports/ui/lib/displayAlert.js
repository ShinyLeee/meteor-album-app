import i18n from 'meteor/universe:i18n';
import Alert from 'react-s-alert';

const displayAlert = (type, context, config) => {
  if (context.includes('.')) {
    Alert[type](i18n.__(context), config);
  } else {
    Alert[type](context);
  }
};

export default displayAlert;
