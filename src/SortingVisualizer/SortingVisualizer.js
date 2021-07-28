import React from "react";
import "./SortingVisualizer.css";
import BubbleSort from "../Sorting/BubbleSort";
import * as Constants from "./Constants";

export default class SortingVisualizer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      array: [], //array to track the value of the bars
      colorArr: [], //array to track the colors of the bars
      sorted: false, //boolean to track whether array is sorted
      sortInProgress: false, //boolean to track whether a sort is currently in progress
      awaitingReset: false, //boolean that used to halt any sortings in progress
    };
  }

  //Check if a new sort should begin
  shouldStartNewSort() {
    if (this.state.sorted || this.state.sortInProgress) {
      return false;
    }
    return true;
  }

  bubbleSort() {
    BubbleSort(
      this.state.array.slice(),
      this.state.colorArr.slice(),
      this.setState.bind(this),
      this.shouldStartNewSort.bind(this),
      this.isAwaitingReset.bind(this),
      this.resetArray.bind(this)
    );
  }

  componentDidMount() {
    this.reset();
  }

  async reset() {
    if (this.state.sortInProgress) {
      this.setState({ awaitingReset: true });
    } else {
      this.resetColors();
    }
    this.resetArray();
    this.setState({ sorted: false });
  }

  async resetColors() {
    const colorArr = [];
    for (let i = 0; i < Constants.NUMBER_OF_ARRAY_BARS; i++) {
      colorArr.push(Constants.NORMAL_COLOR);
    }
    this.setState({ colorArr: colorArr });
  }

  async resetArray() {
    const array = [];
    for (let i = 0; i < Constants.NUMBER_OF_ARRAY_BARS; i++) {
      array.push(randomIntFromInterval(5, 80));
    }
    this.setState({ array: array });
    this.resetColors();
  }

  isAwaitingReset() {
    return this.state.awaitingReset;
  }

  render() {
    const { array, colorArr } = this.state;
    return (
      <div className="visualizer-container">
        <div className="array-container">
          {array.map((value, idx) => (
            <div
              className="array-bar"
              key={idx}
              style={{
                backgroundColor: `${colorArr[idx]}`,
                height: `${value}%`,
                width: `${50 / Constants.NUMBER_OF_ARRAY_BARS}%`,
                margin: `0 ${25 / Constants.NUMBER_OF_ARRAY_BARS}%`,
              }}
            >
              <p>{value}</p>
            </div>
          ))}
        </div>
        <div className="menu-container">
          <button onClick={() => this.reset()}>Generate</button>
          <button onClick={() => this.bubbleSort()}>Bubble sort</button>
          <button>TODO: Quick sort</button>
        </div>
      </div>
    );
  }
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
