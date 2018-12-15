import React, { Component } from 'react';
import { render } from 'react-dom';
import Highcharts from 'highcharts';
import ReactHighcharts from 'react-highcharts';

class Graph extends Component {
  componentDidMount() {
    
  }
  
  static getConfig = (navs) => ({
    chart: {
      type: 'scatter',
        margin: [70, 50, 60, 80],
        
    },
    title: {
        text: 'User supplied data'
    },
    subtitle: {
        text: 'Click the plot area to add a point. Click a point to remove it.'
    },
    xAxis: {
        gridLineWidth: 1,
        minPadding: 0.2,
        maxPadding: 0.2,
        maxZoom: 60
    },
    yAxis: {
        title: {
            text: 'Value'
        },
        minPadding: 0.2,
        maxPadding: 0.2,
        maxZoom: 60,
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }]
    },
    legend: {
        enabled: false
    },
    exporting: {
        enabled: false
    },
    plotOptions: {
        series: {
            lineWidth: 1,
        }
    },
    series: [{
        data: [[20, 20], [80, 80]]
    }]
  })

  render() {
    return (
      <div>
        <ReactHighcharts config={Graph.getConfig(this.props.navs)} isPureConfig ref="chart" />
      </div>
    );
  }
}

export default Graph;
