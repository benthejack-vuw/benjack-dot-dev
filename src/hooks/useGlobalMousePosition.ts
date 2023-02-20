import { useEffect, useMemo, useState } from 'react';
import { Vector } from 'tiny-shader-lib';

export type MousePositions = {
  mousePosition: Vector;
  lastMousePosition: Vector;
  mouseFollowingPosition: Vector;
  normalizedMousePosition: Vector;
  normalizedLastMousePosition: Vector;
  normalizedMouseFollowingPosition: Vector;
};

class GlobalMousePositionListener {
  private _parentElement: HTMLElement | Window;
  private _mousePosition: Vector;
  private _lastMousePosition: Vector;
  private _mouseFollowingPosition: Vector;
  private _normalizedMousePosition: Vector;
  private _normalizedLastMousePosition: Vector;
  private _normalizedFollowingMousePosition: Vector;
  private _speed: number;
  private _animFrame: number;

  constructor(speed = 0.35, element?: HTMLElement) {
    this._parentElement = element || window;
    this._speed = speed;
    this._mousePosition = new Vector();
    this._lastMousePosition = new Vector();
    this._mouseFollowingPosition = new Vector();
    this._normalizedMousePosition = new Vector();
    this._normalizedLastMousePosition = new Vector();
    this._normalizedFollowingMousePosition = new Vector();
    this._animFrame = -1;

    this.start();
    this.updateFollower = this.updateFollower.bind(this);
  }

  public start() {
    if (typeof this._parentElement === 'undefined' || !this._parentElement) {
      return;
    }

    (this._parentElement as HTMLElement).addEventListener('mousemove', this.updateMouse);
    this._animFrame = requestAnimationFrame(this.updateFollower);
  }

  public stop() {
    if (typeof this._parentElement === 'undefined') return;
    (this._parentElement as HTMLElement).removeEventListener('mousemove', this.updateMouse);
    cancelAnimationFrame(this._animFrame);
  }

  private updateMouse = (evt: MouseEvent) => {
    const offsetX = this._parentElement === window ? 0 : (this._parentElement as HTMLElement).getBoundingClientRect().x;
    const offsetY = this._parentElement === window ? 0 : (this._parentElement as HTMLElement).getBoundingClientRect().y;

    this._lastMousePosition.copy(this._mousePosition);
    this._mousePosition.set(evt.clientX - offsetX, evt.clientY - offsetY);
  };

  updateFollower = () => {
    const dt = 1.0 - Math.pow(1.0 - this._speed, 1);
    this._mouseFollowingPosition.set(
      this._mouseFollowingPosition.x +
        (this._mousePosition.x - this._mouseFollowingPosition.x) * dt,
      this._mouseFollowingPosition.y +
        (this._mousePosition.y - this._mouseFollowingPosition.y) * dt
    );
    this._animFrame = requestAnimationFrame(this.updateFollower);
  };

  get mousePositions(): MousePositions {
    const width = this._parentElement === window ? this._parentElement.innerWidth : (this._parentElement as HTMLElement).clientWidth;
    const height = this._parentElement === window ? this._parentElement.innerHeight : (this._parentElement as HTMLElement).clientHeight;

    this._normalizedMousePosition.set(
      this._mousePosition.x / width,
      1.0 - this._mousePosition.y / height
    );

    this._normalizedLastMousePosition.set(
      this._lastMousePosition.x / width,
      1.0 - this._lastMousePosition.y / height
    );

    this._normalizedFollowingMousePosition.set(
      this._mouseFollowingPosition.x / width,
      1.0 - this._mouseFollowingPosition.y / height
    );

    return {
      mousePosition: this._mousePosition,
      lastMousePosition: this._lastMousePosition,
      mouseFollowingPosition: this._mouseFollowingPosition,

      normalizedMousePosition: this._normalizedMousePosition,
      normalizedLastMousePosition: this._normalizedLastMousePosition,
      normalizedMouseFollowingPosition: this._normalizedFollowingMousePosition,
    };
  }

  set speed(speed: number) {
    this._speed = speed;
  }
}

const useGlobalMousePosition = (speed = 0.35) => {
  const mouseListener = useMemo(() => new GlobalMousePositionListener(), []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, refresh] = useState({});

  useEffect(() => {
    mouseListener.speed = speed;
  }, [speed, mouseListener]);

  useEffect(() => {
    let animFrame: number;
    const update = () => {
      refresh({});
    };
    animFrame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animFrame);
  }, [mouseListener]);

  useEffect(() => {
    mouseListener.start();
    return () => {
      mouseListener.stop();
    };
  }, [mouseListener]);

  return mouseListener.mousePositions;
};

export { useGlobalMousePosition, GlobalMousePositionListener };
