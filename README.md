# DSA Project
## B-Tree Insertion and Visualization

A Python project that demonstrates B-Tree insertion with real-time visualization of node splits and key organization. It helps users understand how B-Trees maintain balance and efficient search operations — an essential concept in database indexing and file systems.

Features:

- Step-by-step visualization of B-Tree insertions

- Dynamic node splitting and balancing

- Interactive and educational tool for DSA learning

# 🧩 B-Tree Insertion & Visualization (DSA Project)
## 📖 Project Overview

This project visualizes the insertion process in a ** B-Tree ** — a balanced tree data structure used in databases and file systems.
It demonstrates how nodes split dynamically to maintain balance as elements are inserted.
Developed as part of the Data Structures and Algorithms (DSA) project.

## ⚙️ Project Setup Guide

This guide explains how to clone the repository, set up dependencies, and run the visualization on Linux and Windows.

🔽 Clone the Repository

'''
git clone https://github.com/yourusername/b-tree-visualization.git
cd b-tree-visualization
'''

🐧 Linux Setup
  1️⃣ Install Dependencies
  '''
  sudo apt update
  sudo apt install python3 python3-pip -y
  pip install -r requirements.txt
  '''

2️⃣ Run the Project
  '''
  python3 btree_visualization.py
  '''

🪟 Windows Setup
  1️⃣ Install Dependencies
  
  '''
  Install Python 3.13.8
  .
  
  Open Command Prompt and install the required packages:
  
  pip install -r requirements.txt
  '''
  2️⃣ Run the Project
 '''
  python btree_visualization.py
  '''


🧠 Notes

- Ensure matplotlib is installed properly.

- Run the script in a Python environment (like VS Code or PyCharm).

- If you encounter display issues, update your Python graphics backend or use %matplotlib inline in notebooks.

💡 Example Output

Shows a graphical visualization of B-Tree node insertions — keys appear inside boxes, and splitting is shown dynamically.
