import { Lesson } from "@/types";

export const pythonLessons: Lesson[] = [
  {
    id: 1, title: "Introduction to Python", duration: "10 min",
    content: `<p>Python is a high-level, interpreted programming language known for its clear syntax and readability. Created by Guido van Rossum in 1991, Python has become one of the most popular languages in the world.</p>
<p>Python is used in web development, data science, artificial intelligence, automation, and much more. Its philosophy emphasizes code readability and simplicity.</p>
<h4>Why Python?</h4>
<ul><li>Easy to learn and read</li><li>Massive standard library</li><li>Huge community support</li><li>Versatile — from scripts to AI systems</li></ul>`,
    codeExample: `# Your first Python program\nprint("Hello, Alien Code!")\n\n# Python is expressive\nname = "Astronaut"\nprint(f"Welcome, {name}!")`,
    quiz: { question: "Who created Python?", options: ["James Gosling", "Guido van Rossum", "Linus Torvalds", "Dennis Ritchie"], correct: 1, explanation: "Python was created by Guido van Rossum and first released in 1991." }
  },
  {
    id: 2, title: "Variables & Data Types", duration: "12 min",
    content: `<p>Variables store data values. In Python, you don't need to declare types — Python figures it out automatically.</p>
<h4>Core Data Types:</h4>
<ul><li><strong>int</strong> — whole numbers: <code>x = 42</code></li><li><strong>float</strong> — decimals: <code>pi = 3.14</code></li><li><strong>str</strong> — text: <code>name = "Alien"</code></li><li><strong>bool</strong> — True/False: <code>active = True</code></li></ul>
<p>Use <code>type()</code> to check what type a variable is.</p>`,
    codeExample: `x = 42          # int\npi = 3.14159    # float\nname = "Alien"  # str\nalive = True    # bool\n\nprint(type(x))     # <class 'int'>\nprint(type(name))  # <class 'str'>`,
    quiz: { question: "What type is the value 3.14 in Python?", options: ["int", "string", "float", "bool"], correct: 2, explanation: "3.14 is a floating-point number, so its type is float." }
  },
  {
    id: 3, title: "Strings & String Methods", duration: "14 min",
    content: `<p>Strings are sequences of characters enclosed in quotes. Python offers powerful built-in string methods.</p>
<h4>Common Methods:</h4>
<ul><li><code>.upper()</code> — converts to uppercase</li><li><code>.lower()</code> — converts to lowercase</li><li><code>.strip()</code> — removes whitespace</li><li><code>.replace(a, b)</code> — replaces a with b</li><li><code>.split()</code> — splits into a list</li><li><code>len()</code> — returns length</li></ul>`,
    codeExample: `msg = "  Hello, World!  "\nprint(msg.strip())        # "Hello, World!"\nprint(msg.upper())        # "  HELLO, WORLD!  "\nprint(msg.replace("World","Alien"))  # Hello, Alien!\n\n# f-strings (formatted strings)\nname = "Coder"\nprint(f"You are a {name}!")`,
    quiz: { question: "What does the .upper() method do?", options: ["Converts to lowercase", "Removes spaces", "Converts to uppercase", "Reverses the string"], correct: 2, explanation: ".upper() returns a new string with all characters converted to uppercase." }
  },
  {
    id: 4, title: "Operators", duration: "12 min",
    content: `<p>Python supports arithmetic, comparison, logical, and assignment operators.</p>
<h4>Arithmetic:</h4><ul><li><code>+</code> add, <code>-</code> subtract, <code>*</code> multiply, <code>/</code> divide</li><li><code>//</code> floor division, <code>%</code> modulo, <code>**</code> exponentiation</li></ul>
<h4>Comparison:</h4><ul><li><code>==</code> equal, <code>!=</code> not equal, <code>&gt;</code> <code>&lt;</code> <code>&gt;=</code> <code>&lt;=</code></li></ul>
<h4>Logical:</h4><ul><li><code>and</code>, <code>or</code>, <code>not</code></li></ul>`,
    codeExample: `x, y = 10, 3\nprint(x + y)   # 13\nprint(x ** y)  # 1000\nprint(x % y)   # 1\nprint(x // y)  # 3\n\nprint(x > y)   # True\nprint(x == y)  # False\nprint(x > 5 and y < 5)  # True`,
    quiz: { question: "What is the result of 10 % 3?", options: ["3", "1", "0", "3.33"], correct: 1, explanation: "The modulo operator % returns the remainder of division. 10 ÷ 3 = 3 remainder 1." }
  },
  {
    id: 5, title: "User Input", duration: "10 min",
    content: `<p>The <code>input()</code> function pauses your program and waits for the user to type something. It always returns a string.</p>
<p>To use it as a number, you must convert it with <code>int()</code> or <code>float()</code>.</p>`,
    codeExample: `name = input("Enter your name: ")\nprint(f"Welcome, {name}!")\n\nage = int(input("Enter your age: "))\nyears = 100 - age\nprint(f"You have {years} more years until 100!")`,
    quiz: { question: "What type does input() always return?", options: ["int", "float", "str", "bool"], correct: 2, explanation: "input() always returns a string (str). You must convert it if you need a number." }
  },
  {
    id: 6, title: "If / Elif / Else", duration: "12 min",
    content: `<p>Conditional statements let your program make decisions based on conditions.</p>
<ul><li><code>if</code> — runs if condition is True</li><li><code>elif</code> — checks another condition if previous was False</li><li><code>else</code> — runs if all conditions are False</li></ul>
<p>Python uses <strong>indentation</strong> (4 spaces) instead of braces to define code blocks.</p>`,
    codeExample: `score = 85\n\nif score >= 90:\n    print("Grade: A")\nelif score >= 80:\n    print("Grade: B")\nelif score >= 70:\n    print("Grade: C")\nelse:\n    print("Grade: F")\n\n# Nested if\nif score > 50:\n    if score > 80:\n        print("Excellent!")`,
    quiz: { question: "Which keyword checks an additional condition if the previous if was False?", options: ["else", "elif", "then", "when"], correct: 1, explanation: "elif (else if) allows checking multiple conditions sequentially." }
  },
  {
    id: 7, title: "For Loops", duration: "13 min",
    content: `<p>A <code>for</code> loop iterates over a sequence (list, string, range, etc.).</p>
<p><code>range(n)</code> generates numbers from 0 to n-1. <code>range(start, stop, step)</code> gives more control.</p>
<p>Use <code>break</code> to exit a loop, <code>continue</code> to skip to the next iteration.</p>`,
    codeExample: `# Loop over range\nfor i in range(5):\n    print(i)  # 0,1,2,3,4\n\n# Loop over string\nfor char in "Alien":\n    print(char)\n\n# Loop with step\nfor i in range(0, 10, 2):\n    print(i)  # 0,2,4,6,8\n\n# break and continue\nfor i in range(10):\n    if i == 5: break\n    if i % 2 == 0: continue\n    print(i)`,
    quiz: { question: "What does range(0, 10, 2) produce?", options: ["0 to 10", "0,2,4,6,8", "2,4,6,8,10", "1,3,5,7,9"], correct: 1, explanation: "range(0, 10, 2) starts at 0, stops before 10, stepping by 2: 0, 2, 4, 6, 8." }
  },
  {
    id: 8, title: "While Loops", duration: "11 min",
    content: `<p>A <code>while</code> loop repeats a block of code as long as a condition is True.</p>
<p>Be careful of <strong>infinite loops</strong> — always make sure your condition will eventually become False.</p>
<p>The <code>else</code> clause on a while loop runs when the condition becomes False (not on break).</p>`,
    codeExample: `count = 0\nwhile count < 5:\n    print(f"Count: {count}")\n    count += 1\n\n# Infinite loop with break\nwhile True:\n    answer = input("Guess: ")\n    if answer == "42":\n        print("Correct!")\n        break`,
    quiz: { question: "What causes an infinite loop?", options: ["Using break", "Condition never becomes False", "Too many iterations", "Using continue"], correct: 1, explanation: "An infinite loop occurs when the loop's condition never evaluates to False." }
  },
  {
    id: 9, title: "Lists", duration: "15 min",
    content: `<p>Lists are ordered, mutable collections that can hold any type of data.</p>
<h4>Key Operations:</h4>
<ul><li><code>append()</code> — adds to end</li><li><code>insert(i, val)</code> — inserts at index</li><li><code>remove(val)</code> — removes first occurrence</li><li><code>pop()</code> — removes and returns last item</li><li><code>sort()</code> — sorts in place</li><li><code>len()</code> — returns length</li></ul>`,
    codeExample: `planets = ["Earth", "Mars", "Jupiter"]\nplanets.append("Saturn")\nplanets.insert(0, "Mercury")\nprint(planets)          # ['Mercury', 'Earth', 'Mars', 'Jupiter', 'Saturn']\n\nplanets.remove("Mars")\nprint(len(planets))     # 4\n\n# Slicing\nprint(planets[1:3])    # ['Earth', 'Jupiter']\n\nnumbers = [3,1,4,1,5]\nnumbers.sort()\nprint(numbers)          # [1,1,3,4,5]`,
    quiz: { question: "Which method adds an element to the end of a list?", options: ["insert()", "add()", "append()", "push()"], correct: 2, explanation: "list.append(item) adds the item to the end of the list." }
  },
  {
    id: 10, title: "Tuples", duration: "10 min",
    content: `<p>Tuples are like lists, but <strong>immutable</strong> — you cannot change them after creation. They use parentheses instead of brackets.</p>
<p>Tuples are faster than lists and useful for data that shouldn't change, like coordinates or RGB colors.</p>`,
    codeExample: `coords = (10.5, 20.3)\ncolor = (255, 128, 0)\npoint = (3, 4)\n\nprint(coords[0])   # 10.5\n\n# Tuple unpacking\nx, y = point\nprint(f"x={x}, y={y}")\n\n# Cannot modify:\n# coords[0] = 5  # Error!`,
    quiz: { question: "What makes tuples different from lists?", options: ["Faster creation", "Can hold more items", "Immutable (cannot be changed)", "Only stores numbers"], correct: 2, explanation: "Tuples are immutable — once created, their contents cannot be changed." }
  },
  {
    id: 11, title: "Dictionaries", duration: "14 min",
    content: `<p>Dictionaries store data as <strong>key-value pairs</strong>. Keys must be unique and immutable.</p>
<h4>Methods:</h4>
<ul><li><code>.get(key)</code> — safe access (returns None if missing)</li><li><code>.keys()</code>, <code>.values()</code>, <code>.items()</code></li><li><code>.update()</code> — merge dicts</li><li><code>del dict[key]</code> — remove a key</li></ul>`,
    codeExample: `student = {\n    "name": "Alien Coder",\n    "age": 20,\n    "gpa": 3.9\n}\n\nprint(student["name"])      # Alien Coder\nstudent["major"] = "CS"     # add\nprint(student.get("gpa"))  # 3.9\n\nfor key, val in student.items():\n    print(f"{key}: {val}")`,
    quiz: { question: "How do you safely access a dictionary key that might not exist?", options: ["dict[key]", "dict.get(key)", "dict.find(key)", "dict.fetch(key)"], correct: 1, explanation: "dict.get(key) returns None (or a default) if the key doesn't exist, avoiding a KeyError." }
  },
  {
    id: 12, title: "Sets", duration: "10 min",
    content: `<p>Sets are unordered collections of <strong>unique</strong> elements. Perfect for removing duplicates and mathematical set operations.</p>
<h4>Operations:</h4>
<ul><li><code>|</code> — union</li><li><code>&</code> — intersection</li><li><code>-</code> — difference</li><li><code>^</code> — symmetric difference</li></ul>`,
    codeExample: `nums = {1, 2, 3, 2, 1}  # Duplicates removed\nprint(nums)  # {1, 2, 3}\n\na = {1, 2, 3, 4}\nb = {3, 4, 5, 6}\nprint(a | b)  # {1,2,3,4,5,6}\nprint(a & b)  # {3,4}\nprint(a - b)  # {1,2}`,
    quiz: { question: "What is unique about sets in Python?", options: ["They are ordered", "They only store numbers", "They contain only unique elements", "They use parentheses"], correct: 2, explanation: "Sets automatically remove duplicates and only store unique elements." }
  },
  {
    id: 13, title: "Functions", duration: "15 min",
    content: `<p>Functions are reusable blocks of code. Define with <code>def</code>, call by name.</p>
<p>Functions can have <strong>parameters</strong> (inputs) and a <strong>return value</strong>. Use <code>return</code> to send a value back.</p>
<p>Default parameter values make arguments optional.</p>`,
    codeExample: `def greet(name, greeting="Hello"):\n    return f"{greeting}, {name}!"\n\nprint(greet("Alien"))            # Hello, Alien!\nprint(greet("Coder", "Hi"))     # Hi, Coder!\n\n# Multiple return values\ndef min_max(lst):\n    return min(lst), max(lst)\n\nlo, hi = min_max([3,1,7,2])\nprint(lo, hi)  # 1 7`,
    quiz: { question: "What keyword is used to define a function in Python?", options: ["function", "func", "def", "fn"], correct: 2, explanation: "The def keyword is used to define functions in Python." }
  },
  {
    id: 14, title: "Lambda Functions", duration: "10 min",
    content: `<p>Lambda functions are small anonymous functions defined in a single line using the <code>lambda</code> keyword.</p>
<p>Syntax: <code>lambda args: expression</code></p>
<p>Often used with <code>map()</code>, <code>filter()</code>, and <code>sorted()</code>.</p>`,
    codeExample: `square = lambda x: x ** 2\nprint(square(5))  # 25\n\nadd = lambda x, y: x + y\nprint(add(3, 4))  # 7\n\nnums = [1, 2, 3, 4, 5]\nevens = list(filter(lambda x: x % 2 == 0, nums))\nprint(evens)  # [2, 4]\n\ndoubled = list(map(lambda x: x*2, nums))\nprint(doubled)  # [2,4,6,8,10]`,
    quiz: { question: "What keyword creates a lambda function?", options: ["func", "arrow", "lambda", "anon"], correct: 2, explanation: "The lambda keyword creates small anonymous (unnamed) functions." }
  },
  {
    id: 15, title: "Scope & Global Variables", duration: "11 min",
    content: `<p><strong>Scope</strong> determines where a variable is accessible. Python uses LEGB rule: Local → Enclosing → Global → Built-in.</p>
<p>Variables inside a function are local. Use <code>global</code> to modify a global variable inside a function.</p>`,
    codeExample: `count = 0  # Global\n\ndef increment():\n    global count\n    count += 1\n\nincrement()\nincrement()\nprint(count)  # 2\n\n# Local scope\ndef greet():\n    msg = "Hello"  # local\n    print(msg)\n\ngreet()\n# print(msg)  # Error: msg not defined here`,
    quiz: { question: "What keyword allows modifying a global variable inside a function?", options: ["extern", "global", "public", "shared"], correct: 1, explanation: "The global keyword lets a function modify a variable defined in the global scope." }
  },
  {
    id: 16, title: "List Comprehensions", duration: "12 min",
    content: `<p>List comprehensions provide a concise way to create lists. They're faster and more Pythonic than for loops for simple transformations.</p>
<p>Syntax: <code>[expression for item in iterable if condition]</code></p>`,
    codeExample: `# Traditional\nsquares = []\nfor i in range(10):\n    squares.append(i ** 2)\n\n# List comprehension\nsquares = [i**2 for i in range(10)]\nprint(squares)\n\n# With condition\nevens = [x for x in range(20) if x % 2 == 0]\nprint(evens)\n\n# Nested\nmatrix = [[i*j for j in range(3)] for i in range(3)]`,
    quiz: { question: "Which is the correct list comprehension for squares of 1-5?", options: ["[x^2 for x in range(5)]", "[x**2 for x in range(1,6)]", "[square(x) for x in 5]", "[x*x, for x in range(5)]"], correct: 1, explanation: "[x**2 for x in range(1,6)] correctly creates squares: [1, 4, 9, 16, 25]." }
  },
  {
    id: 17, title: "Error Handling (try/except)", duration: "13 min",
    content: `<p>Errors (exceptions) are inevitable. Python's <code>try/except</code> block catches errors and lets your program continue gracefully.</p>
<ul><li><code>try</code> — code that might fail</li><li><code>except ExceptionType</code> — handles specific errors</li><li><code>else</code> — runs if no error occurred</li><li><code>finally</code> — always runs</li></ul>`,
    codeExample: `try:\n    x = int(input("Enter a number: "))\n    result = 100 / x\nexcept ValueError:\n    print("That's not a number!")\nexcept ZeroDivisionError:\n    print("Cannot divide by zero!")\nelse:\n    print(f"Result: {result}")\nfinally:\n    print("Execution complete.")`,
    quiz: { question: "Which block always executes, regardless of errors?", options: ["try", "except", "else", "finally"], correct: 3, explanation: "The finally block always executes whether an exception occurred or not." }
  },
  {
    id: 18, title: "File Handling", duration: "14 min",
    content: `<p>Python can read and write files using the <code>open()</code> function. Always use <code>with</code> to auto-close files.</p>
<h4>Modes:</h4>
<ul><li><code>"r"</code> — read</li><li><code>"w"</code> — write (overwrites)</li><li><code>"a"</code> — append</li><li><code>"r+"</code> — read and write</li></ul>`,
    codeExample: `# Writing to a file\nwith open("data.txt", "w") as f:\n    f.write("Hello, Alien Code!\\n")\n    f.write("Line 2\\n")\n\n# Reading from a file\nwith open("data.txt", "r") as f:\n    content = f.read()\n    print(content)\n\n# Reading line by line\nwith open("data.txt", "r") as f:\n    for line in f:\n        print(line.strip())`,
    quiz: { question: "Which file mode appends data without overwriting?", options: ['"w"', '"r"', '"a"', '"x"'], correct: 2, explanation: '"a" mode opens a file for appending — existing content is preserved and new content is added at the end.' }
  },
  {
    id: 19, title: "Classes & OOP", duration: "18 min",
    content: `<p>Object-Oriented Programming (OOP) organizes code into <strong>classes</strong> (blueprints) and <strong>objects</strong> (instances).</p>
<p><code>__init__</code> is the constructor method, called when creating an object. <code>self</code> refers to the instance.</p>`,
    codeExample: `class Spaceship:\n    def __init__(self, name, speed):\n        self.name = name\n        self.speed = speed\n        self.fuel = 100\n\n    def fly(self, distance):\n        fuel_needed = distance / 10\n        if self.fuel >= fuel_needed:\n            self.fuel -= fuel_needed\n            return f"{self.name} flew {distance} km!"\n        return "Not enough fuel!"\n\n    def __str__(self):\n        return f"Ship: {self.name} | Fuel: {self.fuel}%"\n\nship = Spaceship("Alien-1", 1000)\nprint(ship.fly(500))\nprint(ship)`,
    quiz: { question: "What is the __init__ method in a Python class?", options: ["A method for printing objects", "The constructor called when creating an object", "A method to delete an object", "An imported module"], correct: 1, explanation: "__init__ is the constructor — it's automatically called when you create a new instance of a class." }
  },
  {
    id: 20, title: "Inheritance", duration: "16 min",
    content: `<p>Inheritance allows a class to <strong>inherit</strong> attributes and methods from a parent class.</p>
<p>Use <code>super()</code> to call the parent class's methods. This promotes code reuse and creates hierarchies.</p>`,
    codeExample: `class Animal:\n    def __init__(self, name):\n        self.name = name\n\n    def speak(self):\n        return "..."\n\nclass Dog(Animal):\n    def speak(self):\n        return f"{self.name} says Woof!"\n\nclass Cat(Animal):\n    def speak(self):\n        return f"{self.name} says Meow!"\n\ndog = Dog("Rex")\ncat = Cat("Luna")\nprint(dog.speak())\nprint(cat.speak())\nprint(isinstance(dog, Animal))  # True`,
    quiz: { question: "What does super() do in Python?", options: ["Creates a superclass", "Calls the parent class constructor/method", "Deletes the parent class", "Imports a module"], correct: 1, explanation: "super() provides access to the parent class's methods, commonly used to call the parent's __init__." }
  },
  {
    id: 21, title: "Modules & Imports", duration: "12 min",
    content: `<p>Modules are files containing Python code. Python has a massive standard library of built-in modules.</p>
<p>Import with <code>import module</code>, or <code>from module import name</code> for specific items.</p>
<p>Popular standard modules: <code>math</code>, <code>random</code>, <code>os</code>, <code>datetime</code>, <code>json</code>.</p>`,
    codeExample: `import math\nprint(math.sqrt(16))   # 4.0\nprint(math.pi)         # 3.14159...\n\nfrom random import randint, choice\nprint(randint(1, 100))\nprint(choice(["Python","JS","C"]))\n\nimport datetime\nnow = datetime.datetime.now()\nprint(now.strftime("%Y-%m-%d"))`,
    quiz: { question: "Which import style is used for specific items from a module?", options: ["import math.sqrt", "from math import sqrt", "import sqrt from math", "include math.sqrt"], correct: 1, explanation: "'from module import name' imports specific items directly, so you can use sqrt() without math. prefix." }
  },
  {
    id: 22, title: "Decorators", duration: "15 min",
    content: `<p>Decorators are functions that wrap other functions to add functionality without modifying the original code. They use the <code>@</code> symbol.</p>
<p>Common built-in decorators: <code>@staticmethod</code>, <code>@classmethod</code>, <code>@property</code>.</p>`,
    codeExample: `import time\n\ndef timer(func):\n    def wrapper(*args, **kwargs):\n        start = time.time()\n        result = func(*args, **kwargs)\n        end = time.time()\n        print(f"{func.__name__} took {end-start:.4f}s")\n        return result\n    return wrapper\n\n@timer\ndef slow_function():\n    time.sleep(0.1)\n    return "Done!"\n\nprint(slow_function())`,
    quiz: { question: "What symbol is used to apply a decorator?", options: ["#", "$", "@", "&"], correct: 2, explanation: "The @ symbol is used to apply a decorator to a function in Python." }
  },
  {
    id: 23, title: "Generators", duration: "13 min",
    content: `<p>Generators are functions that use <code>yield</code> instead of <code>return</code>. They produce values one at a time, saving memory for large datasets.</p>
<p>Generator expressions use parentheses: <code>(x for x in range(n))</code></p>`,
    codeExample: `def count_up(n):\n    i = 0\n    while i < n:\n        yield i\n        i += 1\n\ngen = count_up(5)\nfor num in gen:\n    print(num)  # 0,1,2,3,4\n\n# Generator expression\nsquares_gen = (x**2 for x in range(10))\nprint(next(squares_gen))  # 0\nprint(next(squares_gen))  # 1`,
    quiz: { question: "What keyword is used in a generator function instead of return?", options: ["generate", "send", "yield", "produce"], correct: 2, explanation: "yield pauses the function and returns a value; the function resumes from where it left off on the next call." }
  },
  {
    id: 24, title: "Regular Expressions", duration: "15 min",
    content: `<p>The <code>re</code> module provides regular expression support for pattern matching in strings.</p>
<h4>Common Patterns:</h4>
<ul><li><code>\\d</code> — digit, <code>\\w</code> — word char, <code>\\s</code> — whitespace</li><li><code>*</code> — 0+, <code>+</code> — 1+, <code>?</code> — 0 or 1</li><li><code>^</code> — start, <code>$</code> — end</li></ul>`,
    codeExample: `import re\n\ntext = "My email is alien@code.com and number is 42"\n\n# Find email\nemail = re.search(r'\\w+@\\w+\\.\\w+', text)\nif email:\n    print(email.group())  # alien@code.com\n\n# Find all numbers\nnums = re.findall(r'\\d+', text)\nprint(nums)  # ['42']\n\n# Replace\nclean = re.sub(r'\\d+', 'NUM', text)\nprint(clean)`,
    quiz: { question: "What does \\d match in a regular expression?", options: ["Any word", "A whitespace", "Any digit (0-9)", "End of string"], correct: 2, explanation: "\\d matches any digit character from 0 to 9." }
  },
  {
    id: 25, title: "Working with JSON", duration: "12 min",
    content: `<p>JSON (JavaScript Object Notation) is the universal data format for APIs and web services. Python's <code>json</code> module makes it easy to work with.</p>
<ul><li><code>json.dumps()</code> — Python → JSON string</li><li><code>json.loads()</code> — JSON string → Python</li><li><code>json.dump()</code> — write to file</li><li><code>json.load()</code> — read from file</li></ul>`,
    codeExample: `import json\n\n# Python dict to JSON\ndata = {"name": "Alien", "level": 99, "skills": ["Python","C"]}\njson_str = json.dumps(data, indent=2)\nprint(json_str)\n\n# JSON back to Python\nparsed = json.loads(json_str)\nprint(parsed["name"])    # Alien\nprint(parsed["skills"]) # ['Python','C']`,
    quiz: { question: "Which function converts a Python dictionary to a JSON string?", options: ["json.parse()", "json.loads()", "json.dumps()", "json.encode()"], correct: 2, explanation: "json.dumps() converts a Python object (dict, list) to a JSON-formatted string." }
  },
  {
    id: 26, title: "Virtual Environments & pip", duration: "10 min",
    content: `<p>Virtual environments isolate project dependencies. This prevents version conflicts between projects.</p>
<p><code>pip</code> is Python's package manager for installing third-party libraries.</p>
<h4>Commands:</h4>
<ul><li><code>python -m venv env</code> — create</li><li><code>source env/bin/activate</code> — activate (Linux/Mac)</li><li><code>pip install package_name</code> — install</li><li><code>pip freeze > requirements.txt</code> — save deps</li></ul>`,
    codeExample: `# Terminal commands:\n# python -m venv myenv\n# source myenv/bin/activate  # Mac/Linux\n# myenv\\Scripts\\activate     # Windows\n\n# Install popular packages:\n# pip install numpy pandas matplotlib requests\n\n# List installed:\n# pip list\n\n# Save requirements:\n# pip freeze > requirements.txt\n\n# Install from file:\n# pip install -r requirements.txt`,
    quiz: { question: "What command creates a virtual environment?", options: ["pip create env", "python -m venv env", "virtualenv create", "python new env"], correct: 1, explanation: "python -m venv env creates a new virtual environment in a directory called 'env'." }
  },
  {
    id: 27, title: "NumPy Basics", duration: "16 min",
    content: `<p>NumPy is the foundation of scientific computing in Python. It provides fast, efficient arrays called <strong>ndarrays</strong>.</p>
<p>NumPy arrays are much faster than Python lists for numerical operations because they're stored in contiguous memory.</p>`,
    codeExample: `import numpy as np\n\n# Create arrays\narr = np.array([1, 2, 3, 4, 5])\nprint(arr * 2)      # [2 4 6 8 10]\nprint(arr.mean())   # 3.0\nprint(arr.sum())    # 15\n\n# 2D array (matrix)\nmatrix = np.array([[1,2],[3,4]])\nprint(matrix.shape)  # (2,2)\nprint(matrix.T)       # Transpose\n\n# Zeros, ones, range\nprint(np.zeros(3))\nprint(np.arange(0, 1, 0.25))`,
    quiz: { question: "What is the main advantage of NumPy arrays over Python lists?", options: ["They can store strings", "They are much faster for numerical operations", "They support more methods", "They use less code"], correct: 1, explanation: "NumPy arrays are stored in contiguous memory and support vectorized operations, making them vastly faster for math." }
  },
  {
    id: 28, title: "Pandas Basics", duration: "18 min",
    content: `<p>Pandas is the go-to library for data manipulation and analysis. Its core structures are <strong>Series</strong> (1D) and <strong>DataFrame</strong> (2D table).</p>`,
    codeExample: `import pandas as pd\n\n# Create DataFrame\ndf = pd.DataFrame({\n    "Name": ["Alice","Bob","Charlie"],\n    "Score": [92, 87, 95],\n    "Grade": ["A","B","A"]\n})\n\nprint(df.head())\nprint(df.describe())\nprint(df["Score"].mean())\n\n# Filter\nhigh = df[df["Score"] > 90]\nprint(high)\n\n# Sort\nprint(df.sort_values("Score", ascending=False))`,
    quiz: { question: "What is the 2D data structure in Pandas called?", options: ["Matrix", "Array", "DataFrame", "Table"], correct: 2, explanation: "A DataFrame is Pandas' 2D labeled data structure, similar to a spreadsheet or SQL table." }
  },
  {
    id: 29, title: "Matplotlib & Plotting", duration: "15 min",
    content: `<p>Matplotlib is Python's most popular plotting library. Use <code>pyplot</code> for quick charts.</p>
<h4>Common Plot Types:</h4>
<ul><li><code>plt.plot()</code> — line chart</li><li><code>plt.bar()</code> — bar chart</li><li><code>plt.scatter()</code> — scatter plot</li><li><code>plt.hist()</code> — histogram</li></ul>`,
    codeExample: `import matplotlib.pyplot as plt\nimport numpy as np\n\nx = np.linspace(0, 2*np.pi, 100)\ny = np.sin(x)\n\nplt.figure(figsize=(10,4))\nplt.plot(x, y, color='cyan', linewidth=2)\nplt.title("Sine Wave")\nplt.xlabel("x")\nplt.ylabel("sin(x)")\nplt.grid(True, alpha=0.3)\nplt.show()`,
    quiz: { question: "Which Matplotlib function creates a line chart?", options: ["plt.bar()", "plt.line()", "plt.plot()", "plt.chart()"], correct: 2, explanation: "plt.plot() creates line charts (and also scatter plots with marker arguments)." }
  },
  {
    id: 30, title: "Web Requests with requests", duration: "13 min",
    content: `<p>The <code>requests</code> library makes HTTP calls simple. Use it to fetch data from APIs and websites.</p>
<h4>Methods:</h4>
<ul><li><code>requests.get(url)</code> — GET request</li><li><code>requests.post(url, data)</code> — POST request</li><li><code>response.json()</code> — parse JSON</li><li><code>response.status_code</code> — HTTP status</li></ul>`,
    codeExample: `import requests\n\n# GET request\nresponse = requests.get("https://jsonplaceholder.typicode.com/posts/1")\n\nif response.status_code == 200:\n    data = response.json()\n    print(data["title"])\n    print(data["body"][:50])\n\n# With parameters\nparams = {"userId": 1}\nres = requests.get("https://jsonplaceholder.typicode.com/posts", params=params)\nposts = res.json()\nprint(f"Found {len(posts)} posts")`,
    quiz: { question: "What does response.status_code == 200 mean?", options: ["Error occurred", "Request was successful", "Redirect", "Not found"], correct: 1, explanation: "HTTP status code 200 means 'OK' — the request was successful and data was returned." }
  },
  {
    id: 31, title: "Flask Web Framework", duration: "18 min",
    content: `<p>Flask is a lightweight Python web framework. Perfect for building REST APIs and web apps quickly.</p>
<p>Key concepts: <strong>routes</strong> map URLs to functions, <strong>decorators</strong> define endpoints, <strong>templates</strong> render HTML.</p>`,
    codeExample: `from flask import Flask, jsonify, request\n\napp = Flask(__name__)\n\ndata = [{"id":1,"name":"Alien"},{"id":2,"name":"Coder"}]\n\n@app.route("/")\ndef home():\n    return "<h1>Alien Code API</h1>"\n\n@app.route("/api/users")\ndef get_users():\n    return jsonify(data)\n\n@app.route("/api/users/<int:uid>")\ndef get_user(uid):\n    user = next((u for u in data if u["id"]==uid), None)\n    return jsonify(user) if user else ("Not found", 404)\n\nif __name__ == "__main__":\n    app.run(debug=True)`,
    quiz: { question: "What decorator is used to define a Flask route?", options: ["@flask.route", "@app.url", "@app.route", "@route.get"], correct: 2, explanation: "@app.route('/path') maps a URL path to a Python function in Flask." }
  },
  {
    id: 32, title: "SQLite with Python", duration: "16 min",
    content: `<p>Python's built-in <code>sqlite3</code> module lets you work with SQLite databases without any setup.</p>
<p>Always use parameterized queries (<code>?</code> placeholders) to prevent SQL injection attacks.</p>`,
    codeExample: `import sqlite3\n\nconn = sqlite3.connect("alien.db")\ncursor = conn.cursor()\n\n# Create table\ncursor.execute("""CREATE TABLE IF NOT EXISTS users\n    (id INTEGER PRIMARY KEY, name TEXT, level INTEGER)""")\n\n# Insert\ncursor.execute("INSERT INTO users (name, level) VALUES (?, ?)", ("Alien", 99))\nconn.commit()\n\n# Query\ncursor.execute("SELECT * FROM users")\nfor row in cursor.fetchall():\n    print(row)\n\nconn.close()`,
    quiz: { question: "Why use ? placeholders in SQLite queries?", options: ["For better performance", "To prevent SQL injection", "To support more data types", "Required by Python"], correct: 1, explanation: "Parameterized queries with ? prevent SQL injection attacks by separating data from query structure." }
  },
  {
    id: 33, title: "Async Programming", duration: "17 min",
    content: `<p>Asynchronous programming lets Python handle multiple tasks concurrently without blocking. The <code>asyncio</code> module and <code>async/await</code> keywords enable this.</p>
<p>Perfect for I/O-bound tasks: web requests, file operations, database queries.</p>`,
    codeExample: `import asyncio\n\nasync def fetch_data(name, delay):\n    print(f"Fetching {name}...")\n    await asyncio.sleep(delay)  # Simulates I/O\n    return f"{name}: data ready"\n\nasync def main():\n    # Run concurrently\n    results = await asyncio.gather(\n        fetch_data("API-1", 1),\n        fetch_data("API-2", 2),\n        fetch_data("API-3", 0.5)\n    )\n    for r in results:\n        print(r)\n\nasyncio.run(main())`,
    quiz: { question: "What keyword pauses an async function and waits for a coroutine?", options: ["pause", "wait", "await", "yield"], correct: 2, explanation: "await pauses the async function until the awaited coroutine completes, allowing other tasks to run." }
  },
  {
    id: 34, title: "Data Classes", duration: "12 min",
    content: `<p>The <code>@dataclass</code> decorator (Python 3.7+) automatically generates <code>__init__</code>, <code>__repr__</code>, and <code>__eq__</code> methods.</p>
<p>Cleaner and more concise than traditional classes for data-holding objects.</p>`,
    codeExample: `from dataclasses import dataclass, field\n\n@dataclass\nclass Player:\n    name: str\n    level: int = 1\n    skills: list = field(default_factory=list)\n    health: float = 100.0\n\n    def level_up(self):\n        self.level += 1\n        self.health = min(100, self.health + 10)\n\np = Player("Alien", level=5)\np.skills.append("Python")\np.level_up()\nprint(p)  # Player(name='Alien', level=6, ...)`,
    quiz: { question: "What does the @dataclass decorator auto-generate?", options: ["Only __init__", "__init__, __repr__, __eq__", "All magic methods", "Only __str__"], correct: 1, explanation: "@dataclass automatically generates __init__, __repr__, and __eq__ based on the class's type annotations." }
  },
  {
    id: 35, title: "Testing with pytest", duration: "15 min",
    content: `<p>Writing tests ensures your code works correctly and prevents regressions. <code>pytest</code> is Python's most popular testing framework.</p>
<p>Functions starting with <code>test_</code> are automatically discovered and run.</p>`,
    codeExample: `# math_utils.py\ndef add(a, b): return a + b\ndef divide(a, b):\n    if b == 0: raise ValueError("Cannot divide by zero")\n    return a / b\n\n# test_math_utils.py\nimport pytest\nfrom math_utils import add, divide\n\ndef test_add():\n    assert add(2, 3) == 5\n    assert add(-1, 1) == 0\n\ndef test_divide():\n    assert divide(10, 2) == 5.0\n\ndef test_divide_by_zero():\n    with pytest.raises(ValueError):\n        divide(10, 0)\n\n# Run: pytest test_math_utils.py -v`,
    quiz: { question: "How does pytest identify test functions?", options: ["They use @test decorator", "Functions starting with test_", "They're in a tests/ folder", "They import pytest"], correct: 1, explanation: "pytest automatically discovers and runs functions whose names start with test_." }
  },
  {
    id: 36, title: "Python for AI & Machine Learning", duration: "20 min",
    content: `<p>Python dominates the AI/ML field. The key libraries form an ecosystem called the <strong>Python Data Science Stack</strong>.</p>
<h4>Core Libraries:</h4>
<ul><li><strong>scikit-learn</strong> — classical ML algorithms</li><li><strong>TensorFlow / PyTorch</strong> — deep learning</li><li><strong>Keras</strong> — high-level neural networks</li><li><strong>Hugging Face</strong> — pre-trained AI models</li></ul>
<p>You are now a Python developer — equipped to build anything from scripts to AI systems. The journey continues!</p>`,
    codeExample: `from sklearn.linear_model import LinearRegression\nfrom sklearn.model_selection import train_test_split\nimport numpy as np\n\n# Generate sample data\nX = np.random.randn(100, 1) * 10\ny = 2 * X.flatten() + np.random.randn(100) * 5\n\n# Split data\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)\n\n# Train model\nmodel = LinearRegression()\nmodel.fit(X_train, y_train)\n\nprint(f"Score: {model.score(X_test, y_test):.3f}")\nprint(f"Coefficient: {model.coef_[0]:.2f}")`,
    quiz: { question: "Which Python library is most commonly used for classical machine learning?", options: ["NumPy", "Pandas", "scikit-learn", "Matplotlib"], correct: 2, explanation: "scikit-learn provides easy-to-use implementations of most classical ML algorithms: regression, classification, clustering, etc." }
  }
];
