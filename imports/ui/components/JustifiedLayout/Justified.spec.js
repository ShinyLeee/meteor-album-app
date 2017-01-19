/* eslint-disable
   react/jsx-filename-extension,
   no-unused-expressions,
   func-names,
   prefer-arrow-callback
*/
import { Meteor } from 'meteor/meteor';

if (Meteor.isClient) {
  import React from 'react';
  import faker from 'faker';
  import { shallow } from 'enzyme';
  import { chai } from 'meteor/practicalmeteor:chai';
  import { sinon } from 'meteor/practicalmeteor:sinon';
  import Justified from './Justified.jsx';

  const expect = chai.expect;
  const domain = Meteor.settings.public.domain;

  const generateImages = (len) => {
    const images = [];
    for (let i = 0; i < len; i++) {
      images[i] = {
        user: faker.internet.userName(),
        collection: faker.random.word(),
        name: faker.random.uuid(),
        type: 'jpg',
      };
    }
    return images;
  };

  const setup = (group = {}, counter = 0) => {
    const actions = {
      selectCounter: sinon.spy(),
      selectGroupCounter: sinon.spy(),
      enableSelectAll: sinon.spy(),
      disableSelectAll: sinon.spy(),
    };
    const component = shallow(
      <Justified
        domain={domain}
        isEditing={false}
        images={generateImages(3)}
        group={group}
        counter={counter}
        {...actions}
      />
    );
    return {
      actions,
      component,
    };
  };

  describe('Justified Component', () => {
    it('should isAllSelect state always false if isEditing prop false', () => {
      const { component } = setup();
      expect(component.state('isAllSelect')).to.be.false;

      component.setProps({ counter: 3 });
      expect(component.state('isAllSelect')).to.be.false;
    });

    it('should isAllSelect state behave right when counter prop change', () => {
      const { component } = setup({ '2017-01-12': 3 }, 3);
      component.setProps({ isEditing: true });

      expect(component.state('isAllSelect')).to.equal(true, 'When counter equal to images\' length');

      component.setProps({ group: { '2017-01-12': 2 }, counter: 2 });
      expect(component.state('isAllSelect')).to.equal(false, 'When counter not equal to images\' length');

      component.setProps({ group: { '2017-01-12': -1 }, counter: -1 });
      expect(component.state('isAllSelect')).to.equal(false, 'When counter is negative');
    });

    it('should have toggle button dispatch enable/disable selectAll actions when isEditing true', () => {
      const { actions, component } = setup();

      component.setProps({ isEditing: true });

      const toggleBtn = component.find('.Justified__toolbox_left');
      expect(toggleBtn).to.have.length(1);

      toggleBtn.simulate('touchTap');
      sinon.assert.calledOnce(actions.enableSelectAll);
      component.setState({ isAllSelect: true }); // have to set it by self without redux mock store

      toggleBtn.simulate('touchTap');
      sinon.assert.calledOnce(actions.disableSelectAll);
    });
  });
}
