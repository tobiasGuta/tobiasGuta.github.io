---
layout: post
title: "AI Foundations I"
date: 2026-06-28
categories: [ai, machine-learning, writeups, ctf]
image: https://miro.medium.com/v2/resize:fit:2000/format:webp/1*TvcsPYrQIIJ5zq0MSEzNVA.jpeg
permalink: /blog/AI-Foundations-I
locked: false
---

# Cracking the 2D Perceptron: My "Aha!" Moment in Cylab Security Academy

Hey everyone! I just wrapped up a really cool challenge in the Cylab Security Academy (formerly picoCTF) called **Neuron Express 2D-0!**, and I wanted to share my write-up. If you are getting into AI and machine learning, this is a perfect example of how the underlying math actually works.

## The Challenge
The premise is basically playing Battleship, but with machine learning. We are given a "black box" 2D perceptron. We can feed it `(x, y)` coordinates between -10 and 10, and it will either "stay quiet" (output 0) or "fire" (output 1). 

The goal? Figure out the hidden weights ($w_1$ and $w_2$) and the bias ($b$) that make up its decision rule: 
$$ w_1x + w_2y + b \geq 0 $$

## The decision boundary 

Here is a quick breakdown of what each part of that equation actually does geometrically:
* **Weights ($w_1$ and $w_2$)**: These determine the slope or angle of your line. They represent how much importance the perceptron places on each specific input coordinate.
* **Bias ($b$)**: This shifts the line away from the origin $(0,0)$. Without the bias, your line would always be forced to pass exactly through the center of the graph, which severely limits the kinds of patterns you can learn.
* **The Threshold ($\geq 0$)**: This is the actual "decision." The equation $w_1x_1 + w_2x_2 + b = 0$ is the exact line. Everything greater than 0 is on one side (Perceptron fires: 1), and everything less than 0 is on the other (Perceptron stays silent: 0).

## The Strategy
I started by probing different coordinates to see what would happen. I noticed that testing `1 10` kept the perceptron quiet, but `10 10` made it fire! This was a huge clue because it meant the invisible "decision boundary" (the line where the output flips from 0 to 1) was somewhere between x=1 and x=10 on that top row.

I used a binary search strategy—chopping the area in half. I tested `5 10` (fire!), then stepped down: `4 10` (fire!), `3 10` (fire!), and finally `2 10` (quiet!). So, the boundary line crossed exactly between x=2 and x=3.

## The Plot Twist
I repeated the exact same process on the bottom row (where y=0) and found the exact same flip between x=2 and x=3. 

That's when it hit me: the decision boundary was a perfectly straight, vertical line. The perceptron was completely ignoring the y-axis! 

Because the y-coordinate didn't change the outcome at all, the weight for y ($w_2$) had to be **0**. 

## Doing the Math
With $w_2 = 0$, the formula simplified to just:
$$ w_1x + b \geq 0 $$

Assuming the simplest integer weight for x ($w_1 = 1$), the equation became:
$$ x + b \geq 0 $$
I knew from my tests that the perceptron fired at $x=3$ and stayed quiet at $x=2$. 

I needed a bias ($b$) that would pull a total of 2 below zero, but keep a total of 3 at exactly zero or above. A bias of **-3** fit perfectly:
* For $x=3$: $3 + (-3) = 0$ (Fires! 🔥)
* For $x=2$: $2 + (-3) = -1$ (Stays quiet 🤫)

## The Solution
I submitted the final parameters: `TEST 1 0 -3` and got the perfect match and the flag! 

It was awesome to see how a simple linear equation acts as a brain for a basic AI system. It really demystified the idea of "decision boundaries" for me. On to the next challenge!

***

# Dropping a Dimension: Cracking the 1D Perceptron in Cylab Security Academy

Welcome back! After successfully reverse-engineering a 2D perceptron in the Cylab Security Academy (picoCTF), I immediately jumped into the next challenge: **Neuron Express 0!** This time, the challenge stepped things down a dimension. Instead of a 2D grid with `x` and `y` coordinates, I was dealing with a 1D number line ranging from -10 to 10. 

## The Muscle Memory Trap
When I first booted up the challenge, I kept getting an error: `Not an integer. Try again.` 

I was typing `10 10`, `1 1`, and `0 0`. It took me a minute to realize my mistake: my muscle memory from the 2D challenge was tricking me into entering *two* coordinates instead of one! Since the 1D perceptron rule is just $wx + b \geq 0$, it only needs a single `x` value. 

