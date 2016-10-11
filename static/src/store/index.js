import {createStore, compose, applyMiddleware} from "redux";
import thunk from "redux-thunk";
import {syncHistoryWithStore} from "react-router-redux";
import {browserHistory} from "react-router";
import createLogger from "redux-logger";

const logger = createLogger();

// import the root reducer
import rootReducer from "../reducers/index";


const initialState = {};

// enable the devToolsExtension
const store = createStore(rootReducer, initialState, compose(
  applyMiddleware(thunk, logger),
  window.devToolsExtension ? window.devToolsExtension() : f => f
));


export const history = syncHistoryWithStore(browserHistory, store);

export default store;
