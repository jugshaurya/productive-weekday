import React from "react";
import * as d3 from "d3";

class SingleBar extends React.Component {
  state = {
    smooth_barWidth: this.props.barWidth,
    smooth_contribCount: this.props.data.contribCount,
    smooth_y: this.props.y,
  };

  updateSmoothly = (ease, prop, val) => {
    const { data } = this.props;
    const dur = this.props.speed || 400;
    d3.selection()
      .transition(`${prop}-${data.day}`)
      .duration(dur)
      .ease(ease)
      .tween(`${prop}-${data.day}`, () => {
        const interp = d3.interpolate(this.state[`smooth_${prop}`], val);
        return t => this.setState({ [`smooth_${prop}`]: interp(t) });
      });
  };

  componentDidUpdate(prev) {
    const { barWidth, data, y } = this.props;
    if (prev.barWidth !== barWidth) this.updateSmoothly(d3.easeCubicOut, "barWidth", barWidth);
    if (prev.data.contribCount !== data.contribCount) this.updateSmoothly(d3.easeCubicOut, "contribCount", data.contribCount);
    if (prev.y !== y) this.updateSmoothly(d3.easeCubicInOut, "y", y);
  }

  render() {
    const { data, barHeight } = this.props;
    const { smooth_barWidth, smooth_contribCount, smooth_y } = this.state;

    const colors = {
      Sunday:    ["#667eea", "#4f46e5"],
      Monday:    ["#c084fc", "#9333ea"],
      Tuesday:   ["#22d3ee", "#0891b2"],
      Wednesday: ["#fb7185", "#e11d48"],
      Thursday:  ["#fbbf24", "#d97706"],
      Friday:    ["#fb923c", "#ea580c"],
      Saturday:  ["#34d399", "#059669"],
    };

    const [c1, c2] = colors[data.day] || ["#6366f1", "#4f46e5"];
    const gid = `g-${data.day}`;
    const r = Math.min(barHeight * 0.4, 10);

    return (
      <g transform={`translate(0,${smooth_y})`}>
        <defs>
          <linearGradient id={gid}>
            <stop offset="0%" stopColor={c1} />
            <stop offset="100%" stopColor={c2} stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* Bar */}
        <rect
          width={Math.max(smooth_barWidth, 0)}
          height={barHeight}
          fill={`url(#${gid})`}
          rx={r}
        />

        {/* Shine */}
        <rect
          width={Math.max(smooth_barWidth, 0)}
          height={barHeight * 0.4}
          fill="rgba(255,255,255,0.08)"
          rx={r}
        />

        {/* Day label */}
        <text
          x={18}
          y={barHeight / 2}
          dy=".35em"
          fill="rgba(0,0,0,0.7)"
          fontWeight="700"
          fontSize="12"
          letterSpacing="1"
          fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
        >
          {data.day.slice(0, 3).toUpperCase()}
        </text>

        {/* Count */}
        <text
          x={smooth_barWidth + 14}
          y={barHeight / 2}
          dy=".35em"
          fill="rgba(255,255,255,0.45)"
          fontWeight="700"
          fontSize="13"
          fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
        >
          {Math.round(smooth_contribCount)}
        </text>
      </g>
    );
  }
}

export default SingleBar;
