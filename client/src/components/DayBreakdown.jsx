import React from "react";

const COLORS = {
  Sunday:    "var(--accent)",
  Monday:    "var(--purple)",
  Tuesday:   "var(--cyan)",
  Wednesday: "var(--pink)",
  Thursday:  "var(--yellow)",
  Friday:    "var(--orange)",
  Saturday:  "var(--green)",
};

const DayBreakdown = ({ dataset }) => {
  if (!dataset) return null;

  const allDays = Object.values(dataset).flat();
  const dayTotals = {};
  for (const d of allDays) {
    dayTotals[d.day] = (dayTotals[d.day] || 0) + d.contribCount;
  }

  const maxVal = Math.max(...Object.values(dayTotals));
  const total = Object.values(dayTotals).reduce((a, b) => a + b, 0);
  const ordered = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const full = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="glass-card breakdown-card">
      <h2 className="card-label">Day Distribution</h2>
      <div className="breakdown-list">
        {ordered.map((short, i) => {
          const day = full[i];
          const val = dayTotals[day] || 0;
          const pct = maxVal > 0 ? (val / maxVal) * 100 : 0;
          const share = total > 0 ? ((val / total) * 100).toFixed(0) : 0;
          return (
            <div className="bd-row" key={day}>
              <div className="bd-dot" style={{ background: COLORS[day] }} />
              <span className="bd-day">{short}</span>
              <div className="bd-track">
                <div
                  className="bd-fill"
                  style={{
                    width: `${pct}%`,
                    background: COLORS[day],
                    animationDelay: `${i * 60}ms`,
                  }}
                />
              </div>
              <span className="bd-val">{val}</span>
              <span className="bd-pct">{share}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DayBreakdown;
