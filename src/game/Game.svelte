<script lang="ts">
  import { onMount } from "svelte";
  import { storedCharacters, storedTarget } from "../stores";
  import Characters from "./Characters.svelte";
  import Question from "./Question.svelte";
  import Guess from "./Guess.svelte";

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

  const createCharacters = () => {
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

  onMount(async () => {
    const characters = createCharacters();
    if (characters) {
      const target = pickTarget(characters);
      storedCharacters.update(() => characters);
      storedTarget.update(() => target);
    }
  });
</script>

<div class="grid">
  <Characters />
  <Question />
  <Guess />
</div>

<style>
  .grid {
    display: grid;
    grid-template-columns: 5fr 2fr;
    grid-template-rows: 5fr 2fr;

    height: 100%;
    width: 760px;
    margin: 0 auto;
  }
</style>
