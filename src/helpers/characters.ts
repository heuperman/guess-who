const generateOptions = () => {
  const options: number[][] = [];
  const features = [0, 1, 2];

  for (const firstFeature of features) {
    for (const secondFeature of features) {
      for (const thirdFeature of features) {
        for (const fourthFeature of features) {
          options.push([
            firstFeature,
            secondFeature,
            thirdFeature,
            fourthFeature,
          ]);
        }
      }
    }
  }

  return options;
};

export const createCharacters = () => {
  const options = generateOptions();

  return new Array(18).fill(null).map(() => {
    const index = Math.floor(Math.random() * options.length);
    const character = options[index];
    options.splice(index, 1);

    return character;
  });
};

export const pickTarget = (characters: number[][]) =>
  characters[Math.floor(Math.random() * characters.length)];