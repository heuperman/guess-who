<script lang="ts">
  export let character: number[];

  export const imagePaths = {
    heads: [
      [
        "images/head/square/orange.png",
        "images/head/square/purple.png",
        "images/head/square/green.png",
      ],
      [
        "images/head/triangle/orange.png",
        "images/head/triangle/purple.png",
        "images/head/triangle/green.png",
      ],
      [
        "images/head/circle/orange.png",
        "images/head/circle/purple.png",
        "images/head/circle/green.png",
      ],
    ],
    expressions: [
      "images/expression/angry.png",
      "images/expression/worried.png",
      "images/expression/happy.png",
    ],
    hair: [
      "images/hair/curly.png",
      "images/hair/spiky.png",
      "images/hair/long.png",
    ],
  };
</script>

<div>
  <img
    class="head"
    src={imagePaths.heads[character[0]][character[1]]}
    alt="head"
  />
  <img
    class={`hair-${character[2]}`}
    src={imagePaths.hair[character[2]]}
    alt="hair"
  />
  <img
    class="expression"
    src={imagePaths.expressions[character[3]]}
    alt="expression"
  />
</div>

<style>
  div {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
    border-radius: 3px;
    height: 160px;
    width: 120px;
    overflow: hidden;
  }

  img {
    position: absolute;
  }

  .head {
    height: 130px;
    width: 130px;
    top: 30px;
    left: -4px;
  }

  .hair-0 {
    height: 120px;
    width: 120px;
    top: -28px;
    left: 0;
  }

  .hair-1 {
    height: 120px;
    width: 120px;
    top: -30px;
    left: 0;
  }

  .hair-2 {
    height: 120px;
    width: 120px;
    top: 2px;
    left: 1px;
  }

  .expression {
    height: 80px;
    width: 80px;
    top: 56px;
    left: 20px;
  }
</style>
