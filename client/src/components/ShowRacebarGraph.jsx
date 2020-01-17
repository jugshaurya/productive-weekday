import React, { Component } from "react";
import * as d3 from "d3";

import DATASET from "../assets/dataset";
import "./ShowRacebarGraph.styles.css";

const Bar = ({ barWidth, barHeight, y }) => {
  return (
    <rect x={0} y={y} width={barWidth} height={barHeight} fill={"#278ea5"} />
  );
};

class ShowRacebarGraph extends Component {
  state = {
    parentHeight: 400,
    parentWidth: 600
  };

  render() {
    // const { dataset, userInfo } = this.props.dataset;
    const tempDataset = DATASET;
    const week1Data = tempDataset.slice(0, 7);
    console.log(week1Data);

    const { parentHeight, parentWidth } = this.state;

    const yAxis = d3
      .scaleBand()
      .domain(week1Data.map(data => data.day))
      .range([0, parentHeight])
      .padding(0.4);

    const xAxis = d3
      .scaleLinear()
      .domain([0, d3.max(week1Data, data => data.count)])
      .range([parentWidth, 0]);

    return (
      <>
        <svg>
          <g transform={`translate(${10}, ${10})`}>
            {week1Data.map(data => (
              <Bar
                data={data}
                key={data.date}
                y={yAxis(data.day)}
                barWidth={xAxis(data.count)}
                barHeight={yAxis.bandwidth()}
              />
            ))}
          </g>
        </svg>
      </>
    );
  }
}

export default ShowRacebarGraph;
