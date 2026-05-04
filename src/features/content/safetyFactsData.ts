export interface SafetyFact {
  text: string;
  sourceLabel: string;
  sourceUrl: string;
}

export const safetyFacts: SafetyFact[] = [
  {
    text: "Higher speeds increase both crash risk and crash severity.",
    sourceLabel: "WHO: Road traffic injuries",
    sourceUrl: "https://www.who.int/news-room/fact-sheets/detail/road-traffic-injuries",
  },
  {
    text: "Speeding contributes to a significant share of traffic deaths each year.",
    sourceLabel: "NHTSA: Speeding",
    sourceUrl: "https://www.nhtsa.gov/risky-driving/speeding",
  },
  {
    text: "Even small speed increases reduce reaction and stopping margins.",
    sourceLabel: "IIHS: Speed and crash risk",
    sourceUrl: "https://www.iihs.org/topics/speed",
  },
];
