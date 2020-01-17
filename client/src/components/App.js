import React from "react";
import "./App.css";

import ShowRacebarGraph from "./ShowRacebarGraph";
class App extends React.Component {
  state = {
    username: "",
    dataset: null,
    fetchingError: null,
    isFetching: false
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

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1> Visualize the Dataset </h1>

          {/* <form onSubmit={this.handleFetchingUserDataset}>
            <input
              onChange={this.handleChange}
              type="text"
              name="username"
              value={this.state.username}
            />
            <button type="submit">Fetch</button>
          </form> */}

          {/* {this.state.dataset && ( */}
          <ShowRacebarGraph dataset={this.state.dataset} />
          {/* )} */}
        </header>
      </div>
    );
  }
}

export default App;
