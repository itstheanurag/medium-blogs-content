class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  // The push method takes a value as parameter and assigns it as the tail of the list
  push(value) {
    const node = new Node(value);
    if (!this.head) {
      this.head = node;
      this.tail = this.head;
    } else {
      this.tail.next = node;
      this.tail = node;
    }

    this.length++;
    return this;
  }

  pop() {
    // no head found meaning it's an empty linkedlist
    if (!this.head) return null;
    let current_node = this.head;
    let new_tail = current_node;

    while (current_node.next) {
      new_tail = current_node;
      current_node = current_node.next;
    }

    this.tail = new_tail;
    this.tail.next = null;
    this.length--;

    if (!this.length) {
      this.#empty_list();
    }

    return current_node;
  }

  // The shift method removes the head of the list

  shift() {
    if (!this.head) return null;
    let current = this.head;
    this.head = current.next;
    this.length--;
    if (!this.length) {
      this.#empty_list();
    }
    return current.value;
  }

  // The unshift method takes a value as parameter and assigns it as the head of the list
  unshift(value) {
    const node = new Node(value);
    if (!this.head) {
      this.head = node;
      this.tail = node;
    }

    node.next = this.head;
    this.head = node;
    this.length++;
    return this;
  }

  // The get method takes an index number as parameter and
  // returns the value of the node at that index
  get(index) {
    if (index < 0 || index > this.length) return null;

    let counter = 0;
    let current = this.head;
    while (counter != index) {
      current = current.next;
      counter++;
    }

    return current;
  }

  // The set method takes an index number and a value as parameters,
  // and modifies the node value at the given index in the list
  set(index, value) {
    const node = this.get(index);
    if (node) {
      node.value = value;
      return true;
    }
    return false;
  }

  // The insert method takes an index number and a value as parameters,
  // and inserts the value at the given index in the list
  insert(index, value) {
    if (index < 0 || index > this.length) return false;
    if (index === this.length) return !!this.push(val);
    if (index === 0) return !!this.unshift(val);

    const node = new Node(value);
    const prev = this.get(index - 1);
    const temp = prev.next;

    prev.next = node;
    node.next = temp;
    this.length++;
    return true;
  }

  remove(index) {
    if (index < 0 || index > this.length) return null;
    if (index == 0) this.shift();
    if (index == this.length) this.pop();

    // to remove we basically have to update the previous node next refrence to removed node's next

    const previous_node = this.get(index - 1);
    const removed = previous_node.next;
    previous_node.next = removed.next;
    this.length--;
    if (!this.length) {
      this.#empty_list();
    }
    return removed;
  }

  reverse() {
    let node = this.head;
    this.head = this.tail;
    this.tail = node;

    let next;
    let previous = null;

    for (let i = 0; i < this.length; i++) {
      next = node.next;
      node.next = previous;
      previous = node;
      node = next;
    }

    return this;
  }

  print() {
    let list = "";
    let current = this.head;

    while (current.next) {
      list += `value:${current.value}|next->`;
      current = current.next;
    }

    list += `value:${current.value}|next->null`;

    return list;
  }

  #empty_list() {
    this.head = null;
    this.tail = null;
  }
}

const list = new LinkedList();

// Add values
list.push(10);
list.push(20);
list.push(30);
list.push(40);

console.log("After push:");
console.log(list.print());

// Remove last
console.log("REMOVING THE LAST");
console.log("Pop:", list.pop().value);
console.log(list.print());

// Remove first
console.log("REMOVING THE FIRST");
console.log("Shift:", list.shift());
console.log(list.print());

// Add at beginning
console.log("ADDING AT THE BEGINNING");
list.unshift(5);
console.log("After unshift:");
console.log(list.print());

// Insert in middle
console.log("INSERITNG AT AN INDEX");
list.insert(1, 15);
console.log("After insert at index 1:");
console.log(list.print());

// Get value
console.log("FETCHING VALUE FROM AN INDEX");
console.log("Get index 2:", list.get(2)?.value);

// Set value
console.log("SETITNG A VALUE AT AN INDEX");
list.set(2, 99);
console.log("After set index 2 to 99:");
console.log(list.print());

// Remove from middle
console.log("REMOVING ELEMENT FROM AN INDEX");
console.log("Remove index 1:", list.remove(1)?.value);
console.log(list.print());

// Reverse list
console.log("REVERSING THE LINKEDLIST");
console.log("BEFORE REVERSE : ", list.print());
list.reverse();
console.log("After reverse:", list.print());
