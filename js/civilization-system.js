/* ChatGPT-WorldBox: deterministic, save-friendly settlement and civilization simulation.
   This module adds real settlement resources, population pressure, knowledge, eras,
   governments, and kingdom formation to the lightweight tile-world foundation. */
(function () {
  "use strict";
  const ERAS = [
    { name: "Nomadic", threshold: 0 },
    { name: "Agrarian", threshold: 12 },
    { name: "Bronze Age", threshold: 35 },
    { name: "Classical", threshold: 75 },
    { name: "Medieval", threshold: 140 },
    { name: "Renaissance", threshold: 230 },
    { name: "Industrial", threshold: 360 },
    { name: "Modern", threshold: 540 },
    { name: "Advanced", threshold: 780 },
    { name: "Spacefaring", threshold: 1100 }
  ];
  const GOVERNMENTS = ["Council", "Chieftaincy", "Republic", "Monarchy", "Federation"];
  function ensure(world) {
    if (!world || !Array.isArray(world.settlements)) return;
    world.kingdoms = Array.isArray(world.kingdoms) ? world.kingdoms : [];
    world.settlements.forEach((s, i) => {
      s.resources = s.resources || { food: Number(s.food) || 20, wood: 5, stone: 2, knowledge: 0 };
      s.resources.food = Math.max(0, Number(s.resources.food) || 0);
      s.resources.wood = Math.max(0, Number(s.resources.wood) || 0);
      s.resources.stone = Math.max(0, Number(s.resources.stone) || 0);
      s.resources.knowledge = Math.max(0, Number(s.resources.knowledge) || 0);
      s.technology = Math.max(0, Number(s.technology) || 0);
      s.era = s.era || "Nomadic";
      s.government = s.government || GOVERNMENTS[i % 2];
      s.stability = Number.isFinite(s.stability) ? s.stability : 70;
      s.kingdomId = s.kingdomId || null;
      s.lastGrowthDay = Number(s.lastGrowthDay) || 0;
    });
  }
  function step(world, day, addEvent) {
    ensure(world);
    if (!world || !world.settlements.length) return;
    const citizens = world.citizens || [];
    const activeKingdomIds = new Set();
    world.settlements.forEach((s) => {
      const people = citizens.filter(c => c.home === s.id || Math.hypot(c.x - s.x, c.y - s.y) <= 4);
      s.population = people.length;
      const r = s.resources;
      const localTiles = [];
      for (let y = Math.max(0, s.y - 3); y <= Math.min(world.h - 1, s.y + 3); y++) {
        for (let x = Math.max(0, s.x - 3); x <= Math.min(world.w - 1, s.x + 3); x++) {
          const t = world.tiles[y][x];
          if (Math.hypot(x - s.x, y - s.y) <= 3.5) localTiles.push(t);
        }
      }
      const fertile = localTiles.filter(t => t.terrain === "grass" || t.terrain === "forest").length;
      const forest = localTiles.filter(t => t.terrain === "forest").length;
      const hills = localTiles.filter(t => t.terrain === "mountain").length;
      if (day % 5 === 0) {
        r.food = Math.max(0, r.food + fertile * 0.18 - people.length * 0.055);
        r.wood = Math.min(250, r.wood + forest * 0.035);
        r.stone = Math.min(250, r.stone + hills * 0.025);
        if (people.length) {
          const learning = Math.max(0.025, people.length * 0.012) * (r.food > 2 ? 1 : 0.45);
          r.knowledge = Math.min(10000, r.knowledge + learning);
          s.technology = Math.min(2000, s.technology + learning * (1 + Math.min(r.wood, r.stone) / 30));
        }
        s.stability = Math.max(0, Math.min(100, s.stability + (r.food > people.length * 0.4 ? 0.35 : -1.1)));
      }
      const era = [...ERAS].reverse().find(e => s.technology >= e.threshold) || ERAS[0];
      if (s.era !== era.name) {
        const previous = s.era;
        s.era = era.name;
        if (previous && addEvent) addEvent(s.name + " enters the " + era.name + " era.");
      }
      if (!s.kingdomId && people.length >= 8 && s.technology >= 20) {
        const kingdom = { id: "kingdom-" + s.id, name: s.name.replace(/Settlement/i, "Kingdom"), capitalId: s.id, members: [s.id], foundedDay: day, government: s.government, strength: people.length + s.technology / 5 };
        world.kingdoms.push(kingdom);
        s.kingdomId = kingdom.id;
        activeKingdomIds.add(kingdom.id);
        if (addEvent) addEvent(kingdom.name + " forms around " + s.name + ".");
      }
      if (s.kingdomId) activeKingdomIds.add(s.kingdomId);
      if (day % 30 === 0 && people.length >= 3 && r.food > 5 && Math.random() < 0.16) {
        const old = s.government;
        s.government = GOVERNMENTS[Math.floor(Math.random() * GOVERNMENTS.length)];
        if (old !== s.government && addEvent) addEvent(s.name + " reorganizes its government: " + old + " → " + s.government + ".");
      }
      s.food = r.food;
    });
    world.kingdoms = world.kingdoms.filter(k => activeKingdomIds.has(k.id));
  }
  function summarize(world) {
    ensure(world);
    const settlements = world && world.settlements || [];
    const kingdoms = world && world.kingdoms || [];
    const eras = settlements.reduce((out, s) => { out[s.era || "Nomadic"] = (out[s.era || "Nomadic"] || 0) + 1; return out; }, {});
    const advanced = settlements.filter(s => (s.technology || 0) >= 140).length;
    return { kingdoms: kingdoms.length, advanced, eras, settlements: settlements.length };
  }
  window.CivilizationSystem = { ensure, step, summarize, eras: ERAS.map(e => e.name) };
})();