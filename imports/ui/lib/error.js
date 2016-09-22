import i18n from 'meteor/universe:i18n';

export const displayError = (error) => {
  if (error) {
    alert(i18n.__(error.error)); // eslint-disable-line no-alert
  }
};
