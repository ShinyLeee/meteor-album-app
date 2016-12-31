  /* eslint-disable
   react/jsx-filename-extension,
   no-unused-expressions,
   func-names,
   prefer-arrow-callback
*/
import { Meteor } from 'meteor/meteor';

if (Meteor.isClient) {
  // import { Factory } from 'meteor/dburles:factory';
  import React from 'react';
  // import faker from 'faker';
  import { shallow } from 'enzyme';
  import { chai } from 'meteor/practicalmeteor:chai';
  import { JustifiedGroupHolder } from './JustifiedGroupHolder.jsx';

  const expect = chai.expect;
  const geometry = {
    containerHeight: 375,
    boxes: [
      {
        aspectRatio: 0.5,
        top: 10,
        width: 170,
        height: 340,
        left: 10,
      },
      {
        aspectRatio: 1.5,
        top: 10,
        width: 510,
        height: 340,
        left: 190,
      },
      {
        aspectRatio: 1.5,
        top: 10,
        width: 510,
        height: 340,
        left: 190,
      },
    ],
  };

  const arr = new Array(3);
  const wrapper = shallow(
    <JustifiedGroupHolder
      day={'2016-12-31'}
      geometry={geometry}
      dayGroupImage={arr}
      isEditing
      total={6}
      groupTotal={3}
    />
  );

  describe('JustifiedGroupHolder', () => {
    it('should isGroupSelect state behave right when group\'s value change', function () {
      expect(wrapper.state('isGroupSelect'))
      .to.equal(false, 'Initial isGroupSelect state must be false');

      wrapper.setProps({ group: { '2016-12-31': 3, '2016-12-30': 3 } });
      expect(wrapper.state('isGroupSelect'))
      .to.equal(true, 'When specfic day group exist and value equal to groupTotal');

      wrapper.setProps({ group: { '2016-12-31': 0, '2016-12-30': 3 } });
      expect(wrapper.state('isGroupSelect'))
      .to.equal(false, 'When specfic day group exist but value is empty');

      wrapper.setProps({ group: { '2016-12-31': 3 } });
      expect(wrapper.state('isGroupSelect'))
      .to.equal(true, 'When only has specfic day group');

      wrapper.setProps({ group: { '2016-12-31': 2 } });
      expect(wrapper.state('isGroupSelect'))
      .to.equal(false, 'When specfic day group exist but value not equal to groupTotal');
    });

    it('should isGroupSelect state behave righ when group\'s key change', function () {
      wrapper.setProps({ group: null });
      expect(wrapper.state('isGroupSelect'))
      .to.equal(false, 'When group prop is NULL');

      wrapper.setProps({ group: { '2016-12-31': 3 } });
      expect(wrapper.state('isGroupSelect'))
      .to.equal(true, 'When group prop equal to groupTotal');

      wrapper.setProps({ group: { '2016-12-30': 3 } });
      expect(wrapper.state('isGroupSelect'))
      .to.equal(false, 'When specfic day group not exist');
    });
  });
}
