import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import CollHolder from './CollHolder';
import { TabView } from './CollHolder.style';

export default class CollList extends PureComponent {
  static propTypes = {
    colls: PropTypes.any.isRequired,
    children: PropTypes.any,
  }

  render() {
    const { colls, children, ...rest } = this.props;
    return (
      <TabView>
        { children }
        {
          _.map(colls, (coll) => (
            <CollHolder
              key={coll._id}
              coll={coll}
              {...rest}
            />
          ))
        }
      </TabView>
    );
  }
}
