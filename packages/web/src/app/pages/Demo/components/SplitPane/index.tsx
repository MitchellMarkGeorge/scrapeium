import { Box } from '@chakra-ui/react';
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { getValidChildren } from './utils';

export type SplitPaneDirection = 'horizontal' | 'vertical';

interface DividerProps {
  direction: SplitPaneDirection;
  isDragging: boolean;
  isEnabled: boolean;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const Divider = (props: DividerProps) => {
  if (props.direction === 'horizontal') {
    return (
      <Box
        backgroundColor="gray.900"
        height="100%"
        // width={ props.isDragging ? "5px" : "2px" }
        width="5px"
        onMouseDown={props.onMouseDown}
        cursor={props.isEnabled ? 'col-resize' : undefined}
      />
    );
  } else
    return (
      <Box
        backgroundColor="gray.900"
        // height={ props.isDragging ? "5px" : "2px" }
        height="5px"
        width="100%"
        onMouseDown={props.onMouseDown}
        cursor={props.isEnabled ? 'row-resize' : undefined}
      />
    );
};

interface SplitPaneProps {
  direction: SplitPaneDirection;
  enableResize?: boolean;
  // minSize?: number | number[];
  // defaultSize?: number | number[];
  // think about defaultSizes, minSizes, and maxSizes
  children: React.ReactNode; // using ReactNode gives the most flexibility (allows for things like conditional rendering)
}

// use memo() so it only rerenders when direction and children change??
export default function SplitPane({
  direction,
  children,
  enableResize = true,
}: SplitPaneProps) {
  // remove all children that are either null, undefined, or a boolean (these values are normally remenats of conditiuonal rendering)
  // if a single child is passed in, it also wraps it in an array
  // is no valid children are found, it returns an empty array
  const validChildren = useMemo(() => getValidChildren(children), [children]);

  const numOfChildren = validChildren.length;
  // if (minSize !== undefined) {
  //   if (Array.isArray(minSize)) {
  //     if (numOfChildren !== minSize.length) throw Error('number of children and min sizes should match')
  //     const sum = minSize.reduce((a, b) => a + b, 0);
  //     if (sum !== 100) throw Error('minSize must equal to 100')
  //   } else {
  //     if (minSize < 0 || minSize > 100) throw Error();
  //   }
  // }
  // if I use the flex approach, I am pretty much splting up the container into a 100 parts and sharing them out to each pane
  const [paneFlexPercents, updatePanePercents] = useState<number[]>(
    Array.from({ length: numOfChildren }, () => 100 / numOfChildren)
  );
  if (numOfChildren === 0) throw Error();
  const [isDragging, setIsDragging] = useState(false);
  const [initalDividerPosition, setInitalDividerPosition] = useState<
    number | null
  >(null);
  const [currentDividerIndex, setCurrentDividerIndex] = useState<number | null>(
    null
  );

  const paneNodes = useRef<HTMLDivElement[]>([]);
  const isMounted = useRef(false);
  const isHorizontal = direction === 'horizontal';
  const onMouseUp = (e: MouseEvent) => {
    setIsDragging(false);
    // think about this
    // setCurrentDividerIndex(null);
    // setInitalDividerPosition(null);
  };

  const recalculatePaneFlexPercents = () => {
    // what is the flex percents are not even when this code is called??
    const newPaneFlexPercents = Array.from(
      { length: numOfChildren },
      () => 100 / numOfChildren
    );
    updatePanePercents(newPaneFlexPercents);
  };

  useEffect(() => {
    // when the children change, recalcualte the flex percents (base it on the number of children)
    // only do this when everything has mounted
    if (isMounted.current) {
      recalculatePaneFlexPercents();
    } else {
      isMounted.current = true;
    }
  }, [numOfChildren]);

  const onMouseMove = (e: MouseEvent) => {
    if (
      isDragging &&
      currentDividerIndex !== null &&
      initalDividerPosition !== null
    ) {
      // based on http://jsfiddle.net/6j10L3x2/1/ and https://codesandbox.io/s/dry-currying-dy9z2b?file=/src/index.js:444-451

      // CONFIRM ALL VALUES (offsetWidth, pageX)
      // the currentDivicerInde will always being in range of the size of paneFlexPercents
      const paneFlexPercentsClone = [...paneFlexPercents];
      // with this approach, we only handle a max of 2 panes at a time: the panes at either side of the divider
      // the first pane that is being resized and the second pane that is being resized into
      const firstPaneFlexPercent = paneFlexPercentsClone[currentDividerIndex];
      const secondPaneFlexPercent =
        paneFlexPercentsClone[currentDividerIndex + 1];

      const firstPaneDomNode = paneNodes.current[currentDividerIndex];
      const secondPaneDomNode = paneNodes.current[currentDividerIndex + 1];
      if (!firstPaneDomNode || !secondPaneDomNode) return;

      let firstPaneSize = isHorizontal
        ? firstPaneDomNode.offsetWidth
        : firstPaneDomNode.offsetHeight;

      let secondPaneSize = isHorizontal
        ? secondPaneDomNode.offsetWidth
        : secondPaneDomNode.offsetHeight;

      // this represents the sums of both pane flex percents. we do this as in this context, we are trying to share the space of these two panes
      const paneSizeSum = firstPaneSize + secondPaneSize;
      // this is not always equal to 100... this sum represents the ammount of percentage space (out of 100) that 2 panes share
      // eg: if there were 4 panes, this would be 50, if there were 3 panes, it would be ~66.6667
      const flexPercentSum = firstPaneFlexPercent + secondPaneFlexPercent;
      // both pageX/Y and clientX/Y work
      let nextDividerPosition = isHorizontal ? e.pageX : e.pageY;
      //   let nextDividerPosition = isHorizontal ? e.clientX : e.clientY;
      const positionDifference = nextDividerPosition - initalDividerPosition;

      firstPaneSize += positionDifference;
      secondPaneSize -= positionDifference;

      if (firstPaneSize < 0) {
        secondPaneSize += firstPaneSize;
        nextDividerPosition -= firstPaneSize;
        firstPaneSize = 0;
      }

      if (secondPaneSize < 0) {
        firstPaneSize += secondPaneSize;
        nextDividerPosition += secondPaneSize;
        secondPaneSize = 0;
      }

      console.log(flexPercentSum);

      const newFirstPaneFlexPercent =
        flexPercentSum * (firstPaneSize / paneSizeSum);
      const newSecondPaneFlexPercent =
        flexPercentSum * (secondPaneSize / paneSizeSum);

      paneFlexPercentsClone[currentDividerIndex] = newFirstPaneFlexPercent;
      paneFlexPercentsClone[currentDividerIndex + 1] = newSecondPaneFlexPercent;
      updatePanePercents(paneFlexPercentsClone);
      setInitalDividerPosition(nextDividerPosition);
    }
  };

  const onMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    dividerIndex: number
  ) => {
    if (enableResize) {
      // both pageX/Y and clientX/Y work
      if (isHorizontal) {
        // x for horizontal dividers
        setInitalDividerPosition(e.pageX);
        // setInitalDividerPosition(e.clientX);
      } else {
        // y for vertical dividers
        setInitalDividerPosition(e.pageY);
        // setInitalDividerPosition(e.clientY);
      }
      setCurrentDividerIndex(dividerIndex);
      setIsDragging(true);
    }
  };
  useEffect(() => {
    if (enableResize) {
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('mousemove', onMouseMove);
    }
    return () => {
      // should these only be called is enableResize is true???
      if (enableResize) {
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('mousemove', onMouseMove);
      }
    };
  });

