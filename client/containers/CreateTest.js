const React = require('react');
const connect = require('react-redux').connect;
const actions = require('../actionCreators/links');
const { push } = require('react-router-redux');

const CreateTest = ({ onBack }) => {
  return (
    <div>
    <button onClick={onBack}>Back</button>
    </div>
  );
};

const mapStateToProps = (state) => {
  return state.toJS();
  // return R.pick(['someProp'], state);
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
  mapDispatchToProps
)(CreateTest);
