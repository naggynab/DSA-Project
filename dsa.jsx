import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Plus, Zap, Info } from 'lucide-react';

// B-Tree Node Class
class BTreeNode {
  constructor(t, leaf = false) {
    this.keys = [];
    this.child = [];
    this.leaf = leaf;
    this.t = t;
  }
}

// B-Tree Class
class BTree {
  constructor(t) {
    this.root = new BTreeNode(t, true);
    this.t = t;
  }

  insert(k) {
    const r = this.root;
    if (r.keys.length === (2 * this.t - 1)) {
      const s = new BTreeNode(this.t);
      s.child.push(r);
      s.leaf = false;
      this._split(s, 0);
      this.root = s;
      this._insertNonFull(s, k);
    } else {
      this._insertNonFull(r, k);
    }
  }

  _insertNonFull(x, k) {
    let i = x.keys.length - 1;
    if (x.leaf) {
      x.keys.push(null);
      while (i >= 0 && k < x.keys[i]) {
        x.keys[i + 1] = x.keys[i];
        i--;
      }
      x.keys[i + 1] = k;
    } else {
      while (i >= 0 && k < x.keys[i]) {
        i--;
      }
      i++;
      if (x.child[i].keys.length === (2 * this.t - 1)) {
        this._split(x, i);
        if (k > x.keys[i]) {
          i++;
        }
      }
      this._insertNonFull(x.child[i], k);
    }
  }

  _split(x, i) {
    const t = this.t;
    const y = x.child[i];
    const z = new BTreeNode(t, y.leaf);
    x.child.splice(i + 1, 0, z);
    x.keys.splice(i, 0, y.keys[t - 1]);
    z.keys = y.keys.slice(t, 2 * t - 1);
    y.keys = y.keys.slice(0, t - 1);
    if (!y.leaf) {
      z.child = y.child.slice(t, 2 * t);
      y.child = y.child.slice(0, t);
    }
  }
}

// Tree Node Component
const TreeNode = ({ node, x, y, onLayout }) => {
  const keyWidth = 50;
  const keyHeight = 40;
  const totalWidth = node.keys.length * keyWidth;

  useEffect(() => {
    if (onLayout) {
      onLayout({ x, y, width: totalWidth });
    }
  }, [x, y, totalWidth, onLayout]);

  return (
    <g className="tree-node">
      {node.keys.map((key, idx) => (
        <g key={idx} className="animate-fadeIn">
          <rect
            x={x - totalWidth / 2 + idx * keyWidth}
            y={y - keyHeight / 2}
            width={keyWidth}
            height={keyHeight}
            fill="#4ade80"
            stroke="#16a34a"
            strokeWidth="2"
            rx="4"
            className="transition-all duration-300 hover:fill-green-400"
          />
          <text
            x={x - totalWidth / 2 + idx * keyWidth + keyWidth / 2}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="font-bold text-lg fill-gray-800 select-none"
          >
            {key}
          </text>
        </g>
      ))}
    </g>
  );
};

// Recursive Tree Renderer
const TreeRenderer = ({ node, x, y, level, levelGap, scale, parentX, parentY }) => {
  const [childPositions, setChildPositions] = useState([]);

  const getWidth = (n) => {
    if (n.leaf) return n.keys.length * 50;
    return n.child.reduce((sum, c) => sum + getWidth(c), 0);
  };

  useEffect(() => {
    if (!node.leaf && node.child.length > 0) {
      const widths = node.child.map(c => getWidth(c));
      const totalWidth = widths.reduce((a, b) => a + b, 0);
      let currentX = x - (totalWidth * scale) / 2;
      
      const positions = widths.map(w => {
        const childX = currentX + (w * scale) / 2;
        currentX += w * scale;
        return childX;
      });
      
      setChildPositions(positions);
    }
  }, [node, x, scale]);

  return (
    <g>
      {parentX !== undefined && parentY !== undefined && (
        <line
          x1={parentX}
          y1={parentY + 20}
          x2={x}
          y2={y - 20}
          stroke="#94a3b8"
          strokeWidth="2"
          className="animate-fadeIn"
        />
      )}
      
      <TreeNode node={node} x={x} y={y} />
      
      {!node.leaf && childPositions.map((childX, idx) => (
        <TreeRenderer
          key={idx}
          node={node.child[idx]}
          x={childX}
          y={y + levelGap}
          level={level + 1}
          levelGap={levelGap}
          scale={scale}
          parentX={x}
          parentY={y}
        />
      ))}
    </g>
  );
};

