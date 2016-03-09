const React = require('react');
const ReactDOM = require('react-dom');
const Provider = require('react-redux').Provider;
const App = require('./containers/App');
const CreateLinkRoute = require('./containers/CreateLinkRoute');
const Home = require('./components/app/Home');
const { Router, Route, IndexRoute } = require('react-router');
const configureStore = require('./store/configureStore');
const configureHistory = require('./lib/configureHistory');
const store = configureStore();
const history = configureHistory(store);

ReactDOM.render(
	<Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute components={{ main: Home }} />
        <Route path="/create" components={{ main: CreateLinkRoute }} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
