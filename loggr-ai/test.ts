const testing = () => {
  return {
    getPrompt,
    getLanguageModel,
  }

  function getPrompt() {
    console.log("I'm a prompt!");
  }

  function getLanguageModel() {
    console.log("I'm a language model!");
  }
}

const model = testing();

model.getPrompt();
model.getLanguageModel();