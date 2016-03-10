require('react');
const connect = require('react-redux').connect;
const { push } = require('react-router-redux');
const GetEntryInfo = require('../components/GetEntryInfo');

const mapStateToProps = (state, ownProps) => {
  return state.toJS();
};

const mapDispatchToProps = (dispatch) => {
  return {
    onBack: () => {
      dispatch(push('/'));
    },
  };
};

module.exports = connect(
  mapStateToProps,
  // mapDispatchToProps
)(GetEntryInfo);