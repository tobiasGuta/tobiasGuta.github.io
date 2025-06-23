---
layout: post
title: "Javascript"
date: 2025-06-23
categories: [blog, cybersecurity]
tags: [Redteam, pentesting, bugbounty, ctf]
image: https://wallpapers.com/images/hd/java-script-coffee-mug-space-background-dw830xztu7jr07hu.jpg
permalink: /blog/javascript/
---

# JavaScript Variables 
-------------------------------------------

In JavaScript, variables are used to store and manage data. There are three main ways to declare a variable: `var`, `let`, and `const`.

### var, let, and const

Originally, JavaScript only had `var`. But in 2015, the release of ECMAScript 6 (also called ES6) introduced `let` and `const`, giving developers better and safer ways to handle variables.

Here's a quick breakdown of how each one works:

**let**
Use `let` when you need a variable that can be reassigned later in your code. It is block-scoped, which means it's only available inside the `{}` it was defined in, like inside a loop or function.

**var**
`var` is function-scoped, not block-scoped. This means it behaves differently inside loops and conditional blocks. It can be updated and re-declared, but it's more error-prone, which is why most modern JavaScript avoids using it unless necessary. It's still supported and works in older codebases.

**const**
Use `const` when the variable should never be reassigned. Like `let`, it's block-scoped, but it also cannot be updated or re-declared. It's best used for constants or values that shouldn't change throughout your code.

### Understanding Scope

**Global Scope**
If a variable is declared outside of any function or block, it has global scope. This means it can be accessed from anywhere in the code.

**Block Scope**
If a variable is declared inside a block (inside `{}`), like within a loop, function, or conditional, and it uses `let` or `const`, it is block-scoped. This means it only exists within that block and cannot be accessed outside of it.

JavaScript Data Types and Operators for Beginners
-------------------------------------------------

In JavaScript, a **variable** is like a labeled container that holds different types of data. Before you can use a variable effectively, you need to understand what kinds of data it can store and what you can do with that data.

### Core Data Types

Here are the main types of values you'll work with:

**Number**
Used for any numeric value, whether it's a whole number like `42` or a decimal like `3.14`.

**String**
Text enclosed in quotes, such as `"Matrix"` or `'Hello, world'`.

**Boolean**
Represents true or false values, useful when making decisions in your code.

There are other types like arrays, objects, `null`, and `undefined`, but starting with these three gives you a solid foundation.

### Making Variables Do Something: Operators

A variable by itself just holds a value. To do anything useful with it, you'll need **operators**. These are special symbols used to perform tasks like calculations or comparisons.

### Arithmetic Operators

These are used when working with numbers.

**Addition (`+`)**
Adds values together. For example, `10 + 7` results in `17`.

**Subtraction (`-`)**
Subtracts one number from another. `50 - 12` gives `38`.

**Multiplication (`*`)**
Multiplies numbers. `4 * 6` gives `24`.

**Division (`/`)**
Divides one number by another. `20 / 5` results in `4`.

**Modulus (`%`)**
Gives the remainder after division. `14 % 3` returns `2`.

**Increment (`++`)**
Adds 1 to the current value of a variable. If `let score = 8;`, then `score++` changes it to `9`.

**Decrement (`--`)**
Subtracts 1 from the current value. If `let count = 5;`, then `count--` turns it into `4`.

### Comparison Operators

These are used to compare two values and return either true or false.

**Equal to (`==`)**
Checks if values are equal, ignoring type. `7 == '7'` returns true.

**Strictly equal to (`===`)**
Checks if values and types are the same. `7 === '7'` returns false.

**Not equal to (`!=`)**
Returns true if the values are different. `3 != 9` is true.

**Not strictly equal to (`!==`)**
Returns true if values or types are different. `3 !== '3'` is true.

**Greater than (`>`)**
Checks if one value is larger than another. `90 > 45` is true.

**Less than (`<`)**
Checks if one value is smaller. `2 < 10` is true.

**Greater than or equal to (`>=`)**
Returns true if the value is larger or equal. `5 >= 5` is true.

**Less than or equal to (`<=`)**
Returns true if the value is smaller or equal. `4 <= 6` is true.

### More to Explore

JavaScript also has logical operators like `&&` (and), `||` (or), and `!` (not). These are especially useful when you're combining multiple conditions or writing control flow.

# Conditionals in JavaScript
--------------------------

Conditionals let your code make decisions based on whether something is true or false. The most common conditional structure is the `if` statement.

Here's a simple example:

<div class="code-block-container">
  <span class="code-lang-tag">Javascript</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="Javascript">
