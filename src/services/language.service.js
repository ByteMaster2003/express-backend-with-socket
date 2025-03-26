import en from "../constants/languages/en.js";
import hi from "../constants/languages/hi.js";

const languages = {
  en,
  hi
};

const getMessage = (key, lang = "en") => {
  const keys = key.split(".");
  let message = languages[lang];

  for (const k of keys) {
    message = message?.[k];
  }

  return message || languages[lang][keys[0]][keys[1]];
};

export default { getMessage };
