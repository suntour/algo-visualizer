import React from "react";
import "./SortingVisualizer.css";

const NUMBER_OF_ARRAY_BARS = 30;
const ANIMATION_SPEED = 5;

const NORMAL_COLOR = "white";
const COMPARE_COLOR = "orange";
const SWAP_COLOR = "red";
const COMPLETE_COLOR = "green";

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

  async bubbleSort() {
    if (!this.shouldStartNewSort()) {
      return;
    }

    await this.setState({ sortInProgress: true });
    //Keep track of how many times we've iterated
    let round = 0;
    let innerSorted = false;

    while (!innerSorted) {
      innerSorted = true;

      for (let i = 0; i < this.state.array.length - 1 - round; i++) {
        //If we are awaiting a reset, stop immediately and update state
        if (this.state.awaitingReset) {
          await this.setState({ awaitingReset: false });
          await this.setState({ sortInProgress: false });
          return;
        }

        this.changeBarColors(i, COMPARE_COLOR, i + 1);
        await this.sleep(ANIMATION_SPEED);

        //Not in order found
        if (this.state.array[i] > this.state.array[i + 1]) {
          innerSorted = false;

          this.changeBarColors(i, SWAP_COLOR, i + 1);
          await this.sleep(ANIMATION_SPEED);

          let tempArr = this.state.array.slice();
          let temp = tempArr[i + 1];

          tempArr[i + 1] = tempArr[i];
          tempArr[i] = temp;
          await this.setState({ array: tempArr });
        }

        this.changeBarColors(i, NORMAL_COLOR, i + 1);
        await this.sleep(ANIMATION_SPEED);
      }

      //Every sweep, we update the highest bar to completed
      this.changeBarColors(this.state.array.length - round - 1, COMPLETE_COLOR);
      round++;
    }

    //At this point, we know the rest are in order
    await this.setState({ sorted: true });
    await this.setState({ sortInProgress: false });
    this.changeBarColors(0, COMPLETE_COLOR, this.state.array.length - round);
  }

  changeBarColors(indexStart, color, indexEnd) {
    if (indexStart == null || !color) {
      return;
    }
    let tempColorArr = this.state.colorArr.slice();

    if (indexEnd == null) {
      tempColorArr[indexStart] = color;
      this.setState({ colorArr: tempColorArr });
    } else {
      for (let i = indexStart; i <= indexEnd; i++) {
        tempColorArr[i] = color;
        this.setState({ colorArr: tempColorArr });
      }
    }
  }

  async sleep(timeToSleep) {
    await new Promise((resolve) => setTimeout(resolve, timeToSleep));
  }

  componentDidMount() {
    this.reset();
  }

  async reset() {
    if (this.state.sortInProgress) {
      await this.setState({ awaitingReset: true });
    }
    this.resetArray();
    this.resetColors();
    await this.setState({ sorted: false });
  }

  async resetColors() {
    const colorArr = [];
    for (let i = 0; i < NUMBER_OF_ARRAY_BARS; i++) {
      colorArr.push(NORMAL_COLOR);
    }
    await this.setState({ colorArr: colorArr });
  }

  async resetArray() {
    const array = [];
    for (let i = 0; i < NUMBER_OF_ARRAY_BARS; i++) {
      array.push(randomIntFromInterval(5, 80));
    }
    await this.setState({ array: array });
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
                width: `${50 / NUMBER_OF_ARRAY_BARS}%`,
                margin: `0 ${25 / NUMBER_OF_ARRAY_BARS}%`,
              }}
            ></div>
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
