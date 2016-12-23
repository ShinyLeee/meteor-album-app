import { Migrations } from 'meteor/percolate:migrations';

Migrations.config({
  // Log job run details to console
  log: true,

  // Use a custom logger function (defaults to Meteor's logging package)
  logger: null,

  // Enable/disable logging "Not migrating, already at version {number}"
  logIfLatest: true,

  // Migrations collection name to use in the database
  collectionName: 'migrations',
});
