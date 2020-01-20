import React, { Component } from "react";
import * as d3 from "d3";
import SingleBar from "./SingleBar";

class ShowRacebarGraph extends Component {
  state = {
    svgHeight: 0,
    svgWidth: 0,
    week_number: 0,
    weekData: [],
    dataset: this.props.dataset.dataset,
    number_of_weeks: Object.keys(this.props.dataset.dataset).length,
    userInfo: this.props.dataset.userInfo
  };

  // Updates the weekly data evry 2 second
  componentDidMount() {
    let lock = true;
    this.intervalId = setInterval(() => {
      if (lock) {
        const { weekData, week_number, dataset, number_of_weeks } = this.state;
        lock = false;
        console.log(weekData);
        this.setState(
          {
            week_number: week_number + 1,
            weekData: this.addContribCounts(
              weekData,
              dataset[`week-${week_number + 1}`]
            )
          },
          () => {
            // release the lock when state has updated
            lock = true;
            if (week_number >= number_of_weeks - 1) {
              clearInterval(this.intervalId);
            }
          }
        );
      }
    }, 1500);
  }

  addContribCounts = (prevData, newData) => {
    //  Corner Case
    if (prevData.length === 0) {
      return newData;
    }

    console.log("safsaf", prevData, newData);
    const result = newData.map((data, i) => ({
      ...data,
      contribCount: data.contribCount + prevData[i].contribCount
    }));

    console.log("resukt", result);
    return result;
  };

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  refCallback = element => {
    if (element) {
      const elementRect = element.getBoundingClientRect();
      this.setState({
        svgHeight: elementRect.height,
        svgWidth: elementRect.width
      });
    }
  };

  render() {
    console.log(this.state.dataset);
    const { svgHeight, svgWidth, weekData, week_number } = this.state;

    const sortedWeekData = weekData.sort((x, y) => {
      if (x.contribCount < y.contribCount) return 1;
      if (x.contribCount > y.contribCount) return -1;
      return 0;
    });

    const yAxis = d3
      .scaleBand()
      .domain(sortedWeekData.map(data => data.day))
      .range([0, svgHeight])
      .padding(0.4);

    const rightPadding = 50;
    // ScaleLinear().domain() takes the min and max values as domain
    // since we will be taking sum over the weeks and assuming contribCount value can be atmax 100
    // we can take min =0 and max = #weeks * 100
    // https://github.com/d3/d3-scale/blob/master/README.md#continuous-scales
    const xAxis = d3
      .scaleLinear()
      .domain([0, d3.max(weekData, data => data.contribCount) + rightPadding])
      .range([0, svgWidth]);

    return (
      <>
        <article className="race-bar-graph">
          <svg ref={this.refCallback}>
            {sortedWeekData.map(data => (
              <SingleBar
                key={data.day}
                data={data}
                y={yAxis(data.day)}
                barWidth={50 + xAxis(data.contribCount)}
                barHeight={yAxis.bandwidth()}
              />
            ))}
            <g className="week-number">
              <text x={svgWidth - 130} y={svgHeight - 30}>
                week-{week_number}
              </text>
            </g>
          </svg>
        </article>
        <article className="who-won">
          <h4>
            Productive Weekday:{" "}
            <span className="won-day">
              {weekData.length === 0 ? "Sun" : weekData[0].day}{" "}
            </span>
          </h4>
          <button type="button" onClick={this.props.onReplay}>
            Replay
          </button>
        </article>
      </>
    );
  }
}
export default ShowRacebarGraph;
