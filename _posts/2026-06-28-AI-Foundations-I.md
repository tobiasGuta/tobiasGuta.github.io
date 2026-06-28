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
