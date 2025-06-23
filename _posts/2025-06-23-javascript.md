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

The `=>` symbol in JavaScript is called an arrow function (also known as a fat arrow). It's a shorter way to write functions that was introduced in ES6 (2015).