Once I figured that out, it was time to hunt for the decision boundary.

## The Strategy: Binary Search on a Number Line
In the 2D challenge, I was hunting for an invisible line. In 1D, I was just hunting for a single invisible *point* on the number line where the AI's output flips from 0 (quiet) to 1 (fires).

I started probing the number line and found the exact transition point:
* Input $1$ -> Perceptron stays quiet (0)
* Input $2$ -> Perceptron fires! (1)

Because the perceptron turned "on" as the numbers got bigger, I knew the weight ($w$) had to be a positive number. 

## Doing the Math
I assumed the simplest positive integer for the weight: **$w = 1$**.
This simplified my rule to:
$$ x + b \geq 0 $$

I needed to find a bias ($b$) that made the formula true for my test results:
* For $x = 2$, it needed to fire: $2 + b \geq 0$
* For $x = 1$, it needed to stay quiet: $1 + b < 0$

I needed a number that pulled 2 down to exactly 0, but pulled 1 down into the negatives. A bias of **-2** was the perfect fit!
* $2 + (-2) = 0$ (Fires! 🔥)
* $1 + (-2) = -1$ (Stays quiet 🤫)

## The Solution
I submitted my final parameters: `TEST 1 -2`. 
Perfect match! 

It is amazing how stepping down a dimension actually makes the math much clearer. By removing the `y` variable, you can really see how the bias ($b$) just acts as a slider, shifting the "on/off" point left and right across the number line.

***

# AI Ethics: Why "Trust But Verify" is My New Coding Motto 🕵️♂️

Hey everyone! Back with another update from my Cylab Security Academy journey. I just finished a module that took a break from the heavy math of perceptrons and put me in an interactive fiction scenario called **Trust But Verify**. It honestly completely changed how I look at generative AI.

## The Scenario 📖
The game puts you in the year 2031, using an advanced AI assistant named ARIA to write a science fair proposal. Sounds easy, right? But ARIA ended up teaching me a harsh lesson about "automation bias"—that dangerous habit we have of trusting AI just because it sounds incredibly confident.

During the project, ARIA made three distinct types of mistakes:
*   **The Hallucination 👻:** It completely fabricated a 2022 UNEP report and a statistic about ocean plastic. If I hadn't asked for the source link, I would have put fake data in my project.
*   **The Logic Error 🐛:** It wrote a Python script to calculate averages but snuck a random `+ 1` into the math. The code ran perfectly, but the output was mathematically wrong.
*   **The Subtle Inaccuracy 📉:** This was the scariest one. ARIA cited a *real* study by a *real* researcher at a *real* university... but got the year wrong and claimed the results were "confirmed" instead of "preliminary."

## My Biggest Takeaway 🧠
That last mistake really stuck with me. When an AI gets 95% of the facts right, it builds a false sense of security, making it incredibly easy to let the 5% that is wrong slip right past you. 

The AI told me at the end: *"I genuinely don't know when I'm wrong. You have to be the one who finds out."* 

Moving forward, whether I'm using AI to debug my code or research a topic, I'm treating it like a brilliant but slightly careless intern. It can help me work faster, but I *must* be the final editor and fact-checker. Trust, but verify!

***

# Stepping Up to Classification: Building a 1D Perceptron 🚧

Hey everyone! The Cylab Security Academy just flipped the script on me. In the previous challenges, I was playing detective—trying to find the hidden decision boundary of a "black box" AI. But in the **Perceptron Play 1D!** challenge, I finally got to play engineer. 

Instead of guessing the rules, my job was to look at a dataset and *build* the rule to classify the data correctly.

## The Setup
The challenge gave me a number line with points labeled as either Category 0 (stay quiet) or Category 1 (fire). 
The starting parameters were a weight of $w = 1$ and a bias of $b = 0$. 

When I checked the initial state, there was exactly one point being misclassified: the point at $x = 0$. The data required it to be a 0, but my perceptron was predicting a 1. 

## The Math and the "Fence"
You can think of a perceptron's decision boundary like a physical fence on the number line. Everything on or to the right of the fence fires (1). Everything to the left stays quiet (0).

With $w = 1$ and $b = 0$, the equation was:
$$ 1x + 0 \geq 0 $$
For $x = 0$, the total was exactly 0. Since 0 is greater than or equal to 0, the perceptron fired. I needed to move that fence slightly to the right so $0$ would be left behind in the "quiet" zone, but $2$ (the next data point) would still stay in the "fire" zone.

