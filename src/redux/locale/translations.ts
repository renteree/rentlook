import enTranslationMessages from '../../translations/en.json';
import ruTranslationMessages from '../../translations/ru.json';

const formatTranslationMessages = (locale: string, messages: any): any => {
  const messageKeys = Object.keys(messages);
  const defaultFormattedMessages: any = {};

  return messageKeys.reduce((formattedMessages, key) => {
    const isDefaultFormattedMessage = !messages[key];
    const formattedMessage = isDefaultFormattedMessage ? defaultFormattedMessages[key] : messages[key];

    return Object.assign(formattedMessages, { [key]: formattedMessage });
  }, {});
};

export default {
  en: formatTranslationMessages('en', enTranslationMessages),
  ru: formatTranslationMessages('ru', ruTranslationMessages),
};
