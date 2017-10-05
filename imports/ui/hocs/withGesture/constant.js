// The maximum tap position offset between multiple taps,
// exceeding will trigger `pan` event instead of `tap` event.
export const MAX_TAP_OFFSET = 10;

// The maximum time in ms between multiple taps,
// within this range doing multiple tap will trigger `doubleTap` instead of `tap`.
export const MAX_TAP_INTERVAL = 275;

export const DIRECTION_HORZ = 'horz';
export const DIRECTION_VERT = 'vert';
export const DIRECTION_UP = 'up';
export const DIRECTION_DOWN = 'down';
export const DIRECTION_LEFT = 'left';
export const DIRECTION_RIGHT = 'right';

export const OUT_TYPE_ZOOM = 0;
export const OUT_TYPE_SWIPE_UP = 1;
export const OUT_TYPE_SWIPE_DOWN = 2;
