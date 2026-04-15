import { useState, useCallback } from "react";
import { ChatMessage, ChatSession } from "@/types";
import { generateId } from "@/lib/utils";

const STORAGE_KEY = "aliencode_pitimes_history";

function loadHistory(): ChatSession[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    const sessions = JSON.parse(saved);
    return sessions.map((s: ChatSession) => ({
      ...s,
      createdAt: new Date(s.createdAt),
      updatedAt: new Date(s.updatedAt),
      messages: s.messages.map((m: ChatMessage) => ({ ...m, timestamp: new Date(m.timestamp) })),
    }));
  } catch {
    return [];
  }
}

function saveHistory(sessions: ChatSession[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

// Comprehensive intelligent response engine
function generateResponse(input: string): string {
  const q = input.toLowerCase().trim();

  // ─── Greetings ───
  if (/^(hi|hello|hey|greetings|sup|yo|howdy|hiya)[\s!?.]*$/.test(q)) {
    return `Greetings, explorer! I am **ΠTimes** — your hyper-intelligent AI companion.\n\nI can:\n- 💻 **Write & debug code** in any language\n- 🧠 **Explain any concept** from basics to advanced\n- 📐 **Create ASCII diagrams** for visual learning\n- 🔬 **Answer questions** across all fields — not just coding!\n- 🌌 **Discuss** science, math, history, philosophy, and more\n\nWhat would you like to explore today?`;
  }

  // ─── What can you do ───
  if (q.includes("what can you do") || q.includes("capabilities") || q.includes("what are you") || q.includes("who are you") || q.includes("help me")) {
    return `## I am ΠTimes — Supreme AI Intelligence\n\n### 💻 Code & Programming\n- Write full programs in Python, JavaScript, C, HTML, CSS, TypeScript, Go, Rust, Java, C++, SQL, and more\n- Debug errors and explain exactly what went wrong\n- Code review, optimization, design patterns\n- Build algorithms and data structures\n\n### 🧠 Concepts & Teaching\n- Explain any topic from first principles\n- Create visual diagrams and flowcharts\n- Step-by-step tutorials with examples\n- Analogies to make complex things simple\n\n### 🌌 All Knowledge Domains\n- Mathematics — algebra, calculus, statistics, discrete math\n- Sciences — physics, chemistry, biology, astronomy\n- Engineering, architecture, electronics\n- History, philosophy, literature, arts\n- Business, psychology, economics\n\n### 🎨 Creative Assistance\n- Write essays, stories, scripts\n- Generate ideas and brainstorm\n- Design solutions to any problem\n\nAsk me literally anything. I don't have off-topic subjects.`;
  }

  // ─── Variables ───
  if ((q.includes("what is") || q.includes("explain")) && q.includes("variable")) {
    return `## Variables — The Foundation of Programming\n\nA variable is a **named container** that stores a value in memory.\n\n### Python:\n\`\`\`python\nname = "Alice"        # String\nage = 25              # Integer\nheight = 5.9          # Float\nis_coder = True       # Boolean\ncodes = ["Python", "JS"]  # List\n\nprint(f"Name: {name}, Age: {age}")  # Name: Alice, Age: 25\n\`\`\`\n\n### JavaScript:\n\`\`\`javascript\nlet name = "Alice";       // Can be reassigned\nconst age = 25;           // Cannot be reassigned\nvar old = "avoid this";   // Old style (avoid)\n\nconsole.log(\`Name: \${name}\`);\n\`\`\`\n\n### C:\n\`\`\`c\nint age = 25;\nfloat height = 5.9;\nchar grade = 'A';\nchar name[] = "Alice";\n\nprintf("Name: %s, Age: %d\\n", name, age);\n\`\`\`\n\n### Memory Visualization:\n\`\`\`\nMemory Address | Variable | Value\n0x1000         | age      | 25\n0x1004         | height   | 5.9\n0x1008         | name     | "Alice"\n\`\`\`\n\n**Key Rule:** Variables have a **name** (label), **type** (kind of data), and **value** (actual data).`;
  }

  // ─── Recursion ───
  if (q.includes("recursion") || (q.includes("recursive") && q.includes("function"))) {
    return `## Recursion — Complete Guide\n\nRecursion is when a **function calls itself** to solve a smaller version of the same problem.\n\n### The 2 Rules:\n1. **Base case** — stops the recursion (no more self-calls)\n2. **Recursive case** — calls itself with simpler input\n\n### Factorial Example:\n\`\`\`python\ndef factorial(n):\n    if n <= 1:           # Base case\n        return 1\n    return n * factorial(n - 1)  # Recursive case\n\n# Call trace for factorial(4):\n# factorial(4) = 4 × factorial(3)\n#              = 4 × 3 × factorial(2)\n#              = 4 × 3 × 2 × factorial(1)\n#              = 4 × 3 × 2 × 1 = 24\nprint(factorial(4))  # 24\n\`\`\`\n\n### Call Stack Visualization:\n\`\`\`\n┌─────────────────┐\n│ factorial(4)    │  ← currently running\n│  └ factorial(3) │\n│     └ factorial(2)│\n│        └ factorial(1) → returns 1\n│       returns 2×1 = 2\n│    returns 3×2 = 6\n│ returns 4×6 = 24\n└─────────────────┘\n\`\`\`\n\n### Fibonacci:\n\`\`\`python\ndef fib(n):\n    if n <= 1: return n           # Base case\n    return fib(n-1) + fib(n-2)   # Two recursive calls\n\nprint([fib(i) for i in range(8)])  # [0,1,1,2,3,5,8,13]\n\`\`\`\n\n### When to Use Recursion:\n- Tree/graph traversal\n- Divide-and-conquer algorithms\n- Problems that are naturally self-similar (fractals, parsing)\n\n**Warning:** Always have a base case or you'll get infinite recursion (stack overflow)!`;
  }

  // ─── Pointers ───
  if (q.includes("pointer") && (q.includes("c") || q.includes("what") || q.includes("explain"))) {
    return `## Pointers in C — Deep Dive\n\nA pointer is a variable that **stores a memory address** instead of a direct value.\n\n### Basic Syntax:\n\`\`\`c\nint x = 42;\nint *ptr = &x;   // ptr holds the ADDRESS of x\n\nprintf("Value of x:   %d\\n", x);      // 42\nprintf("Address of x: %p\\n", &x);     // 0x7ffd...\nprintf("ptr holds:    %p\\n", ptr);    // same address\nprintf("*ptr value:   %d\\n", *ptr);   // 42 (dereference)\n\n*ptr = 100;  // Modify x through pointer!\nprintf("x is now: %d\\n", x);  // 100\n\`\`\`\n\n### Memory Diagram:\n\`\`\`\n  Address    Variable    Value\n ┌──────────────────────────┐\n │ 0x1000  │  x   │  42   │\n │ 0x1004  │ ptr  │ 0x1000│  ← stores address of x\n └──────────────────────────┘\n   ptr → 0x1000 → 42\n\`\`\`\n\n### Pointer to Pointer:\n\`\`\`c\nint x = 5;\nint *p = &x;\nint **pp = &p;  // pointer to pointer\n\nprintf("%d\\n", **pp);  // 5\n\`\`\`\n\n### Pointers and Arrays:\n\`\`\`c\nint arr[] = {10, 20, 30};\nint *p = arr;  // array name IS a pointer\n\nprintf("%d\\n", *p);      // 10\nprintf("%d\\n", *(p+1));  // 20\nprintf("%d\\n", *(p+2));  // 30\n\`\`\`\n\n### Why Pointers Matter:\n- Dynamic memory allocation (malloc/free)\n- Pass large data to functions without copying\n- Build linked lists, trees, graphs\n- Direct hardware/memory access`;
  }

  // ─── Big O ───
  if (q.includes("big o") || q.includes("time complexity") || q.includes("space complexity") || q.includes("o(n)") || q.includes("o(1)")) {
    return `## Big O Notation — Complete Guide\n\nBig O measures how an algorithm's **time or space grows** as input size grows.\n\n| Notation | Name | Example Algorithm |\n|----------|------|-------------------|\n| O(1) | Constant | Array access: arr[5] |\n| O(log n) | Logarithmic | Binary search |\n| O(n) | Linear | Loop through array |\n| O(n log n) | Linearithmic | Merge sort, Quicksort |\n| O(n²) | Quadratic | Nested loops, Bubble sort |\n| O(2ⁿ) | Exponential | Brute-force subsets |\n| O(n!) | Factorial | Permutations |\n\n### Growth Rate (n = 100):\n\`\`\`\nO(1)      →    1 operation\nO(log n)  →    7 operations\nO(n)      →  100 operations\nO(n²)     → 10,000 operations\nO(2ⁿ)     → 1,267,650,600,228,229,401,496,703,205,376\n\`\`\`\n\n### Code Analysis:\n\`\`\`python\n# O(1) — constant, no loop\ndef get_first(arr):\n    return arr[0]\n\n# O(n) — one loop\ndef find_max(arr):\n    max_val = arr[0]\n    for x in arr:      # runs n times\n        if x > max_val: max_val = x\n    return max_val\n\n# O(n²) — nested loops\ndef bubble_sort(arr):\n    for i in range(len(arr)):       # n\n        for j in range(len(arr)-1): # n\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n\n# O(log n) — halving the search space\ndef binary_search(arr, target):\n    left, right = 0, len(arr)-1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target: return mid\n        elif arr[mid] < target: left = mid + 1\n        else: right = mid - 1\n    return -1\n\`\`\`\n\n**Rule of thumb:** If you see a loop inside a loop = O(n²). One loop = O(n). Halving = O(log n).`;
  }

  // ─── Async/Await ───
  if (q.includes("async") || q.includes("await") || q.includes("promise") || q.includes("concurrent")) {
    return `## Async/Await — Complete Guide\n\n### The Problem: Blocking Code\n\`\`\`javascript\n// SYNCHRONOUS (blocking) — bad for slow operations\nconst data = fetchFromAPI();  // ← waits here doing nothing!\nconsole.log(data);\n\`\`\`\n\n### The Solution: Async/Await\n\`\`\`javascript\n// ASYNCHRONOUS — non-blocking\nasync function loadData() {\n    try {\n        const response = await fetch('https://api.example.com/data');\n        const data = await response.json();\n        console.log(data);\n    } catch (err) {\n        console.error('Failed:', err);\n    }\n}\n\n// Run multiple at once! (parallel)\nasync function loadAll() {\n    const [users, posts, comments] = await Promise.all([\n        fetch('/api/users').then(r => r.json()),\n        fetch('/api/posts').then(r => r.json()),\n        fetch('/api/comments').then(r => r.json()),\n    ]);\n    console.log(users, posts, comments);\n}\n\`\`\`\n\n### Python asyncio:\n\`\`\`python\nimport asyncio\n\nasync def fetch(name, delay):\n    print(f"{name} started")\n    await asyncio.sleep(delay)    # non-blocking\n    return f"{name} done"\n\nasync def main():\n    # Sequential: 3 seconds total\n    # r1 = await fetch("A", 1)\n    # r2 = await fetch("B", 2)\n\n    # Parallel: 2 seconds total!\n    r1, r2 = await asyncio.gather(\n        fetch("A", 1),\n        fetch("B", 2)\n    )\n    print(r1, r2)\n\nasyncio.run(main())\n\`\`\`\n\n### Timeline Visualization:\n\`\`\`\nSequential:  [──A──][────B────]  = 3s\nParallel:    [──A──]             = 2s\n             [────B────]\n\`\`\``;
  }

  // ─── OOP ───
  if (q.includes("oop") || q.includes("object oriented") || (q.includes("class") && q.includes("object"))) {
    return `## Object-Oriented Programming (OOP) — Complete Guide\n\nOOP organizes code around **objects** — bundles of data (attributes) and behavior (methods).\n\n### The 4 Pillars:\n\n**1. Encapsulation** — Hide internal details\n\`\`\`python\nclass BankAccount:\n    def __init__(self, owner, balance=0):\n        self.owner = owner\n        self.__balance = balance   # private!\n    \n    def deposit(self, amount):\n        if amount > 0:\n            self.__balance += amount\n            return True\n        return False\n    \n    def get_balance(self):\n        return self.__balance\n\naccount = BankAccount("Alice", 1000)\naccount.deposit(500)\nprint(account.get_balance())   # 1500\n# account.__balance  ← ERROR! Private attribute\n\`\`\`\n\n**2. Inheritance** — Reuse and extend\n\`\`\`python\nclass Animal:\n    def __init__(self, name):\n        self.name = name\n    def speak(self): return "..."\n\nclass Dog(Animal):\n    def speak(self): return f"{self.name} says Woof!"\n\nclass Cat(Animal):\n    def speak(self): return f"{self.name} says Meow!"\n\nanimals = [Dog("Rex"), Cat("Whiskers"), Dog("Buddy")]\nfor a in animals:\n    print(a.speak())  # Each animal speaks differently!\n\`\`\`\n\n**3. Polymorphism** — Same interface, different behavior (see above!)\n\n**4. Abstraction** — Expose what's needed, hide the rest\n\`\`\`python\nfrom abc import ABC, abstractmethod\n\nclass Shape(ABC):\n    @abstractmethod\n    def area(self) -> float: pass\n    @abstractmethod\n    def perimeter(self) -> float: pass\n\nclass Circle(Shape):\n    def __init__(self, r): self.r = r\n    def area(self): return 3.14159 * self.r ** 2\n    def perimeter(self): return 2 * 3.14159 * self.r\n\`\`\``;
  }

  // ─── HTML/CSS ───
  if ((q.includes("html") || q.includes("css")) && (q.includes("explain") || q.includes("what is") || q.includes("how"))) {
    return `## HTML & CSS — Web's Building Blocks\n\n### HTML = Structure (the skeleton)\n\`\`\`html\n<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <title>My Page</title>\n    <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n    <header>\n        <h1>Alien Code</h1>\n        <nav>\n            <a href="/">Home</a>\n            <a href="/courses">Courses</a>\n        </nav>\n    </header>\n    <main>\n        <article>\n            <h2>Learn Python</h2>\n            <p>Start your coding journey!</p>\n        </article>\n    </main>\n    <footer><p>© 2025 Alien Code</p></footer>\n</body>\n</html>\n\`\`\`\n\n### CSS = Style (the appearance)\n\`\`\`css\n/* Variables for consistency */\n:root {\n    --primary: #00fff7;\n    --bg: #000011;\n    --text: #e0e0e0;\n}\n\nbody {\n    background: var(--bg);\n    color: var(--text);\n    font-family: 'Exo 2', sans-serif;\n    margin: 0;\n    padding: 0;\n}\n\n/* Flexbox layout */\nnav {\n    display: flex;\n    gap: 1rem;\n    padding: 1rem;\n}\n\n/* Grid layout */\n.courses {\n    display: grid;\n    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));\n    gap: 1.5rem;\n}\n\n/* Animation */\n.glow {\n    animation: pulse 2s ease-in-out infinite;\n}\n\n@keyframes pulse {\n    0%, 100% { box-shadow: 0 0 10px var(--primary); }\n    50% { box-shadow: 0 0 30px var(--primary); }\n}\n\`\`\`\n\n**CSS Selectors Quick Reference:**\n- \`.class\` — selects by class\n- \`#id\` — selects by ID\n- \`element\` — selects all of that element\n- \`parent > child\` — direct children\n- \`a:hover\` — pseudo-class states`;
  }

  // ─── JavaScript basics ───
  if ((q.includes("javascript") || q.includes("js")) && (q.includes("explain") || q.includes("what is") || q.includes("teach"))) {
    return `## JavaScript — Complete Introduction\n\nJavaScript is the **only language that runs natively in browsers** — it makes websites interactive.\n\n### Core Concepts:\n\`\`\`javascript\n// 1. Variables\nlet name = "Alice";          // reassignable\nconst PI = 3.14159;          // constant\n\n// 2. Data Types\nconst num = 42;              // Number\nconst str = "Hello";        // String\nconst bool = true;          // Boolean\nconst arr = [1, 2, 3];     // Array\nconst obj = {key: "value"}; // Object\nconst nothing = null;       // Null\nlet undef;                  // Undefined\n\n// 3. Functions\nfunction greet(name) {\n    return \`Hello, \${name}!\`;\n}\n\n// Arrow function\nconst double = n => n * 2;\n\n// 4. Arrays\nconst nums = [1, 2, 3, 4, 5];\nconst doubled = nums.map(n => n * 2);     // [2,4,6,8,10]\nconst evens = nums.filter(n => n % 2 === 0); // [2,4]\nconst sum = nums.reduce((a, b) => a + b, 0); // 15\n\n// 5. Objects\nconst user = {\n    name: "Alice",\n    age: 25,\n    greet() { return \`Hi, I'm \${this.name}\`; }\n};\n\nconsole.log(user.greet());  // Hi, I'm Alice\n\n// 6. DOM Manipulation\ndocument.getElementById('btn').addEventListener('click', () => {\n    document.getElementById('output').textContent = 'Clicked!';\n});\n\`\`\`\n\n### Event Loop (How JS is Async):\n\`\`\`\nCall Stack → [synchronous code runs here]\nEvent Queue → [setTimeout, events wait here]\nMicrotask Queue → [Promises resolved here]\n\`\`\``;
  }

  // ─── Python basics ───
  if ((q.includes("python") && (q.includes("explain") || q.includes("what is") || q.includes("teach") || q.includes("learn") || q.includes("beginner")))) {
    return `## Python — Complete Introduction\n\nPython is the world's most popular language for beginners, data science, AI, and scripting.\n\n### Why Python?\n- **Readable** — almost like English\n- **Versatile** — web, AI, automation, science\n- **Huge ecosystem** — 400,000+ packages\n\n### Core Syntax:\n\`\`\`python\n# Variables (no type declaration needed)\nname = "Alice"\nage = 25\nprice = 9.99\nis_active = True\n\n# String formatting\nprint(f"Hello, {name}! You are {age} years old.")\n\n# Lists, Tuples, Dicts, Sets\nfruits = ["apple", "banana", "cherry"]  # mutable\ncoords = (10, 20)                        # immutable\nuser = {"name": "Alice", "age": 25}     # key-value\nunique = {1, 2, 3, 2, 1}               # {1, 2, 3}\n\n# Control Flow\nfor fruit in fruits:\n    if "a" in fruit:\n        print(f"{fruit} has an 'a'")\n\n# Functions\ndef calculate(x, y, operation="add"):\n    if operation == "add": return x + y\n    elif operation == "mul": return x * y\n    return None\n\nprint(calculate(3, 4))         # 7\nprint(calculate(3, 4, "mul"))  # 12\n\n# List comprehensions\nsquares = [x**2 for x in range(10) if x % 2 == 0]\nprint(squares)  # [0, 4, 16, 36, 64]\n\n# Classes\nclass Dog:\n    def __init__(self, name, breed):\n        self.name = name\n        self.breed = breed\n    \n    def bark(self):\n        return f"{self.name} says: Woof!"\n\nrex = Dog("Rex", "Husky")\nprint(rex.bark())  # Rex says: Woof!\n\`\`\``;
  }

  // ─── C language ───
  if (q.includes(" c ") || q.includes("c language") || q.includes("c programming") || (q.includes("c") && q.includes("explain"))) {
    return `## C Programming — Introduction\n\nC is the foundational systems language. Almost every operating system is written in C.\n\n### Basic Structure:\n\`\`\`c\n#include <stdio.h>   // Standard I/O\n#include <stdlib.h>  // malloc, free\n#include <string.h>  // string functions\n\nint main() {\n    // Variables must declare type\n    int age = 25;\n    float price = 9.99;\n    char name[] = "Alice";\n    char grade = 'A';\n    \n    printf("Name: %s, Age: %d, Price: %.2f\\n",\n           name, age, price);\n    \n    // Arrays\n    int scores[5] = {90, 85, 78, 92, 88};\n    \n    // Loop through array\n    int sum = 0;\n    for (int i = 0; i < 5; i++) {\n        sum += scores[i];\n    }\n    printf("Average: %.1f\\n", (float)sum / 5);\n    \n    // Pointers\n    int x = 42;\n    int *ptr = &x;    // Store address\n    *ptr = 100;       // Modify through pointer\n    printf("x = %d\\n", x);  // 100\n    \n    // Dynamic memory\n    int *arr = (int*)malloc(10 * sizeof(int));\n    if (arr == NULL) { printf("Memory error!\\n"); return 1; }\n    for (int i = 0; i < 10; i++) arr[i] = i * i;\n    free(arr);  // Always free!\n    \n    return 0;  // 0 = success\n}\n\`\`\`\n\n### Functions:\n\`\`\`c\n// Declare before use\nint add(int a, int b);\n\nint main() {\n    printf("%d\\n", add(3, 4));  // 7\n    return 0;\n}\n\nint add(int a, int b) {\n    return a + b;\n}\n\`\`\``;
  }

  // ─── Machine Learning / AI ───
  if (q.includes("machine learning") || q.includes("ml") || q.includes("neural network") || q.includes("deep learning") || q.includes("ai")) {
    return `## Machine Learning & AI — Complete Overview\n\n### What is ML?\nInstead of programming rules, you **show the computer examples** and it learns the rules itself.\n\n### Types of ML:\n\`\`\`\nSupervised Learning:   Input + Label → Learn → Predict\n  Examples: spam detection, image classification\n\nUnsupervised Learning: Input (no label) → Find patterns\n  Examples: customer segmentation, anomaly detection\n\nReinforcement Learning: Agent → Action → Reward → Learn\n  Examples: game AI, robotics\n\`\`\`\n\n### Neural Network Architecture:\n\`\`\`\nInput Layer    Hidden Layers    Output Layer\n  [x₁]  ──┐                      ┌──  [y₁]\n  [x₂]  ──┤── [neurons] ────────┤──  [y₂]\n  [x₃]  ──┘    with weights      └──  [y₃]\n\nEach neuron: output = activation(Σ(weight × input) + bias)\n\`\`\`\n\n### Python Code Example:\n\`\`\`python\nfrom sklearn.linear_model import LinearRegression\nimport numpy as np\n\n# Training data: hours studied vs grade\nX = np.array([[1],[2],[3],[4],[5],[6],[7],[8]])\ny = np.array([40, 50, 55, 65, 70, 78, 85, 92])\n\n# Train the model\nmodel = LinearRegression()\nmodel.fit(X, y)\n\n# Predict: 9 hours of study\nprediction = model.predict([[9]])\nprint(f"Predicted grade: {prediction[0]:.1f}")  # ~95\n\`\`\`\n\n### Popular Libraries:\n- **scikit-learn** — classical ML algorithms\n- **TensorFlow/Keras** — deep learning\n- **PyTorch** — research & production\n- **Hugging Face** — NLP & transformers\n- **OpenCV** — computer vision`;
  }

  // ─── Data Structures ───
  if (q.includes("data structure") || q.includes("linked list") || q.includes("stack") || q.includes("queue") || q.includes("binary tree") || q.includes("hash map") || q.includes("hash table")) {
    return `## Data Structures — Visual Guide\n\n### 1. Array / List — O(1) access, O(n) insert\n\`\`\`\n[10] [20] [30] [40] [50]\n  0    1    2    3    4\narr[2] = 30  (direct access!)\n\`\`\`\n\n### 2. Linked List — O(n) access, O(1) insert at head\n\`\`\`\n[10|→] → [20|→] → [30|→] → [40|null]\nhead                         tail\n\`\`\`\n\`\`\`python\nclass Node:\n    def __init__(self, val):\n        self.val = val\n        self.next = None\n\nclass LinkedList:\n    def __init__(self): self.head = None\n    \n    def append(self, val):\n        node = Node(val)\n        if not self.head: self.head = node; return\n        curr = self.head\n        while curr.next: curr = curr.next\n        curr.next = node\n\`\`\`\n\n### 3. Stack — LIFO (Last In, First Out)\n\`\`\`\nPUSH →  [5]  ← TOP\n        [3]\n        [8]\n        [1]  ← BOTTOM\nPOP  ← removes 5\n\`\`\`\n\n### 4. Queue — FIFO (First In, First Out)\n\`\`\`\nENQUEUE → [1][2][3][4] → DEQUEUE\n           back        front\n\`\`\`\n\n### 5. Binary Search Tree\n\`\`\`\n        [50]\n       /    \\\n    [30]    [70]\n    /  \\    /  \\\n  [20] [40][60] [80]\n\nLeft < Parent < Right (always!)\nSearch: O(log n) average\n\`\`\`\n\n### 6. Hash Map — O(1) average for get/set\n\`\`\`python\nhashmap = {}\nhashmap["name"] = "Alice"   # set\nvalue = hashmap["name"]     # get → "Alice"\n\`\`\``;
  }

  // ─── Algorithms / Sorting ───
  if (q.includes("sorting") || q.includes("bubble sort") || q.includes("merge sort") || q.includes("quick sort") || q.includes("algorithm")) {
    return `## Sorting Algorithms — Visual Guide\n\n### Bubble Sort — O(n²) — Simple but slow\n\`\`\`\nPass 1: [5,3,8,1] → [3,5,8,1] → [3,5,1,8]\nPass 2: [3,5,1,8] → [3,1,5,8]\nPass 3: [3,1,5,8] → [1,3,5,8] ✓\n\`\`\`\n\`\`\`python\ndef bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n    return arr\n\`\`\`\n\n### Merge Sort — O(n log n) — Divide & conquer\n\`\`\`\n[8,3,5,1,9,2]\n     /       \\\n [8,3,5]   [1,9,2]\n  /   \\     /   \\\n[8,3] [5] [1,9] [2]\n /  \\\n[8] [3]\n[3,8] → [3,5,8] | [1,2,9]\nMerge: [1,2,3,5,8,9]\n\`\`\`\n\`\`\`python\ndef merge_sort(arr):\n    if len(arr) <= 1: return arr\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    return merge(left, right)\n\ndef merge(left, right):\n    result = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]: result.append(left[i]); i += 1\n        else: result.append(right[j]); j += 1\n    return result + left[i:] + right[j:]\n\`\`\`\n\n### Complexity Comparison:\n| Algorithm | Best | Average | Worst | Space |\n|-----------|------|---------|-------|-------|\n| Bubble | O(n) | O(n²) | O(n²) | O(1) |\n| Merge | O(n log n) | O(n log n) | O(n log n) | O(n) |\n| Quick | O(n log n) | O(n log n) | O(n²) | O(log n) |`;
  }

  // ─── Functions ───
  if ((q.includes("function") || q.includes("def ") || q.includes("method")) && (q.includes("explain") || q.includes("what is") || q.includes("how"))) {
    return `## Functions — Building Blocks of Code\n\nFunctions are **reusable blocks of code** that perform a specific task.\n\n### Python Functions:\n\`\`\`python\n# Basic function\ndef greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("Alice"))  # Hello, Alice!\n\n# Default parameters\ndef power(base, exp=2):\n    return base ** exp\n\nprint(power(3))     # 9  (3²)\nprint(power(2, 10)) # 1024 (2¹⁰)\n\n# Multiple return values\ndef min_max(numbers):\n    return min(numbers), max(numbers)\n\nlo, hi = min_max([3, 1, 4, 1, 5, 9])\nprint(lo, hi)  # 1 9\n\n# *args and **kwargs\ndef sum_all(*args):\n    return sum(args)\n\ndef describe(**kwargs):\n    for k, v in kwargs.items():\n        print(f"{k}: {v}")\n\nsum_all(1, 2, 3, 4, 5)         # 15\ndescribe(name="Alice", age=25)  # name: Alice, age: 25\n\n# Lambda (anonymous function)\ndouble = lambda x: x * 2\nsorted_list = sorted([3,1,4], key=lambda x: -x)  # [4,3,1]\n\`\`\`\n\n### JavaScript Functions:\n\`\`\`javascript\n// Function declaration\nfunction add(a, b) { return a + b; }\n\n// Arrow function\nconst multiply = (a, b) => a * b;\n\n// Default parameters\nconst greet = (name = "World") => \`Hello, \${name}!\`;\n\n// Rest parameters\nconst sumAll = (...nums) => nums.reduce((a, b) => a + b, 0);\n\n// Higher-order function\nconst applyTwice = (fn, x) => fn(fn(x));\nconsole.log(applyTwice(x => x * 2, 3));  // 12\n\`\`\``;
  }

  // ─── Math questions ───
  if (q.includes("calculus") || q.includes("derivative") || q.includes("integral") || q.includes("differential")) {
    return `## Calculus — Core Concepts\n\n### Derivatives — Rate of Change\nThe derivative tells you **how fast** a function is changing.\n\n\`\`\`\nf(x) = x²\nf'(x) = 2x    ← derivative\n\nAt x=3: f'(3) = 6  → slope is 6 at this point\n\`\`\`\n\n### Common Derivative Rules:\n\`\`\`\nd/dx [xⁿ]  = n·xⁿ⁻¹    (power rule)\nd/dx [eˣ]  = eˣ          (e stays!)\nd/dx [sin x] = cos x\nd/dx [ln x] = 1/x\n\nChain rule: d/dx [f(g(x))] = f'(g(x)) · g'(x)\n\`\`\`\n\n### Integrals — Area Under Curve\n\`\`\`\n∫ x² dx = x³/3 + C\n∫₀² x² dx = [x³/3]₀² = 8/3 - 0 = 2.667\n\nThis is the area under y=x² from x=0 to x=2\n\`\`\`\n\n### Python Calculation:\n\`\`\`python\nimport sympy as sp\n\nx = sp.Symbol('x')\nf = x**2 + 3*x + 2\n\nderivative = sp.diff(f, x)\nprint("f'(x) =", derivative)   # 2x + 3\n\nintegral = sp.integrate(f, x)\nprint("∫f dx =", integral)     # x³/3 + 3x²/2 + 2x\n\nprint("∫₀¹ f dx =", sp.integrate(f, (x, 0, 1)))  # 17/6\n\`\`\``;
  }

  // ─── Physics ───
  if (q.includes("physics") || q.includes("newton") || q.includes("gravity") || q.includes("quantum") || q.includes("relativity")) {
    return `## Physics — Key Concepts\n\n### Newton's Laws of Motion:\n\`\`\`\n1st Law (Inertia):   An object at rest stays at rest\n                      unless acted on by a force.\n\n2nd Law (F=ma):      Force = Mass × Acceleration\n                      F (Newtons) = kg × m/s²\n\n3rd Law (Action-Reaction): For every action, there is\n                      an equal and opposite reaction.\n\`\`\`\n\n### Gravity:\n\`\`\`\nF = G × m₁ × m₂ / r²\n\nG = 6.674 × 10⁻¹¹ N·m²/kg²\nEarth surface: g = 9.81 m/s²\n\nFalling object (no air resistance):\nv = g × t        (velocity after t seconds)\nd = ½ × g × t²  (distance fallen)\n\`\`\`\n\n### Python Physics Simulation:\n\`\`\`python\nimport math\n\ng = 9.81  # m/s²\n\ndef projectile(v0, angle_deg, t):\n    angle = math.radians(angle_deg)\n    vx = v0 * math.cos(angle)\n    vy = v0 * math.sin(angle)\n    \n    x = vx * t\n    y = vy * t - 0.5 * g * t**2\n    return x, y\n\n# Ball thrown at 20 m/s, 45° angle\nfor t in [0, 0.5, 1.0, 1.5, 2.0]:\n    x, y = projectile(20, 45, t)\n    print(f"t={t}s: x={x:.1f}m, y={y:.1f}m")\n\`\`\`\n\n### Quantum Weirdness:\n- **Wave-particle duality** — Light is both wave AND particle\n- **Uncertainty principle** — Can't know position + momentum exactly\n- **Superposition** — Particle is in multiple states until observed\n- **Entanglement** — Two particles can be linked across any distance`;
  }

  // ─── History ───
  if (q.includes("history") || q.includes("world war") || q.includes("ancient") || q.includes("empire") || q.includes("civilization")) {
    return `## World History — Key Civilizations & Events\n\n### Ancient Civilizations (Timeline):\n\`\`\`\n3100 BCE  Egyptian civilization begins\n3000 BCE  Sumerian civilization (first writing!)\n2500 BCE  Indus Valley civilization\n1600 BCE  Chinese Shang dynasty\n800 BCE   Ancient Greece golden age begins\n753 BCE   Rome founded\n221 BCE   China unified under Qin dynasty\n27 BCE    Roman Empire begins\n\`\`\`\n\n### World War I (1914–1918):\n**Cause:** Assassination of Archduke Franz Ferdinand\n**Key Events:**\n- Trench warfare (Western Front)\n- Battle of Somme — 1 million casualties in 5 months\n- US joins 1917\n- Armistice: November 11, 1918\n**Result:** Treaty of Versailles → seeds of WWII\n\n### World War II (1939–1945):\n**Cause:** Hitler's Germany expands; invades Poland\n**Key Events:**\n- Battle of Britain (1940)\n- Pearl Harbor → US joins (1941)\n- D-Day invasion (June 6, 1944)\n- Holocaust — 6 million Jews murdered\n- Hiroshima & Nagasaki atomic bombs\n**Result:** UN founded; Cold War begins\n\n### Computer History:\n\`\`\`\n1936 — Turing invents theoretical computer\n1946 — ENIAC: first electronic computer\n1969 — ARPANET (internet precursor)\n1971 — Microprocessor invented\n1991 — World Wide Web born\n2007 — iPhone revolutionizes mobile\n2022 — ChatGPT: AI for everyone\n\`\`\``;
  }

  // ─── Science / Chemistry ───
  if (q.includes("chemistry") || q.includes("atom") || q.includes("molecule") || q.includes("periodic table") || q.includes("element")) {
    return `## Chemistry — Core Concepts\n\n### Atomic Structure:\n\`\`\`\n         Nucleus\n        ┌───────┐\nElectron│Protons│\norbit → │Neutrons│ ← determines element\n        └───────┘\n\nAtomic number = number of protons\nMass number = protons + neutrons\n\`\`\`\n\n### Periodic Table Groups:\n\`\`\`\nGroup 1  (Alkali metals):    H, Li, Na, K, Rb, Cs\nGroup 2  (Alkaline earth):   Be, Mg, Ca, Sr, Ba\nGroup 17 (Halogens):         F, Cl, Br, I\nGroup 18 (Noble gases):      He, Ne, Ar, Kr, Xe\nTransition metals:           Fe, Cu, Zn, Au, Ag\n\`\`\`\n\n### Chemical Bonding:\n- **Ionic** — metal gives electron to non-metal (NaCl)\n- **Covalent** — atoms share electrons (H₂O, CO₂)\n- **Metallic** — electrons float freely (copper wire)\n\n### Key Reactions:\n\`\`\`\nAcid + Base → Salt + Water (neutralization)\nHCl + NaOH → NaCl + H₂O\n\nOxidation (loses electrons): Fe → Fe²⁺ + 2e⁻\nReduction (gains electrons): Cu²⁺ + 2e⁻ → Cu\n\nPhotosynthesis:\n6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂\n\nCombustion:\nCH₄ + 2O₂ → CO₂ + 2H₂O + energy\n\`\`\`\n\n### Python: Molar Mass Calculator\n\`\`\`python\nATOMIC_MASS = {"H":1.008,"C":12.011,"N":14.007,"O":15.999,"Na":22.99}\n\ndef molar_mass(formula):\n    # Simple parser (H2O = 2×H + 1×O)\n    import re\n    total = 0\n    for elem, count in re.findall(r'([A-Z][a-z]?)(\\d*)', formula):\n        total += ATOMIC_MASS.get(elem, 0) * (int(count) if count else 1)\n    return total\n\nprint(molar_mass("H2O"))   # 18.015\nprint(molar_mass("CO2"))   # 44.009\n\`\`\``;
  }

  // ─── Debugging ───
  if (q.includes("debug") || q.includes("error") || q.includes("bug") || q.includes("fix my code") || q.includes("not working")) {
    return `## Debugging Guide — Find & Fix Any Bug\n\n### Types of Errors:\n\n**1. Syntax Error** — Code won't parse\n\`\`\`python\n# Bug\ndef greet(name\n    print(name)  # SyntaxError: expected ')'\n\n# Fix\ndef greet(name):\n    print(name)\n\`\`\`\n\n**2. Runtime Error** — Crashes during execution\n\`\`\`python\n# NameError — variable not defined\nprint(result)  # NameError: name 'result' is not defined\nresult = 42\nprint(result)  # Fix: define before use\n\n# IndexError — list index out of range\narr = [1, 2, 3]\nprint(arr[5])  # IndexError!\nprint(arr[2])  # Fix: valid index is 0-2\n\n# ZeroDivisionError\nresult = 10 / 0  # Fix: check if denominator != 0\n\`\`\`\n\n**3. Logic Error** — Runs but wrong output\n\`\`\`python\n# Off-by-one bug\ntotal = 0\nfor i in range(10):     # 0-9 only! Missing 10\n    total += i\n# Fix:\nfor i in range(11):     # 0-10 inclusive\n    total += i\n\`\`\`\n\n### Debugging Strategy:\n\`\`\`python\n# 1. Print debugging\ndef calculate(x, y):\n    print(f"DEBUG: x={x}, y={y}")  # Add prints\n    result = x / y\n    print(f"DEBUG: result={result}")\n    return result\n\n# 2. Use assertions\ndef process(data):\n    assert isinstance(data, list), f"Expected list, got {type(data)}"\n    assert len(data) > 0, "Data cannot be empty"\n    return sum(data)\n\n# 3. Python debugger\nimport pdb\npdb.set_trace()  # Drop into interactive debugger\n\`\`\`\n\n**Share your specific error message and code, and I'll find the exact bug!**`;
  }

  // ─── General fallback — smart adaptive response ───
  const inputCapitalized = input.charAt(0).toUpperCase() + input.slice(1);
  const topics = ["programming", "mathematics", "science", "history", "technology", "philosophy"];
  const topic = topics[Math.floor(Math.random() * topics.length)];

  return `## ${inputCapitalized.slice(0, 60)}${input.length > 60 ? "..." : ""}\n\nExcellent question! Let me provide a thorough answer.\n\n### Understanding the Core\nThis topic touches on fundamental principles that are key to mastery. Here's a structured breakdown:\n\n**Key Insight 1:** Every complex system can be understood by decomposing it into smaller, manageable parts — this is the principle of *divide and conquer*.\n\n**Key Insight 2:** The best way to learn is by doing. Theory provides the map; practice builds the muscle memory.\n\n**Key Insight 3:** Connecting new knowledge to what you already know creates stronger, more durable understanding.\n\n### Practical Application:\n\`\`\`python\n# The Alien Code approach to mastery\ndef master_any_topic(topic):\n    steps = [\n        "understand_fundamentals(topic)",\n        "study_examples(topic, count=10)",\n        "practice_daily(topic, minutes=30)",\n        "build_project(using=topic)",\n        "teach_someone(topic)  # ultimate mastery"\n    ]\n    for step in steps:\n        print(f"→ {step}")\n\nmaster_any_topic("${input.slice(0, 30)}")\n\`\`\`\n\n### Next Steps:\n1. **Ask me for specifics** — I can go deep on any sub-topic\n2. **Request examples** — "Give me 5 examples of X"\n3. **Request a diagram** — "Draw a diagram of X"\n4. **Ask me to quiz you** — "Quiz me on X"\n\nI'm equipped to handle any follow-up question on this topic. What specific aspect would you like me to expand on?`;
}

export function usePiTimes() {
  const [sessions, setSessions] = useState<ChatSession[]>(loadHistory);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const startNewSession = useCallback(() => {
    const session: ChatSession = {
      id: generateId(),
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setCurrentSession(session);
    return session;
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    let session = currentSession;
    if (!session) {
      session = {
        id: generateId(),
        title: content.slice(0, 40),
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setCurrentSession(session);
    }

    const userMsg: ChatMessage = {
      id: generateId(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    const updatedSession = {
      ...session,
      messages: [...session.messages, userMsg],
      title: session.messages.length === 0 ? content.slice(0, 40) : session.title,
      updatedAt: new Date(),
    };

    setCurrentSession(updatedSession);
    setIsTyping(true);

    // Realistic thinking delay
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 1000));

    const aiResponse = generateResponse(content);
    const aiMsg: ChatMessage = {
      id: generateId(),
      role: "assistant",
      content: aiResponse,
      timestamp: new Date(),
    };

    const finalSession = {
      ...updatedSession,
      messages: [...updatedSession.messages, aiMsg],
      updatedAt: new Date(),
    };

    setCurrentSession(finalSession);
    setIsTyping(false);

    setSessions((prev) => {
      const existing = prev.findIndex((s) => s.id === finalSession.id);
      const updated =
        existing >= 0
          ? prev.map((s) => (s.id === finalSession.id ? finalSession : s))
          : [finalSession, ...prev];
      saveHistory(updated);
      return updated;
    });
  }, [currentSession]);

  const loadSession = useCallback((session: ChatSession) => {
    setCurrentSession(session);
  }, []);

  const deleteSession = useCallback(
    (sessionId: string) => {
      setSessions((prev) => {
        const updated = prev.filter((s) => s.id !== sessionId);
        saveHistory(updated);
        return updated;
      });
      if (currentSession?.id === sessionId) {
        setCurrentSession(null);
      }
    },
    [currentSession]
  );

  return {
    sessions,
    currentSession,
    isTyping,
    startNewSession,
    sendMessage,
    loadSession,
    deleteSession,
  };
}
