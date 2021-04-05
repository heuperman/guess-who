<script lang="ts">
  import Character from "./Character.svelte";

  export let handleClick: () => void;
  export let text: string;
  export let character: number[];
</script>

<div class="wrapper">
  <div class="modal">
    <p>{text}</p>
    {#if character && character.length}
      <Character {character} />
    {/if}
    <button on:click={handleClick}>Okay</button>
  </div>
</div>

<style>
  .wrapper {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(173, 173, 173, 0.8);
    z-index: 5;
  }

  .modal {
    /* height: 400px;
    width: 500px; */
    padding: 20px 40px;
    background-color: #ebebeb;
    border: 2px solid #9f86c0;
    border-radius: 3px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  button {
    color: #f5f5f5;
    border: none;
    border-radius: 3px;
    background-color: #9f86c0;
    width: 120px;
    height: 40px;
    margin: 36px 0 0 0;
  }
</style>
