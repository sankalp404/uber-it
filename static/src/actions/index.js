import keykey from 'keykey';
import fetch from 'isomorphic-fetch';

export function onMarkerClose(marker){
  return {
    type : 'MARKER_CLOSE',
    payload : {
      marker
    }
  }
}

export function openMarkerInfo(marker){
  return {
    type : 'MARKER_OPEN',
    payload : {
      marker
    }
  }
}


export function fetchedMarkers(payload){
  return {
    type : 'FETCHED_MARKERS',
    payload
  }
}


export function fetchingMarkers(){
  return {
    type : 'FETCHING_MARKERS',
  }
}

export function fetchedDropOffs(payload){
  return {
    type : 'FETCHED_DROPOFFS',
    payload
  }
}


export function fetchingDropOffs(){
  return {
    type : 'FETCHING_DROPOFFS',
  }
}

export function fetchedPickups(payload){
  return {
    type : 'FETCHED_PICKUPS',
    payload
  }
}


export function fetchingPickups(){
  return {
    type : 'FETCHING_PICKUPS',
  }
}


export function fetchMarkers(){
  return dispatch=>{
    dispatch(fetchPickUps());
    dispatch(fetchDropOffs())
  }
}


export function fetchDropOffs(bounds){
  return (dispatch, getState)=>{
    let url = null ;
      dispatch(fetchingDropOffs());
    if(bounds){
      console.log(bounds.getNorthEast());

      const northEast = bounds.getNorthEast();
      const southWest = bounds.getSouthWest();

      const lats = [northEast.lat(),southWest.lat()];
      const longs = [northEast.lng(), southWest.lng()];

      const state = getState();
      const filters = state.filters;
      const start_hour = filters['AM'] ? 0 : 11;
      const end_hour = filters['PM'] ? 12 : 23;
      const start_minute =0, end_minute = 59;
      const main = state.main;
      const start_day = main.startDate.format('DD/MM/YYYY');
      const end_day = main.endDate.format('DD/MM/YYYY');
      url = '/dropoffs?start_day='+start_day+'&end_day='+end_day+'&start_hour='+start_hour+'&end_hour='+end_hour+'&start_min='+start_minute+'&end_min='+end_minute+'&lats='+lats.join(',')+'&lngs='+longs.join(',');
    }else{
      const state = getState();
      const main = state.main;
      const filters = state.filters;
      const start_hour = filters['AM'] ? 0 : 11;
      const end_hour = filters['PM'] ? 12 : 23;
      const start_minute =0, end_minute = 59;
      const start_day = main.startDate.format('DD/MM/YYYY');
      const end_day = main.endDate.format('DD/MM/YYYY');
      url = '/dropoffs?start_day='+start_day+'&end_day='+end_day+'&start_hour='+start_hour+'&end_hour='+end_hour+'&start_min='+start_minute+'&end_min='+end_minute+'&lats=[]&lngs=[]';

    }

    //past pickup url
    return fetch(url).then(response=>response.json()).then(response=>{
      console.log(response);
      dispatch(fetchedDropOffs({
              dropoffs : response.outputs.map((item,index)=>{
                return {
                  title : "Ranking:"+index,
                  animation : google.maps.Animation.DROP,
                  showInfo : false,
                  infoContent : "Total Dropoffs:"+item["count"],
                  marker_type : 'dropoffs',
                  icon :'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                  position : {
                    ...item,
                    lat : parseFloat(item["lat"]),
                    lng : parseFloat(item["lng"])
                  }
                }
              })
          }))
    })

  }
}

export function fetchPickUps(bounds){
  return (dispatch, getState)=>{
    dispatch(fetchingPickups());
    let url = null;
    if(bounds){
      console.log(bounds.getNorthEast());

      const northEast = bounds.getNorthEast();
      const southWest = bounds.getSouthWest();

      const lats = [northEast.lat(),southWest.lat()];
      const longs = [northEast.lng(), southWest.lng()];

      const state = getState();
      const filters = state.filters;
      const start_hour = filters['AM'] ? 0 : 11;
      const end_hour = filters['PM'] ? 12 : 23;
      const start_minute =0, end_minute = 59;
      const main = state.main;
      const start_day = main.startDate.format('DD/MM/YYYY');
      const end_day = main.endDate.format('DD/MM/YYYY');
      url = '/pickups?start_day='+start_day+'&end_day='+end_day+'&start_hour='+start_hour+'&end_hour='+end_hour+'&start_min='+start_minute+'&end_min='+end_minute+'&lats='+lats.join(',')+'&lngs='+longs.join(',');
    }else{
      const state = getState();
      const main = state.main;
      const filters = state.filters;
      const start_hour = filters['AM'] ? 0 : 11;
      const end_hour = filters['PM'] ? 12 : 23;
      const start_minute =0, end_minute = 59;
      const start_day = main.startDate.format('DD/MM/YYYY');
      const end_day = main.endDate.format('DD/MM/YYYY');
      url = '/pickups?start_day='+start_day+'&end_day='+end_day+'&start_hour='+start_hour+'&end_hour='+end_hour+'&start_min='+start_minute+'&end_min='+end_minute+'&lats=[]&lngs=[]';

    }

    //past pickup url
    return fetch(url).then(response=>response.json()).then(response=>{
      console.log(response);
      dispatch(fetchedPickups({
              pickups : response.outputs.map((item,index)=>{
                return {
                  title : "Ranking:"+index,
                  animation : google.maps.Animation.DROP,
                  showInfo : false,
                  infoContent : "Total Pickups"+item["count"],
                  marker_type : 'pickups',
                  icon : 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
                  position : {
                    ...item,
                    lat : parseFloat(item["lat"]),
                    lng : parseFloat(item["lng"])
                  }
                }
              })
          }))
    }).catch(err=>console.log(err.stack))

  }
}

export const filterConstants = keykey('AM','PM','SHOWPICKUPS',
'SHOWDROPOFFS','TOGGLEDRAWING','SHOWPICKUPHEATMAP',
'SHOWDROPOFFHEATMAP','SHOWCOMMONROUTES');

export function setFilter(filter){
  return {
    type : 'SET_FILTER',
    payload : {
      filter
    }
  }
}

export function onDatesChange({startDate,endDate}){
  return {
    type : 'DATES_CHANGE',
    payload : {
      startDate,
      endDate
    }
  }
}
