/**
 * Node class represents a single element in a Stack or Queue.
 * Each node holds a value and a reference to the next node.
 */
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

/**
 * Queue is a FIFO (First In, First Out) data structure.
 * Elements are added at the rear and removed from the front.
 */
class Queue {
  constructor() {
    this.first = null; // Reference to the front of the queue
    this.last = null; // Reference to the rear of the queue
    this.size = 0; // Number of elements in the queue
  }

  /**
   * Adds an element to the rear of the queue.
   * @param {*} value - The value to be added
   * @returns {number} The new size of the queue
   */
  enqueue(value) {
    const node = new Node(value);

    // If queue is empty, set both first and last to the new node
    if (!this.first) {
      this.first = node;
      this.last = node;
    } else {
      // Link the current last node to the new node and update last
      this.last.next = node;
      this.last = node;
    }

    return ++this.size;
  }

  /**
   * Removes and returns the element from the front of the queue.
   * @returns {*|null} The value of the removed node, or null if queue is empty
   */
  dequeue() {
    if (!this.first) return null;

    const temp = this.first;

    // If there's only one element, clear the last reference
    if (this.first == this.last) {
      this.last = null;
    }

    // Move first pointer to the next node
    this.first = this.first.next;
    this.size--;

    return temp.value;
  }
}

// Example usage of Queue
const quickQueue = new Queue();

quickQueue.enqueue("value1");
quickQueue.enqueue("value2");
quickQueue.enqueue("value3");

console.log(quickQueue.first);
console.log(quickQueue.last);
console.log(quickQueue.size);

quickQueue.enqueue("value4");
console.log(quickQueue.dequeue());
