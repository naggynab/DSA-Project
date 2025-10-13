import matplotlib.pyplot as plt
import matplotlib.patches as patches

# ----------------- B-TREE NODE -----------------
class BTreeNode:
    def __init__(self, t, leaf=False):
        self.keys = []
        self.child = []
        self.leaf = leaf
        self.t = t

# ----------------- B-TREE STRUCTURE -----------------
class BTree:
    def __init__(self, t):
        self.root = BTreeNode(t, True)
        self.t = t

    def insert(self, k):
        r = self.root
        if len(r.keys) == (2 * self.t - 1):
            s = BTreeNode(self.t)
            s.child.insert(0, r)
            s.leaf = False
            self._split(s, 0)
            self.root = s
            self._insert_non_full(s, k)
        else:
            self._insert_non_full(r, k)

    def _insert_non_full(self, x, k):
        i = len(x.keys) - 1
        if x.leaf:
            x.keys.append(None)
            while i >= 0 and k < x.keys[i]:
                x.keys[i + 1] = x.keys[i]
                i -= 1
            x.keys[i + 1] = k
        else:
            while i >= 0 and k < x.keys[i]:
                i -= 1
            i += 1
            if len(x.child[i].keys) == (2 * self.t - 1):
                self._split(x, i)
                if k > x.keys[i]:
                    i += 1
            self._insert_non_full(x.child[i], k)

    def _split(self, x, i):
        t = self.t
        y = x.child[i]
        z = BTreeNode(t, y.leaf)
        x.child.insert(i + 1, z)
        x.keys.insert(i, y.keys[t - 1])
        z.keys = y.keys[t:(2 * t - 1)]
        y.keys = y.keys[0:t - 1]
        if not y.leaf:
            z.child = y.child[t:(2 * t)]
            y.child = y.child[0:t - 1]

# ----------------- VISUALIZATION HELPERS -----------------
def get_width(node):
    """Return width proportional to number of keys and children."""
    base_width = 1.5  # constant space per key
    if node.leaf:
        return len(node.keys) * base_width
    return sum(get_width(c) for c in node.child)

def get_height(node):
    if node.leaf:
        return 1
    return 1 + max(get_height(c) for c in node.child)

def draw_node(ax, node, x, y, level_gap, scale):
    key_width = 0.8   # Fixed width for each key box
    node_height = 0.6
    node_width = key_width * max(1, len(node.keys))

    left = x - node_width / 2
    cur_x = left

    # Draw compartments (fixed size)
    for key in node.keys:
        rect = patches.Rectangle(
            (cur_x, y - node_height / 2),
            key_width, node_height,
            linewidth=1.5, edgecolor='black', facecolor='#A8E6A3'
        )
        ax.add_patch(rect)
        ax.text(cur_x + key_width / 2, y, str(key),
                ha='center', va='center', fontsize=10, fontweight='bold')
        cur_x += key_width

    # Draw children recursively
    if not node.leaf:
        child_y = y - level_gap
        widths = [get_width(c) for c in node.child]
        total_width = sum(widths)
        cur_x = x - total_width / 2 * scale

        for c in node.child:
            w = get_width(c)
            child_x = cur_x + w / 2 * scale
            ax.plot([x, child_x], [y - node_height / 2, child_y + node_height / 2],
                    color='gray', linewidth=1)
            draw_node(ax, c, child_x, child_y, level_gap, scale)
            cur_x += w * scale

def plot_btree(tree, live=False, ax=None):
    height = get_height(tree.root)
    width = get_width(tree.root)
    level_gap = 2.0
    scale = 2.0

    if not live:
        fig, ax = plt.subplots(figsize=(max(10, width * 1.2), max(6, height * 2)))

    ax.clear()
    ax.set_aspect('equal')
    ax.axis('off')

    draw_node(ax, tree.root, 0, 0, level_gap, scale)
    ax.set_title("B-Tree Visualization", fontsize=14, fontweight='bold')

    ax.set_xlim(-width * scale / 1.5, width * scale / 1.5)
    ax.set_ylim(-height * level_gap, 2)

    if live:
        plt.draw()
        plt.pause(0.8)
    else:
        plt.show()

# ----------------- MAIN FUNCTION -----------------
def main():
    print("****************** B-Tree Insertion & Visualization ******************")
    t = int(input("Enter minimum degree (t): "))
    bt = BTree(t)

    print("\nChoose insertion mode:")
    print("1. Insert all numbers at once")
    print("2. Insert one by one (visualize step-by-step)")
    choice = input("Enter choice (1 or 2): ").strip()

    if choice == "1":
        nums = input("\nEnter numbers to insert (comma separated): ").strip().split(',')
        for n in nums:
            bt.insert(int(n.strip()))
        plot_btree(bt)

    elif choice == "2":
        plt.ion()
        fig, ax = plt.subplots(figsize=(10, 6))
        while True:
            key = input("Enter key to insert (or 'q' to quit): ").strip()
            if key.lower() == 'q':
                break
            if key.isdigit():
                bt.insert(int(key))
                plot_btree(bt, live=True, ax=ax)
            else:
                print("Please enter a valid number.")
        plt.ioff()
        plt.show()
    else:
        print("Invalid choice. Please restart and enter 1 or 2.")

if __name__ == "__main__":
    main()
