import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import CollHolder from '/imports/ui/components/CollHolder';

export default class FollowedCollection extends Component {
  static propTypes = {
    colls: PropTypes.array.isRequired,
  }

  state = {
    colls: this.generateColls(this.props),
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.colls.length !== nextProps.colls.length) {
      const newColls = this.generateColls(nextProps);
      this.setState({ colls: newColls });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  generateColls(props) {
    return props.colls.map((coll) => {
      const newColl = coll;
      newColl.userAvatar = Meteor.users.findOne({ username: coll.user }).profile.avatar;
      return newColl;
    });
  }

  render() {
    const { colls } = this.state;
    return (
      <div style={{ paddingBottom: '30px' }}>
        {
          colls.map((coll) => (
            <CollHolder
              key={coll._id}
              avatarSrc={coll.userAvatar}
              coll={coll}
              showUser
            />
          ))
        }
      </div>
    );
  }
}
