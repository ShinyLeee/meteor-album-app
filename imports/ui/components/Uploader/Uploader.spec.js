/* eslint-disable
   react/jsx-filename-extension,
   no-unused-expressions,
   func-names,
   prefer-arrow-callback
*/
import { Meteor } from 'meteor/meteor';

if (Meteor.isClient) {
  import React from 'react';
  import { shallow } from 'enzyme';
  import { chai } from 'meteor/practicalmeteor:chai';
  import { sinon } from 'meteor/practicalmeteor:sinon';
  import Uploader from './Uploader';

  const expect = chai.expect;

  const setup = (open = false) => {
    const actions = {
      snackBarOpen: sinon.spy(),
      uploaderStop: sinon.spy(),
    };
    const component = shallow(
      <Uploader
        open={open}
        {...actions}
      />,
    );
    return {
      actions,
      component,
    };
  };

  describe('Uploader', () => {
    it('should have correct initial state', function () {
      const initialState = {
        pace: 0, // Current File Uploading Progress
        current: 0, // Current Uploading file
        total: 1, // total Uploading files length
        thumbnail: '', // Current Uploading thumbnail
        uploading: false, // Is in Uploading Progress
      };
      const { component } = setup();
      expect(component.state()).to.eql(initialState);
    });

    it('should render input when open', function () {
      const { component } = setup();
      const openedComponent = setup(true).component;
      expect(component.children('input')).to.have.length(1);
      expect(openedComponent.children('input')).to.have.length(1);
    });

    it('should not render input when uploading', function () {
      const { component } = setup(true);
      component.setProps({ destination: 'test' });
      component.setState({ uploading: true });
      expect(component.children('input')).to.have.length(0);
    });
  });
}
