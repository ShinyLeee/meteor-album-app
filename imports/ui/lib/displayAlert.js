import i18n from 'meteor/universe:i18n';
import Alert from 'react-s-alert';

export const displayAlert = (type, context, config) => {
  Alert[type](i18n.__(context), config);
};
