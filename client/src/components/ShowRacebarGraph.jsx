import React, { Component } from "react";
import * as d3 from "d3";

import DATASET from "../assets/dataset";
import "./ShowRacebarGraph.styles.css";
import SingleBar from "./SingleBar";

class ShowRacebarGraph extends Component {
  state = {
    parentHeight: 400,
    parentWidth: 600,
    week_number: 0,
    weekData: []
  };

  // Updates the weekly data evry 1 second
  componentDidMount() {
    let lock = true;
    this.intervalId = setInterval(() => {
      if (lock) {
        lock = false;
        this.setState(
          {
            week_number: this.state.week_number + 1,
            // weekData: DATASET[`week-${this.state.week_number + 1}`]
            weekData: this.addContribCounts(
              this.state.weekData,
              DATASET[`week-${this.state.week_number + 1}`]
            )
          },
          () => {
            // release the lock when state is updated
            lock = true;
          }
        );

        if (this.state.week_number > Object.keys(DATASET).length - 1) {
          clearInterval(this.intervalId);
        }
      }
    }, 500);
  }

  addContribCounts = (prevData, newData) => {
    //  Corner Case
    if (prevData.length === 0) {
      return newData;
    }
    const result = newData.map((data, i) => ({
      ...data,
      count: data.count + prevData[i].count
    }));
    return result;
  };

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {
    // const { dataset, userInfo } = this.props.dataset;
    const number_of_weeks = Object.keys(DATASET).length;
    // const weekData = this.state.tempDataset["week-1"];

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
      .domain([
        0,
        number_of_weeks * 100
        // d3.max(weekData, data => data.count)
      ])
      .range([0, parentWidth]);

    return (
      <>
        <svg>
          {/* Change weekdata every `s` seconds */}
          {weekData.map(data => (
            <SingleBar
              key={data.day}
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
