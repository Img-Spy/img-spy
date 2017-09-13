export let T = require("i18n-react").default;

const language = "en";
const texts = {
    "menu": require(`./${language}/menu.json`),
    "select-case": require(`./${language}/select-case.json`)
};

T.setTexts(texts);