let temperature = 32;

if (temperature > 30) {
  console.log("It's hot outside.");
} else if (temperature > 20) {
  console.log("It's a nice day.");
} else {
  console.log("It's a bit chilly.");
}
</code></pre>
</div>

<div class="video-container">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/SKnXS6zVGHw" 
          frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen></iframe>
</div>

#### What's happening here?

-   If the `temperature` is greater than 30, it prints "It's hot outside."

-   If that first condition isn't true but the temperature is greater than 20, it prints "It's a nice day."

-   If neither condition is true, it defaults to the last message: "It's a bit chilly."

This is the basic pattern for conditional logic:

-   `if` checks the first condition

-   `else if` allows you to check additional conditions

-   `else` handles everything that didn't match above

You can combine conditionals with comparison and logical operators to build more complex logic.

# switch Statements in JavaScript
-------------------------------

When you have a variable that could match several different values, using a `switch` statement can make your code easier to read and maintain.

### Example: Day of the Week

<div class="code-block-container">
  <span class="code-lang-tag">Javascript</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="Javascript">
let day = "Wednesday";

switch (day) {
  case "Monday":
    console.log("Start of the week.");
    break;
  case "Wednesday":
    console.log("Midweek hustle.");
    break;
  case "Friday":
    console.log("Almost the weekend!");
    break;
  case "Sunday":
    console.log("Time to rest.");
    break;
  default:
    console.log("Just another day.");
}
</code></pre>
</div>

<div class="video-container">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/1uY_bzC4oDk" 
          frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen></iframe>
</div>

### What's going on here?

-   `switch` checks the value of `day`

-   Each `case` is a value you want to compare it to

-   When a match is found (in this case, "Wednesday"), it runs that block of code

-   `break` tells JavaScript to stop checking further once a match is found

-   `default` is the fallback if none of the cases match

### When to use switch

Use a `switch` when you're checking **one variable** against **multiple possible values**. It's not meant for complex comparisons or range checks `if` statements are better for that.

# Functions in JavaScript: ES5 vs ES6
-----------------------------------

In JavaScript, you can write functions a few different ways depending on which version of the language you're using. ES5 is the older style, and ES6 introduced a more modern and concise syntax called **arrow functions**.

Understanding both styles is important, especially if you're reading older code or contributing to larger projects.

### ES5: Function Declaration

This is the classic way of defining a function.

<div class="code-block-container">
  <span class="code-lang-tag">Javascript</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="Javascript">
function sayHello(name) {
  return "Hello, " + name +  "!";
}

let message = sayHello("Trinity");
console.log(message);
</code></pre>
</div>

<div class="video-container">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/0sX_1o4I0TY" 
          frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen></iframe>
</div>

### ES5: Function Expression

In ES5, you could also assign a function to a variable. This is called a function expression.

<div class="code-block-container">
  <span class="code-lang-tag">Javascript</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="Javascript">
var greet = function(name) {
  return "Hi, " + name + "!";
};

console.log(greet("Morpheus"));
</code></pre>
</div>

<div class="video-container">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/OviHyV8GF3o" 
          frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen></iframe>
</div>

Notice how the function doesn’t have a name it’s anonymous, and it gets stored inside the greet variable.

### ES6: Arrow Functions

ES6 introduced a shorter, cleaner syntax using **arrow functions**. It's widely used in modern JavaScript, especially in React and functional-style code.

Here's that same example using an arrow function:

<div class="code-block-container">
  <span class="code-lang-tag">Javascript</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="Javascript">
const greet = (name) => {
  return "Hi, " + name;
};
</code></pre>
</div>
If the function has only one parameter and one return statement, you can make it even shorter:

<div class="code-block-container">
  <span class="code-lang-tag">Javascript</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="Javascript">
const greet = name => "Hi, " + name;
</code></pre>
</div>

### Key Differences Between ES5 and ES6 Functions

1.  **Syntax**
    Arrow functions are more concise and easier to read when doing simple tasks.

2.  **`this` Behavior**
    Arrow functions do **not** have their own `this` context. They inherit it from the surrounding code. This is a big deal when working with objects, classes, or event listeners.

3.  **Hoisting**
    Regular function declarations (like in ES5) are hoisted, meaning you can call them before they're defined. Function expressions and arrow functions are **not** hoisted.

* * * * *

### When to Use What

-   Use **regular functions** (ES5 style) if you need access to `this`, like inside object methods or class constructors.

-   Use **arrow functions** for cleaner code in callbacks, array methods (`map`, `filter`, etc.), and when you don't need a dynamic `this`.

