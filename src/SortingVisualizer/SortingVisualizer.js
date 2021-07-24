import React from "react";
import "./SortingVisualizer.css";

const NUMBER_OF_ARRAY_BARS = 50;

export default class SortingVisualizer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      array: [],
    };
  }

  componentDidMount() {
    this.resetArray();
  }

  resetArray() {
    const array = [];
    for (let i = 0; i < NUMBER_OF_ARRAY_BARS; i++) {
      array.push(randomIntFromInterval(5, 80));
    }
    this.setState({ array });
  }

  render() {
    const { array } = this.state;

    return (
      <div className="visualizer-container">
        <div className="array-container">
          {array.map((value, idx) => (
            <div
              className="array-bar"
              key={idx}
              style={{
                height: `${value}%`,
                width: `${(100 * 0.5) / NUMBER_OF_ARRAY_BARS}%`,
                margin: "0 " + `${(100 * 0.25) / NUMBER_OF_ARRAY_BARS}%`,
              }}
            ></div>
          ))}
        </div>
        <div className="menu-container">
          <button onClick={() => this.resetArray()}>Generate</button>
        </div>
      </div>
    );
  }
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
