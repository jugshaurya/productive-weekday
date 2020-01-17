import React, { Component } from "react";
import * as d3 from "d3";

class ShowRacebarGraph extends Component {
  state = { dataset: this.props.dataset };

  render() {
    const { dataset } = this.state;
    console.log("dataset from bar", dataset);
    return <p> HELLO FORM BAR</p>;
  }
}

export default ShowRacebarGraph;