The `=>` symbol in JavaScript is called an `arrow` function (also known as a fat arrow). It's a shorter way to write functions that was introduced in ES6 (2015).

# Objects and Arrays in JavaScript
--------------------------------

When you're working with more complex data in JavaScript like lists of things or related properties variables alone aren't enough. That's where **arrays** and **objects** come in.

These two data structures let you store and organize information in flexible, powerful ways.

* * * * *

### Arrays

An **array** is a list of values stored in a single variable. It's ordered, and each value has an index starting at zero.

<div class="code-block-container">
  <span class="code-lang-tag">Javascript</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="Javascript">
let fruits = ["apple", "banana", "cherry"];

console.log(fruits[0]);
console.log(fruits[2]);
</code></pre>
</div>

<div class="video-container">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/PcSAv8QMoQE" 
          frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen></iframe>
</div>

You can store any type of value in an array numbers, strings, booleans, even other arrays or objects.

<div class="code-block-container">
  <span class="code-lang-tag">Javascript</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="Javascript">
let mixed = [42, "hello", true, null];
</code></pre>
</div>
You can also update and add to arrays:

<div class="code-block-container">
  <span class="code-lang-tag">Javascript</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="Javascript">
fruits.push("orange");
fruits.unshift("grape");
fruits[1] = "blueberry";
</code></pre>
</div>

### Objects

An **object** is a collection of **key-value pairs**. It's unordered, but the keys (also called properties) let you access values by name instead of position.

<div class="code-block-container">
  <span class="code-lang-tag">Javascript</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="Javascript">
user.age = 30;
user.city = "Zion";
</code></pre>
</div>

### Arrays vs. Objects When to Use Each

-   Use an **array** when the order matters or when you're just listing items.

-   Use an **object** when you want to label each piece of data with a key and access it by name.

Sometimes, you'll combine them:

<div class="code-block-container">
  <span class="code-lang-tag">Javascript</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="Javascript">
let users = [
  { name: "Neo", role: "The One" },
  { name: "Trinity", role: "Operator" }
];

console.log(users[1].role); // Output: Operator
</code></pre>
</div>

That’s when things get powerful when arrays hold objects, and objects contain arrays.

<div class="video-container">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/IQV4Y5PjZ1s" 
          frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen></iframe>
</div>

# Loops
-------------------

Loops are used when you want to run the same block of code multiple times. Whether you're processing a list, repeating a calculation, or iterating over data loops get the job done.

There are a few types of loops in JavaScript: `for`, `while`, and `do...while`. Each one is useful in different situations.

### The `for` Loop

The `for` loop is the most commonly used. It's great when you know exactly how many times you want the code to run.

<div class="code-block-container">
  <span class="code-lang-tag">Javascript</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="Javascript">
for (let i = 0; i < 5; i++) {
  console.log("Count:", i);
}
</code></pre>
</div>

<div class="video-container">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/yjLjsp_q_S0" 
          frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen></iframe>
</div>

This runs the block five times, from `i = 0` up to `i < 5`.

**How it works:**

-   `let i = 0` initializes the counter

-   `i < 5` is the condition the loop runs while this is true

-   `i++` increases the counter each time through

### The `while` Loop

The `while` loop runs as long as the condition stays true. It's better when you don't know ahead of time how many times you'll need to loop.

<div class="code-block-container">
  <span class="code-lang-tag">Javascript</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="Javascript">
let count = 0;

while (count < 3) {
  console.log("Number:", count);
  count++;
}
</code></pre>
</div>

<div class="video-container">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/IKI1GVMZt0I" 
          frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen></iframe>
</div>

If count never hits 3, the loop keeps going which is why you need to be careful to avoid infinite loops.

### The `do...while` Loop

This is like a `while` loop, except it runs **at least once**, even if the condition is false.

<div class="code-block-container">
  <span class="code-lang-tag">Javascript</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="Javascript">
let num = 10;

do {
  console.log("Running at least once");
  num++;
} while (num < 5);
</code></pre>
</div>

**Breaking Down the `do...while` Example**

This code demonstrates a `do...while` loop, which executes code **at least once** before checking its condition.

**Step-by-step breakdown:**

1. **Variable initialization**: `num` starts at `10`
2. **Loop execution**: The `do` block runs first, regardless of the condition
3. **Inside the loop**:
   - Prints "Running at least once" to console
   - Increments `num` by 1 (making it `11`)
4. **Condition check**: After execution, it checks `num < 5`

