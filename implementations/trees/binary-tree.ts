class TreeNode<T> {
  value: T;
  left: TreeNode<T> | null;
  right: TreeNode<T> | null;

  constructor(value: T) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinaryTree<T> {
  root: TreeNode<T> | null;

  constructor() {
    this.root = null;
  }

  insert(value: T) {
    const newNode = new TreeNode(value);

    if (!this.root) {
      this.root = newNode;
      return;
    }

    // bfs based insertion
    const queue = [this.root];

    while (queue.length) {
      const current = queue.shift()!;

      if (!current.left) {
        current.left = newNode;
        return;
      } else {
        queue.push(current.left);
      }

      if (!current.right) {
        current.right = newNode;
        return;
      } else {
        queue.push(current.right);
      }
    }
  }

  dfs_recursive(root: TreeNode<T> | null, result: T[] = []): T[] {
    if (!root) return result;

    result.push(root.value);

    this.dfs_recursive(root.left, result);
    this.dfs_recursive(root.right, result);

    return result;
  }

  dfs(root: TreeNode<T> | null): T[] {
    if (!root) return [];
    const values = [];

    const stack = [root];

    while (stack.length) {
      const current = stack.pop()!;
      values.push(current.value);
      if (current.right) stack.push(current.right);
      if (current.left) stack.push(current.left);
    }

    return values;
  }

  bfs(root: TreeNode<T> | null) {
    if (!root) return [];
    const values = [];
    const queue = [root];

    while (queue.length) {
      const current = queue.shift()!;

      values.push(current.value);
      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
    }

    return values;
  }
}

const tree = new BinaryTree<number>();

tree.insert(1);
tree.insert(2);
tree.insert(3);
tree.insert(4);
tree.insert(5);
console.log(tree.dfs(tree.root));
console.log(tree.bfs(tree.root));

const tree2 = new BinaryTree<string>();

tree2.insert("a");
tree2.insert("b");
tree2.insert("c");
tree2.insert("d");
tree2.insert("e");
tree2.insert("f");

console.log(tree2.dfs(tree2.root));
console.log(tree2.bfs(tree2.root));
