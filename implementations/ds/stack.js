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
 * Stack is a LIFO (Last In, First Out) data structure.
 * Elements are added and removed from the same end (top).
 */
class Stack {
  constructor() {
    this.first = null; // Reference to the top of the stack
    this.last = null; // Reference to the bottom of the stack
    this.size = 0; // Number of elements in the stack
  }

  /**
   * Adds an element to the top of the stack.
   * @param {*} value - The value to be added
   * @returns {number} The new size of the stack
   */
  push(value) {
    const node = new Node(value);

    // If stack is empty, set both first and last to the new node
    if (!this.first) {
      this.first = node;
      this.last = node;
    } else {
      // Link the new node to the current top and update first
      const temp = this.first;
      this.first = node;
      this.first.next = temp;
    }

    return this.size++;
  }

  /**
   * Removes and returns the element from the top of the stack.
   * @returns {*|null} The value of the removed node, or null if stack is empty
   */
  pop() {
    if (!this.first) return null;

    let temp_node = this.first;

    // If there's only one element, clear the last reference
    if (this.first === this.last) this.last = null;

    // Move first pointer to the next node
    this.first = this.first.next;
    this.size--;

    return temp_node.value;
  }
}

// Example usage of Stack
const stck = new Stack();

stck.push("value1");
stck.push("value2");
stck.push("value3");

console.log(stck.first);
console.log(stck.last);
console.log(stck.size);

stck.push("value4");
console.log(stck.pop());
console.log(stck.pop());
