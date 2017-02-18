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
  import { SelectableImageHolder } from './SelectableImageHolder.jsx';

  const expect = chai.expect;

  const domain = Meteor.settings.public.domain;

  const image = {
    user: faker.internet.userName(),
    collection: faker.random.word(),
    name: faker.random.uuid(),
    type: 'jpg',
  };

  const setup = (counter = 0) => {
    const actions = {
      selectCounter: sinon.spy(),
    };
    const component = shallow(
      <SelectableImageHolder
        domain={domain}
        isEditing
        image={image}
        total={6}
        counter={counter}
        {...actions}
      />
    );
    return {
      actions,
      component,
    };
  };

  describe('SelectableImageHolder', () => {
    it('should isSelect state behave right when counter prop change', () => {
      const { component } = setup();
      component.setProps({ counter: 6 });
      expect(component.state('isSelect')).to.equal(true, 'When counter equal to total');

      component.setProps({ counter: 0 });
      expect(component.state('isSelect')).to.equal(false, 'When counter is empty');
    });

    it('should have toggle button dispatch selectCounter action', () => {
      const { actions, component } = setup();
      const props = component.instance().props;

      const toggleBtn = component.find('.GridLayout__Image');
      expect(toggleBtn).to.have.length(1);

      toggleBtn.simulate('touchTap');
      sinon.assert.calledWith(actions.selectCounter, {
        selectImages: [props.image],
        group: 'nested',
        counter: 1,
      });
      component.setState({ isSelect: true }); // have to set it by self without redux mock store

      toggleBtn.simulate('touchTap');
      sinon.assert.calledWith(actions.selectCounter, {
        selectImages: [props.image],
        group: 'nested',
        counter: -1,
      });
    });
  });
}
