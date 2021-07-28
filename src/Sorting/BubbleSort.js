// export default BubbleSort;
import * as Constants from "../SortingVisualizer/Constants";
import * as Helper from "../SortingVisualizer/Helper";

const BubbleSort = async (
  array,
  colorArr,
  awaitingReset,
  setState,
  shouldStartNewSort
) => {
  if (!shouldStartNewSort()) {
    console.log("Sort in progress or already sorted");
    return;
  }
  console.log("this shit is broken");

  setState({ sortInProgress: true });

  //Keep track of how many times we've iterated
  let round = 0;
  let innerSorted = false;

  while (!innerSorted) {
    //console.log("Round:" + round);
    innerSorted = true;

    for (let i = 0; i < array.length - 1 - round; i++) {
      //If we are awaiting a reset, stop immediately and update state
      if (awaitingReset) {
        setState({ awaitingReset: false, sortInProgress: false });
        return;
      }

      //console.log("Comparing " + array[i] + " and " + array[i + 1]);
      colorArr[i] = Constants.COMPARE_COLOR;
      colorArr[i + 1] = Constants.COMPARE_COLOR;
      setState({ colorArr: colorArr });

      await Helper.sleep(Constants.ANIMATION_SPEED);

      //Not in order found
      if (array[i] > array[i + 1]) {
        innerSorted = false;

        //console.log("Swapping " + array[i] + " and " + array[i + 1]);
        colorArr[i] = Constants.SWAP_COLOR;
        colorArr[i + 1] = Constants.SWAP_COLOR;
        setState({ colorArr: colorArr });

        await Helper.sleep(Constants.ANIMATION_SPEED);

        let temp = array[i + 1];
        array[i + 1] = array[i];
        array[i] = temp;

        setState({ array: array });

        // setState((array) => {
        //   let temp = array[i + 1];
        //   array[i + 1] = array[i];
        //   array[i] = temp;

        //   let tempArr = array.slice();
        //   console.log(Object.prototype.toString.call(tempArr) == '[object Array]');
        //   return { array: tempArr };
        // });
      }

      colorArr[i] = Constants.NORMAL_COLOR;
      colorArr[i + 1] = Constants.NORMAL_COLOR;
      setState({ colorArr: colorArr });
      await Helper.sleep(Constants.ANIMATION_SPEED);
    }

    //Every sweep, we update the highest bar to completed
    //console.log("Single sorted: " + array[array.length - round - 1]);
    colorArr[array.length - round - 1] = Constants.COMPLETE_COLOR;
    setState({ colorArr: colorArr });
    //console.log(round);
    round++;
  }

  //At this point, we know the rest are in order
  setState({ sorted: true });
  setState({ sortInProgress: false });
  for (let i = 0; i < array.length - round; i++) {
    colorArr[i] = Constants.COMPLETE_COLOR;
  }
  setState({ colorArr: colorArr });
  //console.log(array);
};

export default BubbleSort;
