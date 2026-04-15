// ─── Puzzle Game Levels ───────────────────────────────────────────────────────
// Grid: 8×8, 0=path, 1=wall, 2=trap, 3=key, 4=door, 5=goal
// Robot starts at startPos, must reach goal using commands

export type CellType = 0 | 1 | 2 | 3 | 4 | 5;
export type Direction = "up" | "down" | "left" | "right";

export interface PuzzleLevel {
  id: number;
  title: string;
  description: string;
  hint: string;
  grid: CellType[][];
  startPos: [number, number]; // [row, col]
  startDir: Direction;
  goalPos: [number, number];
  starThresholds: [number, number, number]; // [3star, 2star, 1star] commands
  availableCommands: string[];
  tutorial?: string;
}

export const PUZZLE_LEVELS: PuzzleLevel[] = [
  {
    id: 1,
    title: "First Steps",
    description: "Guide the robot to the goal using moveForward().",
    hint: "The robot faces right. Call moveForward() 3 times.",
    tutorial: "Type commands in the editor. Each command moves the robot one step. Click RUN to execute.",
    grid: [
      [1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,1],
      [1,0,1,1,1,1,0,1],
      [1,0,1,0,0,1,0,1],
      [1,0,1,0,0,1,0,1],
      [1,0,1,1,1,1,0,1],
      [1,0,0,0,0,0,5,1],
      [1,1,1,1,1,1,1,1],
    ],
    startPos: [1, 1],
    startDir: "right",
    goalPos: [6, 6],
    starThresholds: [8, 12, 20],
    availableCommands: ["moveForward()", "turnLeft()", "turnRight()"],
  },
  {
    id: 2,
    title: "Turn Around",
    description: "Use turns to navigate the maze.",
    hint: "You'll need turnLeft() and turnRight() to navigate.",
    grid: [
      [1,1,1,1,1,1,1,1],
      [1,0,1,0,0,0,0,1],
      [1,0,1,0,1,1,0,1],
      [1,0,0,0,1,0,0,1],
      [1,1,1,0,1,0,1,1],
      [1,0,0,0,0,0,1,1],
      [1,0,1,1,1,5,1,1],
      [1,1,1,1,1,1,1,1],
    ],
    startPos: [1, 1],
    startDir: "down",
    goalPos: [6, 5],
    starThresholds: [10, 14, 22],
    availableCommands: ["moveForward()", "turnLeft()", "turnRight()"],
  },
  {
    id: 3,
    title: "Trap Field",
    description: "Avoid the traps (⚡)! Stepping on one ends the run.",
    hint: "Plan your route carefully — traps are instant fail.",
    grid: [
      [1,1,1,1,1,1,1,1],
      [1,0,0,0,2,0,0,1],
      [1,0,1,0,1,1,0,1],
      [1,0,1,0,0,2,0,1],
      [1,0,0,0,1,0,0,1],
      [1,2,1,0,1,0,1,1],
      [1,0,0,0,0,5,0,1],
      [1,1,1,1,1,1,1,1],
    ],
    startPos: [1, 1],
    startDir: "right",
    goalPos: [6, 5],
    starThresholds: [10, 15, 24],
    availableCommands: ["moveForward()", "turnLeft()", "turnRight()"],
  },
  {
    id: 4,
    title: "Use a Function",
    description: "Define a function to move efficiently.",
    hint: "Define a helper function to avoid repeating commands.",
    grid: [
      [1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,1],
      [1,0,1,1,1,1,0,1],
      [1,0,1,0,0,1,0,1],
      [1,0,1,0,0,1,0,1],
      [1,0,0,0,0,0,0,1],
      [1,0,1,1,1,1,5,1],
      [1,1,1,1,1,1,1,1],
    ],
    startPos: [1, 1],
    startDir: "right",
    goalPos: [6, 6],
    starThresholds: [7, 10, 18],
    availableCommands: ["moveForward()", "turnLeft()", "turnRight()", "function myFunc() {}"],
  },
  {
    id: 5,
    title: "Key & Door",
    description: "Collect the key (🔑) before reaching the door (🚪).",
    hint: "Pick up the key first, then the door will unlock.",
    grid: [
      [1,1,1,1,1,1,1,1],
      [1,0,0,3,0,0,0,1],
      [1,0,1,1,1,1,0,1],
      [1,0,0,0,0,0,0,1],
      [1,1,1,0,1,1,0,1],
      [1,0,0,0,0,4,0,1],
      [1,0,1,1,1,1,5,1],
      [1,1,1,1,1,1,1,1],
    ],
    startPos: [1, 1],
    startDir: "right",
    goalPos: [6, 6],
    starThresholds: [12, 18, 28],
    availableCommands: ["moveForward()", "turnLeft()", "turnRight()"],
  },
  {
    id: 6,
    title: "Loop It",
    description: "Use a repeat loop to minimize your commands.",
    hint: "repeat(4) { moveForward(); } saves writing the same command 4 times.",
    grid: [
      [1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,0,1],
      [1,0,0,0,0,0,0,1],
      [1,0,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,5,1],
      [1,1,1,1,1,1,1,1],
    ],
    startPos: [1, 1],
    startDir: "right",
    goalPos: [6, 6],
    starThresholds: [6, 9, 16],
    availableCommands: ["moveForward()", "turnLeft()", "turnRight()", "repeat(n) {}"],
  },
];

