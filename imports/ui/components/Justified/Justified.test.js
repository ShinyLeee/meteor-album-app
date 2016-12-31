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
  import { Justified } from './Justified.jsx';

  const expect = chai.expect;

  describe('Justified', () => {
    it('should isAllSelect false when isEditing prop false', function () {
      const arr = new Array(3);
      const wrapper = shallow(<Justified images={arr} isEditing={false} />);
      wrapper.setProps({ counter: 3 });
      expect(wrapper.state('isAllSelect')).not.to.be.ok;
    });

    it('should isAllSelect state behave right when counter prop change', function () {
      const arr = new Array(3);
      const wrapper = shallow(<Justified images={arr} isEditing />);

      expect(wrapper.state('isAllSelect'))
      .to.equal(false, 'Initial isAllSelect state must be false');

      wrapper.setProps({ counter: 3 });
      expect(wrapper.state('isAllSelect'))
      .to.equal(true, 'When counter equal to images\' length');

      wrapper.setProps({ counter: 2 });
      expect(wrapper.state('isAllSelect'))
      .to.equal(false, 'When counter not equal to images\' length');

      wrapper.setProps({ counter: -1 });
      expect(wrapper.state('isAllSelect'))
      .to.equal(false, 'When counter is negative');
    });
  });
}
