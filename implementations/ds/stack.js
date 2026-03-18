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
 * Stack is a LIFO (bottom In, top Out) data structure.
 * Elements are added and removed from the same end (top).
 */
class Stack {
  constructor() {
    this.top = null; // Reference to the top of the stack
    this.bottom = null; // Reference to the bottom of the stack
    this.size = 0; // Number of elements in the stack
  }

  /**
   * Adds an element to the top of the stack.
   * @param {*} value - The value to be added
   * @returns {number} The new size of the stack
   */
  push(value) {
    const node = new Node(value);

    // If stack is empty, set both top and bottom to the new node
    if (!this.top) {
      this.top = node;
      this.bottom = node;
    } else {
      // Link the new node to the current top and update top
      const temp = this.top;
      this.top = node;
      this.top.next = temp;
    }

    return this.size++;
  }

  /**
   * Removes and returns the element from the top of the stack.
   * @returns {*|null} The value of the removed node, or null if stack is empty
   */
  pop() {
    if (!this.top) return null;

    let temp_node = this.top;

    // If there's only one element, clear the bottom reference
    if (this.top === this.bottom) this.bottom = null;

    // Move top pointer to the next node
    this.top = this.top.next;
    this.size--;

    return temp_node.value;
  }
}

// Example usage of Stack
const stck = new Stack();

stck.push("value1");
stck.push("value2");
stck.push("value3");

console.log(stck.top);
console.log(stck.bottom);
console.log(stck.size);

stck.push("value4");
console.log(stck.pop());
console.log(stck.pop());
