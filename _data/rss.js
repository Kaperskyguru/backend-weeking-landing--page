let parser = require("fast-xml-parser");
let fetch = require("@11ty/eleventy-fetch");

module.exports = async function () {
  let url = `https://anchor.fm/s/f7f18900/podcast/rss`;
  let response;

  try {
    response = await fetch(url, {
      duration: "1w", // save for 1 week
      type: "text",
    });
  } catch (error) {
    console.error(`Fetch failed in rss.js. ${error}`);
  }

  let feed;

  const result = parser.XMLValidator.validate(response);

  if (result === true) {
    const xmlparser = new parser.XMLParser({ ignoreAttributes: false });
    feed = xmlparser.parse(response);
  } else {
    console.error(
      `spotify - XML is invalid. Reason: ${result.err.msg}`,
      result
    );
  }

  let posts = feed.rss.channel.item;

  let transformedPosts = posts.map((post) => {
    let transformedPost = {};
    transformedPost.date = new Date(post?.pubDate);
    transformedPost.url = post?.link;
    transformedPost.title = post?.title;
    transformedPost.description = post?.description;
    transformedPost.audio = post?.enclosure;
    return transformedPost;
  });

  return transformedPosts;
};
