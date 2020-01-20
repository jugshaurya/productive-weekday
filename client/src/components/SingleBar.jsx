import React from "react";
import * as d3 from "d3";

class SingleBar extends React.Component {
  state = {
    smooth_barWidth: this.props.barWidth,
    smooth_contribCount: this.props.data.contribCount,
    smooth_y: this.props.y
  };

  updateSmoothly = (effect, property, propertyValue) => {
    const { data } = this.props;
    // tweeking the properties
    d3.selection()
      .transition(`update-${property}-smoothly-${data.day}`)
      .duration(1500)
      .ease(effect)
      .tween(`update-${property}-smoothly-${data.day}`, () => {
        const interpolate = d3.interpolate(
          this.state[`smooth_${property}`],
          propertyValue
        );
        return t => this.setState({ [`smooth_${property}`]: interpolate(t) });
      });
  };

  componentDidUpdate(prevProps) {
    const { barWidth, data, y } = this.props;
    if (prevProps.barWidth !== barWidth) {
      this.updateSmoothly(d3.easeBackOut, "barWidth", barWidth);
    }
    if (prevProps.data.contribCount !== data.contribCount) {
      this.updateSmoothly(d3.easeBackOut, "contribCount", data.contribCount);
    }

    if (prevProps.y !== y) {
      this.updateSmoothly(d3.easeLinear, "y", y);
    }
  }

  getColor = day => {
    switch (day) {
      case "Sunday":
        return "#fdfdfd";
      case "Monday":
        return "#f090d9";
      case "Tuesday":
        return "#22d1ee";
      case "Wednesday":
        return "#f3558e";
      case "Thursday":
        return "#f9ff21";
      case "Friday":
        return "#ff9f68";
      case "Saturday":
        return "#83e85a";
      default:
        return "#000";
    }
  };

  render() {
    const { data, barHeight } = this.props;
    const { smooth_barWidth, smooth_contribCount, smooth_y } = this.state;

    return (
      <g transform={`translate(0,${smooth_y})`}>
        <rect
          width={smooth_barWidth}
          height={barHeight}
          fill={this.getColor(data.day)}
        />

        <text x={15} y={barHeight / 2} dy=".35em">
          {data.day}
        </text>

        <text x={smooth_barWidth + 5} y={barHeight / 2} dy=".35em">
          {Math.round(smooth_contribCount)}
        </text>
      </g>
    );
  }
}
export default SingleBar;
