import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Notes } from '/imports/api/notes/note.js';

import { snackBarOpen } from '../redux/actions/creators.js';
import Construction from '../pages/Error/Construction.jsx';
import Forbidden from '../pages/Error/Forbidden.jsx';
import InternalError from '../pages/Error/InternalError.jsx';
import NotFound from '../pages/Error/NotFound.jsx';


const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => bindActionCreators({ snackBarOpen }, dispatch);

const ConstructionContainer = createContainer(() => {
  Meteor.subscribe('Notes.own');
  const noteNum = Notes.find({ isRead: { $ne: true } }).count();
  return {
    noteNum,
  };
}, Construction);

export const ConnectedConstruction = connect(mapStateToProps, mapDispatchToProps)(ConstructionContainer);

const ForbiddenContainer = createContainer(() => {
  Meteor.subscribe('Notes.own');
  const noteNum = Notes.find({ isRead: { $ne: true } }).count();
  return {
    noteNum,
  };
}, Forbidden);

export const ConnectedForbidden = connect(mapStateToProps, mapDispatchToProps)(ForbiddenContainer);

const InternalErrorContainer = createContainer(() => {
  Meteor.subscribe('Notes.own');
  const noteNum = Notes.find({ isRead: { $ne: true } }).count();
  return {
    noteNum,
  };
}, InternalError);

export const ConnectedInternalError = connect(mapStateToProps, mapDispatchToProps)(InternalErrorContainer);

const NotFoundContainer = createContainer(() => {
  Meteor.subscribe('Notes.own');
  const noteNum = Notes.find({ isRead: { $ne: true } }).count();
  return {
    noteNum,
  };
}, NotFound);

export const ConnectedNotFound = connect(mapStateToProps, mapDispatchToProps)(NotFoundContainer);
