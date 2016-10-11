import {routerReducer}   from "react-router-redux";
import {combineReducers} from "redux";
import {filterConstants} from '../actions';
import moment from 'moment'
export function mainReducer(state= {
  markers : {
    pickups : [],
    dropoffs : []
  },
  startDate : moment("2014-4-1"),
  endDate : moment("2014-5-30")
},action){
  switch(action.type){
    // case 'FETCHING_MARKERS' :
    //   return {
    //     ...state,
    //     markers : {}
    //   }
    case 'FETCHED_MARKERS' :
      return {
        ...state,
        markers :{
          ...action.payload.markers
        }
      };
    // case 'FETCHING_PICKUPS' :
    //   return {
    //     ...state,
    //     markers : {
    //       ...state.markers,
    //       pickups : []
    //     }
    //   }
    case 'FETCHED_PICKUPS' :
      return {
        ...state,
        markers :{
          ...state.markers,
          pickups : action.payload.pickups.slice(0)
        }
      };
      case 'FETCHING_DROPOFFS' :
      return {
        ...state,
        markers : {
          ...state.markers,
          dropoffs : []
        }
      }
    case 'FETCHED_DROPOFFS' :
      return {
        ...state,
        markers :{
          ...state.markers,
          dropoffs :  action.payload.dropoffs.slice(0)
        }
      };
    case 'MARKER_OPEN' : {
      var marker = action.payload.marker;
      return {
        ...state,
        markers :{
            ...state.markers,
           [marker.marker_type] : state.markers[marker.marker_type].map(_marker=>{
              if(_marker == marker){
                marker.showInfo = true;
              }
              return _marker;
           })
        }
      }
    }
    case 'MARKER_CLOSE' : {
      var marker = action.payload.marker;
      return {
        ...state,
        markers :{
            ...state.markers,
           [marker.marker_type] : state.markers[marker.marker_type].map(_marker=>{
              if(_marker == marker){
                marker.showInfo = false;
              }
              return _marker;
           })
        }
      }
    }

    case 'DATES_CHANGE' :
      return {
        ...state,
        ...action.payload
      }
  }
  return state;
}
const filterReducerInitialState = {};
Object.keys(filterConstants).forEach(key=>{
  return filterReducerInitialState[key] = false;
});

export function filterReducer(state= {
  ...filterReducerInitialState,
  TOGGLEDRAWING : true,
  SHOWPICKUPS : true,
  SHOWDROPOFFS : true
},action){
  switch(action.type){
    case 'SET_FILTER' :
      return {
        ...state,
        [action.payload.filter] : !state[action.payload.filter]
      }
  }
  return state;
}

const rootReducer = combineReducers({
  main : mainReducer,
  filters: filterReducer,
  routing: routerReducer
});

export default rootReducer;
