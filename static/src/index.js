import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { isInclusivelyAfterDay, DateRangePickerInput } from 'react-dates';
import {IndexRoute, Router, Route, Link, browserHistory, Redirect} from "react-router";
import fetch from "isomorphic-fetch";

// Redux
import {Provider} from "react-redux";
import store, {history} from "./store";


import TopBanner from './components/top-banner';
// import SideBanner from './components/side-banner';
import SideBanner from './containers/Sidebar';
import Root from './containers/Root';

class App extends Component{
  constructor(props){
    super(props);
  }

  render(){
    const startDate = moment("2014-4-2");
    const endDate = moment("2014-5-30");
    return(
      <Provider store={ store }>
      <div>
        <div>
          <TopBanner />
          <Root/>
        </div>

          <SideBanner />

      </div>
      </Provider>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('.app'));