// Main App Component
export default function BTreeVisualizer() {
  const [t, setT] = useState(3);
  const [tree, setTree] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [bulkInput, setBulkInput] = useState('');
  const [insertedKeys, setInsertedKeys] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setTree(new BTree(t));
    setInsertedKeys([]);
  }, [t]);

  const handleInsert = (key) => {
    if (tree && key !== '' && !isNaN(key)) {
      setAnimating(true);
      const numKey = parseInt(key);
      tree.insert(numKey);
      setInsertedKeys([...insertedKeys, numKey]);
      setTree(new BTree(t));
      const newTree = new BTree(t);
      [...insertedKeys, numKey].forEach(k => newTree.insert(k));
      setTree(newTree);
      setInputValue('');
      setTimeout(() => setAnimating(false), 300);
    }
  };

  const handleBulkInsert = () => {
    if (bulkInput.trim()) {
      setAnimating(true);
      const keys = bulkInput.split(',').map(k => parseInt(k.trim())).filter(k => !isNaN(k));
      const newTree = new BTree(t);
      keys.forEach(k => newTree.insert(k));
      setTree(newTree);
      setInsertedKeys(keys);
      setBulkInput('');
      setTimeout(() => setAnimating(false), 300);
    }
  };

  const handleReset = () => {
    setTree(new BTree(t));
    setInsertedKeys([]);
    setInputValue('');
    setBulkInput('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
      
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            B-Tree Visualizer
          </h1>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Info className="w-6 h-6" />
          </button>
        </div>

        {/* Info Panel */}
        {showInfo && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-6 animate-fadeIn">
            <h3 className="text-xl font-semibold mb-3 text-green-400">About B-Trees</h3>
            <p className="text-slate-300 mb-3">
              A B-Tree is a self-balancing tree data structure that maintains sorted data and allows searches, insertions, and deletions in logarithmic time.
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-1">
              <li><strong>Minimum Degree (t):</strong> Each node has at least t-1 keys (except root)</li>
              <li><strong>Maximum Keys:</strong> Each node has at most 2t-1 keys</li>
              <li><strong>Balanced:</strong> All leaf nodes are at the same level</li>
            </ul>
          </div>
        )}

        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Left Panel */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-green-400">Configuration</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-slate-300">
                Minimum Degree (t): <span className="text-green-400 text-lg font-bold">{t}</span>
              </label>
              <input
                type="range"
                min="2"
                max="5"
                value={t}
                onChange={(e) => setT(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-slate-300">Insert Single Key</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleInsert(inputValue)}
                  placeholder="Enter a number"
                  className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                />
                <button
                  onClick={() => handleInsert(inputValue)}
                  disabled={animating}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Insert
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Bulk Insert (comma-separated)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleBulkInsert()}
                  placeholder="e.g., 10, 20, 30, 40"
                  className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                />
                <button
                  onClick={handleBulkInsert}
                  disabled={animating}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  Bulk
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-green-400">Quick Actions</h2>
            
            <button
              onClick={handleReset}
              className="w-full mb-4 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <RotateCcw className="w-5 h-5" />
              Reset Tree
            </button>

            <div className="bg-slate-700 rounded-lg p-4">
              <h3 className="text-sm font-medium mb-2 text-slate-300">Inserted Keys:</h3>
              <div className="flex flex-wrap gap-2">
                {insertedKeys.length === 0 ? (
                  <span className="text-slate-400 text-sm">No keys inserted yet</span>
                ) : (
                  insertedKeys.map((key, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-green-600 rounded-full text-sm font-medium"
                    >
                      {key}
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className="mt-4 bg-slate-700 rounded-lg p-4">
              <h3 className="text-sm font-medium mb-2 text-slate-300">Tree Properties:</h3>
              <div className="space-y-1 text-sm">
                <p><span className="text-slate-400">Min degree (t):</span> <span className="text-green-400 font-bold">{t}</span></p>
                <p><span className="text-slate-400">Min keys per node:</span> <span className="text-green-400 font-bold">{t - 1}</span></p>
                <p><span className="text-slate-400">Max keys per node:</span> <span className="text-green-400 font-bold">{2 * t - 1}</span></p>
                <p><span className="text-slate-400">Total keys:</span> <span className="text-green-400 font-bold">{insertedKeys.length}</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Visualization */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
          <h2 className="text-xl font-semibold mb-4 text-green-400">Tree Structure</h2>
          <div className="bg-slate-900 rounded-lg p-8 overflow-auto">
            {tree && tree.root.keys.length > 0 ? (
              <svg width="100%" height="500" className="mx-auto">
                <TreeRenderer
                  node={tree.root}
                  x={window.innerWidth / 2 - 100}
                  y={50}
                  level={0}
                  levelGap={100}
                  scale={1.5}
                />
              </svg>
            ) : (
              <div className="text-center py-20 text-slate-400">
                <p className="text-lg mb-2">No keys in the tree yet</p>
                <p className="text-sm">Insert some numbers to see the B-Tree visualization</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}