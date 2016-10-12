import React, { Component } from 'react';
import { Menu, Brand, Item } from 'impromptu-react-sidemenu';
import {connect} from 'react-redux';
import {setFilter, filterConstants} from '../../actions';
import ReactToggle from 'react-toggle';
import ToggleButton from 'react-toggle-button'

class Flex extends Component{
  render(){
    return <div style={{display : "flex", color:"white", align:"left"}}>
       <div style={{padding: "16px"}}>{this.props.left}</div>
        <div style={{ padding: "16px"}}>{this.props.right}</div>
    </div>


  }
}

class SideBanner extends Component{
    constructor(props) {
        super(props);
     }

    handleClick(item) {
      this.props.setFilter(item);
    }

    render() {

        const {SHOWPICKUPS, SHOWDROPOFFS, TOGGLEDRAWING, SHOWPICKUPHEATMAP, SHOWDROPOFFHEATMAP, SHOWCOMMONROUTES, AM, PM} = this.props.filters;
        return (
            <Menu
                position='left' width="400" height="400">
                <Brand>
                    FILTERS
                </Brand>

                <Flex right={
                  <ToggleButton
                      value={  SHOWPICKUPS }
                      onToggle={()=>this.handleClick(filterConstants['SHOWPICKUPS'])} />}
                      left={  <div className="filterLabel">Show Pickups</div>
                }/>

                <Flex right={
                  <ToggleButton
                      value={  SHOWDROPOFFS }
                      onToggle={()=>this.handleClick(filterConstants['SHOWDROPOFFS'])} />}
                      left={  <div className="filterLabel">Show Dropoffs</div>
                }/>

                <Flex right={
                  <ToggleButton
                      value={  TOGGLEDRAWING }
                      onToggle={()=>this.handleClick(filterConstants['TOGGLEDRAWING'])} />}
                      left={  <div className="filterLabel">Enable Drawing</div>
                }/>

                <Flex right={
                  <ToggleButton
                      value={  false || SHOWPICKUPHEATMAP }
                      onToggle={()=>this.handleClick(filterConstants['SHOWPICKUPHEATMAP'])} />}
                      left={  <div className="filterLabel">Show heatmap for Pickups</div>
                }/>

                <Flex right={
                  <ToggleButton
                    value={  false || SHOWDROPOFFHEATMAP}
                    onToggle={()=>this.handleClick(filterConstants['SHOWDROPOFFHEATMAP'])} />}
                    left={  <div className="filterLabel">Show heatmap for Dropoffs</div>
              }/>

              <Flex right={
                <ToggleButton
                  value={  false || SHOWCOMMONROUTES}
                  onToggle={()=>this.handleClick(filterConstants['SHOWCOMMONROUTES'])} />}
                  left={  <div className="filterLabel">Show common routes</div>
            }/>

              <Flex right={
                <ToggleButton
                  value={ AM }
                  onToggle={()=>this.handleClick(filterConstants['AM'])} />}
                  left={
                    <div className="filterLabel">AM</div>
            }/>

            <Flex right={
              <ToggleButton
                value={  PM }
                onToggle={()=>this.handleClick(filterConstants['PM'])} />}
                left={
                  <div className="filterLabel">PM</div>
          }/>

            </Menu>
        );
    }
}

function mapStateToProps(state){
  return {
    ...state.mainReducer,
    filters : {
      ...state.filters
    }
  }
}

export default connect(mapStateToProps, {
  setFilter
})(SideBanner);
