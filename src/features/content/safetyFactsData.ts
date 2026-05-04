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
  {
    text: "A pedestrian struck at 50 mph is far less likely to survive than one struck at 30 mph.",
    sourceLabel: "WHO: Road traffic injuries",
    sourceUrl: "https://www.who.int/news-room/fact-sheets/detail/road-traffic-injuries",
  },
  {
    text: "Speed-related crashes cost billions in economic losses annually.",
    sourceLabel: "NHTSA: Speeding",
    sourceUrl: "https://www.nhtsa.gov/risky-driving/speeding",
  },
  {
    text: "Doubling your speed quadruples the energy released in a crash.",
    sourceLabel: "IIHS: Speed and crash risk",
    sourceUrl: "https://www.iihs.org/topics/speed",
  },
  {
    text: "Speed limits are set based on road design, traffic, and pedestrian safety — not just flow.",
    sourceLabel: "FHWA: Speed management",
    sourceUrl: "https://highways.dot.gov/safety/speed-management",
  },
  {
    text: "Rear-end crashes increase significantly at higher speeds due to longer stopping distances.",
    sourceLabel: "IIHS: Speed and crash risk",
    sourceUrl: "https://www.iihs.org/topics/speed",
  },
  {
    text: "Roads with lower speed limits consistently show fewer and less severe crashes.",
    sourceLabel: "IIHS: Speed and crash risk",
    sourceUrl: "https://www.iihs.org/topics/speed",
  },
];
