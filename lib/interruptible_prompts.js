
const prompts = require('prompts');

function onCancel(prompt) {
    console.log("Interrupted");
    process.exit(0);
}

module.exports = (questions) => prompts(questions, { onCancel: onCancel });
