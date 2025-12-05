export function generateGameName() {
  const prefixes = [
    "Dark",
    "Shadow",
    "Fire",
    "Iron",
    "Storm",
    "Frost",
    "Void",
    "Blood",
    "Sky",
    "Steel",
  ];
  const middles = [
    "bane",
    "fang",
    "blade",
    "wing",
    "strike",
    "shade",
    "flame",
    "thorn",
    "soul",
    "drift",
  ];
  const suffixes = [
    "born",
    "walker",
    "weaver",
    "runner",
    "hunter",
    "warden",
    "rider",
    "seeker",
    "keeper",
    "mancer",
  ];

  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const randomMiddle = middles[Math.floor(Math.random() * middles.length)];
  const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];

  return `${randomPrefix}${randomMiddle}${randomSuffix}`;
}
