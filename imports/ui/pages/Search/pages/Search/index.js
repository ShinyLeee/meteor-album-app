import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import ViewLayout from '/imports/ui/layouts/ViewLayout';
import SearchBar from '/imports/ui/components/NavHeader/SearchBar';
import withLoadable from '/imports/ui/hocs/withLoadable';

const AsyncSearchContent = withLoadable({
  loader: () => import('./containers/ContentContainer'),
});

export default class SearchPage extends PureComponent {
  static propTypes = {
    history: PropTypes.object.isRequired,
  }

  state = {
    searchText: null,
  }

  _handleSearchChange = (e) => {
    this.setState({ searchText: e.target.value });
  }

  _handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!this.state.searchText) {
      return;
    }
    this.props.history.push(`/search/${this.state.searchText}`);
  }

  render() {
    return (
      <ViewLayout
        deep
        Topbar={
          <SearchBar
            onChange={this._handleSearchChange}
            onSubmit={this._handleSearchSubmit}
          />
        }
      >
        <AsyncSearchContent />
      </ViewLayout>
    );
  }
}
