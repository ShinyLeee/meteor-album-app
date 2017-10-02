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
  import justifiedLayout from 'justified-layout';
  import { shallow } from 'enzyme';
  import { chai } from 'meteor/practicalmeteor:chai';
  import { sinon } from 'meteor/practicalmeteor:sinon';
  import { getRandomArbitrary } from '/imports/utils';
  import { GroupImageHolder } from './GroupImageHolder.js';
  import { Wrapper } from './GroupImageHolder.style.js';

  const expect = chai.expect;

  const image = {
    user: faker.internet.userName(),
    collection: faker.random.word(),
    name: faker.random.uuid(),
    type: 'jpg',
    dimension: [1280, 1280],
  };

  const generateGeometry = (len) => {
    const ratios = [];
    for (let i = 0; i < len; i++) {
      ratios[i] = getRandomArbitrary(0, 1.5).toFixed(1);
    }
    return justifiedLayout(ratios);
  };

  const setup = (group = {}, counter = 0) => {
    const actions = {
      selectCounter: sinon.spy(),
    };
    const component = shallow(
      <GroupImageHolder
        key={1}
        isEditing
        groupName={'2016-12-31'}
        image={image}
        dimension={generateGeometry(1)}
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

  describe('GroupImageHolder', () => {
    it('should isSelect state behave right when counter prop change', () => {
      const { component } = setup();
      expect(component.state('isSelect')).to.equal(false, 'Initial isSelect state must be false');

      component.setProps({ group: { '2016-12-31': 3, '2016-12-30': 3 }, counter: 6 });
      expect(component.state('isSelect')).to.equal(true, 'When counter equal to total');

      component.setProps({ group: { '2016-12-31': 0, '2016-12-30': 0 }, counter: 0 });
      expect(component.state('isSelect')).to.equal(false, 'When counter is empty');
    });

    it('should isSelect state behave right when group prop change', () => {
      const { component } = setup();

      component.setProps({ group: { '2016-12-31': 3, '2016-12-30': 3 }, counter: 6 });
      expect(component.state('isSelect')).to.equal(true, 'When specfic day group exist and value equal to groupTotal');

      component.setProps({ group: { '2016-12-31': 0, '2016-12-30': 3 }, counter: 3 });
      expect(component.state('isSelect')).to.equal(false, 'When specfic day group exist but value is empty');

      component.setProps({ group: { '2016-12-30': 3 }, counter: 3 });
      expect(component.state('isSelect')).to.equal(false, 'When specfic day group not exist');

      component.setProps({ group: {}, counter: 0 });
      expect(component.state('isSelect')).to.equal(false, 'when group prop is empty');
    });

    it('should have toggle button dispatch selectCounter action', () => {
      const { actions, component } = setup();
      const props = component.instance().props;

      const toggleBtn = component.find(Wrapper);
      expect(toggleBtn).to.have.length(1);

      toggleBtn.simulate('touchTap');
      sinon.assert.calledWith(actions.selectCounter, {
        selectImages: [props.image],
        group: props.groupName,
        counter: 1,
      });
      component.setState({ isSelect: true }); // have to set it by self without redux mock store

      toggleBtn.simulate('touchTap');
      sinon.assert.calledWith(actions.selectCounter, {
        selectImages: [props.image],
        group: props.groupName,
        counter: -1,
      });
    });
  });
}
