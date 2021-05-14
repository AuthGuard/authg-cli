
const prompts = require('prompts');

function onCancel(prompt, answer) {
    console.log("Aborted");
    process.exit(0);
}

module.exports = (questions) => prompts(questions, { 
    onCancel: onCancel
});
