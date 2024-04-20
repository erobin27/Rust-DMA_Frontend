export const findDuplicates = <T>(items: T[]): T[] => {
  const seen = new Set<T>();
  const duplicates = new Set<T>();

  items.forEach((item) => {
    if (seen.has(item)) {
      duplicates.add(item);
    } else {
      seen.add(item);
    }
  });

  return Array.from(duplicates);
}
