import React from "react";
import "./SortingVisualizer.css";

const NUMBER_OF_ARRAY_BARS = 50;
const ANIMATION_SPEED = 1;

const NORMAL_COLOR = "white";
const COMPARE_COLOR = "orange";
const SWAP_COLOR = "red";
const COMPLETE_COLOR = "green";

export default class SortingVisualizer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      array: [], //array to track the value of the bars
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
    let shouldStart = this.shouldStartNewSort();
    if (!shouldStart) {
      return;
    }

    await this.setState({ sortInProgress: true });
    //Keep track of how many times we've iterated
    let round = 0;
    const arrayBars = document.getElementsByClassName("array-bar");
    let innerSorted = false;

    while (!this.state.sorted && this.state.sortInProgress && !innerSorted) {
      innerSorted = true;
    
      //Check array for any i > i+1
      for (let i = 0; i < this.state.array.length - 1 - round; i++) {
        if (this.state.awaitingReset) {
          await this.setState({ awaitingReset: false });
          return;
        }
        const leftBarColor = arrayBars[i].style;
        const rightBarColor = arrayBars[i + 1].style;

        function changeBarsToColor(color) {
          leftBarColor.backgroundColor = color;
          rightBarColor.backgroundColor = color;
        }

        changeBarsToColor(COMPARE_COLOR);
        await this.sleep(ANIMATION_SPEED);

        if (this.state.array[i] > this.state.array[i + 1]) {
          innerSorted = false;
          changeBarsToColor(SWAP_COLOR);
          await this.sleep(ANIMATION_SPEED);

          let tempArr = this.state.array.slice();
          let temp = tempArr[i + 1];

          tempArr[i + 1] = tempArr[i];
          tempArr[i] = temp;
          await this.setState({ array: tempArr });
        }

        changeBarsToColor(NORMAL_COLOR);
        await this.sleep(ANIMATION_SPEED);
      }
      changeBarToColor(this.state.array.length - round - 1, COMPLETE_COLOR);
      round++;
    }

    //At this point, we know the rest are in order, no need to check
    await this.setState({ sorted: true });

    for (let i = 0; i < this.state.array.length - round; i++) {
      changeBarToColor(i, COMPLETE_COLOR);
    }
    await this.setState({ sortInProgress: false });

    function changeBarToColor(index, color) {
      arrayBars[index].style.backgroundColor = color;
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
    await this.setState({ sortInProgress: false });
  }

  resetColors() {
    for (let i = 0; i < this.state.array.length; i++) {
      const arrayBars = document.getElementsByClassName("array-bar");
      arrayBars[i].style.backgroundColor = NORMAL_COLOR;
    }
  }

  async resetArray() {
    this.resetColors();
    this.forceUpdate();
    const array = [];
    for (let i = 0; i < NUMBER_OF_ARRAY_BARS; i++) {
      array.push(randomIntFromInterval(5, 80));
    }
    await this.setState({ array: array });
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
                backgroundColor: NORMAL_COLOR,
                height: `${value}%`,
                width: `${(100 * 0.5) / NUMBER_OF_ARRAY_BARS}%`,
                margin: `0 ${(100 * 0.25) / NUMBER_OF_ARRAY_BARS}%`,
              }}
            ></div>
          ))}
        </div>
        <div className="menu-container">
          <button onClick={() => this.reset()}>Generate</button>
          <button onClick={() => this.bubbleSort()}>Bubble</button>
        </div>
      </div>
    );
  }
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
