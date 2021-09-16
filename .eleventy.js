const {
  DateTime
} = require("luxon");
const readingTime = require('eleventy-plugin-reading-time');
// const faviconPlugin = require("eleventy-favicon");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy('./src/style.css');
  eleventyConfig.addPassthroughCopy('./src/assets');
  // eleventyConfig.addPlugin(faviconPlugin, {destination:'./public'});
  eleventyConfig.addPassthroughCopy('./src/admin');
  eleventyConfig.addPlugin(readingTime);
  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
  });
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  return {
    dir: {
      input: "src",
      output: "public"
    }
  };
}
