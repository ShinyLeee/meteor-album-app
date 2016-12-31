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
  import Drawer from 'material-ui/Drawer';
  import { NavHeader } from './NavHeader.jsx';

  const expect = chai.expect;

  describe('NavHeader', () => {
    it('should render Drawer with primary prop', function () {
      const wrapper = shallow(<NavHeader primary />);
      expect(wrapper.find(Drawer)).to.have.length(1);
    });

    it('should not render Drawer with loading prop or without primary prop', function () {
      const loadingWrapper = shallow(<NavHeader loadinng />);
      const primaryWrapper = shallow(<NavHeader />);
      expect(loadingWrapper.find(Drawer)).to.have.length(0);
      expect(primaryWrapper.find(Drawer)).to.have.length(0);
    });
  });
}
