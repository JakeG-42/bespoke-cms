const DEMO_ARTICLE_MIN_WORDS = 1000;

const DEMO_ARTICLE_NOTE =
  "Demo content note: The following random text is included only to showcase the article page functionality, scrolling behaviour and sticky supporting content. This placeholder content will be replaced with Andersen how-to guides, videos and screenshots.";

const LOREM_PARAGRAPH =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere, nibh vitae facilisis faucibus, neque sapien lacinia justo, vitae finibus arcu augue sed mi. Suspendisse potenti. Praesent luctus, magna sed laoreet tincidunt, lectus velit commodo erat, in fermentum nibh neque vitae sapien. Donec tempor arcu at sem pretium, non dignissim eros fermentum. Curabitur non augue id mauris feugiat accumsan. Vivamus consequat justo sed massa bibendum, sed ullamcorper mi gravida. Sed at velit vitae purus facilisis convallis. Maecenas porttitor, lectus a volutpat aliquet, lorem nibh consequat risus, vitae posuere mi justo id quam. Aenean efficitur, urna non facilisis gravida, eros arcu pulvinar nibh, ac molestie lacus mi vitae orci.";

export function ensureDemoArticleBodyLength(body: string, minWords = DEMO_ARTICLE_MIN_WORDS) {
  const trimmedBody = body.trim();

  if (wordCount(trimmedBody) >= minWords || trimmedBody.includes(DEMO_ARTICLE_NOTE)) {
    return body;
  }

  const fillerChunks = [DEMO_ARTICLE_NOTE];
  let totalWords = wordCount([trimmedBody, DEMO_ARTICLE_NOTE].filter(Boolean).join(" "));

  while (totalWords < minWords) {
    fillerChunks.push(LOREM_PARAGRAPH);
    totalWords += wordCount(LOREM_PARAGRAPH);
  }

  return [trimmedBody, ...fillerChunks].filter(Boolean).join("\n\n");
}

function wordCount(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}
