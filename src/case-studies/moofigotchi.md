---
tags: lab
title: Moofigotchi
dek: "An exploration of an AI-assisted workflow. Differentiating between delegation and ownership of work."
role: Concept, Design & Pixel Art
type: experiment
summary: "A Tamagotchi-style app with Moof the dogcow, built to explore when to delegate to AI and when to own the work."
timeframe: 2026
size: s
stack: Claude / Figma
links:
  - { label: "Moofigotchi on GitHub", url: "https://github.com/outoffoffice/moofigotchi" }
heroImage: moofgotchi/25-background-waves.png
heroImageAlt: The Moofigotchi device, a dark handheld with an olive LCD screen showing Moof the dogcow in pixel art in front of a wavy landscape, on a grey background
---

In this short case study I wanted to go through a creative process, focusing on how and when I use generative AI as a tool, and to sum up a kind of flow that makes it a conscious use of the tool. Here are my key takeaways. To make comparison easier, I will refer to the process without AI as the "non-AI process". One thing stays the same either way: before you start, you should already have an idea of what you want, however detailed or low-resolution it is.

## Three Basic Steps in AI-Based Creation

{% imageNatural "moofgotchi/Two-cycle-pixel-design-process.png", "Two cycles of generate, differentiate and adapt" %}

### 1. Generate: Bring Something to the Table

At this point it doesn't matter how detailed it is. In the non-AI process you would also use either a sketch or a mood board, which mostly consists of defined images as well.

### 2. Differentiation Point

AI can be quite powerful and give you a highly polished result in the first round. But is this result the one you wanted in the first place? It is important to now distinguish between what you are presented with and what you intended to create, and to weigh it up: What do you want to change?

Don't worry: in every creative process (non-AI included) you always get influenced by what you perceive and see. Just try to be aware of it here.

### 3. Adaptation

Similar to the Double Diamond process, there will be a phase of exploration followed by a phase of distillation, in which you either instruct your LLM to make changes towards your intended vision or simply do the manual work yourself. In this project I also caught myself doing manual work on pixel art. Not just because it was necessary, but also because it was simply fun!

## The Example Project

I wanted to create a small project to explore the process. The vision was clear: I wanted to create a Tamagotchi-style app featuring the beloved Moof, the dogcow. Looking back, the project ran through the three steps twice, just like in the graphic above: the first cycle produced a quick terminal sketch, the second turned it into the actual app, with the adaptation phase happening in Figma.

### First Concept with a Terminal Sketch

It can be fine to start with a first prompt of just a few words, also to get clear yourself about what you want to do. It doesn't have to be a mega-prompt with everything in it. In my case, I was lucky enough to get a Python version right in the client. Afterwards it occurred to me that this was an efficient way to draft the idea first. Even though in this case it seems more easily applicable to a Tamagotchi-like, low-res scenario, I imagine such simple software sketches can be useful in the first phase as a sort of wireframe prototype.

{% imagePair "moofgotchi/First-Sketch.png", "moofgotchi/Second-Sketch.png" %}

### A Finer Graphic Version

Now it was time to move towards the intended app format. In my case I rolled the dice again to see how Claude would interpret my vision described in words. But at this point it drifted apart: the result did not match what I had imagined. What didn't fit was the overall style, the way things were shown on the display and the way Moof was drawn, and for each of these I had to name concrete references. I did one more rerun, describing specifically what the details should look like visually, but quickly realized I had reached a point where my direct manipulation was needed. This was where the adaptation phase I mentioned earlier in this article came in.

{% imagePair "moofgotchi/01-home-light.png", "moofgotchi/02-home-dark.png" %}

### Time to Define the Details

Now I took the result into Figma and started building it myself, manually drawing some assets I already had in mind, but augmenting them by generating alternate versions.

{% imageTrio "moofgotchi/figma-work-1.png", "moofgotchi/figma-work-2.png", "moofgotchi/figma-work-3.png" %}

I felt this step was a crucial one: to rework every detail of the design. *This way it started to feel more genuinely like a craft instead of just accepting a generated result.* Using both manual work and amplifying it with an agent helped me focus on the creative part, both conceptually and in fine visual detail work.

{% imageScreens "moofgotchi/10-poops.png", "moofgotchi/Figma-agent-reproduction.png", "Left: the last version from Claude. Right: the Figma agent's reproduction of the interface, rebuilt just by looking at a screenshot. Quite impressive." %}

Afterwards it occurred to me that I could have defined the logic of the game first, then worked out which assets would be necessary, and just asked for generic sketches or placeholders. In the Tamagotchi case the functionality was obvious: take care of a digital creature, with one or two little games in it. So here Claude of course copied the standard Tamagotchi logic and applied it to Moofigotchi. That way the classic catch-a-cookie game ended up in the program, which I did not like because it did not fit the overall story. So I changed it to either taking a walk and training your dog, or bouncing a ball.

{% imageScreens "moofgotchi/v4-mg1/10-ball-game.png", "moofgotchi/v4-mg1/17-walk-sit.png", "Bouncing a ball and training on a walk" %}

## What to Keep and What to Delegate?

I noticed in this instance that there were parts I was happy for Claude to take over, as they would have needed a lot of attention and work up front, like all the phrases Moof communicates with you. Still, I got really excited to dedicate some time to this very detail: what the dogcow would say to you. This is just one of many examples where I realized two things. First: the more dedication I gave to certain details, the more the result felt like my own creation. And second: having the result already working and mostly built in front of me helped me immensely to dedicate my energy to the creative part. As I worked out the details, the project took more and more shape, and new ideas even came to me along the way, showing me that there was still a lot of creative work left for me.

{% imageScreens "moofgotchi/v4-mg1/02-home-light.png", "moofgotchi/v4-mg1/11-ball-game-later.png", "moofgotchi/v4-mg1/16-walk-event-later.png", "moofgotchi/v4-mg1/33-night-sleeping-light.png", "The final screens in light mode: home, bouncing the ball, an event on the walk and sleeping in the printer" %}

**What I delegated:** the first drafts, the code and the game logic, a first set of phrases for Moof, alternate versions of my assets and rebuilding the interface in Figma.

**What I kept:** the vision, and the UI concept: instead of many buttons, just three, with the functions chosen on the display. I rebuilt the interface and changed and adjusted its details, drew pixel art like the trees and clouds myself and redrew parts of the icons so they match visually. And finally: games that fit the story, and what Moof actually says to you.

If you are interested in trying it out and maybe building on it yourself, you can get the Moofigotchi build on GitHub [here](https://github.com/outoffoffice/moofigotchi).
