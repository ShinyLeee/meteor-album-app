import { Meteor } from 'meteor/meteor';
// import { _ } from 'meteor/underscore';
// import { check } from 'meteor/check';

// import { Notes } from './note.js';

const incompleteCountDenormalizer = {
  // _updateList(listId) {
  //   // Recalculate the correct incomplete count direct from MongoDB
  //   const incompleteCount = Notes.find({
  //     listId,
  //     checked: false,
  //   }).count();

  //   Notes.update(listId, { $set: { incompleteCount } });
  // },
  afterInsertNote(note) {
    const uid = note.receiver;
    Meteor.users.update(uid, {
      $inc: {
        'profile.notes': 1,
      },
    });
  },
  // afterUpdateNote(selector, modifier) {
  //   // We only support very limited operations on Notes
  //   check(modifier, { $set: Object });

  //   // We can only deal with $set modifiers, but that's all we do in this app
  //   if (_.has(modifier.$set, 'checked')) {
  //     Notes.find(selector, { fields: { listId: 1 } }).forEach(note => {
  //       this._updateList(note.listId);
  //     });
  //   }
  // },
  // Here we need to take the list of Notes being removed, selected *before* the update
  // because otherwise we can't figure out the relevant list id(s) (if the note has been deleted)
  // afterRemoveTodos(todos) {
  //   todos.forEach(todo => this._updateList(todo.listId));
  // },
};

export default incompleteCountDenormalizer;
