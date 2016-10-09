import { Accounts } from 'meteor/accounts-base';

Accounts.config({

  /** [Boolean]
   *
   *  New users with an email address will receive an address verification email.
   *
   */

  sendVerificationEmail: true,


  /** [Boolean]
   *
   * Calls to createUser from the client will be rejected.
   * In addition, if you are using accounts-ui,
   * the "Create account" link will not be available.
   *
   */

  forbidClientAccountCreation: false,


  /** [String or Function]
   * If set to a string, only allows new users if the domain part of their email address
   * matches the string. If set to a function, only allows new users if the function returns true.
   * The function is passed the full email address of the proposed new user.
   * Works with password-based sign-in and external services
   * that expose email addresses (Google, Facebook, GitHub).
   * All existing users still can log in after enabling this option.
   * Example:
   */

  // restrictCreationByEmailDomain: 'school.edu',


  /** [Number]
   *
   * The number of days from when a user logs in
   * until their token expires and they are logged out.
   * Defaults to 90. Set to null to disable login expiration.
   *
   */

  loginExpirationInDays: 7,


  /** [String]
   * When using the oauth-encryption package,
   * the 16 byte key using to encrypt sensitive account credentials in the database,
   * encoded in base64. This option may only be specifed on the server.
   * See packages/oauth-encryption/README.md for details.
   */

  // oauthSecretKey: STRING,


  /**
   *
   * The number of days from when a link to reset password is sent
   * until token expires and user can't reset password with the link anymore.
   * Defaults to 3.
   *
   */

  passwordResetTokenExpirationInDays: 3,

});
