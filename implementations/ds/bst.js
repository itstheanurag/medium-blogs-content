class Node {
  constructor(value) {
    this.value = value;
    this.right = null;
    this.left = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }
  // adds a value to BST
  insert(value) {
    const node = new Node(value);
    if (!this.root) {
      this.root = node;
      return this;
    }
    let current = this.root;
    while (true) {
      if (value == current.value) return undefined;
      if (value < current.value) {
        if (!current.left) {
          current.left = node;
          return this;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = node;
          return this;
        }
        current = current.right;
      }
    }
  }
  // returns the node;
  find(value) {
    if (!this.root) return null;
    return this.#findNode(value, this.root);
  }
  // returns true or false
  contains(value) {
    if (!this.root) return false;
    return !!this.#findNode(value, this.root);
  }

  #findNode(value, root) {
    let current = root;

    while (current) {
      if (value < current.value) {
        current = current.left;
      } else if (value > current.value) {
        current = current.right;
      } else {
        return current;
      }
    }

    return null;
  }
}

const bst = new BinarySearchTree();

// Insert values
console.log("Inserting values...");
bst.insert(10);
bst.insert(5);
bst.insert(15);
bst.insert(3);
bst.insert(7);
bst.insert(12);
bst.insert(18);

console.log("BST after inserts:", JSON.stringify(bst, null, 2));
console.log("Insert duplicate (10):", bst.insert(10)); // should be undefined

// Find values
console.log("\nFinding values...");
console.log("Find 7:", bst.find(7)); // should return node
console.log("Find 20:", bst.find(20)); // should be undefined

// Contains
console.log("\nChecking contains...");
console.log("Contains 15:", bst.contains(15)); // true
console.log("Contains 100:", bst.contains(100)); // false

// Inspect structure
console.log("\nRoot:", bst.root);
console.log("Left subtree:", bst.root.left);
console.log("Right subtree:", bst.root.right);
