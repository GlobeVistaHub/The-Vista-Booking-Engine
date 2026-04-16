import { Property } from './src/data/properties';

const getReliabilityScore = (p: { rating: number; reviews: number }) => {
  return p.rating * Math.log10((p.reviews || 0) + 1);
};

const mockProps: any[] = [
  { id: 1, title: "Small Star", rating: 4.9, reviews: 5, isInstantBookable: false, tags: [] },
  { id: 2, title: "Big Reliable", rating: 4.8, reviews: 500, isInstantBookable: false, tags: [] },
  { id: 3, title: "Instant Book 1", rating: 4.0, reviews: 10, isInstantBookable: true, tags: [] },
  { id: 4, title: "Instant Book 2", rating: 4.5, reviews: 100, isInstantBookable: true, tags: [] },
];

const sortProperties = (props: any[]) => {
  return [...props].sort((a, b) => {
    const aInstant = a.isInstantBookable || a.tags?.includes('tagInstantBook');
    const bInstant = b.isInstantBookable || b.tags?.includes('tagInstantBook');
    
    if (aInstant && !bInstant) return -1;
    if (!aInstant && bInstant) return 1;

    return getReliabilityScore(b) - getReliabilityScore(a);
  });
};

const sorted = sortProperties(mockProps);
console.log("Sorted Results:");
sorted.forEach((p, i) => {
  console.log(`${i+1}. ${p.title} - Instant: ${p.isInstantBookable}, Reliability: ${getReliabilityScore(p).toFixed(2)}`);
});
