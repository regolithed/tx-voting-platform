import React, { Component, PropTypes } from 'react';
import Profile from '../components/Profile';
import { connect } from 'react-redux';
import entryActions from '../actionCreators/entries';
import userActions from '../actionCreators/users';
import { push } from 'react-router-redux';

class ProfileRoute extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.populateProfileUser(this.props.authID);
    this.props.getEntriesForUser(this.props.authID);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.redirectPath !== null) {
      this.props.redirect(nextProps.redirectPath);
    } else if (nextProps.authID !== this.props.authID) {
      this.props.populateProfileUser(nextProps.authID);
      this.props.getEntriesForUser(nextProps.authID);
    }
  }
  render() {
    return <Profile {...this.props} />;
  }
}

const getUserStats = (entries => {
  return entries.reduce((stats, entry) => {
    stats.views = stats.views || 0;
    stats.likes = stats.likes || 0;
    stats.likes += parseInt(entry.statistics.likeCount, 0);
    stats.views += parseInt(entry.statistics.viewCount, 0);
    return stats;
  }, {});
});

const getRedirectPath = (authID, user) => {
  if (!authID && !user.isLoggedIn && !user.isPopulated) return '/login';
  if (!authID && user.isLoggedIn && user.isPopulated) return `/profile/${user.data.authID}`;
  return null;
};

const mapStateToProps = (state, ownProps) => {
  const authID = ownProps.params.auth_id;
  const entries = state.getIn(['entriesForUser', 'itemsByID']).toList().toJS();
  const loggedInUser = state.get('user');
  const userStats = getUserStats(entries);
  const profileUser = state.get('profileUser');
  const displayUser = (authID && authID === loggedInUser.getIn(['data', 'authID'])) ? loggedInUser : profileUser;
  const redirectPath = getRedirectPath(authID, loggedInUser.toJS());
  const entriesWithUsers = entries.map((entry) => {
    return {
      ...entry,
      user: profileUser.get('data').toJS(),
    };
  });
  return {
    authID,
    redirectPath,
    entries: entriesWithUsers,
    userStats,
    user: displayUser.get('data').toJS(),
  };
};

const matchDispatchToProps = (dispatch) => {
  return {
    populateProfileUser: (authID) => dispatch(userActions.populateProfileUser(authID)),
    getEntriesForUser: (authID) => {
      if (authID) dispatch(entryActions.getEntriesForUser(authID));
    },
    onLogoutClick: () => dispatch(userActions.logOut()),
    redirect: (path) => dispatch(push(path)),
  };
};

ProfileRoute.propTypes = {
  onLogoutClick: PropTypes.func.isRequired,
  user: PropTypes.func.isRequired,
  authID: PropTypes.string,
  redirect: PropTypes.func.isRequired,
  getEntriesForUser: PropTypes.func.isRequired,
  populateProfileUser: PropTypes.func.isRequired,
  handleAuthID: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, matchDispatchToProps)(ProfileRoute);
