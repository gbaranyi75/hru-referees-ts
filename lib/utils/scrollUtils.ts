/**
 * Easing functions for smooth animations
 */
type EasingFunction = (t: number) => number;

/**
 * Ease-in-out cubic easing function
 * Slow start, fast middle, slow end
 */
export const easeInOutCubic: EasingFunction = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

/**
 * Ease-in cubic easing function
 * Slow start, fast end
 */
export const easeInCubic: EasingFunction = (t: number): number => {
  return t * t * t;
};

/**
 * Ease-out cubic easing function
 * Fast start, slow end
 */
export const easeOutCubic: EasingFunction = (t: number): number => {
  return 1 - Math.pow(1 - t, 3);
};

/**
 * Custom smooth scroll with easing animation
 * @param element - The target HTML element to scroll to
 * @param duration - Animation duration in milliseconds (default: 600)
 * @param easing - Easing function to use (default: easeInOutCubic)
 */
export const smoothScrollTo = (
  element: HTMLElement,
  duration: number = 600,
  easing: EasingFunction = easeInOutCubic
): void => {
  const targetPosition = element.getBoundingClientRect().top + window.scrollY;
  const startPosition = window.scrollY;
  const distance = targetPosition - startPosition;
  let startTime: number | null = null;

  const animation = (currentTime: number) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const easeProgress = easing(progress);

    window.scrollTo(0, startPosition + distance * easeProgress);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  };

  requestAnimationFrame(animation);
};
