import React from "react";

const StatsCards = ({ dataset }) => {
  if (!dataset) return null;

  const weeks = Object.values(dataset);
  const allDays = weeks.flat();
  const totalContribs = allDays.reduce((sum, d) => sum + d.contribCount, 0);
  const activeDays = allDays.filter(d => d.contribCount > 0).length;
  const totalDays = allDays.length;
  const activePct = totalDays > 0 ? Math.round((activeDays / totalDays) * 100) : 0;

  let longestStreak = 0, currentStreak = 0;
  for (const day of allDays) {
    if (day.contribCount > 0) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  const bestDay = allDays.reduce((best, d) =>
    d.contribCount > best.contribCount ? d : best, allDays[0]);

  const avgPerDay = activeDays > 0 ? (totalContribs / activeDays).toFixed(1) : 0;

  const stats = [
    {
      label: "Total Contributions",
      value: totalContribs.toLocaleString(),
      color: "var(--accent)",
      ring: Math.min(totalContribs / 500, 1),
    },
    {
      label: "Active Days",
      value: activeDays,
      sub: `${activePct}% of ${totalDays}d`,
      color: "var(--green)",
      ring: activePct / 100,
    },
    {
      label: "Longest Streak",
      value: `${longestStreak}`,
      sub: "consecutive days",
      color: "var(--orange)",
      ring: Math.min(longestStreak / 30, 1),
    },
    {
      label: "Avg / Active Day",
      value: avgPerDay,
      sub: "contributions",
      color: "var(--purple)",
      ring: Math.min(avgPerDay / 10, 1),
    },
    {
      label: "Best Single Day",
      value: bestDay.contribCount,
      sub: bestDay.date,
      color: "var(--pink)",
      ring: 1,
    },
    {
      label: "Weeks Analyzed",
      value: weeks.length,
      sub: `${totalDays} days`,
      color: "var(--cyan)",
      ring: Math.min(weeks.length / 52, 1),
    },
  ];

  return (
    <div className="stats-grid">
      {stats.map((s, i) => (
        <div className="stat-card glass-card" key={i} style={{ animationDelay: `${i * 50}ms` }}>
          <div className="stat-ring-wrap">
            <svg width="44" height="44" viewBox="0 0 44 44">
              <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
              <circle
                cx="22" cy="22" r="18" fill="none"
                stroke={s.color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${s.ring * 113} 113`}
                transform="rotate(-90 22 22)"
                className="ring-fill"
                style={{ animationDelay: `${i * 80 + 200}ms` }}
              />
            </svg>
            <span className="ring-value" style={{ color: s.color }}>{s.value}</span>
          </div>
          <div className="stat-text">
            <span className="stat-label">{s.label}</span>
            {s.sub && <span className="stat-sub">{s.sub}</span>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
