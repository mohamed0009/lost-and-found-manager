import { Item } from "../types";
import { notificationService } from "./notificationService";

const calculateSimilarity = (desc1: string, desc2: string): number => {
  const words1 = desc1.toLowerCase().split(" ");
  const words2 = desc2.toLowerCase().split(" ");

  const commonWords = words1.filter((word) => words2.includes(word));
  return commonWords.length / Math.max(words1.length, words2.length);
};

export const matchingService = {
  // Vérifier les correspondances potentielles
  findPotentialMatches: (item: Item, allItems: Item[]): Item[] => {
    const matches = allItems.filter(
      (otherItem) =>
        otherItem.id !== item.id &&
        otherItem.type !== item.type && // Un perdu avec un trouvé
        otherItem.category === item.category &&
        calculateSimilarity(item.description, otherItem.description) > 0.7
    );

    // Notifier les utilisateurs des correspondances
    matches.forEach((match) => {
      if (item.type === "Lost") {
        notificationService.notifyPotentialMatch(item, match);
      } else {
        notificationService.notifyPotentialMatch(match, item);
      }
    });

    return matches;
  },
};
