<script lang="ts">
  import {
    storedCharacters,
    storedCorrectGuess,
    storedCorrectQuestions,
    storedIncorrectGuesses,
    storedIncorrectQuestions,
    storedTarget,
  } from "../stores";
  import Character from "./Character.svelte";

  let selectedIndex: number;
  let characters: number[][];
  let possibleCharacters: number[][];
  let selectedCharacter: number[];

  let incorrectQuestions: number[][];
  storedIncorrectQuestions.subscribe((value) => (incorrectQuestions = value));

  let incorrectGuesses: number[][];
  storedIncorrectGuesses.subscribe((value) => (incorrectGuesses = value));

  let correctQuestions: number[];
  storedCorrectQuestions.subscribe((value) => (correctQuestions = value));

  let target: number[];
  storedTarget.subscribe((value) => (target = value));

  $: possibleCharacters = characters.filter((character) =>
    isPossible(
      character,
      correctQuestions,
      incorrectQuestions,
      incorrectGuesses
    )
  );
  $: selectedCharacter = possibleCharacters[selectedIndex];
  $: selectedIndex =
    selectedIndex < possibleCharacters.length ? selectedIndex : 0;

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

  storedCharacters.subscribe((value) => {
    characters = value;
    selectedIndex = 0;
  });

  const selectPreviousCharacter = () => {
    if (selectedIndex > 0) {
      selectedIndex -= 1;
    }
  };

  const selectNextCharacter = () => {
    if (selectedIndex < characters.length - 1) {
      selectedIndex += 1;
    }
  };

  const submitGuess = async () => {
    const result = isMatch(target, selectedCharacter);
    if (result) {
      storedCorrectGuess.update(() => selectedCharacter);
    } else {
      storedIncorrectGuesses.update((value) => [...value, selectedCharacter]);
    }
  };
</script>

<div class="wrapper">
  {#if characters.length}
    <div class="selector">
      <button class="arrow" on:click={selectPreviousCharacter}>{"<"}</button>
      <Character character={selectedCharacter} />
      <button class="arrow" on:click={selectNextCharacter}>{">"}</button>
    </div>
    <button class="guess" type="submit" on:click={submitGuess}>Guess</button>
  {/if}
</div>

<style>
  .wrapper {
    grid-column-start: 2;
    grid-column-end: 3;
    grid-row-start: 2;
    grid-row-end: 3;

    display: flex;
    flex-direction: column;
    align-items: center;

    margin: 12px 0 24px 12px;
    border-radius: 3px;
  }

  .selector {
    display: flex;
  }

  .arrow {
    background-color: #ebebeb;
    border: none;
    padding: 0;
    margin: 0;

    color: #9f86c0;
    font-size: 24px;
    width: 48px;
    height: 160px;
    font-weight: bold;
  }

  .guess {
    color: #f5f5f5;
    border: none;
    border-radius: 3px;
    background-color: #9f86c0;
    width: 120px;
    height: 40px;
    margin: 12px 0 0 0;
  }
</style>
