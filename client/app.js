const React = require('react');
const ReactDOM = require('react-dom');
const Provider = require('react-redux').Provider;
const App = require('./containers/App');
const CreateTest = require('./containers/CreateTest');
const Home = require('./components/app/Home');
const { Router, Route, IndexRoute } = require('react-router');
const configureStore = require('./store/configureStore');
const configureHistory = require('./lib/configureHistory');
const actions = require('./actionCreators/links.js');
const store = configureStore();
const history = configureHistory(store);
store.dispatch(actions.receiveNewLinkError({ test: 1 }));
// store.dispatch(null);
ReactDOM.render(
	<Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute components={{ main: Home }} />
        <Route path="/create/:id" components={{ main: CreateTest }} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
