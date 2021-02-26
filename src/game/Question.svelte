<script lang="ts">
  import {
    emojis,
    storedCorrectQuestions,
    storedIncorrectQuestions,
    storedTarget,
  } from "../stores";

  const positions = ["first", "second", "third", "fourth"];

  let selectedIndex: number;
  let selectedEmojiIndex: number;

  let correctQuestions: number[];
  storedCorrectQuestions.subscribe((value) => (correctQuestions = value));

  let incorrectQuestions: number[][];
  storedIncorrectQuestions.subscribe((value) => (incorrectQuestions = value));

  let target: number[];
  storedTarget.subscribe((value) => (target = value));

  const createString = (incorrectQuestions: number[]) => {
    const questionEmojis = incorrectQuestions.map(
      (question) => emojis[question]
    );

    return questionEmojis.length > 1
      ? questionEmojis.join(" or ")
      : questionEmojis[0];
  };

  const submitQuestion = async () => {
    const result = target[selectedIndex] === selectedEmojiIndex;
    if (result) {
      storedCorrectQuestions.update((value) => {
        value[selectedIndex] = selectedEmojiIndex;
        return [...value];
      });
    } else if (
      !incorrectQuestions[selectedIndex].includes(selectedEmojiIndex)
    ) {
      storedIncorrectQuestions.update((value) => {
        value[selectedIndex].push(selectedEmojiIndex);
        return [...value];
      });
    }
  };
</script>

<div class="wrapper">
  <form on:submit|preventDefault={submitQuestion}>
    <div>
      Is the
      <select bind:value={selectedIndex}>
        {#each positions as position, index}
          <option value={index}>
            {position}
          </option>
        {/each}
      </select>
      position the emoji
      <select bind:value={selectedEmojiIndex}>
        {#each emojis as emoji, index}
          <option value={index}>
            {emoji}
          </option>
        {/each}
      </select>
      ?
    </div>
    <button type="submit"> Ask </button>
  </form>

  <div class="log">
    {#each [0, 1, 2, 3] as feature}
      {#if correctQuestions[feature] !== undefined}
        <p>
          The {positions[feature]} position is {emojis[
            correctQuestions[feature]
          ]}
        </p>
      {:else if incorrectQuestions[feature].length}
        <p>
          The {positions[feature]} position is not {createString(
            incorrectQuestions[feature]
          )}
        </p>
      {/if}
    {/each}
  </div>
</div>

<style>
  .wrapper {
    grid-column-start: 1;
    grid-column-end: 2;
    grid-row-start: 2;
    grid-row-end: 3;

    display: flex;
    flex-direction: column;

    margin: 12px 12px 24px 0;
    border-radius: 3px;
  }

  form {
    display: flex;
    align-items: center;
    justify-content: space-between;

    margin: 0;
    font-size: 16px;
  }

  select {
    background-color: #ebebeb;
    color: #3b3737;
    border: none;
    border-bottom: 3px solid #9f86c0;
    margin: 0 3px;
    padding: 8px 8px 4.5px 0;
  }

  button {
    color: #f5f5f5;
    border: none;
    border-radius: 3px;
    background-color: #9f86c0;
    width: 120px;
    height: 40px;
    margin: 0;
  }

  .log {
    margin: 12px 0 0 0;
    padding: 12px;
    border: 2px solid #9f86c0;
    border-radius: 3px;
    height: 120px;
    overflow: scroll;
  }

  p {
    margin-top: 0;
    margin-bottom: 4px;
    width: fit-content;
    font-size: 16px;
  }
</style>
