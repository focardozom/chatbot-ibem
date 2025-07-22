// personalityProfileGenerator.js

// Parameters for childhood Big-Five traits and difficulty (example normative means & std devs)
const traitParams = {
    openness:         { mean: 4.2, stdDev: 2.0 },
    conscientiousness:{ mean: 4.0, stdDev: 1.8 },
    extraversion:     { mean: 5.5, stdDev: 2.2 },
    agreeableness:    { mean: 3.0, stdDev: 1.5 },
    neuroticism:      { mean: 3.5, stdDev: 2.0 },
    resistencia:       { mean: 10.0, stdDev: 2.5 }
  };
  
  /**
   * Draws a single sample from N(mean, stdDev^2) using the Box–Muller transform,
   * then clamps the result to the range [0,10].
   */
  function randomTrait(mean, stdDev) {
    const u = 1 - Math.random();
    const v = 1 - Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v); // standard normal
    const value = mean + stdDev * z;
    return Math.max(0, Math.min(10, value));
  }
  
  /**
   * Generates a synthetic childhood profile including the Big-Five traits and a difficulty parameter.
   * Each trait uses its age-appropriate mean & stdDev. Returns an object with all six dimensions.
   */
  export function generateChildProfile() {
    const profile = {};
    for (const [trait, { mean, stdDev }] of Object.entries(traitParams)) {
      profile[trait] = randomTrait(mean, stdDev);
    }
    return profile;
  }
  
  // Export traitParams so you can inspect or reuse the normative values elsewhere
  export { traitParams, generateChildProfile, randomTrait };