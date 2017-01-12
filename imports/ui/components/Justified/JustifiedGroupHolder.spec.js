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
  import JustifiedGroupHolder from './JustifiedGroupHolder.jsx';

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

  const domain = Meteor.settings.public.domain;

  const dayGroupImages = [
    {
      user: faker.internet.userName(),
      collection: faker.random.word(),
      name: faker.random.uuid(),
      type: 'jpg',
    },
    {
      user: faker.internet.userName(),
      collection: faker.random.word(),
      name: faker.random.uuid(),
      type: 'jpg',
    },
    {
      user: faker.internet.userName(),
      collection: faker.random.word(),
      name: faker.random.uuid(),
      type: 'jpg',
    },
  ];

  const setup = (group = null, counter = 0) => {
    const actions = {
      selectCounter: sinon.spy(),
      selectGroupCounter: sinon.spy(),
    };
    const component = shallow(
      <JustifiedGroupHolder
        domain={domain}
        isEditing
        day={'2016-12-31'}
        geometry={geometry}
        dayGroupImage={dayGroupImages}
        total={6}
        groupTotal={3}
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

  describe('JustifiedGroupHolder', () => {
    it('should isGroupSelect state behave right when group\'s key change', () => {
      const { component } = setup();
      expect(component.state('isGroupSelect'))
      .to.equal(false, 'When group prop is NULL');

      component.setProps({ group: { '2016-12-31': 3 }, counter: 3 });
      expect(component.state('isGroupSelect'))
      .to.equal(true, 'When group prop equal to groupTotal');

      component.setProps({ group: { '2016-12-30': 3 }, counter: 3 });
      expect(component.state('isGroupSelect'))
      .to.equal(false, 'When specfic day group not exist');
    });

    it('should isGroupSelect state behave right when group\'s value change', () => {
      const { component } = setup();
      expect(component.state('isGroupSelect'))
      .to.equal(false, 'Initial isGroupSelect state must be false');

      component.setProps({ group: { '2016-12-31': 3, '2016-12-30': 3 }, counter: 6 });
      expect(component.state('isGroupSelect'))
      .to.equal(true, 'When specfic day group exist and value equal to groupTotal');

      component.setProps({ group: { '2016-12-31': 0, '2016-12-30': 3 }, counter: 3 });
      expect(component.state('isGroupSelect'))
      .to.equal(false, 'When specfic day group exist but value is empty');

      component.setProps({ group: { '2016-12-31': 3 }, counter: 3 });
      expect(component.state('isGroupSelect'))
      .to.equal(true, 'When only has specfic day group');

      component.setProps({ group: { '2016-12-31': 2 }, counter: 2 });
      expect(component.state('isGroupSelect'))
      .to.equal(false, 'When specfic day group exist but value not equal to groupTotal');
    });

    it('should have toggle button dispatch selectGroupCounter action', () => {
      const { actions, component } = setup();
      const props = component.instance().props;

      const toggleBtn = component.find('.Justified__title');
      expect(toggleBtn).to.have.length(1);

      toggleBtn.simulate('touchTap');
      sinon.assert.calledWith(actions.selectGroupCounter, {
        selectImages: props.dayGroupImage,
        group: props.day,
        counter: props.groupTotal,
      });
      component.setState({ isGroupSelect: true }); // have to set it by self without redux mock store

      toggleBtn.simulate('touchTap');
      sinon.assert.calledWith(actions.selectGroupCounter, {
        selectImages: props.dayGroupImage,
        group: props.day,
        counter: -props.groupTotal,
      });
    });
  });
}
