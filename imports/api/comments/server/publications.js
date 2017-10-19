/* eslint-disable prefer-arrow-callback, meteor/audit-argument-checks */
import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Comments } from '../comment';

Meteor.publish('Comments.own', function ownComments() {
  const user = Meteor.users.findOne(this.userId);
  return Comments.find({
    user: user && user.username,
  });
});

Meteor.publish('Comments.inImage', function specificImageComments(discId) {
  new SimpleSchema({
    discId: { type: String, label: '评论目标Id', regEx: SimpleSchema.RegEx.Id, denyUpdate: true },
  }).validator({ clean: true, filter: false });
  return Comments.find({
    discussion_id: discId,
    type: 'image',
  });
});
