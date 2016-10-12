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
              defaultZoom={12}
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
                      // Todo..
                    }}
                    onRectanglecomplete={(entity)=>{
                      if( this.rectangle){
                        this.rectangle.setMap(null);
                      }
                      this.rectangle = entity;
                      this.props.fetchPickUps(entity.getBounds());
                      this.props.fetchDropOffs(entity.getBounds());
                    }}
                    onpolygoncomplete={(entity)=>{
                      if( this.polygon){
                        this.polygon.setMap(null);
                      }
                        console.log("sankalp");
                        // console.log(entity);
                        this.polygon = entity;
                        this.props.fetchPickUps(entity.getBounds());
                        this.props.fetchDropOffs(entity.getBounds());
                    }}
                    defaultOptions={{
                        drawingControl: true,
                        drawingControlOptions: {
                          position: google.maps.ControlPosition.TOP_CENTER,
                          drawingModes: [
                            //google.maps.drawing.OverlayType.POLYGON,
                            // Will come back to this.
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
