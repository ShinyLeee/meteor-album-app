/* eslint-disable class-methods-use-this */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { delay, now, getEmptyPoint, isValidPoint, isClickableElement } from './helper';
import {
  MAX_TAP_OFFSET,
  MAX_TAP_INTERVAL,
  DIRECTION_HORZ,
  DIRECTION_VERT,
  DIRECTION_UP,
  DIRECTION_DOWN,
  DIRECTION_LEFT,
  DIRECTION_RIGHT,
} from './constant';

/**
 * @description React HOC that handle touch event and produce
 *              `tap`, `doubleTap`, `pan`, `swipe`, `pinch` and `zoom` for React-Photo-Swipe
 *              Inspired by AlloyFinger https://github.com/AlloyTeam/AlloyFinger
 */

export default function withGesture(ListenedComponent) {
  return class Gesture extends Component {
    static propTypes = {
      onTap: PropTypes.func,
      onDoubleTap: PropTypes.func,
      onPanStart: PropTypes.func,
      onPan: PropTypes.func,
      onPanEnd: PropTypes.func,
      onSwipe: PropTypes.func,
      onPinchStart: PropTypes.func,
      onPinch: PropTypes.func,
      onPinchEnd: PropTypes.func,
    }

    constructor(props) {
      super(props);
      this.isBound = false;
      this.isDoubleTap = false;
      this.isPinching = false;
      this.tapTimerId = undefined;
      this.initPinchLen = undefined;
      this.lastTime = null;
      this.currTime = null;
      this.currPos = getEmptyPoint(true);
      this.tapPos = getEmptyPoint();
      this.startPanPos = getEmptyPoint();
      this.lastPanPos = getEmptyPoint();
      this.panAccDelta = getEmptyPoint();
      this.panDirection = undefined;
      this.panStartTime = null;
      this.initPinchCenter = getEmptyPoint();
      this.pinchCenter = getEmptyPoint();
    }

    getDirection() {
      let direction;
      const finX = this.lastPanPos.x;
      const finY = this.lastPanPos.y;
      const satX = this.startPanPos.x;
      const satY = this.startPanPos.y;
      if (this.panDirection === DIRECTION_HORZ) {
        direction = finX - satX > 0 ? DIRECTION_RIGHT : DIRECTION_LEFT;
      } else if (this.panDirection === DIRECTION_VERT) {
        direction = finY - satY > 0 ? DIRECTION_DOWN : DIRECTION_UP;
      }
      return direction;
    }

    getVelocity() {
      const duration = now() - this.panStartTime;
      return {
        velocityX: this.panAccDelta.x / duration,
        velocityY: this.panAccDelta.y / duration,
      };
    }

    getPinchLen() {
      const hLen = this.currPos.x2 - this.currPos.x1;
      const vLen = this.currPos.y2 - this.currPos.y1;
      return Math.sqrt((hLen * hLen) + (vLen * vLen));
    }

    getMiddlePoint(p) {
      return {
        x: Math.round((p.x1 + p.x2) * 0.5),
        y: Math.round((p.y1 + p.y2) * 0.5),
      };
    }

    checkIsTap() {
      return Math.abs(this.currPos.x1 - this.tapPos.x) < MAX_TAP_OFFSET &&
             Math.abs(this.currPos.y1 - this.tapPos.y) < MAX_TAP_OFFSET;
    }

    checkIsdoubleTap() {
      if (!this.lastTime) return false;
      const interval = this.currTime - this.lastTime;
      if (interval > 0 && interval < MAX_TAP_INTERVAL && this.checkIsTap()) {
        return true;
      }
      return false;
    }

    emit(type, e) {
      if (this.props[type]) {
        this.props[type](e);
      }
    }

    _handleTouchStart = (e) => {
      const fingerNum = e.touches.length;
      const clientX = e.touches[0].clientX;
      const clientY = e.touches[0].clientY;
      this.isTicking = true;
      this.currTime = now();
      this.currPos.x1 = clientX;
      this.currPos.y1 = clientY;

      if (fingerNum > 1) {
        this.currPos.x2 = e.touches[1].clientX;
        this.currPos.y2 = e.touches[1].clientY;
        this.initPinchLen = this.getPinchLen();
        this.initPinchCenter = this.getMiddlePoint(this.currPos);
      } else {
        if (isValidPoint(this.tapPos) && this.checkIsdoubleTap()) {
          clearTimeout(this.tapTimerId);
          this.isDoubleTap = true;
        }
        this.lastTime = now();
        this.tapPos.x = clientX;
        this.tapPos.y = clientY;
      }
    }

    _handleTouchMove = (e) => {
      const evt = { originalEvent: e };
      const fingerNum = e.touches.length;
      this.currPos.x1 = e.touches[0].clientX;
      this.currPos.y1 = e.touches[0].clientY;
      if (fingerNum > 1) {
        if (!this.isPinching) {
          this.isPinching = true;
          evt.initPinchCenter = this.initPinchCenter;
          evt.pinchCenter = this.initPinchCenter;
          evt.position = this.currPos;
          evt.scale = 1;
          this.emit('onPinchStart', evt);
        }
        this.currPos.x2 = e.touches[1].clientX;
        this.currPos.y2 = e.touches[1].clientY;
        this.pinchCenter = this.getMiddlePoint(this.currPos);
        evt.initPinchCenter = this.initPinchCenter;
        evt.pinchCenter = this.pinchCenter;
        evt.position = this.currPos;
        evt.scale = this.getPinchLen() / this.initPinchLen;
        this.emit('onPinch', evt);
      } else {
        this.startPanPos.x = this.tapPos.x;
        this.startPanPos.y = this.tapPos.y;
        if (isValidPoint(this.lastPanPos)) {
          evt.x = this.currPos.x1 - this.lastPanPos.x;
          evt.y = this.currPos.y1 - this.lastPanPos.y;
          evt.dx = this.panAccDelta.x;
          evt.dy = this.panAccDelta.y;
          if (this.panDirection === undefined) {
            const absPanAccDeltaX = Math.abs(this.panAccDelta.x);
            const absPanAccDeltaY = Math.abs(this.panAccDelta.y);
            if (absPanAccDeltaX >= MAX_TAP_OFFSET || absPanAccDeltaY >= MAX_TAP_OFFSET) {
              this.panDirection = absPanAccDeltaX > absPanAccDeltaY ? DIRECTION_HORZ : DIRECTION_VERT;
              this.panStartTime = now();
              evt.direction = this.panDirection;
              this.emit('onPanStart', evt);
            }
          } else {
            evt.direction = this.panDirection;
            this.emit('onPan', evt);
          }
        } else {
          evt.x = 0;
          evt.y = 0;
        }
        this.lastPanPos.x = this.currPos.x1;
        this.lastPanPos.y = this.currPos.y1;
        this.panAccDelta.x += evt.x;
        this.panAccDelta.y += evt.y;
      }
    }

    _handleTouchCancel = () => {
      clearTimeout(this.tapTimerId);
    }

    _handleTouchEnd = (e) => {
      const evt = { originalEvent: e };
      if (this.currPos.x2 !== null && this.currPos.y2 !== null) {
        if (this.isPinching) {
          evt.initPinchCenter = this.initPinchCenter;
          evt.pinchCenter = this.pinchCenter;
          evt.position = this.currPos;
          evt.scale = this.getPinchLen() / this.initPinchLen;
          this.emit('onPinchEnd', evt);
          this.isPinching = false;
          this.initPinchLen = undefined;
          this.initPinchCenter = getEmptyPoint();
          this.pinchCenter = getEmptyPoint();
        }
      } else if (!isClickableElement(e.target) && this.checkIsTap()) {
        evt.position = this.tapPos;
        const emitTapEvent = () => this.emit('onTap', evt);
        this.tapTimerId = delay(emitTapEvent, MAX_TAP_INTERVAL);
        if (this.isDoubleTap) {
          clearTimeout(this.tapTimerId);
          this.emit('onDoubleTap', evt);
          this.tapPos = getEmptyPoint();
          this.isDoubleTap = false;
        }
      } else if (isValidPoint(this.lastPanPos)) {
        const { velocityX, velocityY } = this.getVelocity();
        evt.direction = this.getDirection();
        evt.dx = this.panAccDelta.x;
        evt.dy = this.panAccDelta.y;
        evt.vx = velocityX;
        evt.vy = velocityY;
        this.emit('onPanEnd', evt);
        this.startPanPos = getEmptyPoint();
        this.lastPanPos = getEmptyPoint();
        this.panAccDelta = getEmptyPoint();
        this.panDirection = undefined;
        this.panStartTime = null;
      }
      this.currPos.x2 = null;
      this.currPos.y2 = null;
    }

    render() {
      return (
        <ListenedComponent
          onTouchStart={this._handleTouchStart}
          onTouchMove={this._handleTouchMove}
          onTouchCancel={this._handleTouchCancel}
          onTouchEnd={this._handleTouchEnd}
          {...this.props}
        />
      );
    }
  };
}
