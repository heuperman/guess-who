<script>
  import { push } from "svelte-spa-router";

  const handleClick = async () => {
    const fetched = await fetch(`http://localhost:8000/game`, {
      method: "POST",
    });
    const game = await fetched.json();
    if (game?.id) {
      push(`/game/${game.id}`);
    }
  };
</script>

<button on:click={handleClick}>New game</button>
