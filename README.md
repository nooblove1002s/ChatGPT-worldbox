# ChatGPT-WorldBox

A mobile-friendly, 2D pixel-art god simulator and evolving world sandbox. This project is maintained on the repository's `main` branch and is separate from HYPERBLOCK.

## Run the game

Open `index.html` from a static web server or enable GitHub Pages for this repository. The game uses plain HTML, CSS, and JavaScript with no build step or external runtime dependencies.

## Current working features

- Procedurally generated tile maps in small, medium, and large sizes
- Editable grass, water, sand, forest, mountain, and snow terrain
- Touch-friendly map painting, brush sizes, citizen placement, settlement placement, erase, and inspect tools
- Simulation pause/play, single-step, and speed controls
- Starter citizen needs, aging, mortality, food collection, and settlement births
- Settlement-level food, wood, and stone gathering based on nearby terrain
- Settlement knowledge accumulation and technology progression through ten eras: Nomadic, Agrarian, Bronze Age, Classical, Medieval, Renaissance, Industrial, Modern, Advanced, and Spacefaring
- Settlement stability that responds to food pressure
- Government types and occasional government reorganization
- Kingdom formation for developed, sufficiently populated settlements
- Live civilization overview, kingdom count, and advancement stats
- Event history, save/load in the current browser's local storage, and legacy-save migration for the new civilization fields

## Save behavior

Saves currently live in this browser on this device. They are not cloud saves and will not automatically transfer between browsers or devices. The game adds missing civilization fields when loading older saves.

## Current limits

This is an actively growing prototype, not the complete long-term design. It does not yet include full diplomacy, gradual conquest, vassal/puppet states, detailed citizen families/jobs/education, historical Earth scenarios, deep military logistics, or advanced AI. Those should be implemented as tested systems rather than advertised as complete features.

## Next development priorities

1. Make citizen movement, family formation, jobs, and settlement population rules more robust.
2. Add inter-settlement trade, resource shortages, and meaningful technology requirements.
3. Build diplomacy, alliances, gradual conquest, occupation, vassals, and puppet states.
4. Expand persistent world history and scenario/map tools.
5. Add historical eras, disasters, crisis systems, and performance safeguards.
