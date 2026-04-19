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
    finished: false,
  };

  componentDidMount() {
    const speed = this.props.speed || 400;
    let lock = true;
    this.intervalId = setInterval(() => {
      if (lock) {
        const { weekData, week_number, dataset, number_of_weeks } = this.state;
        lock = false;
        this.setState(
          {
            week_number: week_number + 1,
            weekData: this.addContribCounts(weekData, dataset[`week-${week_number + 1}`]),
          },
          () => {
            lock = true;
            if (week_number >= number_of_weeks - 1) {
              clearInterval(this.intervalId);
              this.setState({ finished: true });
            }
          }
        );
      }
    }, speed);
  }

  addContribCounts = (prev, next) => {
    if (prev.length === 0) return next;
    return next.map((d, i) => ({ ...d, contribCount: d.contribCount + prev[i].contribCount }));
  };

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  refCallback = (el) => {
    if (el) {
      const r = el.getBoundingClientRect();
      this.setState({ svgHeight: r.height, svgWidth: r.width });
    }
  };

  render() {
    const { svgHeight, svgWidth, weekData, week_number, dataset, number_of_weeks, finished } = this.state;
    const speed = this.props.speed || 400;

    const sorted = [...weekData].sort((a, b) => b.contribCount - a.contribCount);

    const yAxis = d3.scaleBand()
      .domain(sorted.map(d => d.day))
      .range([16, svgHeight - 44])
      .padding(0.12);

    const xAxis = d3.scaleLinear()
      .domain([0, d3.max(weekData, d => d.contribCount) + 80])
      .range([0, svgWidth * 0.8]);

    const progress = number_of_weeks > 0 ? Math.min(week_number / number_of_weeks, 1) : 0;

    return (
      <div className="race-wrap">
        {/* Progress */}
        <div className="race-progress">
          <div className="race-progress-fill" style={{ width: `${progress * 100}%` }} />
        </div>

        <svg ref={this.refCallback} className="race-svg">
          {sorted.map(d => (
            <SingleBar
              key={d.day}
              data={d}
              y={yAxis(d.day)}
              barWidth={80 + xAxis(d.contribCount)}
              barHeight={yAxis.bandwidth()}
              speed={speed}
            />
          ))}

          {/* Week watermark */}
          <text
            x={svgWidth - 90}
            y={svgHeight - 50}
            className="wk-watermark"
          >
            {week_number}
          </text>
          <text
            x={svgWidth - 90}
            y={svgHeight - 20}
            className="wk-date"
          >
            {dataset[`week-${week_number + 1}`]
              ? dataset[`week-${week_number + 1}`][6].date
              : dataset[`week-${week_number}`]
              ? dataset[`week-${week_number}`][6].date
              : ""}
          </text>
        </svg>

        {/* Winner */}
        {finished && sorted.length > 0 && (
          <div className="winner">
            <div className="winner-glow" />
            <span className="winner-label">Winner</span>
            <span className="winner-day">{sorted[0].day}</span>
            <span className="winner-count">{sorted[0].contribCount} total contributions</span>
          </div>
        )}
      </div>
    );
  }
}
export default ShowRacebarGraph;
