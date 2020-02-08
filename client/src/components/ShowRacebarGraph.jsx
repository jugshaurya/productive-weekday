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
    }, 700);
  }

  addContribCounts = (prevData, newData) => {
    //  Corner Case
    if (prevData.length === 0) {
      return newData;
    }

    const result = newData.map((data, i) => ({
      ...data,

      contribCount: data.contribCount + prevData[i].contribCount
    }));

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

  showGrid() {
    return (
      <>
        <defs>
          <pattern
            id="smallGrid"
            width="5"
            height="5"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 10 0 L 0 0 0 10"
              fill="none"
              stroke="gray"
              strokeWidth="1"
            />
          </pattern>
          <pattern
            id="medSmallGrid"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <rect width="100" height="100" fill="url(#smallGrid)" />
            <path
              d="M 10 0 L 0 0 0 10"
              fill="none"
              stroke="black"
              strokeWidth="1"
            />
          </pattern>
          <pattern
            id="medLargeGrid"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
          >
            <rect width="100" height="100" fill="url(#medSmallGrid)" />
            <path
              d="M 10 0 L 0 0 0 10"
              fill="none"
              stroke="violet"
              strokeWidth="1"
            />
          </pattern>
          <pattern
            id="largeGrid"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <rect width="100" height="100" fill="url(#medLargeGrid)" />
            <path
              d="M 100 0 L 0 0 0 100"
              fill="none"
              stroke="red"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        <rect
          className="defs-rect"
          width="100%"
          height="100%"
          fill="url(#largeGrid)"
        />
      </>
    );
  }
  render() {
    const {
      svgHeight,
      svgWidth,
      weekData,
      week_number,
      dataset,
      userInfo
    } = this.state;
    const sortedWeekData = weekData.sort((x, y) => {
      if (x.contribCount < y.contribCount) return 1;
      if (x.contribCount > y.contribCount) return -1;
      return 0;
    });

    const yAxis = d3
      .scaleBand()
      .domain(sortedWeekData.map(data => data.day))
      .range([0, svgHeight - 20]) // -20 for svg being inside parent box
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
            {this.showGrid()}
            {sortedWeekData.map(data => (
              <SingleBar
                key={data.day}
                data={data}
                y={yAxis(data.day)}
                // Initial length is shown to be 50
                barWidth={50 + xAxis(data.contribCount)}
                barHeight={yAxis.bandwidth()}
              />
            ))}
            <g className="week-number">
              <text x={svgWidth - 100} y={svgHeight - 60}>
                week-{week_number}
              </text>
              <text className="date" x={svgWidth - 100} y={svgHeight - 30}>
                {dataset[`week-${week_number + 1}`]
                  ? dataset[`week-${week_number + 1}`][6].date
                  : dataset[`week-${week_number}`][6].date}
              </text>
            </g>
          </svg>
        </article>

        <article className="who-won">
          {userInfo.avatar_url ? (
            <div className="user-info">
              <img src={userInfo.avatar_url} alt="username" />
              {userInfo.github_username}
            </div>
          ) : null}
          <div>
            <h4>
              Most Productive Weekday:{" "}
              <span className="won-day">
                {weekData.length === 0 ? "Sun" : weekData[0].day}{" "}
              </span>
            </h4>
            <button type="button" onClick={this.props.onReplay}>
              Replay
            </button>
          </div>
        </article>
      </>
    );
  }
}
export default ShowRacebarGraph;