**Key insight**: Since `num` starts at `10` and becomes `11` after incrementing, the condition `num < 5` is **false from the beginning**. 

- In a regular `while` loop -> code would **never execute**
- In a `do...while` loop -> code runs **once before** checking the condition

**Result**: "Running at least once" prints exactly **one time**, then the loop terminates because `11` is not less than `5`.

### When to Use `do...while`

This pattern is perfect for:
- **Input validation** - Ask for input first, then validate
- **Menu systems** - Show menu once, then check if user wants to continue
- **Any scenario** where you need something to happen before deciding whether to repeat it

* * * * *

### Which Loop Should You Use?

-   Use `for` when you know how many times you need to loop

-   Use `while` when you don't know in advance how long to loop

-   Use `do...while` if the code needs to run at least once before checking the condition

You'll also run into modern looping methods like `for...of`, `for...in`, and array methods like `.forEach()`.

# Modern Looping in JavaScript: `for...of`, `for...in`, and `.forEach()`
----------------------------------------------------------------------

Once you've got the basics of `for` and `while`, it's time to look at newer, cleaner ways to loop through **arrays** and **objects**.

### `for...of`

This loop is made for arrays, strings, or anything that's iterable. It gives you the value directly, not the index.

<div class="code-block-container">
  <span class="code-lang-tag">Javascript</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="Javascript">
let colors = ["red", "green", "blue"];

for (let color of colors) {
  console.log(color);
}
</code></pre>
</div>

Output:

<div class="code-block-container">
  <span class="code-lang-tag">OUTPUT</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="OUTPUT">
red
green
blue
</code></pre>
</div>

Clean, simple, and readable. You don’t need to mess with `colors[i]` or worry about index bounds.

### `for...in`

This loop is used for **objects**. It loops over the **keys** (property names), not the values directly.

<div class="code-block-container">
  <span class="code-lang-tag">Javascript</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="Javascript">
let user = {
  name: "Neo",
  age: 30,
  role: "The One"
};

for (let key in user) {
  console.log(key + ": " + user[key]);
}
</code></pre>
</div>

OUTPUT:

<div class="code-block-container">
  <span class="code-lang-tag">OUTPUT</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="OUTPUT">
name: Neo
age: 30
role: The One
</code></pre>
</div>

Use for...in for plain objects. If you try to use it on arrays, it can give unexpected results because it loops over all enumerable properties, not just the values.

### `.forEach()`

This is an **array method** that lets you run a function on each element of an array. It's super common in modern JavaScript.

<div class="code-block-container">
  <span class="code-lang-tag">Javascript</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="Javascript">
let numbers = [10, 20, 30];

numbers.forEach(function(num) {
  console.log(num * 2);
});
</code></pre>
</div>

Or with an arrow function:

<div class="code-block-container">
  <span class="code-lang-tag">Javascript</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="Javascript">
numbers.forEach(num => console.log(num * 2));
</code></pre>
</div>

`.forEach()` is useful when you don’t need to break out of the loop early it just runs for every item in the array.

<div class="video-container">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/EIE13d8m0_4" 
          frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen></iframe>
</div>

### Remember

-   Use `for...of` for looping through values in arrays or strings

-   Use `for...in` for looping through keys in objects

-   Use `.forEach()` for clean, functional looping through arrays

These modern methods make your code easier to read and maintain and they're everywhere in frameworks like React, Node.js, and frontend scripts.

# Additional Resources 📚

Want to dive deeper into JavaScript? Here are some excellent resources to continue your learning journey:

### Official Documentation
- **[MDN Web Docs - JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)** - The gold standard for JavaScript documentation. Comprehensive, accurate, and regularly updated.

### Interactive Learning
- **[W3Schools JavaScript Tutorial](https://www.w3schools.com/js/default.asp)** - Great for beginners with interactive examples and exercises.

### Recommended Next Steps
- **[JavaScript.info](https://javascript.info/)** - Modern JavaScript tutorial covering everything from basics to advanced topics
- **[Eloquent JavaScript](https://eloquentjavascript.net/)** - Free online book that dives deep into JavaScript concepts
- **[freeCodeCamp JavaScript Course](https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/)** - Hands-on coding challenges and projects

### Practice Platforms
- **[Codewars](https://www.codewars.com/)** - Coding challenges to sharpen your skills
- **[HackerRank](https://www.hackerrank.com/domains/tutorials/30-days-of-code)** - Algorithm and data structure practice
- **[LeetCode](https://leetcode.com/)** - Problem-solving for technical interviews

---

*Happy coding! Remember: the best way to learn JavaScript is by building projects and practicing regularly.* 

