<script lang="ts">
  import { emojis } from "../stores";

  export let character: number[];
</script>

<div>
  {#each character as feature}
    {emojis[feature]}
  {/each}
</div>

<style>
  div {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
    border-radius: 3px;
    height: 160px;
    width: 120px;
  }
</style>
