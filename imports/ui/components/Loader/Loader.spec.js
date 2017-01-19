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
  // import { sinon } from 'meteor/practicalmeteor:sinon';
  import Dialog from 'material-ui/Dialog';
  import Loader from './Loader.jsx';

  const expect = chai.expect;

  const setup = (open = false, message = '', timeout = 5000) => {
    const component = shallow(
      <Loader
        open={open}
        message={message}
        timeout={timeout}
      />
    );
    return {
      component,
    };
  };

  describe('Loader', function () {
    // this.timeout(5500);
    it('should render inner Dialog when open', () => {
      const { component } = setup(true);
      expect(component.state('open')).to.equal(true, 'When open prop is true');
      expect(component.find(Dialog)).to.have.length(1);
    });

    // it('should close when timeout', (done) => {
    //   const msg = 'Loading';
    //   const { component } = setup(true, msg);
    //   expect(component.find('.Loader__message').text()).to.equal(msg);
    //   setTimeout(() => {
    //     expect(component.state('open')).to.equal(true, 'sss');
    //     done();
    //   }, 5200);
    // });
  });
}
