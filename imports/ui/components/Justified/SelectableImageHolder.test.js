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
  import { SelectableImageHolder } from './SelectableImageHolder.jsx';

  const expect = chai.expect;

  const domain = Meteor.settings.public.domain;
  const square = Math.ceil(document.body.clientWidth / 3);
  const image = {
    user: faker.internet.userName(),
    collection: faker.random.word(),
    name: faker.random.uuid(),
    type: 'jpg',
  };

  describe('SelectableImageHolder', () => {
    it('should isSelect state behave right when counter prop change', function () {
      const wrapper = shallow(
        <SelectableImageHolder
          isEditing
          image={image}
          total={6}
        />
      );
      wrapper.setProps({ counter: 6 });
      expect(wrapper.state('isSelect'))
      .to.equal(true, 'When counter equal to total');

      wrapper.setProps({ counter: 0 });
      expect(wrapper.state('isSelect'))
      .to.equal(false, 'When counter is empty');
    });

    it('should have correct image source link', function () {
      const url = `${domain}/${image.user}/${image.collection}/${image.name}.${image.type}`;
      const imageSource = `${url}?imageView2/1/w/${square * 2}/h/${square * 2}`;
      const wrapper = shallow(
        <SelectableImageHolder
          isEditing
          image={image}
          total={6}
        />
      );
      expect(wrapper.find({ src: imageSource })).to.have.length(1);
    });
  });
}