  const addPaneNode = (node: HTMLDivElement | null, index: number) => {
    if (node) {
      paneNodes.current[index] = node;
    } else {
      paneNodes.current.splice(index, 1);
    }
  };

  return (
    <Box
      display="flex"
      height="100%"
      width="100%"
      overflow="hidden"
      flexDirection={isHorizontal ? 'row' : 'column'}
    >
      {validChildren.map((child, index) => {
        // need to find better key than the index....
        const isLastChild = index === numOfChildren - 1;
        const paneStyle: React.CSSProperties = {
          flexGrow: paneFlexPercents[index],
          flexShrink: 1,
          flexBasis: 0,
          overflow: 'hidden',
          ...(isDragging ? { userSelect: 'none' } : null), // so nothing gets acciddentaly selected when dragging
        };
        if (isLastChild)
          return (
            <div
              key={index}
              ref={(node) => addPaneNode(node, index)}
              style={paneStyle}
            >
              {child}
            </div>
          );

        return (
          <React.Fragment key={index}>
            <div
              key={index}
              ref={(node) => addPaneNode(node, index)}
              style={paneStyle}
            >
              {child}
            </div>
            {/*  have a Divider hitbox?? */}
            <Divider
              isDragging={isDragging && currentDividerIndex === index}
              isEnabled={enableResize}
              direction={direction}
              onMouseDown={(e) => onMouseDown(e, index)}
            />
          </React.Fragment>
        );
      })}
    </Box>
  );
}
