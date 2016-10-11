import React, { PropTypes, Component } from 'react';
import moment from 'moment';
import { isInclusivelyAfterDay, DateRangePickerInput } from 'react-dates';
import {IndexRoute, Router, Route, Link, browserHistory, Redirect} from "react-router";
import fetch from "isomorphic-fetch";
import {fetchMarkers, fetchPickUps, fetchDropOffs, onDatesChange, openMarkerInfo, onMarkerClose} from '../../actions';
import DateRangePickerWrapper from '../../components/dates';
import MyMap from '../../components/my-map';
import {connect} from 'react-redux';

class Root extends Component{
  constructor(props){
    super(props);
  }

  componentDidMount(){
    //load markers
    this.props.fetchMarkers();
  }

  componentDidUpdate(oldProps,oldState){
    if(!oldProps.startDate.isSame(this.props.startDate) || !oldProps.endDate.isSame(this.props.endDate)){
      this.props.fetchMarkers();
    }
  }

  render(){
    const {markers, startDate, endDate , filters} = this.props;
      const {TOGGLEDRAWING, SHOWPICKUPS, SHOWDROPOFFS} = filters;
    let displayMarkers = [];
    if(SHOWPICKUPS){
      displayMarkers = displayMarkers.concat(markers.pickups);
    }
    if(SHOWDROPOFFS){
      displayMarkers = displayMarkers.concat(markers.dropoffs);
    }


    return(
      <div>
      <DateRangePickerWrapper
          numberOfMonths={1}
          reopenPickerOnClearDates
          onOutsideClick
          displayFormat="MMM D, YYYY"
          isOutsideRange={day =>
              !isInclusivelyAfterDay(day, startDate) ||
              isInclusivelyAfterDay(day, endDate)
            }
          onDatesChange = {this.props.onDatesChange}
          startDate={startDate}
          endDate={endDate}
        />
      <MyMap filters={filters} fetchPickUps={this.props.fetchPickUps} onMarkerClose={this.props.onMarkerClose} openMarkerInfo={this.props.openMarkerInfo}  fetchDropOffs={this.props.fetchDropOffs} markers={displayMarkers}/>
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    ...state.main,
    filters : state.filters
  }
}

export default connect(mapStateToProps, {
  fetchMarkers,
  fetchPickUps,
  fetchDropOffs,
  onDatesChange,
  onMarkerClose,
  openMarkerInfo
})(Root);
