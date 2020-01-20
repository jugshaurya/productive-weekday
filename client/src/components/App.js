import React from "react";
import "./App.css";
import "./ribbon.styles.css";
// import DATASET from "../assets/dataset";
import ShowRacebarGraph from "./ShowRacebarGraph";
import { ReactComponent as MainSVG } from "../assets/main.svg";
import { ReactComponent as LoadingSVG } from "../assets/loadingicon.svg";
class App extends React.Component {
  state = {
    username: "",
    dataset: null,
    // dataset: DATASET,
    fetchingError: null,
    isFetching: false,
    replayKey: true
  };

  handleChange = e => {
    this.setState({ fetchingError: null, [e.target.name]: e.target.value });
  };

  handleFetchingUserDataset = e => {
    e.preventDefault();
    const { username } = this.state;

    if (!username)
      return this.setState({
        fetchingError: { status: null, message: "Enter a Github Username" }
      });

    // Fetching start
    this.setState({ fetchingError: null, dataset: null, isFetching: true });
    // Fetching Pending + Fetching Resolved/Rejected
    fetch(`http://localhost:8080/user/${username}`)
      .then(response => response.json())
      .then(dataset =>
        this.setState({
          dataset,
          fetchingError: null,
          isFetching: false,
          username: ""
        })
      )
      .catch(err => {
        this.setState({
          dataset: null,
          fetchingError: err,
          isFetching: false,
          username: ""
        });
      });
  };

  replayAnimation = () => {
    this.setState({ replayKey: !this.state.replayKey });
  };

  render() {
    const {
      username,
      dataset,
      fetchingError,
      isFetching,
      replayKey
    } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <div className="ribbon ribbon-top-left">
            <span>Made by Shaurya</span>
          </div>
          <MainSVG />
          <h3>
            Find out the most Productive <span>Weekday</span> of your Github
            World !
          </h3>
          {isFetching ? (
            <LoadingSVG />
          ) : (
            <form onSubmit={this.handleFetchingUserDataset}>
              <div className="label"> Github Username</div>
              <input
                onChange={this.handleChange}
                type="text"
                name="username"
                placeholder="Username"
                value={username}
              />
              <button type="submit">Draw</button>
            </form>
          )}
        </header>
        <main>
          <section>
            <h3 className="svg-label"> Weekly-Data</h3>
            {dataset && (
              <ShowRacebarGraph
                key={replayKey}
                dataset={dataset}
                onReplay={this.replayAnimation}
              />
            )}
          </section>
        </main>
      </div>
    );
  }
}

export default App;
