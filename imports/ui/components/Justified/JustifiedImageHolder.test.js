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
  import faker from 'faker';
  import { shallow } from 'enzyme';
  import { chai } from 'meteor/practicalmeteor:chai';
  import { JustifiedImageHolder } from './JustifiedImageHolder.jsx';

  const expect = chai.expect;

  const image = { name: faker.random.uuid() };
  const imageSource = faker.image.imageUrl();
  const style = { left: 0, top: 0, width: '100px', height: '100px' };

  describe('JustifiedImageHolder', () => {
    it('should isSelect state behave right when counter prop change', function () {
      const wrapper = shallow(
        <JustifiedImageHolder
          image={image}
          imageSource={imageSource}
          style={style}
          isEditing
          total={6}
          groupTotal={3}
          day={'2016-12-31'}
        />
      );
      expect(wrapper.state('isSelect'))
      .to.equal(false, 'Initial isSelect state must be false');

      wrapper.setProps({ counter: 6 });
      expect(wrapper.state('isSelect'))
      .to.equal(true, 'When counter equal to total');

      wrapper.setProps({ counter: 0 });
      expect(wrapper.state('isSelect'))
      .to.equal(false, 'When counter is empty');
    });

    it('should isSelect state behave right when group prop change', function () {
      const wrapper = shallow(
        <JustifiedImageHolder
          image={image}
          imageSource={imageSource}
          style={style}
          isEditing
          total={6}
          groupTotal={3}
          day={'2016-12-31'}
        />
      );
      expect(wrapper.state('isSelect'))
      .to.equal(false, 'Initial isSelect state must be false');

      wrapper.setProps({ group: { '2016-12-31': 3, '2016-12-30': 3 } });
      expect(wrapper.state('isSelect'))
      .to.equal(true, 'When specfic day group exist and value equal to groupTotal');

      wrapper.setProps({ group: { '2016-12-31': 0, '2016-12-30': 3 } });
      expect(wrapper.state('isSelect'))
      .to.equal(false, 'When specfic day group exist but value is empty');

      wrapper.setProps({ group: { '2016-12-30': 3 } });
      expect(wrapper.state('isSelect'))
      .to.equal(false, 'When specfic day group not exist');

      wrapper.setProps({ group: null });
      expect(wrapper.state('isSelect'))
      .to.equal(false, 'when group prop is NULL');
    });
  });
}
