import React from "react";

import DATASET from "../assets/dataset";
import ShowRacebarGraph from "./ShowRacebarGraph";
import StatsCards from "./StatsCards";
import DayBreakdown from "./DayBreakdown";
import WeeklyTrend from "./WeeklyTrend";
import Heatmap from "./Heatmap";

import "./App.css";

class App extends React.Component {
  state = {
    username: "",
    dataset: DATASET,
    fetchingError: null,
    isFetching: false,
    replayKey: 0,
    speed: 400,
    theme: "dark",
  };

  handleChange = (e) => {
    this.setState({ fetchingError: null, [e.target.name]: e.target.value });
  };

  handleFetchingUserDataset = (e) => {
    e.preventDefault();
    const { username } = this.state;
    const SERVER_URL = process.env.REACT_APP_SERVER_URL;
    if (!username)
      return this.setState({
        fetchingError: { message: "Please enter a GitHub username" },
      });

    this.setState({ fetchingError: null, dataset: null, isFetching: true });
    fetch(`${SERVER_URL}/user/${username}`)
      .then((res) => res.json())
      .then((dataset) => {
        if (dataset.error && dataset.error.status >= 400) {
          throw new Error(dataset.error.message);
        }
        this.setState({
          dataset,
          fetchingError: null,
          isFetching: false,
          username: "",
          replayKey: this.state.replayKey + 1,
        });
      })
      .catch((error) => {
        this.setState({
          dataset: null,
          fetchingError: error,
          isFetching: false,
          username: "",
        });
      });
  };

  replayAnimation = () => {
    this.setState({ replayKey: this.state.replayKey + 1 });
  };

  setSpeed = (speed) => {
    this.setState({ speed, replayKey: this.state.replayKey + 1 });
  };

  render() {
    const { username, dataset, fetchingError, isFetching, replayKey, speed, theme } = this.state;

    if (fetchingError) {
      setTimeout(() => {
        this.setState({ fetchingError: null });
      }, 3000);
    }

    const hasData = dataset && dataset.dataset;
    const userInfo = dataset && dataset.userInfo;

    return (
      <div className={`App ${theme}`}>
        {fetchingError && (
          <div id="toast" className="show">{fetchingError.message}</div>
        )}

        {/* Theme toggle */}
        <button
          className="theme-toggle"
          type="button"
          onClick={() => this.setState({ theme: theme === "dark" ? "light" : "dark" })}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>

        {/* Ambient glow */}
        <div className="ambient-glow" />

        {/* Hero */}
        <header className="hero">
          <div className="hero-content">
            <div className="hero-eyebrow">
              <div className="dot-pulse" />
              GitHub Contribution Analytics
            </div>
            <h1>
              Discover your most<br />
              <span>Productive Weekday</span>
            </h1>
            <p className="hero-sub">
              Watch your contributions race in real-time. Animated bar chart visualization powered by D3.
            </p>

            {isFetching ? (
              <div className="loader">
                <div className="loader-ring" />
                <span>Fetching contributions...</span>
              </div>
            ) : (
              <form onSubmit={this.handleFetchingUserDataset} className="search-form">
                <div className="search-box">
                  <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                  <input
                    onChange={this.handleChange}
                    type="text"
                    name="username"
                    placeholder="Enter GitHub username"
                    value={username}
                    autoComplete="off"
                    spellCheck="false"
                  />
                  <button type="submit" className="search-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </form>
            )}

            <div className="hero-hints">
              Try: <button type="button" onClick={() => this.setState({ username: "torvalds" }, () => this.handleFetchingUserDataset({ preventDefault: () => {} }))}>torvalds</button>
              <button type="button" onClick={() => this.setState({ username: "gaearon" }, () => this.handleFetchingUserDataset({ preventDefault: () => {} }))}>gaearon</button>
              <button type="button" onClick={() => this.setState({ username: "sindresorhus" }, () => this.handleFetchingUserDataset({ preventDefault: () => {} }))}>sindresorhus</button>
            </div>
          </div>
        </header>

        {hasData && (
          <div className="dashboard fade-in">
            {/* Demo banner */}
            {userInfo && !userInfo.avatar_url && (
              <div className="demo-banner">
                <span className="demo-dot" />
                Showing demo data — enter a GitHub username above to see real contributions
              </div>
            )}

            {/* Profile */}
            {userInfo && userInfo.avatar_url && (
              <div className="profile-strip">
                <div className="profile-left">
                  <img src={userInfo.avatar_url} alt="" className="avatar" />
                  <div>
                    <h3>{userInfo.name || userInfo.username}</h3>
                    <span>@{userInfo.username} &middot; Joined {userInfo.joinedYear}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Stats */}
            <StatsCards dataset={dataset.dataset} />

            {/* Race Chart */}
            <div className="glass-card chart-card">
              <div className="card-toolbar">
                <div className="toolbar-left">
                  <div className="card-dot red" />
                  <div className="card-dot yellow" />
                  <div className="card-dot green" />
                  <h2>Contribution Race</h2>
                </div>
                <div className="toolbar-right">
                  <div className="pill-group">
                    {[
                      { label: "Slow", val: 900 },
                      { label: "Normal", val: 400 },
                      { label: "Fast", val: 180 },
                    ].map((s) => (
                      <button
                        key={s.label}
                        type="button"
                        className={`pill ${speed === s.val ? "active" : ""}`}
                        onClick={() => this.setSpeed(s.val)}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                  <button type="button" className="icon-btn" onClick={this.replayAnimation} title="Replay">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 4v6h6" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                    </svg>
                  </button>
                </div>
              </div>
              <ShowRacebarGraph
                key={replayKey}
                dataset={dataset}
                speed={speed}
              />
            </div>

            {/* Heatmap */}
            <Heatmap dataset={dataset.dataset} />

            {/* Bottom grid */}
            <div className="two-col">
              <DayBreakdown dataset={dataset.dataset} />
              <WeeklyTrend dataset={dataset.dataset} />
            </div>
          </div>
        )}

        <footer className="footer">
          <span>Built with D3.js &middot; </span>
          <a href="https://github.com/jugshaurya" target="_blank" rel="noopener noreferrer">@jugshaurya</a>
        </footer>
      </div>
    );
  }
}

export default App;
