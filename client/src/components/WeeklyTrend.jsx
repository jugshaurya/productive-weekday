import React, { Component } from "react";

class WeeklyTrend extends Component {
  state = { page: 0 };

  render() {
    const { dataset } = this.props;
    if (!dataset) return null;

    const weeks = Object.entries(dataset);
    const allTotals = weeks.map(([key, days]) => ({
      label: key.replace("week-", ""),
      total: days.reduce((sum, d) => sum + d.contribCount, 0),
    }));

    // Show 20 weeks per page
    const pageSize = 20;
    const totalPages = Math.ceil(allTotals.length / pageSize);
    const page = Math.min(this.state.page, totalPages - 1);
    const start = page * pageSize;
    const weekTotals = allTotals.slice(start, start + pageSize);

    const maxTotal = Math.max(...allTotals.map(w => w.total), 1);
    const avg = Math.round(allTotals.reduce((s, w) => s + w.total, 0) / allTotals.length);
    const chartH = 140;

    return (
      <div className="glass-card trend-card">
        <div className="trend-header">
          <h2 className="card-label">Weekly Trend</h2>
          <div className="trend-controls">
            <span className="trend-avg">avg {avg}/wk</span>
            {totalPages > 1 && (
              <div className="trend-nav">
                <button
                  className="nav-btn"
                  disabled={page === 0}
                  onClick={() => this.setState({ page: page - 1 })}
                >
                  ‹
                </button>
                <span className="nav-info">{page + 1}/{totalPages}</span>
                <button
                  className="nav-btn"
                  disabled={page >= totalPages - 1}
                  onClick={() => this.setState({ page: page + 1 })}
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="trend-body">
          <div className="trend-bars">
            {weekTotals.map((w, i) => {
              const h = (w.total / maxTotal) * chartH;
              const isMax = w.total === maxTotal;
              return (
                <div className="t-col" key={start + i} title={`Week ${w.label}: ${w.total}`}>
                  <span className="t-val">{w.total}</span>
                  <div
                    className={`t-bar ${isMax ? "t-bar-max" : ""}`}
                    style={{
                      height: `${h}px`,
                      animationDelay: `${i * 30}ms`,
                    }}
                  />
                  <span className="t-label">W{w.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default WeeklyTrend;
