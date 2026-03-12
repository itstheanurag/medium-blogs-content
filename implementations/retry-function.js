function retryAsyncFunction(
  cb,
  max_retry,
  delay,
  is_exponential_back_off_enabled = false,
) {
  let attempts = 0;
  return new Promise((resolve, reject) => {
    const attempt = () => {
      Promise.resolve(cb())
        .then((res) => resolve(res))
        .catch((err) => {
          attempts++;

          if (attempts > max_retry) {
            reject(err);
            return;
          }
          console.log("Failed, attempt number: ", attempts);
          if (is_exponential_back_off_enabled) {
            setTimeout(attempt, delay * 2 ** attempts);
          } else {
            setTimeout(attempt, delay);
          }
        });
    };

    attempt();
  });
}

function passingTestFunction() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("resolving");
      resolve("OK");
    }, 200);
  });
}

function failingTestFunction() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject("Failure");
    }, 200);
  });
}

async function fetchTodos() {
  //   const result = fetch(`https://jsonplaceholder.typicode.com/todos/`)
  //     .then((response) => response.json())
  //     .then((json) => console.log(json));

  const result = fetch(`https://jsonplaceholder.typicode.com/todos/`);

  throw Error("failed");
}

retryAsyncFunction(fetchTodos, 4, 500, true)
  .then((res) => console.log("failingTestFunction returned this", res))
  .catch((err) => console.log("failingTestFunction returned this", err))
  .finally(() => console.log("finished"));

// retryAsyncFunction(passingTestFunction, 4, 500)
//   .then((res) => console.log("passingTestFunction returned this", res))
//   .catch((err) => console.log("passingTestFunction returned this", err))
//   .finally(() => console.log("finished"));

// retryAsyncFunction(failingTestFunction, 4, 500, true)
//   .then((res) => console.log("failingTestFunction returned this", res))
//   .catch((err) => console.log("failingTestFunction returned this", err))
//   .finally(() => console.log("finished"));
