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
  import JustifiedImageHolder from './JustifiedImageHolder.jsx';

  const expect = chai.expect;

  const image = {
    user: faker.internet.userName(),
    collection: faker.random.word(),
    name: faker.random.uuid(),
    type: 'jpg',
  };
  const imageSrc = faker.image.imageUrl();
  const imageHolderStyle = { left: 0, top: 0, width: '100px', height: '100px' };

  const setup = (group = null, counter = 0) => {
    const actions = {
      selectCounter: sinon.spy(),
    };
    const component = shallow(
      <JustifiedImageHolder
        key={1}
        isEditing
        day={'2016-12-31'}
        image={image}
        imageSrc={imageSrc}
        imageHolderStyle={imageHolderStyle}
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

  describe('JustifiedImageHolder', () => {
    it('should isSelect state behave right when counter prop change', () => {
      const { component } = setup();
      expect(component.state('isSelect'))
      .to.equal(false, 'Initial isSelect state must be false');

      component.setProps({ group: { '2016-12-31': 3, '2016-12-30': 3 }, counter: 6 });
      expect(component.state('isSelect'))
      .to.equal(true, 'When counter equal to total');

      component.setProps({ group: { '2016-12-31': 0, '2016-12-30': 0 }, counter: 0 });
      expect(component.state('isSelect'))
      .to.equal(false, 'When counter is empty');
    });

    it('should isSelect state behave right when group prop change', () => {
      const { component } = setup();

      component.setProps({ group: { '2016-12-31': 3, '2016-12-30': 3 }, counter: 6 });
      expect(component.state('isSelect'))
      .to.equal(true, 'When specfic day group exist and value equal to groupTotal');

      component.setProps({ group: { '2016-12-31': 0, '2016-12-30': 3 }, counter: 3 });
      expect(component.state('isSelect'))
      .to.equal(false, 'When specfic day group exist but value is empty');

      component.setProps({ group: { '2016-12-30': 3 }, counter: 3 });
      expect(component.state('isSelect'))
      .to.equal(false, 'When specfic day group not exist');

      component.setProps({ group: null, counter: 0 });
      expect(component.state('isSelect'))
      .to.equal(false, 'when group prop is NULL');
    });

    it('should have toggle button dispatch selectCounter action', () => {
      const { actions, component } = setup();
      const props = component.instance().props;

      const toggleBtn = component.find('.Justified__imageHolder');
      expect(toggleBtn).to.have.length(1);

      toggleBtn.simulate('touchTap');
      sinon.assert.calledWith(actions.selectCounter, {
        selectImages: [props.image],
        group: props.day,
        counter: 1,
      });
      component.setState({ isSelect: true }); // have to set it by self without redux mock store

      toggleBtn.simulate('touchTap');
      sinon.assert.calledWith(actions.selectCounter, {
        selectImages: [props.image],
        group: props.day,
        counter: -1,
      });
    });
  });
}
