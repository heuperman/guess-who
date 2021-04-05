<script lang="ts">
  import { onMount } from "svelte";
  import { createCharacters, pickTarget } from "../helpers/characters";
  import {
    storedCharacters,
    storedTarget,
    storedIncorrectGuesses,
    storedCorrectGuess,
  } from "../stores";
  import Characters from "./Characters.svelte";
  import Question from "./Question.svelte";
  import Guess from "./Guess.svelte";
  import Modal from "./Modal.svelte";

  let showModal: boolean = true;

  let character: number[];
  let text = "Guess Who?";

  storedIncorrectGuesses.subscribe((guesses) => {
    const latestGuess = guesses[guesses.length - 1];
    if (latestGuess && latestGuess.length) {
      character = latestGuess;
      text = "It's not";
      toggleModal();
    }
  });

  storedCorrectGuess.subscribe((guess) => {
    if (guess && guess.length) {
      character = guess;
      text = "Well done, it's";
      toggleModal();
    }
  });

  const toggleModal = () => (showModal = !showModal);

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
  {#if showModal}
    <Modal handleClick={toggleModal} {text} {character} />
  {/if}
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
