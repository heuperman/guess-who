<script lang="ts">
  import {
    emojis,
    storedCharacters,
    storedCorrectGuess,
    storedCorrectQuestions,
    storedIncorrectGuesses,
    storedIncorrectQuestions,
  } from "../stores";

  export let id: string;

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

  const toEmojis = (character: number[]) =>
    character.map((number) => emojis[number]).join("");

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
    const fetched = await fetch(`http://localhost:8000/guess`, {
      method: "POST",
      body: JSON.stringify({ character: selectedCharacter, id }),
    });
    const { guess, result } = await fetched.json();
    if (result) {
      storedCorrectGuess.update(() => guess);
    } else {
      storedIncorrectGuesses.update((value) => [...value, guess]);
    }
  };
</script>

<div class="wrapper">
  {#if characters.length}
    <div class="selector">
      <button class="arrow" on:click={selectPreviousCharacter}>{"<"}</button>
      <div class="character">
        {toEmojis(selectedCharacter)}
      </div>
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

  .character {
    display: flex;
    justify-content: center;
    align-items: center;

    background-color: #f5f5f5;
    border-radius: 3px;
    height: 160px;
    width: 120px;
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
