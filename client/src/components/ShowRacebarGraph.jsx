import React, { Component } from "react";
import * as d3 from "d3";

import DATASET from "../assets/dataset";
import "./ShowRacebarGraph.styles.css";

const Bar = ({ data, barWidth, barHeight, y }) => {
  return (
    <g transform={`translate(0, ${y})`}>
      <rect width={barWidth} height={barHeight} fill="#278ea5" />
      <text x={barWidth - 40} y={barHeight - 15} dy=".35em" fill="#fff">
        {data.day}
      </text>
    </g>
  );
};

class ShowRacebarGraph extends Component {
  state = {
    parentHeight: 400,
    parentWidth: 600,
    week_number: 0,
    weekData: []
  };

  componentDidMount() {
    this.intervalId = setInterval(() => {
      console.log("running evry 1 sec");
      this.setState(prevState => {
        return {
          week_number: prevState.week_number + 1,
          weekData: DATASET[`week-${prevState.week_number + 1}`]
        };
      });
      if (this.state.week_number > Object.keys(DATASET).length - 1) {
        clearInterval(this.intervalId);
      }
    }, 1000);
  }

  componentWillUnmount() {
    console.log("cleared", this.intervalId);
    clearInterval(this.intervalId);
  }

  render() {
    // const { dataset, userInfo } = this.props.dataset;
    // const number_of_weeks = Object.keys(tempDataset).length;
    // const weekData = this.state.tempDataset["week-1"];
    // console.log(weekData);

    const { weekData } = this.state;
    const { parentHeight, parentWidth } = this.state;

    const yAxis = d3
      .scaleBand()
      .domain(weekData.map(data => data.day))
      .range([0, parentHeight])
      .padding(0.4);

    // ScaleLinear().domain() takes the min and max values as domain
    // since we will be taking sum over the weeks and assuming count value can be atmax 100
    // we can take min =0 and max = #weeks * 100
    // https://github.com/d3/d3-scale/blob/master/README.md#continuous-scales
    const xAxis = d3
      .scaleLinear()
      .domain([0, d3.max(weekData, data => data.count)])
      .range([0, parentWidth - 50]);

    return (
      <>
        <svg>
          {/* Change weekdata every `s` seconds */}
          {weekData &&
            weekData.map(data => (
              <Bar
                key={data.date}
                data={data}
                y={yAxis(data.day)}
                barWidth={xAxis(data.count)}
                barHeight={yAxis.bandwidth()}
              />
            ))}
        </svg>
      </>
    );
  }
}

export default ShowRacebarGraph;
