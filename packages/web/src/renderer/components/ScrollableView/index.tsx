import { useEffect, useRef, useState, useCallback, useContext } from 'react';
import { StyledContainer, StyledIntersectionBox } from './styled';
import { AppState } from 'renderer/state';

interface ScrollableViewProps {
  children: JSX.Element | JSX.Element[];
  header?: JSX.Element | JSX.Element[];
  onReachedTop: () => void;
}

const ScrollableView = ({
  children,
  onReachedTop,
  header,
}: ScrollableViewProps) => {
  const { noPreviousMessages } = useContext(AppState).state;
  const intersectionBoxRef = useRef(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const intersectionCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      console.log('USEEFFECT intersectionCallback');
      const intersection = entries.find(
        (entry) => entry.target === intersectionBoxRef.current
      );

      console.log('USEEFFECT intersectionCallback intersection', intersection);

      if (!intersection) return;

      const isVisibleNow = intersection.intersectionRatio === 1;
      console.log('USEEFFECT intersectionCallback isVisibleNow', isVisibleNow);
      console.log('USEEFFECT intersectionCallback isVisible', isVisible);

      if (isVisibleNow && !isVisible) onReachedTop();

      setIsVisible(isVisibleNow);
    },
    [isVisible, setIsVisible, onReachedTop]
  );

  useEffect(() => {
    let observer: IntersectionObserver | undefined;
    console.log('USEEFFECT Observer useEffect', intersectionBoxRef.current);

    if (intersectionBoxRef.current) {
      console.log('USEEFFECT Creating new observer');

      observer = new IntersectionObserver(intersectionCallback, {
        root: null,
        rootMargin: '0px',
        threshold: 1,
      });

      observer.observe(intersectionBoxRef.current);
    }

    return () => {
      if (observer) {
        console.log('USEEFFECT Cleanup', observer);
        observer.disconnect();
      }
    };
  }, [onReachedTop, intersectionCallback, intersectionBoxRef]);

  return (
    <StyledContainer>
      {isVisible && noPreviousMessages ? header : undefined}
      <StyledIntersectionBox ref={intersectionBoxRef}></StyledIntersectionBox>
      {children}
    </StyledContainer>
  );
};

export default ScrollableView;