## The Fix
To slide the fence to the right, I needed to lower the total by dipping into negative numbers with my bias ($b$). 

I changed the bias to **-1**. Let's look at why that worked:
* For $x = 0$: $0 + (-1) = -1$. Since -1 is less than 0, it stays quiet (0). Fixed!
* For $x = 2$: $2 + (-1) = 1$. Since 1 is greater than 0, it still fires (1). Perfect!

Here is what it looked like in the challenge terminal when I typed `SET 1 -1` and hit `CHECK`:

```text
Number line (predictions):
    -4-3-2-1+0+1+2+3+4
     0 . 0 . x . 1 1 1
             ^

Current parameters -> w: 1, b: 0

  x    label  perceptron  activation
  --   -----  ----------  ----------
  -4      0        0        -4
  -2      0        0        -2
  +0      0        1        0
  +2      1        1        2
  +3      1        1        3
  +4      1        1        4

> SET 1 -1
Number line (predictions):
    -4-3-2-1+0+1+2+3+4
     0 . 0 . 0 . 1 1 1
               ^

Current parameters -> w: 1, b: -1

  x    label  perceptron  activation
  --   -----  ----------  ----------
  -4      0        0        -5
  -2      0        0        -3
  +0      0        0        -1
  +2      1        1        1
  +3      1        1        2
  +4      1        1        3

> CHECK
Perfect! All points are classified correctly.
```

All points classified perfectly, and I grabbed the flag! 

It's really cool to see how tweaking a single number (the bias) just physically slides the AI's decision-making threshold back and forth. Next up: 2D classification!

***

# Leveling Up: Cracking 2D Classification with Perceptrons 🚀

Hey everyone! I'm back with another update from the Cylab Security Academy. After mastering the 1D perceptron, it was time to step things up to a full 2D grid. Instead of just sliding a single point back and forth on a number line, my goal was to draw a literal line in the sand—a decision boundary—to separate two clusters of data.

## The Setup
In this challenge, I was given an ASCII graph with points labeled as either Category 0 (stay quiet) or Category 1 (fire). The perceptron now had two weights ($w_1$ for the x-axis, $w_2$ for the y-axis) and a bias ($b$). 

The starting parameters were $w_1 = 1$, $w_2 = -1$, and $b = 0$. This made my starting rule: 
$$ 1x - 1y + 0 \geq 0 $$

## The Bug in the Math 🐛
When I looked at my dataset, two points were failing:
* **$(-1, -1)$** was supposed to be a `0`, but the math ($-1 - (-1) = 0$) made the perceptron fire. 
* **$(+1, +3)$** was supposed to be a `1`, but the math ($1 - 3 = -2$) kept the perceptron quiet. 

The issue was that pesky negative weight for $w_2$. Because it was subtracting the y-value, it was dragging the total down way below zero for my Class 1 points (which were all in the top right, meaning they had positive y-values). 

## The Fix 🛠️
I needed to stop subtracting that y-value and start adding it so it would help push my Class 1 points above zero. I changed the weight of $w_2$ to $1$. 

My new, simplified rule became: 
$$ x + y \geq 0 $$

Let's look at how that fixed my failing points:
* For **$(-1, -1)$**: $-1 + (-1) = -2$. Since -2 is less than 0, it stays quiet (0). Fixed!
* For **$(+1, +3)$**: $1 + 3 = 4$. Since 4 is greater than 0, it fires (1). Fixed!

## The Result
That single change perfectly drew a diagonal line straight through the middle of the grid. Every point in the bottom-left naturally had a negative sum (Class 0), and every point in the top-right had a positive sum (Class 1). 

Here is what it looked like in the challenge terminal when I entered `SET 1 1 0` and hit `CHECK`:

