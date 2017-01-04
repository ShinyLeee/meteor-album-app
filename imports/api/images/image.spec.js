import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Factory } from 'meteor/dburles:factory';
// import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { assert, expect } from 'meteor/practicalmeteor:chai';
// import { Random } from 'meteor/random';
// import { _ } from 'meteor/underscore';
import faker from 'faker';
import { Images } from './image.js';

if (Meteor.isServer) {
  import './server/publications.js';

  describe('image API', () => {
    describe('factory', () => {
      it('should builds correctly from factory', () => {
        const image = Factory.create('image');
        assert.match(image.uid, SimpleSchema.RegEx.Id, 'uid field must be MongoId');
        assert.typeOf(image.user, 'string', 'user field must be String');
        assert.typeOf(image.collection, 'string', 'collection field must be String');
        assert.typeOf(image.name, 'string', 'name field must be String');
        assert.typeOf(image.ratio, 'number');
        assert.typeOf(image.shootAt, 'date');
        assert.typeOf(image.createdAt, 'date');
      });
    });

    it('should not update createdAt on update', () => {
      const createdAt = new Date(new Date() - 1000);
      let image = Factory.create('image', { createdAt });

      const collection = faker.random.word();
      Images.update(image, { $set: { collection } });

      image = Images.findOne(image._id);
      expect(image.collection).to.be.equal(collection, 'should update collection');
      expect(image.createdAt.getTime()).to.be.equal(createdAt.getTime());
    });

    // describe('publications', () => {
    //   let publicList;
    //   let privateList;
    //   let userId;

    //   before(() => {
    //     userId = Random.id();
    //     publicList = Factory.create('list');
    //     privateList = Factory.create('list', { userId });

    //     _.times(3, () => {
    //       Factory.create('todo', { listId: publicList._id });
    //       // TODO get rid of userId, https://github.com/meteor/todos/pull/49
    //       Factory.create('todo', { listId: privateList._id, userId });
    //     });
    //   });

      // describe('todos.inList', () => {
      //   it('sends all todos for a public list', (done) => {
      //     const collector = new PublicationCollector();
      //     collector.collect(
      //       'todos.inList',
      //       { listId: publicList._id },
      //       (collections) => {
      //         chai.assert.equal(collections.Todos.length, 3);
      //         done();
      //       }
      //     );
      //   });

      //   it('sends all todos for a public list when logged in', (done) => {
      //     const collector = new PublicationCollector({ userId });
      //     collector.collect(
      //       'todos.inList',
      //       { listId: publicList._id },
      //       (collections) => {
      //         chai.assert.equal(collections.Todos.length, 3);
      //         done();
      //       }
      //     );
      //   });

      //   it('sends all todos for a private list when logged in as owner', (done) => {
      //     const collector = new PublicationCollector({ userId });
      //     collector.collect(
      //       'todos.inList',
      //       { listId: privateList._id },
      //       (collections) => {
      //         chai.assert.equal(collections.Todos.length, 3);
      //         done();
      //       }
      //     );
      //   });

      //   it('sends no todos for a private list when not logged in', (done) => {
      //     const collector = new PublicationCollector();
      //     collector.collect(
      //       'todos.inList',
      //       { listId: privateList._id },
      //       (collections) => {
      //         chai.assert.isUndefined(collections.Todos);
      //         done();
      //       }
      //     );
      //   });

      //   it('sends no todos for a private list when logged in as another user', (done) => {
      //     const collector = new PublicationCollector({ userId: Random.id() });
      //     collector.collect(
      //       'todos.inList',
      //       { listId: privateList._id },
      //       (collections) => {
      //         chai.assert.isUndefined(collections.Todos);
      //         done();
      //       }
      //     );
      //   });
      // });
    // });
  });
}
