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
