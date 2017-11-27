import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadingModule, loadedModule, loadingModuleError } from '/imports/ui/redux/actions';

const withModules = (WrappedComponent) => {
  let C = (props) => <WrappedComponent {...props} />;

  const mapStateToProps = ({ modules }) => ({
    modules,
  });

  const mapDispatchToProps = (dispatch) => bindActionCreators({
    loadingModule,
    loadedModule,
    loadingModuleError,
  }, dispatch);

  C = connect(mapStateToProps, mapDispatchToProps)(C);

  C.displayName = `withModules(${C.displayName || C.name})`;

  return C;
};

export default withModules;
