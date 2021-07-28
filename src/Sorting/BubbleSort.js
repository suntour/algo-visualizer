// export default BubbleSort;
import * as Constants from "../SortingVisualizer/Constants";
import * as Helper from "../SortingVisualizer/Helper";

const BubbleSort = async (
  array,
  colorArr,
  setState,
  shouldStartNewSort,
  isAwaitingReset,
  resetArray
) => {
  if (!shouldStartNewSort()) {
    console.log("Sort in progress or already sorted");
    return;
  }

  setState({ sortInProgress: true });

  //Keep track of how many times we've iterated
  let round = 0;
  let innerSorted = false;

  while (!innerSorted) {
    innerSorted = true;

    for (let i = 0; i < array.length - 1 - round; i++) {
      //If we are awaiting a reset, stop immediately and update state
      if (isAwaitingReset()) {
        setState(
          {
            awaitingReset: false,
            sortInProgress: false,
          },
          () => {
            resetArray();
          }
        );
        return;
      }

      colorArr[i] = Constants.COMPARE_COLOR;
      colorArr[i + 1] = Constants.COMPARE_COLOR;
      setState({ colorArr: colorArr });

      await Helper.sleep(Constants.ANIMATION_SPEED);

      //Not in order found
      if (array[i] > array[i + 1]) {
        innerSorted = false;

        colorArr[i] = Constants.SWAP_COLOR;
        colorArr[i + 1] = Constants.SWAP_COLOR;

        setState({ colorArr: colorArr });

        await Helper.sleep(Constants.ANIMATION_SPEED);

        let temp = array[i + 1];
        array[i + 1] = array[i];
        array[i] = temp;

        setState({ array: array });
      }
      await Helper.sleep(Constants.ANIMATION_SPEED);

      colorArr[i] = Constants.NORMAL_COLOR;
      colorArr[i + 1] = Constants.NORMAL_COLOR;
      setState({ colorArr: colorArr });
      await Helper.sleep(Constants.ANIMATION_SPEED);
    }

    //Every sweep, we update the highest bar to completed
    colorArr[array.length - round - 1] = Constants.COMPLETE_COLOR;
    setState({ colorArr: colorArr });
    round++;
  }

  //At this point, we know the rest are in order
  setState({ sorted: true });
  setState({ sortInProgress: false });
  for (let i = 0; i < array.length - round; i++) {
    colorArr[i] = Constants.COMPLETE_COLOR;
  }
  setState({ colorArr: colorArr });
};

export default BubbleSort;
