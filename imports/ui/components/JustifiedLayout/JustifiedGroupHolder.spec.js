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
  import { JustifiedGroupHolder } from './JustifiedGroupHolder.jsx';

  const expect = chai.expect;

  const generateImages = (len) => {
    const images = [];
    for (let i = 0; i < len; i++) {
      images[i] = {
        user: faker.internet.userName(),
        collection: faker.random.word(),
        name: faker.random.uuid(),
        type: 'jpg',
        dimension: [1280, 1280],
      };
    }
    return images;
  };

  const setup = (group = {}, counter = 0) => {
    const actions = {
      selectCounter: sinon.spy(),
      selectGroupCounter: sinon.spy(),
    };
    const component = shallow(
      <JustifiedGroupHolder
        isEditing
        day={'2016-12-31'}
        dayGroupImage={generateImages(4)}
        total={6}
        groupTotal={4}
        group={group}
        counter={counter}
        {...actions}
      />
    );
    const anotherComponent = shallow(
      <JustifiedGroupHolder
        isEditing
        day={'2016-12-30'}
        dayGroupImage={generateImages(2)}
        total={6}
        groupTotal={2}
        group={group}
        counter={counter}
        {...actions}
      />
    );
    return {
      actions,
      component,
      anotherComponent,
    };
  };

  describe('JustifiedGroupHolder', () => {
    it('should isGroupSelect state behave right when counter change', () => {
      const { component } = setup();
      component.setProps({ counter: 6 });
      expect(component.state('isGroupSelect')).to.equal(true, 'When counter prop equal total prop');

      component.setProps({ counter: 0 });
      expect(component.state('isGroupSelect')).to.equal(false, 'When counter prop is 0');
    });
    it('should isGroupSelect state behave right when group\'s key change', () => {
      const { component, anotherComponent } = setup();
      expect(component.state('isGroupSelect')).to.equal(false, 'When group prop is {} -- empty Object');

      component.setProps({ group: { '2016-12-31': 4 }, counter: 4 });
      anotherComponent.setProps({ group: { '2016-12-31': 4 }, counter: 4 });
      expect(component.state('isGroupSelect')).to.equal(true, '当前组需要高亮当只有当前组被全选时');
      expect(anotherComponent.state('isGroupSelect')).to.equal(false, '其他组不能高亮当其他组没有被全选时');

      component.setProps({ group: { '2016-12-30': 2 }, counter: 2 });
      anotherComponent.setProps({ group: { '2016-12-30': 2 }, counter: 2 });
      expect(anotherComponent.state('isGroupSelect')).to.equal(true, '其他组需要高亮当只有其他组被全选时');
      expect(component.state('isGroupSelect')).to.equal(false, '当前组不能高亮当当前组没有被全选时');
    });

    it('should isGroupSelect state behave right when group\'s value change', () => {
      const { component, anotherComponent } = setup();
      expect(anotherComponent.state('isGroupSelect')).to.equal(false, 'Initial isGroupSelect state must be false');

      component.setProps({ group: { '2016-12-31': 4, '2016-12-30': 2 }, counter: 6 });
      anotherComponent.setProps({ group: { '2016-12-31': 4, '2016-12-30': 2 }, counter: 6 });
      expect(component.state('isGroupSelect')).to.equal(true, '当前组被选中且所有图片都被选中时');
      expect(anotherComponent.state('isGroupSelect')).to.equal(true, '其他组被选中且所有图片都被选中时');

      component.setProps({ group: { '2016-12-31': 3, '2016-12-30': 2 }, counter: 2 });
      anotherComponent.setProps({ group: { '2016-12-31': 3, '2016-12-30': 2 }, counter: 2 });
      expect(component.state('isGroupSelect')).to.equal(false, '当前组有图片被选中但没有被全选时');
      expect(anotherComponent.state('isGroupSelect')).to.equal(true, '当group属性更改但当前组仍全选时');

      component.setProps({ group: { '2016-12-31': 4 }, counter: 4 });
      expect(component.state('isGroupSelect')).to.equal(true, '只有当前组被全选时');
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
