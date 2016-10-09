import i18n from 'meteor/universe:i18n';
import Alert from 'react-s-alert';

const displayAlert = (type, context, config) => {
  Alert[type](i18n.__(context), config);
};

export default displayAlert;
