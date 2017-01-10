  /* eslint-disable no-unused-expressions */

import { Meteor } from 'meteor/meteor';

if (Meteor.isClient) {
  import faker from 'faker';
  import { chai } from 'meteor/practicalmeteor:chai';
  import * as reducers from './reducers';

  const expect = chai.expect;

  describe('reducers', () => {
    describe('uptoken', () => {
      it('should STORE_UPTOKEN store uptoken', () => {
        const uptoken = faker.random.number();
        expect(reducers.uptoken('', { type: 'STORE_UPTOKEN', uptoken })).to.equal(uptoken);
      });

      it('should CLEAR_UPTOKEN clear uptoken', () => {
        expect(reducers.uptoken('', { type: 'CLEAR_UPTOKEN' })).to.be.null;
      });
    });

    describe('uploader', () => {
      it('should UPLOADER_START return token and key', () => {
        const uploader = {
          uptoken: faker.random.number(),
          key: `${faker.internet.userName()}/${faker.random.word()}`,
        };
        const returnValue = reducers.uploader(null, { type: 'UPLOADER_START', uploader });
        expect(returnValue.uptoken).to.equal(uploader.uptoken);
        expect(returnValue.key).to.equal(uploader.key);
        expect(returnValue.open).to.be.true;
      });

      it('should UPLOADER_STOP return null', () => {
        expect(reducers.uploader(null, { type: 'UPLOADER_STOP' })).to.be.null;
      });
    });

    describe('selectCounter', () => {
      const initialState = { selectImages: [], group: null, counter: 0 };

      it('should provide the initial state', () => {
        expect(reducers.selectCounter(undefined, {})).to.eql(initialState);
      });

      it('should ignore unknown actions', () => {
        expect(reducers.selectCounter(initialState, { type: 'unknown' })).to.eql(initialState);
      });

      it('should ENABLE_SELECT_ALL behave right', () => {
        const prevState = Object.assign({}, initialState);
        const action = {
          selectImages: [{ _id: 1, name: 'test' }, { _id: 2, name: 'test2' }],
          group: { '2017-1-1': 2 },
          counter: 2,
        };
        const actionWithType = Object.assign({}, { type: 'ENABLE_SELECT_ALL' }, action);
        const nextState = reducers.selectCounter(prevState, actionWithType);
        const expectState = Object.assign({}, action);
        expect(nextState).to.eql(expectState);
      });

      it('should DISABLE_SELECT_ALL behave right', () => {
        const prevState = {
          selectImages: [{ _id: 1, name: 'test' }, { _id: 2, name: 'test2' }],
          group: { '2017-1-1': 2 },
          counter: 2,
        };
        const nextState = reducers.selectCounter(prevState, { type: 'DISABLE_SELECT_ALL' });
        const expectState = Object.assign({}, initialState);
        expect(nextState).to.eql(expectState);
      });

      it('should SELECT_COUNTER increment action behave right when FIRST SELECT', () => {
        const prevState = Object.assign({}, initialState);
        const increAction = {
          selectImages: [{ _id: 1, name: 'test' }],
          group: '2017-1-1',
          counter: 1,
        };
        const actionWithType = Object.assign({}, { type: 'SELECT_COUNTER' }, increAction);
        const nextState = reducers.selectCounter(prevState, actionWithType);
        const expectState = {
          selectImages: [{ _id: 1, name: 'test' }],
          group: { '2017-1-1': 1 },
          counter: 1,
        };
        expect(nextState).to.eql(expectState);
      });

      it('should SELECT_COUNTER decrement action behave right when LAST DISSELECT', () => {
        const prevState = {
          selectImages: [{ _id: 1, name: 'test' }],
          group: '2017-1-1',
          counter: 1,
        };
        const decreAction = {
          selectImages: [{ _id: 1, name: 'test' }],
          group: '2017-1-1',
          counter: -1,
        };
        const actionWithType = Object.assign({}, { type: 'SELECT_COUNTER' }, decreAction);
        const nextState = reducers.selectCounter(prevState, actionWithType);
        const expectState = Object.assign({}, initialState);
        expect(nextState).to.eql(expectState);
      });

      it('should SELECT_COUNTER increment action behave right when ARBITRAY SELECT', () => {
        const prevState = {
          selectImages: [{ _id: 1, name: 'test' }],
          group: { '2017-1-1': 1 },
          counter: 1,
        };
        const increAction = {
          selectImages: [{ _id: 2, name: 'test2' }],
          group: '2017-1-1',
          counter: 1,
        };
        const actionWithType = Object.assign({}, { type: 'SELECT_COUNTER' }, increAction);
        const nextState = reducers.selectCounter(prevState, actionWithType);
        const expectState = {
          selectImages: [{ _id: 1, name: 'test' }, { _id: 2, name: 'test2' }],
          group: { '2017-1-1': 2 },
          counter: 2,
        };
        expect(nextState).to.eql(expectState);
      });

      it('should SELECT_COUNTER decrement action behave right when ARBITRAY DISSELECT', () => {
        const prevState = {
          selectImages: [{ _id: 1, name: 'test' }, { _id: 2, name: 'test2' }],
          group: { '2017-1-1': 2 },
          counter: 2,
        };
        const decreAction = {
          selectImages: [{ _id: 2, name: 'test2' }],
          group: '2017-1-1',
          counter: -1,
        };
        const actionWithType = Object.assign({}, { type: 'SELECT_COUNTER' }, decreAction);
        const nextState = reducers.selectCounter(prevState, actionWithType);
        const expectState = {
          selectImages: [{ _id: 1, name: 'test' }],
          group: { '2017-1-1': 1 },
          counter: 1,
        };
        expect(nextState).to.eql(expectState);
      });

      it('should SELECT_GROUP_COUNTER increment action behave right when FIRST SELECT', () => {
        const prevState = Object.assign({}, initialState);
        const increAction = {
          selectImages: [{ _id: 1, name: 'test' }, { _id: 2, name: 'test2' }],
          group: '2017-1-1',
          counter: 2,
        };
        const actionWithType = Object.assign({}, { type: 'SELECT_GROUP_COUNTER' }, increAction);
        const nextState = reducers.selectCounter(prevState, actionWithType);
        const expectState = {
          selectImages: [{ _id: 1, name: 'test' }, { _id: 2, name: 'test2' }],
          group: { '2017-1-1': 2 },
          counter: 2,
        };
        expect(nextState).to.eql(expectState);
      });

      it('should SELECT_GROUP_COUNTER decrement action behave right when LAST SELECT', () => {
        const prevState = {
          selectImages: [{ _id: 1, name: 'test' }, { _id: 2, name: 'test2' }],
          group: { '2017-1-1': 2 },
          counter: 2,
        };
        const decreAction = {
          selectImages: [{ _id: 1, name: 'test' }, { _id: 2, name: 'test2' }],
          group: '2017-1-1',
          counter: -2,
        };
        const actionWithType = Object.assign({}, { type: 'SELECT_GROUP_COUNTER' }, decreAction);
        const nextState = reducers.selectCounter(prevState, actionWithType);
        const expectState = Object.assign({}, initialState);
        expect(nextState).to.eql(expectState);
      });

      it('should SELECT_GROUP_COUNTER increment action behave right when ARBITRAY SELECT', () => {
        const prevState = {
          selectImages: [{ _id: 1, name: 'test' }],
          group: { '2017-1-1': 1 },
          counter: 1,
        };
        const increAction = {
          selectImages: [{ _id: 2, name: '2016' }, { _id: 3, name: '12-31' }],
          group: '2016-12-31',
          counter: 2,
        };
        const actionWithType = Object.assign({}, { type: 'SELECT_GROUP_COUNTER' }, increAction);
        const nextState = reducers.selectCounter(prevState, actionWithType);
        const expectState = {
          selectImages: [{ _id: 1, name: 'test' }, { _id: 2, name: '2016' }, { _id: 3, name: '12-31' }],
          group: { '2016-12-31': 2, '2017-1-1': 1 },
          counter: 3,
        };
        expect(nextState).to.eql(expectState);
      });

      it('should SELECT_GROUP_COUNTER decrement action behave right when ARBITRAY DISSELECT', () => {
        const prevState = {
          selectImages: [{ _id: 1, name: 'test' }, { _id: 2, name: '2016' }, { _id: 3, name: '12-31' }],
          group: { '2016-12-31': 2, '2017-1-1': 1 },
          counter: 3,
        };
        const decreAction = {
          selectImages: [{ _id: 2, name: '2016' }, { _id: 3, name: '12-31' }],
          group: '2016-12-31',
          counter: -2,
        };
        const actionWithType = Object.assign({}, { type: 'SELECT_GROUP_COUNTER' }, decreAction);
        const nextState = reducers.selectCounter(prevState, actionWithType);
        const expectState = {
          selectImages: [{ _id: 1, name: 'test' }],
          group: { '2017-1-1': 1 },
          counter: 1,
        };
        expect(nextState).to.eql(expectState);
      });
    });
  });
}
