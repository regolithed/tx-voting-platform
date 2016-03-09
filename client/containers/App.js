const React = require('react');
const connect = require('react-redux').connect;
const Header = require('../components/app/Header');

const App = ({ main }) => {
  return (
    <div>
      <Header />
      <div className="container content">
        {main}
      </div>
    </div>
	);
};

const mapStateToProps = (state) => {
  return state.toJS();
  // return R.pick(['someProp'], state);
};

const mapDispatchToProps = (dispatch) => {
  return {};
  // return {
  //   onClick: (value) => {
  //     dispatch(actions.someAction(value));
  //   },
  // };
};

const WrappedApp = connect(
	mapStateToProps,
	mapDispatchToProps
)(App);

module.exports = WrappedApp;