// ─── Fix The Code Challenges ──────────────────────────────────────────────────

export interface FixChallenge {
  id: number;
  title: string;
  language: "javascript" | "python" | "c";
  difficulty: "easy" | "medium" | "hard";
  description: string;
  brokenCode: string;
  fixedCode: string;
  hint: string;
  bugType: string;
  xp: number;
}

export const FIX_CHALLENGES: FixChallenge[] = [
  {
    id: 1,
    title: "Infinite Loop",
    language: "javascript",
    difficulty: "easy",
    description: "This loop runs forever! Fix the bug so it counts from 0 to 9.",
    brokenCode: `for (let i = 0; i <= 10; i--) {
  console.log(i);
}`,
    fixedCode: `for (let i = 0; i <= 9; i++) {
  console.log(i);
}`,
    hint: "Look at the loop increment operator — is it going the right direction?",
    bugType: "Infinite Loop",
    xp: 50,
  },
  {
    id: 2,
    title: "Off by One",
    language: "javascript",
    difficulty: "easy",
    description: "The function should return the sum of numbers 1 through n, but it's returning the wrong result.",
    brokenCode: `function sumTo(n) {
  let total = 0;
  for (let i = 0; i < n; i++) {
    total += i;
  }
  return total;
}
console.log(sumTo(5)); // Should print 15`,
    fixedCode: `function sumTo(n) {
  let total = 0;
  for (let i = 1; i <= n; i++) {
    total += i;
  }
  return total;
}
console.log(sumTo(5)); // 15`,
    hint: "The loop starts at 0 and goes to n-1. What should it be for 1 to n?",
    bugType: "Off-by-One Error",
    xp: 60,
  },
  {
    id: 3,
    title: "Missing Return",
    language: "python",
    difficulty: "easy",
    description: "The function should double a number, but it's returning None.",
    brokenCode: `def double(n):
    result = n * 2
    
print(double(5))  # Should print 10`,
    fixedCode: `def double(n):
    result = n * 2
    return result

print(double(5))  # 10`,
    hint: "The function calculates the result but never sends it back to the caller.",
    bugType: "Missing Return",
    xp: 50,
  },
  {
    id: 4,
    title: "Wrong Comparison",
    language: "javascript",
    difficulty: "easy",
    description: "The grade checker always returns 'F'. Fix the comparison operators.",
    brokenCode: `function getGrade(score) {
  if (score = 90) return "A";
  if (score = 80) return "B";
  if (score = 70) return "C";
  return "F";
}
console.log(getGrade(85)); // Should print B`,
    fixedCode: `function getGrade(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  return "F";
}
console.log(getGrade(85)); // B`,
    hint: "There's a difference between = (assignment) and >= (comparison).",
    bugType: "Assignment vs Comparison",
    xp: 70,
  },
  {
    id: 5,
    title: "Index Out of Range",
    language: "python",
    difficulty: "medium",
    description: "Find the maximum value in a list — but it crashes with an IndexError.",
    brokenCode: `def find_max(lst):
    max_val = lst[0]
    for i in range(len(lst) + 1):
        if lst[i] > max_val:
            max_val = lst[i]
    return max_val

print(find_max([3, 7, 1, 9, 4]))`,
    fixedCode: `def find_max(lst):
    max_val = lst[0]
    for i in range(len(lst)):
        if lst[i] > max_val:
            max_val = lst[i]
    return max_val

print(find_max([3, 7, 1, 9, 4]))  # 9`,
    hint: "List indices go from 0 to len-1. What does range(len(lst)+1) produce?",
    bugType: "Index Out of Range",
    xp: 80,
  },
  {
    id: 6,
    title: "Null Pointer",
    language: "javascript",
    difficulty: "medium",
    description: "This function crashes when passed null. Make it safe.",
    brokenCode: `function getLength(str) {
  return str.length;
}

console.log(getLength("hello"));  // 5
console.log(getLength(null));     // Crashes!`,
    fixedCode: `function getLength(str) {
  if (str === null || str === undefined) return 0;
  return str.length;
}

console.log(getLength("hello"));  // 5
console.log(getLength(null));     // 0`,
    hint: "Check if the input is null before trying to access its properties.",
    bugType: "Null Reference",
    xp: 90,
  },
  {
    id: 7,
    title: "Recursion Without Base Case",
    language: "python",
    difficulty: "medium",
    description: "This factorial function crashes with a RecursionError. Fix it.",
    brokenCode: `def factorial(n):
    return n * factorial(n - 1)

print(factorial(5))  # Should print 120`,
    fixedCode: `def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))  # 120`,
    hint: "Every recursive function needs a base case to stop the recursion.",
    bugType: "Missing Base Case",
    xp: 100,
  },
  {
    id: 8,
    title: "Scope Error",
    language: "javascript",
    difficulty: "medium",
    description: "The counter should increment but always resets to 1.",
    brokenCode: `function makeCounter() {
  function increment() {
    let count = 0;
    count++;
    return count;
  }
  return increment;
}

const counter = makeCounter();
console.log(counter()); // Should be 1
console.log(counter()); // Should be 2
console.log(counter()); // Should be 3`,
    fixedCode: `function makeCounter() {
  let count = 0;
  function increment() {
    count++;
    return count;
  }
  return increment;
}

const counter = makeCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3`,
    hint: "Where should 'count' be declared to persist between calls?",
    bugType: "Scope / Closure",
    xp: 110,
  },
  {
    id: 9,
    title: "Wrong Data Type",
    language: "python",
    difficulty: "hard",
    description: "Adding user's age always crashes. The function should handle string input.",
    brokenCode: `def birthday_message(age):
    next_age = age + 1
    return f"Happy birthday! Next year you'll be {next_age}"

user_age = input("Enter age: ")  # Returns string!
print(birthday_message(user_age))`,
    fixedCode: `def birthday_message(age):
    next_age = int(age) + 1
    return f"Happy birthday! Next year you'll be {next_age}"

user_age = input("Enter age: ")  # Returns string
print(birthday_message(user_age))`,
    hint: "input() always returns a string. You need to convert it to a number first.",
    bugType: "Type Error",
    xp: 120,
  },
  {
    id: 10,
    title: "Async Race Condition",
    language: "javascript",
    difficulty: "hard",
    description: "The total should print after all fetches complete, but prints 0.",
    brokenCode: `async function fetchPrices() {
  let total = 0;
  
  [1, 2, 3].forEach(async (id) => {
    const price = await getPrice(id);
    total += price;
  });
  
  console.log("Total:", total); // Prints 0!
}

async function getPrice(id) { return id * 10; }
fetchPrices();`,
    fixedCode: `async function fetchPrices() {
  let total = 0;
  
  const prices = await Promise.all(
    [1, 2, 3].map(async (id) => await getPrice(id))
  );
  
  total = prices.reduce((a, b) => a + b, 0);
  console.log("Total:", total); // 60
}

async function getPrice(id) { return id * 10; }
fetchPrices();`,
    hint: "forEach doesn't wait for async operations. Use Promise.all with map instead.",
    bugType: "Async / Race Condition",
    xp: 150,
  },
  {
    id: 11,
    title: "C: Uninitialized Variable",
    language: "c",
    difficulty: "medium",
    description: "The sum variable gives garbage values. Fix the initialization.",
    brokenCode: `#include <stdio.h>

int main() {
    int sum;
    int arr[] = {1, 2, 3, 4, 5};
    
    for (int i = 0; i < 5; i++) {
        sum += arr[i];
    }
    printf("Sum: %d\\n", sum);
    return 0;
}`,
    fixedCode: `#include <stdio.h>

int main() {
    int sum = 0;  // Initialize!
    int arr[] = {1, 2, 3, 4, 5};
    
    for (int i = 0; i < 5; i++) {
        sum += arr[i];
    }
    printf("Sum: %d\\n", sum);  // 15
    return 0;
}`,
    hint: "In C, uninitialized variables contain garbage values. Always initialize them.",
    bugType: "Uninitialized Variable",
    xp: 100,
  },
  {
    id: 12,
    title: "C: Buffer Overflow",
    language: "c",
    difficulty: "hard",
    description: "This string copy can overflow the buffer. Fix it safely.",
    brokenCode: `#include <stdio.h>
#include <string.h>

int main() {
    char dest[5];
    char src[] = "Hello, World!";
    strcpy(dest, src);  // Unsafe!
    printf("%s\\n", dest);
    return 0;
}`,
    fixedCode: `#include <stdio.h>
#include <string.h>

int main() {
    char dest[14];  // Big enough for src
    char src[] = "Hello, World!";
    strncpy(dest, src, sizeof(dest) - 1);
    dest[sizeof(dest) - 1] = '\\0';  // Null terminate
    printf("%s\\n", dest);
    return 0;
}`,
    hint: "Make dest large enough, and use strncpy with size limit instead of strcpy.",
    bugType: "Buffer Overflow",
    xp: 160,
  },
];

