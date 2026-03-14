class MyPromise {
  state = "pending";
  reason;
  value;
  _handlers = [];

  constructor(callback) {
    try {
      callback(this.resolve.bind(this), this.reject.bind(this));
    } catch (err) {
      this.reject(err);
    }
  }

  resolve(value) {
    if (this.state !== "pending") return;
    this.#resolveValue(value);
  }

  reject(reason) {
    if (this.state != "pending") return;

    this.state = "rejected";
    this.reason = reason;

    queueMicrotask(() => {
      const handlers = this._handlers;
      this._handlers = [];
      handlers.forEach((handler) => this.#runHandler(handler));
    });
  }

  then(thenHandler) {
    return new MyPromise((resolve, reject) => {
      this.#attachHandler({
        onFulfilled: thenHandler,
        resolve,
        reject,
      });
    });
  }

  catch(catchHandler) {
    return new MyPromise((resolve, reject) => {
      this.#attachHandler({
        onRejected: catchHandler,
        resolve,
        reject,
      });
    });
  }

  finally(finallyHandler) {
    return new MyPromise((resolve, reject) => {
      this.#attachHandler({
        onFulfilled: (value) => {
          const result = finallyHandler();

          if (this.#isThenable(result)) {
            return result.then(() => value);
          }

          return value;
        },
        onRejected: (reason) => {
          const result = finallyHandler();

          if (this.#isThenable(result)) {
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

  #resolveValue(value) {
    // value is a promise related
    if (this.#isThenable(value)) {
      value.then(
        (resolvedValue) => this.#resolveValue(resolvedValue),
        (reason) => this.reject(reason),
      );
      return;
    }

    this.state = "fulfilled";
    this.value = value;

    queueMicrotask(() => {
      const handlers = this._handlers;
      this._handlers = [];
      handlers.forEach((handler) => this.#runHandler(handler));
    });
  }

  #attachHandler(handler) {
    if (this.state == "pending") {
      this._handlers.push(handler);
      return;
    }

    queueMicrotask(() => this.#runHandler(handler));
  }

  #runHandler(handlerFn) {
    try {
      if (this.state === "fulfilled") {
        if (!handlerFn.onFulfilled) {
          handlerFn.resolve(this.value);
          return;
        }

        const result = handlerFn.onFulfilled(this.value);
        this.#resolveChainedValue(result, handlerFn.resolve, handlerFn.reject);
        return;
      }

      if (this.state === "rejected") {
        if (!handlerFn.onRejected) {
          handlerFn.reject(this.reason);
          return;
        }

        const result = handlerFn.onRejected(this.reason);
        this.#resolveChainedValue(result, handlerFn.resolve, handlerFn.reject);
      }
    } catch (error) {
      handlerFn.reject(error);
    }
  }

  #resolveChainedValue(value, resolve, reject) {
    if (this.#isThenable(value)) {
      value.then(resolve, (reason) => reject(reason));
      return;
    }

    resolve(value);
  }

  /**
   *
   * In JavaScript, a thenable is an object that has a then() function.
   * All promise are thenables, but not all thenables are promises.
   *
   * refrence: https://masteringjs.io/tutorials/fundamentals/thenable
   */

  #isThenable(value) {
    return (
      value &&
      (typeof value === "object" || typeof value === "function") &&
      "then" in value &&
      typeof value.then === "function"
    );
  }
}

function testChaining() {
  console.log("Starting Promise Chain Test\n");

  new MyPromise((resolve) => {
    setTimeout(() => {
      console.log("Step 1: resolving with 5");
      resolve(5);
    }, 3000);
  })
    .then((value) => {
      console.log("Step 2:", value);
      return value * 2;
    })
    .then((value) => {
      console.log("Step 3:", value);

      // return another MyPromise to test chaining
      return new MyPromise((resolve) => {
        setTimeout(() => {
          console.log("Step 4: async multiply");
          resolve(value * 3);
        }, 100);
      });
    })
    .then((value) => {
      console.log("Step 5:", value);
      throw new Error("Something broke");
    })
    .catch((err) => {
      console.log("Step 6: caught error ->", err.message);
      return 100;
    })
    .finally(() => {
      console.log("Step 7: finally executed");
    })
    .then((value) => {
      console.log("Step 8:", value);
    });
}

testChaining();
