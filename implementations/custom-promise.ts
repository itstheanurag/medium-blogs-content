const states = ["pending", "fulfilled", "rejected"] as const;

type TPromiseState = (typeof states)[number];

type TResolve<T> = (value: T) => void;
type TReject<K> = (reason: K) => void;

type TPromiseExecutor<T, K> = (
  resolve: TResolve<T>,
  reject: TReject<K>,
) => void;

type TThenHandler<T, U> = (value: T) => U | PromiseLike<U>;
type TCatchHandler<K, U> = (reason: K) => U | PromiseLike<U>;
type TFinallyHandler = () => void | PromiseLike<void>;

type THandler<T, K, U, V> = {
  onFulfilled?: TThenHandler<T, U>;
  onRejected?: TCatchHandler<K, V>;
  resolve: (value: U | T | V) => void;
  reject: TReject<K>;
};

class CustomPromise<T, K = unknown> {
  value?: T;
  reason?: K;
  state: TPromiseState = "pending";

  private _handlers: THandler<T, K, unknown, unknown>[] = [];

  constructor(cb: TPromiseExecutor<T, K>) {
    try {
      cb(this.resolve.bind(this), this.reject.bind(this));
    } catch (err) {
      this.reject(err as K);
    }
  }

  resolve(value: T) {
    if (this.state !== "pending") return;
    this._resolveValue(value);
  }

  reject(reason: K) {
    if (this.state !== "pending") return;

    this.state = "rejected";
    this.reason = reason;

    queueMicrotask(() => {
      const handlers = this._handlers;
      this._handlers = [];
      handlers.forEach((handler) => this._runHandler(handler));
    });
  }

  then<U>(handler: TThenHandler<T, U>): CustomPromise<U, K> {
    return new CustomPromise<U, K>((resolve, reject) => {
      this._attachHandler({
        onFulfilled: handler,
        resolve: resolve as (value: U | T) => void,
        reject,
      });
    });
  }

  catch<U>(handler: TCatchHandler<K, U>): CustomPromise<T | U, K> {
    return new CustomPromise<T | U, K>((resolve, reject) => {
      this._attachHandler({
        onRejected: handler,
        resolve,
        reject,
      });
    });
  }

  finally(handler: TFinallyHandler): CustomPromise<T, K> {
    return new CustomPromise<T, K>((resolve, reject) => {
      this._attachHandler({
        onFulfilled: (value) => {
          const result = handler();
          if (this._isThenable(result)) {
            return result.then(() => value);
          }

          return value;
        },
        onRejected: (reason) => {
          const result = handler();
          if (this._isThenable(result)) {
            return result.then(() => {
              throw reason;
            });
          }

          throw reason;
        },
        resolve,
        reject,
      });
    });
  }

  private _attachHandler<U, V>(handler: THandler<T, K, U, V>) {
    if (this.state === "pending") {
      this._handlers.push(handler as THandler<T, K, unknown, unknown>);
      return;
    }

    queueMicrotask(() =>
      this._runHandler(handler as THandler<T, K, unknown, unknown>),
    );
  }

  private _runHandler(handler: THandler<T, K, unknown, unknown>) {
    try {
      if (this.state === "fulfilled") {
        if (!handler.onFulfilled) {
          handler.resolve(this.value as T);
          return;
        }

        const result = handler.onFulfilled(this.value as T);
        this._resolveChainedValue(result, handler.resolve, handler.reject);
        return;
      }

      if (!handler.onRejected) {
        handler.reject(this.reason as K);
        return;
      }

      const result = handler.onRejected(this.reason as K);
      this._resolveChainedValue(result, handler.resolve, handler.reject);
    } catch (err) {
      handler.reject(err as K);
    }
  }

  private _resolveValue(value: T | PromiseLike<T>) {
    if (this._isThenable(value)) {
      value.then(
        (resolvedValue) => this._resolveValue(resolvedValue),
        (reason) => this.reject(reason as K),
      );
      return;
    }

    this.state = "fulfilled";
    this.value = value;

    queueMicrotask(() => {
      const handlers = this._handlers;
      this._handlers = [];
      handlers.forEach((handler) => this._runHandler(handler));
    });
  }

  private _resolveChainedValue<U>(
    value: U | PromiseLike<U>,
    resolve: (value: U) => void,
    reject: TReject<K>,
  ) {
    if (this._isThenable(value)) {
      value.then(resolve, (reason) => reject(reason as K));
      return;
    }

    resolve(value);
  }

  private _isThenable<U>(value: unknown): value is PromiseLike<U> {
    return (
      value !== null &&
      (typeof value === "object" || typeof value === "function") &&
      "then" in value &&
      typeof value.then === "function"
    );
  }
}

const p = new CustomPromise<number>((resolve) => {
  resolve(5);
}).then((value) => {
  console.log("Resolved with:", value);
});

console.log(p);
