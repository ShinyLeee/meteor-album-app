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
  import { Uploader } from './Uploader.jsx';

  const expect = chai.expect;

  describe('Uploader', () => {
    it('should have correct initial state', function () {
      const initialState = {
        pace: 0,               // Current File Uploading Progress
        current: 0,           // Current Uploading file
        total: 1,            // total Uploading files length
        thumbnail: '',      // Current Uploading thumbnail
        uploading: false,  // Is in Uploading Progress
      };
      const wrapper = shallow(<Uploader />);
      expect(wrapper.state()).to.eql(initialState);
    });

    it('should render input', function () {
      const wrapper = shallow(<Uploader />);
      const openWrapper = shallow(<Uploader open />);
      expect(wrapper.children('input')).to.have.length(1);
      expect(openWrapper.children('input')).to.have.length(1);
    });

    it('should render input when uploading', function () {
      const wrapper = shallow(<Uploader open />);
      wrapper.setProps({ destination: 'test' });
      wrapper.setState({ uploading: true }, () => {
        expect(wrapper.children('input')).to.have.length(1);
      });
    });
  });
}
