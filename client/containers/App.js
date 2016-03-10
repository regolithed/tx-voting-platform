import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Header from '../components/Header';

class App extends Component {
  render() {
    const { main } = this.props;
    return (
      <div>
        <Header />
        <div className="container content">
          {main}
        </div>
      </div>
    );  
  }
}

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

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(App);
