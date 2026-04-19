import React, { Component } from "react";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sun", "", "Tue", "", "Thu", "", "Sat"];

class Heatmap extends Component {
  state = { tooltip: null, filter: "all" };

  render() {
    const { dataset } = this.props;
    const { tooltip, filter } = this.state;
    if (!dataset) return null;

    // Flatten all days and sort by date
    const allDays = Object.values(dataset).flat().sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    if (allDays.length === 0) return null;

    // Build date→count map from ALL data
    const dateMap = {};
    for (const d of allDays) {
      dateMap[d.date] = d.contribCount;
    }

    // Get available years for dropdown
    const years = [...new Set(allDays.map(d => d.date.split("-")[0]))].sort();

    // Determine date range based on filter
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let startDate, endDate;

    if (filter === "all") {
      startDate = new Date(allDays[0].date);
      endDate = today;
    } else if (filter === "last12") {
      endDate = today;
      startDate = new Date(today);
      startDate.setFullYear(startDate.getFullYear() - 1);
    } else {
      // Specific year
      startDate = new Date(`${filter}-01-01`);
      endDate = filter === String(today.getFullYear())
        ? today
        : new Date(`${filter}-12-31`);
    }

    // Filter days in range for stats
    const filteredDays = allDays.filter(d => {
      const dt = new Date(d.date);
      return dt >= startDate && dt <= endDate;
    });

    const maxCount = Math.max(...(filteredDays.length > 0 ? filteredDays.map(d => d.contribCount) : [1]), 1);
    const totalContribs = filteredDays.reduce((s, d) => s + d.contribCount, 0);

    // Align start to Sunday
    const gridStart = new Date(startDate);
    gridStart.setDate(gridStart.getDate() - gridStart.getDay());

    // Build weeks array till endDate
    const calendarWeeks = [];
    const monthLabels = [];
    let current = new Date(gridStart);
    let weekIdx = 0;
    let lastMonth = -1;

    while (current <= endDate) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        const dateStr = current.toISOString().split("T")[0];
        const inRange = current >= startDate && current <= endDate;
        const isFuture = current > today;
        week.push({
          date: dateStr,
          count: isFuture ? -2 : (inRange ? (dateMap[dateStr] || 0) : -1),
          month: current.getMonth(),
        });

        if (d === 0 && current.getMonth() !== lastMonth && inRange) {
          monthLabels.push({ weekIdx, month: MONTHS[current.getMonth()] });
          lastMonth = current.getMonth();
        }

        current.setDate(current.getDate() + 1);
      }
      calendarWeeks.push(week);
      weekIdx++;
    }

    const cell = 13;
    const gap = 3;
    const step = cell + gap;
    const labelW = 32;
    const topPad = 20;
    const svgW = calendarWeeks.length * step + labelW + 10;
    const svgH = 7 * step + topPad + 4;

    const getColor = (count) => {
      if (count === -1) return "transparent";
      if (count === -2) return "rgba(255,255,255,0.02)"; // future
      if (count === 0) return "rgba(255,255,255,0.04)";
      const pct = count / maxCount;
      if (pct <= 0.15) return "#0e4429";
      if (pct <= 0.35) return "#006d32";
      if (pct <= 0.6)  return "#26a641";
      return "#39d353";
    };

    // Dropdown options
    const filterOptions = [
      { value: "all", label: "All Time" },
      { value: "last12", label: "Last 12 Months" },
      ...years.map(y => ({ value: y, label: y })),
    ];

    return (
      <div className="glass-card heatmap-card">
        <div className="heatmap-header">
          <h2 className="card-label">Contribution Graph</h2>
          <div className="heatmap-right">
            <span className="heatmap-total">
              {totalContribs.toLocaleString()} contributions
            </span>
            <select
              className="hm-select"
              value={filter}
              onChange={(e) => this.setState({ filter: e.target.value, tooltip: null })}
            >
              {filterOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="heatmap-scroll">
          <div className="heatmap-inner" style={{ position: "relative" }}>
            <svg width={svgW} height={svgH} className="heatmap-svg">
              {/* Month labels */}
              {monthLabels.map((m, i) => (
                <text
                  key={i}
                  x={m.weekIdx * step + labelW}
                  y={12}
                  fill="rgba(255,255,255,0.3)"
                  fontSize="10"
                  fontWeight="500"
                  fontFamily="-apple-system, sans-serif"
                >
                  {m.month}
                </text>
              ))}

              {/* Day labels */}
              {DAYS.map((label, i) => (
                <text
                  key={i}
                  x={0}
                  y={topPad + i * step + cell - 2}
                  fill="rgba(255,255,255,0.2)"
                  fontSize="10"
                  fontWeight="500"
                  fontFamily="-apple-system, sans-serif"
                >
                  {label}
                </text>
              ))}

              {/* Cells */}
              {calendarWeeks.map((week, wi) =>
                week.map((day, di) => {
                  if (day.count === -1) return null;
                  const x = wi * step + labelW;
                  const y = topPad + di * step;
                  const delay = Math.min(wi * 8 + di * 2, 600);
                  const isFuture = day.count === -2;
                  return (
                    <rect
                      key={`${wi}-${di}`}
                      x={x}
                      y={y}
                      width={cell}
                      height={cell}
                      rx={3}
                      fill={getColor(day.count)}
                      className={isFuture ? "hm-cell-future" : "hm-cell"}
                      style={{ animationDelay: `${delay}ms` }}
                      onMouseEnter={isFuture ? undefined : (e) => {
                        const rect = e.target.getBoundingClientRect();
                        const parent = e.target.closest('.heatmap-inner').getBoundingClientRect();
                        this.setState({
                          tooltip: {
                            x: rect.left - parent.left + cell / 2,
                            y: rect.top - parent.top - 8,
                            text: day.count === 0
                              ? `No contributions on ${day.date}`
                              : `${day.count} contribution${day.count !== 1 ? "s" : ""} on ${day.date}`,
                          },
                        });
                      }}
                      onMouseLeave={() => this.setState({ tooltip: null })}
                    />
                  );
                })
              )}
            </svg>

            {tooltip && (
              <div className="hm-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
                {tooltip.text}
              </div>
            )}
          </div>
        </div>

        <div className="heatmap-footer">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hm-link">
            Learn how we count contributions
          </a>
          <div className="heatmap-legend">
            <span>Less</span>
            {["rgba(255,255,255,0.04)", "#0e4429", "#006d32", "#26a641", "#39d353"].map((c, i) => (
              <div key={i} className="lg-cell" style={{ background: c }} />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>
    );
  }
}

export default Heatmap;
