<script lang="ts">
  import {
    storedCharacters,
    storedCorrectQuestions,
    storedIncorrectGuesses,
    storedIncorrectQuestions,
  } from "../stores";
  import Character from "./Character.svelte";

  let characters: number[][];
  storedCharacters.subscribe((value) => (characters = value));

  let incorrectQuestions: number[][];
  storedIncorrectQuestions.subscribe((value) => (incorrectQuestions = value));

  let incorrectGuesses: number[][];
  storedIncorrectGuesses.subscribe((value) => (incorrectGuesses = value));

  let correctQuestions: number[];
  storedCorrectQuestions.subscribe((value) => (correctQuestions = value));

  const isMatch = (character: number[], guess: number[]) => {
    if (character.length !== guess.length) return false;
    const matches = character.filter(
      (feature, index) => feature === guess[index]
    );
    return matches.length === guess.length;
  };

  const isPossible = (
    character: number[],
    correct: number[],
    incorrect: number[][],
    guesses: number[][]
  ) => {
    let possible = true;

    if (correct) {
      character.forEach((feature, index) => {
        if (
          (correct[index] !== undefined && feature !== correct[index]) ||
          incorrect[index].includes(feature)
        ) {
          possible = false;
        }
      });
    }

    if (possible) {
      const matches = guesses.filter((guess) => isMatch(character, guess));
      possible = !matches.length;
    }

    return possible;
  };
</script>

<div class="grid">
  {#each characters as character}
    <div class="wrapper">
      {#if !isPossible(character, correctQuestions, incorrectQuestions, incorrectGuesses)}
        <div class="ruled-out" />
      {/if}
      <Character {character} />
    </div>
  {/each}
</div>

<style>
  .grid {
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 1;
    grid-row-end: 2;

    display: grid;
    grid-template-columns: repeat(6, auto);
    grid-template-rows: repeat(3, auto);
    gap: 8px;

    width: 760px;
    margin: auto auto 12px;
    border-radius: 3px;
    text-align: center;
  }

  .wrapper {
    position: relative;
  }

  .ruled-out {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 3px;
    height: 160px;
    width: 120px;
    background-color: rgba(173, 173, 173, 0.4);
    backdrop-filter: blur(3px);
    z-index: 2;
  }
</style>
