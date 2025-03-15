import c from 'chroma-js';
import makeColorMoreChill from 'make-color-more-chill';
import { Image } from 'react-native';

// Placeholder function to extract colors from an image
async function getImageColors(imageUrl: string): Promise<{ dominant?: string; fallback?: string }> {
  return new Promise(resolve => {
    Image.getSize(
      imageUrl,
      () => {
        // Mock dominant and fallback colors
        resolve({ dominant: '#FF5733', fallback: '#C70039' });
      },
      () => {
        resolve({}); // Return empty object on failure
      }
    );
  });
}

export default async function getDominantColorFromImage(imageUrl: string, colorToMeasureAgainst: string) {
  const { dominant, fallback } = await getImageColors(imageUrl);

  if (dominant) {
    const chillDominant = makeColorMoreChill(dominant, colorToMeasureAgainst);

    if (c.deltaE(dominant, chillDominant) < 13) {
      return chillDominant;
    } else if (fallback && fallback !== dominant) {
      const chillFallback = makeColorMoreChill(fallback, colorToMeasureAgainst);
      return fallback === chillFallback ? chillFallback : chillDominant;
    }
  }
  return makeColorMoreChill(dominant || '#FFFFFF', colorToMeasureAgainst);
}
