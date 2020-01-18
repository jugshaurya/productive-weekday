import React from "react";
import * as d3 from "d3";

class SingleBar extends React.Component {
  state = {
    new_smooth_barWidth: this.props.barWidth
  };

  updateAndTransitBars = () => {
    const { data } = this.props;
    d3.selection()
      .transition(`change-width-smoothly-${data.day}`)
      .duration(500)
      .ease(d3.easeLinear)
      .tween(`change-width-smoothly-${data.day}`, () => {
        const interpolate = d3.interpolate(
          this.state.new_smooth_barWidth,
          this.props.barWidth
        );
        return t => this.setState({ new_smooth_barWidth: interpolate(t) });
      });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.barWidth !== this.props.barWidth) {
      this.updateAndTransitBars();
    }
  }
  render() {
    const { data, barWidth, barHeight, y } = this.props;

    return (
      <g transform={`translate(0, ${y})`}>
        <rect
          width={this.state.new_smooth_barWidth}
          height={barHeight}
          fill="#278ea5"
        />
        <text
          x={this.state.new_smooth_barWidth - 40}
          y={barHeight - 15}
          dy=".35em"
          fill="#fff"
        >
          {data.day}
        </text>
      </g>
    );
  }
}
export default SingleBar;
