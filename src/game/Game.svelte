<script lang="ts">
  import { onMount } from "svelte";
  import { storedCharacters } from "../stores";
  import Characters from "./Characters.svelte";
  import Question from "./Question.svelte";
  import Guess from "./Guess.svelte";

  export let params: { id: string };
  const id = params?.id;

  onMount(async () => {
    if (id) {
      const fetched = await fetch(`http://localhost:8000/game/${id}`);
      const game = await fetched.json();
      if (game && game.characters) {
        storedCharacters.update(() => game.characters);
      }
    }
  });
</script>

<div class="grid">
  <Characters />
  <Question {id} />
  <Guess {id} />
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
