const levels = [
  // LEVEL I
  [
    { name: "paratrooper" },
    { name: "paratrooper", delay: 800 },
    { name: "paratrooper", delay: 800 },
  ],
  // LEVEL II
  [
    { name: "paratrooper", delay: 2000 },
    { name: "paratrooper", delay: 800 },
    { name: "paratrooper", delay: 800 },

    { name: "paratrooper", delay: 4000 },
    { name: "paratrooper", delay: 800 },

    { name: "paratrooper", delay: 4000 },
    { name: "paratrooper", delay: 800 },
  ],
  // LEVEL III
  [
    { name: "scooterunit", delay: 2000 },
    { name: "scooterunit", delay: 2000 },
    { name: "paratrooper", delay: 800 },
    { name: "scooterunit", delay: 800 },
    { name: "paratrooper", delay: 800 },
  ],
  // LEVEL IV
  [
    { name: "scooterunit", delay: 2000 },

    { name: "paratrooper", delay: 500 },
    { name: "paratrooper", delay: 500 },

    { name: "scooterunit" },
  ],
  // LEVEL V
  [
    { name: "paratrooper", delay: 2000 },
    { name: "scooterunit", delay: 1000 },
    { name: "paratrooper", delay: 500 },

    { name: "paratrooper", delay: 4000 },
    { name: "scooterunit", delay: 1000 },
    { name: "paratrooper", delay: 500 },

    { name: "paratrooper", delay: 4000 },
    { name: "paratrooper", delay: 500 },
    { name: "scooterunit" },

    { name: "scooterunit", delay: 4000 },
    { name: "paratrooper", delay: 500 },
    { name: "paratrooper", delay: 500 },
  ],
  // LEVEL VI
  [
    { name: "paratrooper", delay: 2000 },
    { name: "paratrooper", delay: 500 },
    { name: "paratrooper", delay: 500 },
    { name: "scooterunit" },

    { name: "paratrooper", delay: 1000 },
    { name: "scooterunit" },

    { name: "paratrooper", delay: 1000 },
    { name: "paratrooper", delay: 500 },

    { name: "paratrooper", delay: 1000 },
    { name: "paratrooper", delay: 500 },
    { name: "paratrooper", delay: 500 },
    { name: "scooterunit" },

    { name: "scooterunit", delay: 1000 },

    { name: "scooterunit", delay: 1000 },
    { name: "paratrooper", delay: 500 },
    { name: "paratrooper", delay: 500 },
    { name: "paratrooper", delay: 500 },
    { name: "paratrooper", delay: 500 },

    { name: "paratrooper", delay: 1000 },

    { name: "scooterunit", delay: 1000 },
    { name: "scooterunit", delay: 500 },

    { name: "paratrooper", delay: 1000 },
    { name: "scooterunit", delay: 500 },

    { name: "paratrooper", delay: 500 },
    { name: "paratrooper", delay: 500 },
    { name: "paratrooper", delay: 500 },
  ],
  // LEVEL VII
  [
    { name: "paratrooper", delay: 2000 },
    { name: "scooterunit", delay: 500 },

    { name: "paratrooper", delay: 1000 },
    { name: "paratrooper", delay: 500 },
    { name: "paratrooper", delay: 500 },

    { name: "nuclearbomb", delay: 3000 },

    { name: "paratrooper", delay: 5000 },
    { name: "paratrooper", delay: 500 },
    { name: "paratrooper", delay: 500 },
    { name: "scooterunit", delay: 500 },

    { name: "paratrooper", delay: 1000 },
    { name: "paratrooper", delay: 500 },
    { name: "paratrooper", delay: 500 },

    { name: "nuclearbomb", delay: 3000 },

    { name: "paratrooper", delay: 5000 },
    { name: "paratrooper", delay: 500 },
    { name: "scooterunit", delay: 500 },

    { name: "paratrooper", delay: 1000 },
    { name: "scooterunit", delay: 500 },

    { name: "paratrooper", delay: 1000 },
    { name: "paratrooper", delay: 500 },

    { name: "paratrooper", delay: 1000 },
    { name: "paratrooper", delay: 500 },

    { name: "nuclearbomb", delay: 2000 },

    { name: "paratrooper", delay: 5000 },

    { name: "paratrooper", delay: 1000 },

    { name: "nuclearbomb", delay: 2000 },

    { name: "paratrooper", delay: 1000 },
  ],
  // LEVEL VIII
  [{ name: "warplane" }],
  // LEVEL IX
  [
    { name: "paratrooper", delay: 2000 },
    { name: "paratrooper" },
    { name: "scooterunit", delay: 1000 },
    { name: "scooterunit" },
    { name: "paratrooper", delay: 500 },
    { name: "paratrooper" },

    { name: "paratrooper", delay: 4000 },
    { name: "paratrooper" },
    { name: "scooterunit", delay: 1000 },
    { name: "scooterunit" },
    { name: "paratrooper", delay: 500 },
    { name: "paratrooper" },

    { name: "paratrooper", delay: 4000 },
    { name: "paratrooper" },
    { name: "paratrooper", delay: 500 },
    { name: "paratrooper" },
    { name: "scooterunit" },
    { name: "scooterunit" },

    { name: "scooterunit", delay: 4000 },
    { name: "scooterunit" },
    { name: "paratrooper", delay: 500 },
    { name: "paratrooper" },
    { name: "paratrooper", delay: 500 },
    { name: "paratrooper" },
  ],
  // LEVEL X
  [
    { name: "nuclearbomb", delay: 2000 },
    { name: "nuclearbomb", delay: 100 },
    { name: "nuclearbomb", delay: 100 },

    { name: "paratrooper", delay: 4000 },
    { name: "paratrooper", delay: 500 },
    { name: "paratrooper", delay: 500 },
    { name: "paratrooper", delay: 500 },
    { name: "paratrooper", delay: 500 },
    { name: "paratrooper", delay: 500 },
    { name: "paratrooper", delay: 500 },
    { name: "paratrooper", delay: 500 },
    { name: "paratrooper", delay: 500 },

    { name: "nuclearbomb", delay: 10000 },
    { name: "nuclearbomb", delay: 100 },
    { name: "nuclearbomb", delay: 100 },
    { name: "nuclearbomb", delay: 100 },
    { name: "nuclearbomb", delay: 100 },

    { name: "paratrooper", delay: 4000 },
    { name: "paratrooper", delay: 500 },
    { name: "paratrooper", delay: 500 },
    { name: "paratrooper", delay: 500 },
    { name: "paratrooper", delay: 500 },
    { name: "paratrooper", delay: 500 },
    { name: "paratrooper", delay: 500 },
    { name: "paratrooper", delay: 500 },
    { name: "paratrooper", delay: 500 },
    { name: "paratrooper", delay: 500 },

    { name: "scooterunit" },
    { name: "scooterunit", delay: 500 },
    { name: "scooterunit", delay: 500 },

    { name: "paratrooper", delay: 500 },
    { name: "paratrooper", delay: 500 },
  ],
  // LEVEL XI
  [
    { name: "paratrooper", delay: 2000 },
    { name: "scooterunit", delay: 500 },
    { name: "scooterunit", delay: 500 },

    { name: "paratrooper", delay: 1000 },
    { name: "paratrooper", delay: 500 },
    { name: "paratrooper", delay: 500 },

    { name: "nuclearbomb", delay: 3000 },

    { name: "paratrooper", delay: 5000 },
    { name: "paratrooper", delay: 500 },
    { name: "paratrooper", delay: 500 },
    { name: "scooterunit", delay: 500 },
    { name: "scooterunit", delay: 500 },
    { name: "scooterunit", delay: 500 },

    { name: "paratrooper", delay: 1000 },
    { name: "paratrooper", delay: 500 },
    { name: "paratrooper", delay: 500 },

    { name: "nuclearbomb", delay: 3000 },

    { name: "paratrooper", delay: 5000 },
    { name: "paratrooper", delay: 500 },
    { name: "scooterunit", delay: 500 },

    { name: "paratrooper", delay: 1000 },
    { name: "scooterunit", delay: 500 },

    { name: "paratrooper", delay: 1000 },
    { name: "paratrooper", delay: 500 },

    { name: "paratrooper", delay: 1000 },
    { name: "paratrooper", delay: 500 },

    { name: "nuclearbomb", delay: 2000 },

    { name: "scooterunit", delay: 500 },
    { name: "scooterunit", delay: 500 },
    { name: "scooterunit", delay: 500 },

    { name: "paratrooper", delay: 5000 },

    { name: "paratrooper", delay: 1000 },

    { name: "nuclearbomb", delay: 2000 },

    { name: "paratrooper", delay: 1000 },
  ],
  // LEVEL XII
  [
    { name: "paratrooper", delay: 2000 },
    { name: "paratrooper" },
    { name: "paratrooper", delay: 500 },
    { name: "paratrooper" },
    { name: "paratrooper", delay: 500 },
    { name: "paratrooper" },
    { name: "scooterunit" },
    { name: "scooterunit" },

    { name: "paratrooper", delay: 1000 },
    { name: "paratrooper" },
    { name: "scooterunit" },
    { name: "scooterunit" },

    { name: "paratrooper", delay: 1000 },
    { name: "paratrooper" },
    { name: "paratrooper", delay: 500 },
    { name: "paratrooper" },

    { name: "paratrooper", delay: 1000 },
    { name: "paratrooper" },
    { name: "paratrooper", delay: 500 },
    { name: "paratrooper" },
    { name: "paratrooper", delay: 500 },
    { name: "paratrooper" },
    { name: "scooterunit" },
    { name: "scooterunit" },

    { name: "scooterunit", delay: 1000 },
    { name: "scooterunit" },

    { name: "scooterunit", delay: 1000 },
    { name: "scooterunit" },
    { name: "paratrooper", delay: 500 },
    { name: "paratrooper" },
    { name: "paratrooper", delay: 500 },
    { name: "paratrooper" },
    { name: "paratrooper", delay: 500 },
    { name: "paratrooper" },
    { name: "paratrooper", delay: 500 },
    { name: "paratrooper" },

    { name: "paratrooper", delay: 1000 },
    { name: "paratrooper" },

    { name: "paratrooper", delay: 1000 },
    { name: "paratrooper" },
    { name: "scooterunit" },

    { name: "paratrooper", delay: 500 },
    { name: "paratrooper" },
    { name: "paratrooper", delay: 500 },
    { name: "paratrooper" },
    { name: "paratrooper", delay: 500 },
    { name: "paratrooper" },
  ],
  // LEVEL XIII
  [
    { name: "warplane" },

    { name: "paratrooper", delay: 5000 },
    { name: "paratrooper" },
    { name: "paratrooper", delay: 500 },
    { name: "paratrooper" },

    { name: "paratrooper", delay: 15000 },
    { name: "paratrooper" },
    { name: "paratrooper", delay: 500 },
    { name: "paratrooper" },

    { name: "paratrooper", delay: 15000 },
    { name: "paratrooper" },
    { name: "paratrooper", delay: 500 },
    { name: "paratrooper" },
    { name: "scooterunit" },

    { name: "scooterunit", delay: 15000 },
    { name: "paratrooper" },
    { name: "paratrooper", delay: 500 },
    { name: "paratrooper" },
    { name: "scooterunit" },
  ],
];

export default levels;
