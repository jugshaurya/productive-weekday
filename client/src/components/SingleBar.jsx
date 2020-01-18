import React from "react";
import * as d3 from "d3";

class SingleBar extends React.Component {
  state = {
    smooth_barWidth: this.props.barWidth,
    smooth_count: this.props.data.count,
    smooth_y: this.props.y
  };

  updateBarWidthSmoothly = () => {
    const { data } = this.props;
    // tweeking the bars widths
    d3.selection()
      .transition(`update-width-smoothly-${data.day}`)
      .duration(1000)
      .ease(d3.easeLinear)
      .tween(`update-width-smoothly-${data.day}`, () => {
        const interpolate = d3.interpolate(
          this.state.smooth_barWidth,
          this.props.barWidth
        );
        return t => this.setState({ smooth_barWidth: interpolate(t) });
      });
  };

  updateContribCountSmoothly = () => {
    const { data } = this.props;
    // tweeking the count values
    d3.selection()
      .transition(`update-count-smoothly-${data.day}`)
      .duration(1000)
      .ease(d3.easeLinear)
      .tween(`update-count-smoothly-${data.day}`, () => {
        const interpolate = d3.interpolate(
          this.state.smooth_count,
          this.props.data.count
        );
        return t => this.setState({ smooth_count: interpolate(t) });
      });
  };

  updateBarYSmoothly = () => {
    const { data } = this.props;
    // tweeking the count values
    d3.selection()
      .transition(`update-y-smoothly-${data.day}`)
      .duration(1000)
      .ease(d3.easeLinear)
      .tween(`update-y-smoothly-${data.day}`, () => {
        const interpolate = d3.interpolate(this.state.smooth_y, this.props.y);
        return t => this.setState({ smooth_y: interpolate(t) });
      });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.barWidth !== this.props.barWidth) {
      this.updateBarWidthSmoothly();
    }
    if (prevProps.data !== this.props.data) {
      this.updateContribCountSmoothly();
    }

    if (prevProps.y !== this.props.y) {
      this.updateBarYSmoothly();
    }
  }

  render() {
    const { data, barHeight } = this.props;
    return (
      <g transform={`translate(10, ${this.state.smooth_y})`}>
        <rect
          width={this.state.smooth_barWidth}
          height={barHeight}
          fill="#278ea5"
        />
        <text
          x={this.state.smooth_barWidth - 40}
          y={barHeight - 45}
          dy=".35em"
          fill="#fff"
        >
          {data.day}
        </text>

        <text
          x={this.state.smooth_barWidth - 40}
          y={barHeight - 15}
          dy=".35em"
          fill="#fff"
        >
          {Math.round(this.state.smooth_count)}
        </text>
      </g>
    );
  }
}
export default SingleBar;
