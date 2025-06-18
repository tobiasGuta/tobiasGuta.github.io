---
layout: post
title: "Quantum Scrambler (PicoCTF)"
date: 2025-06-05
categories: [blog, cybersecurity]
tags: [red team, pentesting, bug bounty, ctf, Reverse Engineering]
image: https://e1.pxfuel.com/desktop-wallpaper/637/928/desktop-wallpaper-the-grim-reaper-%C2%B7%E2%91%A0-grim-reaper-layouts-backgrounds.jpg
---

Reverse Engineering a Recursive Scramble in Python picoCTF Challenge Breakdown
================================================================================

* * * * *

Introduction
------------

In this challenge, we're handed a Python script that scrambles a flag using a bizarre in-place list mutation with nested references making direct decoding tricky.

Our mission: understand the scramble, decode the nested structure, and extract the original flag.

* * * * *

#### Description
We invented a new cypher that uses "quantum entanglement" to encode the flag. Do you have what it takes to decode it?

The Challenge Code
------------------

<div class="code-block-container">
  <span class="code-lang-tag">Python</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="language-python">
import sys

def exit():
  sys.exit(0)

def scramble(L):
  A = L
  i = 2
  while (i < len(A)):
    A[i-2] += A.pop(i-1)
    A[i-1].append(A[:i-2])
    i += 1
    
  return L

def get_flag():
  flag = open('flag.txt', 'r').read()
  flag = flag.strip()
  hex_flag = []
  for c in flag:
    hex_flag.append([str(hex(ord(c)))])

  return hex_flag

def main():
  flag = get_flag()
  cypher = scramble(flag)
  print(cypher)

if __name__ == '__main__':
  main()
</code></pre>
</div>

Here's the core part:

<div class="code-block-container">
  <span class="code-lang-tag">Python</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="language-python">
def scramble(L):
    A = L
    i = 2
    while (i < len(A)):
        A[i-2] += A.pop(i-1)
        A[i-1].append(A[:i-2])
        i += 1
    return L

def get_flag():
    flag = open('flag.txt', 'r').read().strip()
    hex_flag = [[hex(ord(c))] for c in flag]
    return hex_flag

def main():
    flag = get_flag()
    cypher = scramble(flag)
    print(cypher)

</code></pre>
</div>

* * * * *

What's happening here?
----------------------

### Step 1: Preparing the flag

-   The flag is read from `flag.txt`.

-   Each character is converted to its hexadecimal ASCII code string, wrapped in a list.

    -   Example: `'p'` → `['0x70']`

-   So the flag becomes a list of lists:\
    `[['0x70'], ['0x69'], ['0x63'], ['0x6f'], ...]`

### Step 2: The scramble function --- the chaos begins

<div class="code-block-container">
  <span class="code-lang-tag">Python</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="language-python">
def scramble(L):
    A = L
    i = 2
    while (i < len(A)):
        A[i-2] += A.pop(i-1)
        A[i-1].append(A[:i-2])
        i += 1
    return L
</code></pre>
</div>

-   `A` is a reference to the original list `L` (no copy).

-   `i` starts at 2, loops while less than length of `A`.

-   Each iteration:

    -   `A.pop(i-1)` removes the element at index `i-1` and returns it.

    -   The popped element (a list like `['0x69']`) is **concatenated (`+=`) to `A[i-2]`** --- so two lists merge.

    -   Then, a **slice of the list `A[:i-2]`** (everything before `i-2`) is appended as a nested list inside `A[i-1]`.

    -   `i` increments by 1.

-   The list shrinks by one each iteration because of `.pop()`.

* * * * *

What does this scrambling actually do?
--------------------------------------

1.  It merges adjacent elements, combining the hex codes into growing lists.

2.  It appends nested slices of earlier parts of the list as *recursive references* inside other list elements.

3.  The nested slices are **not flat copies**, but *references* to parts of the list.

* * * * *

Why does this matter?
---------------------

-   The final structure is a **deeply nested recursive list**, with references to earlier parts of itself.

-   This creates a complex graph-like structure, **not a simple list of hex strings**.

-   Naively flattening or recursively joining all elements will **repeat parts multiple times** or enter infinite loops.

* * * * *

How to decode it?
-----------------

### Step 1: Read the scrambled output (a Python list) from a file:

<div class="code-block-container">
  <span class="code-lang-tag">Python</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="language-python">
import ast

with open('scrambled_output.txt') as f:
    scrambled_data = f.read()

data = ast.literal_eval(scrambled_data)
</code></pre>
</div>


-   `ast.literal_eval` safely evaluates the string to a nested Python list.

### Step 2: Decode hex strings to ASCII but **skip nested references**

You want to:

-   Decode only **direct hex string elements** on the top level of each list.

-   **Ignore nested lists inside each list** because those are recursive references to previous parts they'll cause duplicates.

<div class="code-block-container">
  <span class="code-lang-tag">Python</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="language-python">
def decode_node(node, visited=None):
    if visited is None:
        visited = set()

    if isinstance(node, list):
        node_id = id(node)
        if node_id in visited:
            return ''
        visited.add(node_id)

        result = ''
        for el in node:
            if isinstance(el, list):
                continue  # skip nested refs
            elif isinstance(el, str) and el.startswith('0x'):
                result += chr(int(el, 16))
        return result

    elif isinstance(node, str) and node.startswith('0x'):
        return chr(int(node, 16))

    return ''
</code></pre>
</div>

### Step 3: Rebuild the flag linearly by decoding each top-level element:

<div class="code-block-container">
  <span class="code-lang-tag">Python</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="language-python">
flag = ""
for item in data:
    flag += decode_node(item)

print(flag)
</code></pre>
</div>

Full code:

<div class="code-block-container">
  <span class="code-lang-tag">Python</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="language-python">
import ast

def decode_node(node, visited=None):
    if visited is None:
        visited = set()

    # If this node is a list
    if isinstance(node, list):
        # To avoid cycles or repeat processing the same slice multiple times,
        # we use id() of the node list object to track visits.
        node_id = id(node)
        if node_id in visited:
            return ''  # already decoded, skip to avoid duplicates or infinite loops
        visited.add(node_id)

        # Decode each element in list sequentially
        result = ''
        for el in node:
            # If el is a list inside the node, it usually is a recursive reference slice,
            # so skip it to avoid duplication.
            if isinstance(el, list):
                continue
            # If string with hex prefix, decode to char
            elif isinstance(el, str) and el.startswith('0x'):
                result += chr(int(el, 16))
        return result

    # If node is a string hex
    elif isinstance(node, str) and node.startswith('0x'):
        return chr(int(node, 16))

    # Otherwise, ignore
    return ''

# Read scrambled data from file
with open('scrambled_output.txt') as f:
    scrambled_data = f.read()

data = ast.literal_eval(scrambled_data)

flag = ""
for item in data:
    flag += decode_node(item)

print(flag)
</code></pre>
</div>

Remember to save the output like this: `nc verbal-sleep[.]picoctf[.]net 63518 > scrambled_output.txt`

