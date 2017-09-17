import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import CollHolder from '/imports/ui/components/CollHolder/CollHolder.jsx';

export default class FollowedCollection extends Component {

  constructor(props) {
    super(props);
    this.state = {
      colls: this.generateColls(props),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.colls.length !== nextProps.colls.length) {
      const newColls = this.generateColls(nextProps);
      this.setState({ colls: newColls });
    }
  }

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
          colls.map((coll, i) => (
            <CollHolder
              key={i}
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

FollowedCollection.displayName = 'FollowedCollection';

FollowedCollection.propTypes = {
  curUser: PropTypes.object.isRequired,
  colls: PropTypes.array.isRequired,
};
