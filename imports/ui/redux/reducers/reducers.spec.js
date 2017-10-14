/* eslint-disable no-unused-expressions */

import { Meteor } from 'meteor/meteor';

if (Meteor.isClient) {
  import { chai } from 'meteor/practicalmeteor:chai';
  import * as reducers from './reducers';

  const expect = chai.expect;

  describe('reducers', () => {
    describe('uptoken', () => {
      it('should STORE_UPTOKEN store uptoken', () => {
        const uptoken = 'uptoken001';
        expect(reducers.uptoken('', { type: 'STORE_UPTOKEN', uptoken })).to.equal(uptoken);
      });

      it('should CLEAR_UPTOKEN clear uptoken', () => {
        const uptoken = 'uptoken001';
        expect(reducers.uptoken(uptoken, { type: 'CLEAR_UPTOKEN' })).to.be.empty;
      });
    });

    describe('uploader', () => {
      it('should UPLOADER_START open and pass destination value', () => {
        const uploader = {
          destination: 'testColl',
        };
        const returnValue = reducers.uploader(
          { open: false, destination: '' },
          { type: 'UPLOADER_START', uploader },
        );
        expect(returnValue.open).to.be.true;
        expect(returnValue.destination).to.equal(uploader.destination);
      });

      it('should UPLOADER_STOP return initial uploader state', () => {
        const prevState = {
          destination: 'testColl',
        };
        const returnValue = reducers.uploader(prevState, { type: 'UPLOADER_STOP' });
        expect(returnValue.open).to.be.false;
        expect(returnValue.destination).to.be.empty;
      });
    });

    describe('selectCounter', () => {
      const initialState = { selectImages: [], group: {}, counter: 0 };

      it('should provide the initial state', () => {
        expect(reducers.selectCounter(undefined, {})).to.eql(initialState);
      });

      it('should ignore unknown actions', () => {
        expect(reducers.selectCounter(initialState, { type: 'unknown' })).to.eql(initialState);
      });

      describe('ENABLE_SELECT_ALL', () => {
        it('should behave right', () => {
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
      });

      describe('DISABLE_SELECT_ALL', () => {
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
      });

      describe('SELECT_COUNTER', () => {
        it('should incre right when FIRST SELECT', () => {
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

        it('should decre right when LAST DISSELECT', () => {
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

        it('should incre right when ARBITRAY SELECT', () => {
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

        it('should decre right when ARBITRAY DISSELECT', () => {
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
      });

      describe('SELECT_GROUP_COUNTER', () => {
        it('should incre right when FIRST SELECT', () => {
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

        it('should decre right when LAST SELECT', () => {
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

        it('should incre right when ARBITRAY SELECT', () => {
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

        it('should decre right when ARBITRAY DISSELECT', () => {
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
  });
}
