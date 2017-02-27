import React, { PropTypes } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import CollHolder from '/imports/ui/components/CollHolder/CollHolder.jsx';

const OwnedCollection = (props) => {
  const { curUser, colls, dataIsReady } = props;
  return (
    <div>
      {
        dataIsReady
        ? colls.map((coll, i) => (
          <CollHolder
            key={i}
            avatarSrc={curUser.profile.avatar}
            coll={coll}
          />
        ))
        : (
          <div className="text-center">
            <CircularProgress
              color="#3F51B5"
              size={30}
              thickness={2.5}
            />
          </div>
        )
      }
    </div>
  );
};

OwnedCollection.displayName = 'OwnedCollection';

OwnedCollection.defaultProps = {
  dataIsReady: false,
};

OwnedCollection.propTypes = {
  curUser: PropTypes.object.isRequired,
  // Pass from Database and Redux
  colls: PropTypes.array.isRequired,
  dataIsReady: PropTypes.bool.isRequired,
};

export default OwnedCollection;
