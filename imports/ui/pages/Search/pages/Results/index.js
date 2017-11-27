import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import ViewLayout from '/imports/ui/layouts/ViewLayout';
import SearchBar from '/imports/ui/components/NavHeader/SearchBar';
import withLoadable from '/imports/ui/hocs/withLoadable';

const AsyncSearchResultsContent = withLoadable({
  loader: () => import('./containers/ContentContainer'),
});

export default class SearchResultsPage extends PureComponent {
  static propTypes = {
    history: PropTypes.object.isRequired,
  }

  state = {
    searchText: null,
  }

  _handleGoBack = () => {
    this.props.history.replace('/search');
  }

  _handleSearchChange = (e) => {
    this.setState({ searchText: e.target.value });
  }


  _handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!this.state.searchText) {
      return;
    }
    this.props.history.replace(`/search/${this.state.searchText}`);
  }

  render() {
    return (
      <ViewLayout
        deep
        Topbar={
          <SearchBar
            onBack={this._handleGoBack}
            onChange={this._handleSearchChange}
            onSubmit={this._handleSearchSubmit}
          />
        }
      >
        <AsyncSearchResultsContent />
      </ViewLayout>
    );
  }
}
