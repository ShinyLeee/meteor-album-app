import React, { PureComponent } from 'react';
import { Provider } from 'react-redux';
import { MuiThemeProvider } from 'material-ui/styles';
import theme from '/imports/utils/theme';
import Store from '/imports/ui/redux/store';
import NavigatorLayout from '/imports/ui/layouts/NavigatorLayout';

export default class App extends PureComponent {
  state = {
    error: null,
  }

  componentDidCatch(error) {
    import('/imports/ui/layouts/ErrorLayout')
      .then((module) => {
        const ErrorLayout = module.default;
        this.setState({ error: <ErrorLayout message={error.toString()} /> });
      })
      .catch((err) => {
        this.setState({ error: <div>Uncaught Error: {err}</div> });
        console.log(err);
      });
  }

  render() {
    return (
      <Provider store={Store}>
        <MuiThemeProvider theme={theme}>
          {
            this.state.error || <NavigatorLayout />
          }
        </MuiThemeProvider>
      </Provider>
    );
  }
}
