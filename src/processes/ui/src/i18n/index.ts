import T                from "i18n-react";
import { environment }  from "img-spy-core";

const language = "en";
const i18nPath = `${environment.rootAppPath}/assets/languages/${language}`;
const texts = {
    "menu": require(`${i18nPath}/menu.json`),
    "select-case": require(`${i18nPath}/select-case.json`)
};

T.setTexts(texts);

export { T as default };
