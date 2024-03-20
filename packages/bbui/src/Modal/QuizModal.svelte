<script>
  import ModalContent from "./ModalContent.svelte"
  import Input from "../Form/Input.svelte"

  let modal
  let answer
  let error

  export function show() {
    modal.show()
  }
  export function hide() {
    modal.hide
  }

  function resetState() {
    answer = undefined
    error = undefined
  }

  async function answerQuiz() {
    const correct = answer === "8"
    error = !correct
    return correct
  }
</script>

<ModalContent
  title="快速数学"
  bind:this={modal}
  confirmText="提交"
  onConfirm={answerQuiz}
  on:show={resetState}
>
  {#if error}
    <p class="error">答错了！再试一次。</p>
  {/if}
  <p>What is 4 + 4?</p>
  <Input label="Answer" bind:value={answer} />
</ModalContent>

<style>
  p {
    margin: 0;
    font-size: var(--font-size-s);
  }
  p.error {
    color: #e26d69;
    background-color: #ffe6e6;
    padding: 8px;
    border-radius: 4px;
  }
</style>
