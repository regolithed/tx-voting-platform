const Immutable = require('immutable');
const { createReducer } = require('../lib/redux-helpers');

// FIXME: ESLint
const links = createReducer(Immutable.fromJS([]), {
  RECEIVE_LINKS: (state, action) => {
    return Immutable.fromJS(action.links);
  },
});

const linksAreLoading = createReducer(false, {
  REQUEST_LINKS: () => true,
  RECEIVE_LINKS: () => false,
});

const isLinkInfoLoading = createReducer(false, {
  REQUEST_LINK_INFO: () => true,
});

const isLinkBeingEditted = createReducer(false, {
  RECEIVE_LINK_INFO: () => true,
  REQUEST_NEW_LINK: () => false,
});

const isLinkUpdating = createReducer(false, {
  REQUEST_NEW_LINK: () => true,
  RECEIVE_NEW_LINK: () => false,
  RECEIVE_NEW_LINK_ERROR: () => false,
});

const createLinkError = createReducer(false, {
  REQUEST_NEW_LINK: () => null,
  RECEIVE_NEW_LINK: () => null,
  RECEIVE_NEW_LINK_ERROR: (state, action) => {
    return Immutable.fromJS(action.error);
  },
});

const getLinksError = createReducer(false, {
  REQUEST_LINKS: () => null,
  RECEIVE_LINKS: () => null,
  RECEIVE_LINKS_ERROR: (state, action) => Immutable.fromJS(action.error),
});

const currentLink = createReducer(null, {
  RECEIVE_LINK_INFO: (state, action) => {
    return Immutable.fromJS(action.data);
  },
});


module.exports = {
  links,
  linksAreLoading,
  getLinksError,
  createLinkError,
  isLinkBeingEditted,
  isLinkUpdating,
  isLinkInfoLoading,
  currentLink,
};
