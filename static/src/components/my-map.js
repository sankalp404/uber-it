import React, { Component } from 'react';
import { GoogleMapLoader, GoogleMap, Marker, Circle, InfoWindow } from 'react-google-maps';
import DrawingManager from 'react-google-maps/lib/DrawingManager';

class MyMap extends Component{
  constructor(props){
    super(props);
  }

  componentDidMount(){
    //console.log(this.refs.map);
  }
  render(){
    const {filters, markers} = this.props;
    const {TOGGLEDRAWING} =  filters;
    return (
      <GoogleMapLoader
          containerElement={
            <div style= {{ height:"calc(100vh - 250px)", width: "100%" }} />
          }
          googleMapElement={
            <GoogleMap
              ref={(map) => console.log(map)}
              defaultZoom={14}
              defaultCenter={{ lat:40.748433, lng: -73.985656 }}

              >
              {markers.length ? markers.map((marker, index) => {
                       return (
                         <Marker
                          key={index}
                           {...marker}
                           onClick={()=>this.props.openMarkerInfo(marker)}
                           onRightclick={() => console.log(marker,index)} >
                           {marker.showInfo && (
                                <InfoWindow onCloseClick={() => this.props.onMarkerClose(marker)}>
                                  <div>{marker.infoContent || ""}</div>
                                </InfoWindow>
                              )}
                           </Marker>
                       );
                     }) : null}
                {TOGGLEDRAWING ? <DrawingManager
                    defaultDrawingMode={null}
                    onCirclecomplete={(entity)=>{
                      // Todo
                    }}
                    onRectanglecomplete={(entity)=>{
                      if( this.rectangle){
                        this.rectangle.setMap(null);
                      }

                      //console.log(entity);
                      this.rectangle = entity;
                        //console.log(entity.getBounds())
                        //custom_fucn(entity.getBounds,"rectangle")
                        this.props.fetchPickUps(entity.getBounds());
                          this.props.fetchDropOffs(entity.getBounds());
                    }}
                    defaultOptions={{
                        drawingControl: true,
                        drawingControlOptions: {
                          position: google.maps.ControlPosition.TOP_RIGHT,
                          drawingModes: [
                            google.maps.drawing.OverlayType.POLYGON,
                            google.maps.drawing.OverlayType.RECTANGLE,
                          ],
                        }
                      }}
                  /> : null}
              </GoogleMap>
          }
          />
    );
  }
}

export default MyMap;
