**Prompt to build web site in Lovable AI and Cursor**

Build a complete, modern, fully interactive single-page educational web application called TransiQuest — "Quest to Master Transistors & Circuit Magic".
Target audience: Teenage students (ages 14–18). Tone must feel fun, energetic, slightly gamer-like, empowering, and cool — never childish or boring. Use short sentences, occasional gaming slang (“level up”, “epic combo”, “power spike”), and real-world hooks like “this is what powers your phone, gaming PC, and TikTok”.
Visual style & tech vibe:

Futuristic cyber-tech lab meets video game: dark navy/black background with glowing neon electric-blue (#00F0FF), neon-green (#39FF14), and purple accents.
Subtle animated circuit-board particle background or faint glowing lines that pulse.
Bold, modern fonts (Inter + Orbitron for headings). Rounded glowing cards, hover glow effects, confetti explosions on wins.
Fully responsive Tailwind + shadcn/ui + React. Dark mode only. Smooth page transitions and micro-animations everywhere.
Gamification: XP points, progress bar at top, unlockable badges (“Switch Master”, “Logic Lord”, “Transistor Titan”), streak counter, simple profile with level (Novice → Titan).

Core navigation (persistent left sidebar that collapses on mobile + top bar with logo and progress):

Home / Dashboard
Learn (Tutorials)
Quiz Arena
Build Lab (drag & drop)
Ask Sparky (AI chatbot)
Resources

Pages & Features (build everything in one app with local storage for progress/XP/badges):

Home/Dashboard
Hero section with large animated transistor SVG (electrons flowing, switch flipping, amplify mode pulsing). Big headline: “TransiQuest: Become a Transistor Titan!”
Subtitle: “The tiny heroes inside every phone, computer & game console.”
Quick-start cards: “Start Learning →”, “Jump to Build Lab”, “Challenge a Quiz”.
Show today’s XP, current level, unlocked badges, and a “Continue your quest” section with next recommended activity.
Learn – Basic Tutorials with simple animations
6 bite-sized interactive lessons (scrollable cards or stepper):
What is a transistor & why it matters
BJT (NPN & PNP) explained
MOSFETs (enhancement & depletion)
Transistor as a switch
Transistor as an amplifier
Transistor combinations → Logic gates (NOT, AND, OR, NAND, NOR)
Each lesson has clean text + simple SVG/Canvas animations (e.g., electrons moving when “on”, current paths lighting up, truth-table inputs changing output in real time, gate animation showing 0s & 1s). Include “Test it yourself” mini-simulator at the end of each lesson.

Quiz Arena – Multiple choice
25+ multiple-choice questions across all topics, 3 difficulty levels.
Instant feedback with explanation + fun meme-style reaction image.
Score, streak counter, XP reward on completion. Leaderboard (local only) and “Retry” button.
Build Lab – Drag & drop exercises
Interactive canvas that looks like a digital breadboard.
Draggable components: NPN/PNP transistors, resistors, LEDs, wires, batteries, input switches (0/1), power rails.
Pre-made challenges with clear targets:
“Build a NOT gate (inverter)”
“Build an AND gate”
“Build an OR gate”
“Make a simple amplifier that lights the LED brighter”
“Create a light sensor switch”
“Run” button simulates the circuit (visual current flow + output LED/state changes). Green check + XP + confetti when target achieved. Hint system and “Show solution” after 3 tries.

Ask Sparky – LLM chatbot
Floating chat bubble or dedicated full-screen page titled “Ask Sparky the Transistor Bot”.
Friendly robot avatar. Pre-loaded knowledge about all transistor topics.
Users can type any question (“How does a MOSFET work?”, “Why do we use NAND gates in CPUs?”, “Explain this circuit I built…”) and get accurate, teen-friendly, step-by-step answers.
Show example starter questions as chips. Keep conversation history in the session.
Resources
Glossary (clickable terms with short explanations + diagrams)
Timeline of transistor history (1947 to today)
Downloadable PDFs (circuit diagrams, cheat sheets)
Curated external links (Khan Academy, YouTube explainers, real-world uses)
“Print my progress certificate” button when all badges unlocked.


Technical notes for Lovable:

Use React + TypeScript + Tailwind CSS + shadcn/ui.
All interactivity (animations, drag-and-drop, quiz logic, circuit simulation) must be client-side JavaScript (no external heavy libraries needed).
Progress, XP, badges, and quiz scores saved in browser localStorage.
Make the whole app feel instantly fun and polished — no placeholder text.

Start building with the Home/Dashboard page first, including the animated hero transistor, then add the sidebar navigation and the other sections one by one. Make it feel alive and game-like from the very first screen.