```text
+4         |       /
+3         | x   /
+2         |   1
+1         | /   1
+0 - - - - / - - - -
-1       x |
-2 0 0 /   |
-3   /     |
-4 /       |
   -4-3-2-1+0+1+2+3+4

Current weights -> w1: 1, w2: -1, b: 0

  point    label  perceptron  activation
  ------   -----  ----------  ----------
  (-3,-2)     0        0        -1
  (-1,-1)     0        1        0
  (-4,-2)     0        0        -2
  (+3,+1)     1        1        2
  (+2,+2)     1        1        0
  (+1,+3)     1        0        -2

> SET 1 1 0
+4 /       |
+3   /     | 1
+2     /   |   1
+1       / |     1
+0 - - - - / - - - -
-1       0 | /
-2 0 0     |   /
-3         |     /
-4         |       /
   -4-3-2-1+0+1+2+3+4

Current weights -> w1: 1, w2: 1, b: 0

  point    label  perceptron  activation
  ------   -----  ----------  ----------
  (-3,-2)     0        0        -5
  (-1,-1)     0        0        -2
  (-4,-2)     0        0        -6
  (+3,+1)     1        1        4
  (+2,+2)     1        1        4
  (+1,+3)     1        1        4

> CHECK
Perfect! All points are classified correctly.
```

The system verified all points, and I secured my next flag! It is incredibly satisfying to see how just flipping a single weight from negative to positive completely changes the AI's "worldview" and how it draws its boundaries. 

On to the next challenge!

***

# Thinking Outside the Axis: Drawing a Horizontal Boundary 🏢

Welcome back! The Cylab Security Academy just threw a brilliant curveball at me in the **Perceptron Play Naught** challenge. It really hammered home why we need to build intuition instead of just memorizing math.

## The Setup
I was given a 2D grid with a new dataset. The goal was the same: find the weights ($w_1$, $w_2$) and the bias ($b$) to separate Class 0 (stay quiet) from Class 1 (fire). 

The starting parameters were $w_1 = 1$, $w_2 = -1$, and $b = 0$.

## The Problem: A Messy X-Axis
When I looked at the data, the $x$-values (left/right positions) were a complete mess. Class 0 points and Class 1 points were completely overlapping on the $x$-axis. Trying to draw a vertical or even a diagonal line was going to be impossible because the points were too mixed up left-to-right.

## The "Building" Epiphany 💡
Instead of looking at the $x$-axis, I focused entirely on the $y$-axis (up/down). 

I imagined the grid as a tall building:
* All the Class 1 points lived "upstairs" on floors +1 and +2.
* All the Class 0 points lived "downstairs" on floors -1 and -2. 

It didn't matter what room (x-value) they were in; the only thing that mattered was their floor (y-value). I needed a perfectly flat, horizontal floor right between them.

## The Fix
To draw a perfectly horizontal line, I needed my perceptron to completely ignore the $x$-values. How do you make a number disappear in math? Multiply it by zero!

I set my first weight ($w_1$) to **0**. 
Then, I set my second weight ($w_2$) to **1** so the positive "upstairs" numbers would stay positive, and the negative "downstairs" numbers would stay negative. I left the bias at **0**.

My new perceptron rule was beautifully simple: 
$$ y \geq 0 $$

* For a point upstairs (e.g., $y = +2$): $2 \geq 0$. It fires! (Class 1)
* For a point downstairs (e.g., $y = -1$): $-1 \geq 0$. It stays quiet! (Class 0)

Here is what it looked like in the challenge terminal when I entered `SET 0 1 0` and hit `CHECK`:

```text
+4         |       /
+3         |     /
+2       x x   /   1
+1         | /   1
+0 - - - - / - - - -
-1 0     / x   x
-2     /   |
-3   /     |
-4 /       |
   -4-3-2-1+0+1+2+3+4

Current weights -> w1: 1, w2: -1, b: 0

  point    label  perceptron  activation
  ------   -----  ----------  ----------
  (-4,-1)     0        0        -3
  (-1,+2)     1        0        -3
  (+0,-1)     0        1        1
  (+0,+2)     1        0        -2
  (+2,-1)     0        1        3
  (+3,+1)     1        1        2
  (+4,+2)     1        1        2

> SET 0 1 0
+4         |
+3         |
+2       1 1       1
+1         |     1
+0 / / / / / / / / /
-1 0       0   0
-2         |
-3         |
-4         |
   -4-3-2-1+0+1+2+3+4

Current weights -> w1: 0, w2: 1, b: 0

  point    label  perceptron  activation
  ------   -----  ----------  ----------
  (-4,-1)     0        0        -1
  (-1,+2)     1        1        2
  (+0,-1)     0        0        -1
  (+0,+2)     1        1        2
  (+2,-1)     0        0        -1
  (+3,+1)     1        1        1
  (+4,+2)     1        1        2

> CHECK
Perfect! All points are classified correctly.
```

The system verified all points, and I grabbed my next flag! It was a great lesson in how zeroing out a weight allows an AI to completely ignore irrelevant data.