// ─── Daily Challenges ─────────────────────────────────────────────────────────

export interface DailyChallenge {
  id: number;
  date: string; // YYYY-MM-DD offset from base
  title: string;
  description: string;
  language: "javascript" | "python";
  difficulty: "easy" | "medium" | "hard";
  starterCode: string;
  testCases: { input: string; expected: string; description: string }[];
  hint: string;
  xp: number;
  tags: string[];
}

export const DAILY_CHALLENGES: DailyChallenge[] = [
  {
    id: 1,
    title: "Reverse a String",
    description: "Write a function that reverses a given string.",
    language: "javascript",
    difficulty: "easy",
    starterCode: `function reverseString(str) {
  // Your code here
}

// Test:
console.log(reverseString("hello")); // "olleh"
console.log(reverseString("alien")); // "neila"`,
    testCases: [
      { input: "hello", expected: "olleh", description: "Reverse 'hello'" },
      { input: "alien", expected: "neila", description: "Reverse 'alien'" },
      { input: "a", expected: "a", description: "Single char" },
    ],
    hint: "Try split('').reverse().join('')",
    xp: 100,
    tags: ["strings", "arrays"],
  },
  {
    id: 2,
    title: "FizzBuzz Classic",
    description: "Print 1-20. For multiples of 3 print 'Fizz', for 5 print 'Buzz', for both print 'FizzBuzz'.",
    language: "javascript",
    difficulty: "easy",
    starterCode: `function fizzBuzz(n) {
  // Return array of fizzbuzz values from 1 to n
}

console.log(fizzBuzz(15));`,
    testCases: [
      { input: "3", expected: "Fizz", description: "3 → Fizz" },
      { input: "5", expected: "Buzz", description: "5 → Buzz" },
      { input: "15", expected: "FizzBuzz", description: "15 → FizzBuzz" },
    ],
    hint: "Use the modulo operator %. Check 15 first, then 3, then 5.",
    xp: 100,
    tags: ["loops", "conditionals"],
  },
  {
    id: 3,
    title: "Count Vowels",
    description: "Count the number of vowels (a, e, i, o, u) in a string.",
    language: "python",
    difficulty: "easy",
    starterCode: `def count_vowels(s):
    # Your code here
    pass

print(count_vowels("hello"))  # 2
print(count_vowels("alien code"))  # 6`,
    testCases: [
      { input: "hello", expected: "2", description: "hello → 2" },
      { input: "alien", expected: "3", description: "alien → 3" },
      { input: "xyz", expected: "0", description: "no vowels" },
    ],
    hint: "Loop through each character and check if it's in 'aeiou'.",
    xp: 100,
    tags: ["strings", "loops"],
  },
  {
    id: 4,
    title: "Palindrome Check",
    description: "Return true if a string reads the same forwards and backwards.",
    language: "javascript",
    difficulty: "easy",
    starterCode: `function isPalindrome(str) {
  // Your code here
}

console.log(isPalindrome("racecar")); // true
console.log(isPalindrome("hello"));  // false`,
    testCases: [
      { input: "racecar", expected: "true", description: "racecar → palindrome" },
      { input: "hello", expected: "false", description: "hello → not palindrome" },
      { input: "madam", expected: "true", description: "madam → palindrome" },
    ],
    hint: "Compare the string with its reverse.",
    xp: 110,
    tags: ["strings"],
  },
  {
    id: 5,
    title: "Find Maximum",
    description: "Find the largest number in an array without using Math.max.",
    language: "javascript",
    difficulty: "easy",
    starterCode: `function findMax(arr) {
  // Without Math.max!
}

console.log(findMax([3, 7, 1, 9, 4])); // 9
console.log(findMax([-1, -5, -2]));    // -1`,
    testCases: [
      { input: "[3,7,1,9,4]", expected: "9", description: "Find max in mixed array" },
      { input: "[-1,-5,-2]", expected: "-1", description: "All negatives" },
    ],
    hint: "Start with arr[0] as max, then compare each element.",
    xp: 110,
    tags: ["arrays", "loops"],
  },
  {
    id: 6,
    title: "Factorial",
    description: "Calculate the factorial of a number n (n!) using recursion.",
    language: "python",
    difficulty: "medium",
    starterCode: `def factorial(n):
    # Use recursion!
    pass

print(factorial(5))   # 120
print(factorial(10))  # 3628800`,
    testCases: [
      { input: "5", expected: "120", description: "5! = 120" },
      { input: "0", expected: "1", description: "0! = 1" },
      { input: "10", expected: "3628800", description: "10! = 3628800" },
    ],
    hint: "Base case: n <= 1 returns 1. Recursive: n * factorial(n-1).",
    xp: 130,
    tags: ["recursion", "math"],
  },
  {
    id: 7,
    title: "Two Sum",
    description: "Find two numbers in the array that add up to the target. Return their indices.",
    language: "javascript",
    difficulty: "medium",
    starterCode: `function twoSum(nums, target) {
  // Return [index1, index2]
}

console.log(twoSum([2,7,11,15], 9));  // [0,1]
console.log(twoSum([3,2,4], 6));      // [1,2]`,
    testCases: [
      { input: "[2,7,11,15], 9", expected: "[0,1]", description: "2+7=9 at indices 0,1" },
      { input: "[3,2,4], 6", expected: "[1,2]", description: "2+4=6 at indices 1,2" },
    ],
    hint: "Use a hash map (object) to store seen numbers and their indices.",
    xp: 150,
    tags: ["arrays", "hash map"],
  },
  {
    id: 8,
    title: "Flatten Array",
    description: "Flatten a nested array one level deep.",
    language: "javascript",
    difficulty: "medium",
    starterCode: `function flatten(arr) {
  // Without using .flat()!
}

console.log(flatten([1,[2,3],[4,5]])); // [1,2,3,4,5]
console.log(flatten([[1],[2],[3]]));   // [1,2,3]`,
    testCases: [
      { input: "[1,[2,3],[4,5]]", expected: "[1,2,3,4,5]", description: "Mixed nested" },
      { input: "[[1],[2],[3]]", expected: "[1,2,3]", description: "All nested" },
    ],
    hint: "Use reduce with concat, or loop and push individual elements.",
    xp: 140,
    tags: ["arrays", "reduce"],
  },
  {
    id: 9,
    title: "Anagram Check",
    description: "Check if two strings are anagrams of each other.",
    language: "python",
    difficulty: "medium",
    starterCode: `def is_anagram(s1, s2):
    pass

print(is_anagram("listen", "silent"))  # True
print(is_anagram("hello", "world"))   # False`,
    testCases: [
      { input: "listen, silent", expected: "True", description: "listen ↔ silent" },
      { input: "hello, world", expected: "False", description: "Not anagrams" },
      { input: "anagram, nagaram", expected: "True", description: "anagram ↔ nagaram" },
    ],
    hint: "Sort both strings and compare, or use a frequency counter dictionary.",
    xp: 140,
    tags: ["strings", "sorting"],
  },
  {
    id: 10,
    title: "Binary Search",
    description: "Implement binary search on a sorted array. Return the index or -1.",
    language: "javascript",
    difficulty: "hard",
    starterCode: `function binarySearch(arr, target) {
  // O(log n) required!
}

console.log(binarySearch([1,3,5,7,9,11], 7));  // 3
console.log(binarySearch([1,3,5,7,9,11], 6));  // -1`,
    testCases: [
      { input: "[1,3,5,7,9,11], 7", expected: "3", description: "Found at index 3" },
      { input: "[1,3,5,7,9,11], 6", expected: "-1", description: "Not in array" },
      { input: "[1], 1", expected: "0", description: "Single element" },
    ],
    hint: "Use left/right pointers. Compare mid element with target each iteration.",
    xp: 200,
    tags: ["searching", "algorithms"],
  },
  {
    id: 11,
    title: "Group By",
    description: "Group an array of objects by a given key.",
    language: "javascript",
    difficulty: "hard",
    starterCode: `function groupBy(arr, key) {
  // Group objects by key
}

const people = [
  {name:"Alice", dept:"Engineering"},
  {name:"Bob", dept:"Marketing"},
  {name:"Charlie", dept:"Engineering"},
];
console.log(groupBy(people, "dept"));`,
    testCases: [
      { input: "people, dept", expected: "{Engineering:[...], Marketing:[...]}", description: "Group by department" },
    ],
    hint: "Use reduce to build an object where each key maps to an array.",
    xp: 180,
    tags: ["arrays", "objects", "reduce"],
  },
  {
    id: 12,
    title: "Fibonacci Sequence",
    description: "Return the first n numbers of the Fibonacci sequence using a generator.",
    language: "python",
    difficulty: "medium",
    starterCode: `def fibonacci(n):
    # Return list of first n fibonacci numbers
    pass

print(fibonacci(8))  # [0,1,1,2,3,5,8,13]`,
    testCases: [
      { input: "8", expected: "[0,1,1,2,3,5,8,13]", description: "First 8 fibonacci" },
      { input: "1", expected: "[0]", description: "First 1" },
    ],
    hint: "Start with [0, 1] and each new number = sum of previous two.",
    xp: 130,
    tags: ["sequences", "math"],
  },
];
