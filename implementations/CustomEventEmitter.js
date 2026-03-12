class CustomEvenEmitter {
  #events = new Map();
  constructor() {}

  // consumer will listen to this events and we will run these code.
  on(event, callback) {
    const event_handlers = this.#events.get(event) || [];
    this.#events.set(event, [...event_handlers, callback]);
  }

  // method will be used to create an event with some data
  emit(event, data) {
    this.#events.set(event, this.#events.get(event) || []);
    this.#Listener(event, data);
  }

  #Listener(event, data) {
    const event_handlers = this.#events.get(event) || [];
    event_handlers.forEach((handler) => handler(data));
  }
}

const emitter = new CustomEvenEmitter();

emitter.on("user_signed_in", (data) => {
  console.log("handler 1", data);
});

emitter.on("user_signed_in", (data) => {
  console.log("handler 2 ", data);
});

emitter.on("user_signed_in", (data) => {
  console.log("handler 3", data);
});

emitter.on("user_signed_in", async (data) => {
  await new Promise((r) => setTimeout(r, 1000));
  console.log("async handler", data);
});

emitter.emit("user_signed_in", {
  user: "Gaurav",
  role: "Developer",
});
