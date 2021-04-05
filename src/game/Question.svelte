<script lang="ts">
  import {
    storedCorrectQuestions,
    storedIncorrectQuestions,
    storedTarget,
  } from "../stores";

  const features = ["head", "colour", "hair", "expression"];
  const types = [
    ["a square", "a triangle", "a circle"],
    ["orange", "purple", "green"],
    ["curly", "spiky", "long"],
    ["angry", "worried", "happy"],
  ];

  let selectedFeature: number;
  let selectedType: number;

  let correctQuestions: number[];
  storedCorrectQuestions.subscribe((value) => (correctQuestions = value));

  let incorrectQuestions: number[][];
  storedIncorrectQuestions.subscribe((value) => (incorrectQuestions = value));

  let target: number[];
  storedTarget.subscribe((value) => (target = value));

  const createString = (feature: number, incorrectQuestions: number[]) => {
    const questionTypes = incorrectQuestions.map(
      (question) => types[feature][question]
    );

    return questionTypes.length > 1
      ? questionTypes.join(" or ")
      : questionTypes[0];
  };

  const submitQuestion = async () => {
    const result = target[selectedFeature] === selectedType;
    if (result) {
      storedCorrectQuestions.update((value) => {
        value[selectedFeature] = selectedType;
        return [...value];
      });
    } else if (!incorrectQuestions[selectedFeature].includes(selectedType)) {
      storedIncorrectQuestions.update((value) => {
        value[selectedFeature].push(selectedType);
        return [...value];
      });
    }
  };
</script>

<div class="wrapper">
  <form on:submit|preventDefault={submitQuestion}>
    <div>
      Is their
      <select bind:value={selectedFeature}>
        {#each features as feature, index}
          <option value={index}>
            {feature}
          </option>
        {/each}
      </select>
      {#if selectedFeature >= 0}
        <select bind:value={selectedType}>
          {#each types[selectedFeature] as type, index}
            <option value={index}>
              {type}
            </option>
          {/each}
        </select>
      {/if}
      ?
    </div>
    <button type="submit"> Ask </button>
  </form>

  <div class="log">
    {#each [0, 1, 2, 3] as feature}
      {#if correctQuestions[feature] !== undefined}
        <p>
          Their {features[feature]} is {types[feature][
            correctQuestions[feature]
          ]}.
        </p>
      {:else if incorrectQuestions[feature].length}
        <p>
          Their {features[feature]} is not {createString(
            feature,
            incorrectQuestions[feature]
          )}.
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
    height: 100%;
  }

  p {
    margin-top: 0;
    margin-bottom: 4px;
    width: fit-content;
    font-size: 16px;
  }
</style>
