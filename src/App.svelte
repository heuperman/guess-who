<script lang="ts">
  import Game from "./game/Game.svelte";
</script>

<main>
  <Game />
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    font-family: "Kalam", cursive;
    color: #3b3737;
    background-color: #ebebeb;
    padding: 0;
    width: 100vw;
    height: 100vh;
    margin: 0;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
