const config = require('./.apirc');

class API {
  static async getChunkSignature(q, nextPage) {
    if (q === undefined) {
      return undefined;
    }

    function isNextPageEmpty() {
      if (nextPage === undefined) return '';
      return `&pageToken=${nextPage}`;
    }
    const json = await fetch(
      `${config.apiUrl}search?type=video`
      + `&q=${q}`
      + '&part=id'
      + '&maxResults=15'
      + `&key=${config.apiKey}${isNextPageEmpty()}`,
    ).then(data => data.json());

    const signature = {
      nextPage: json.nextPageToken,
      items: json.items,
      totalResults: json.pageInfo.totalResults,
    };

    return signature;
  }

  static async getChunkItems(signature) {
    if (signature === undefined) {
      return undefined;
    }
    const items = [];
    let stringOfID = '';
    for (let i = 0; i < signature.items.length; i += 1) {
      stringOfID += `${signature.items[i].id.videoId},`;
    }
    const json = await fetch(
      `${config.apiUrl}videos?id=${stringOfID}`
      + '&part=snippet,statistics'
      + `&key=${config.apiKey}`,
    ).then(data => data.json());

    for (let i = 0; i < signature.items.length; i += 1) {
      const [snippet] = [json.items[i].snippet];
      const item = {
        url: `https://youtu.be/${signature.items[i].id.videoId}`,
        title: snippet.title,
        description: snippet.description,
        pic: snippet.thumbnails.medium.url,
        author: snippet.channelTitle,
        date: snippet.publishedAt.split('T')[0].replace(/-/g, ' '),
        views: json.items[i].statistics.viewCount,
      };
      items.push(item);
    }

    if (items.length !== signature.items.length) {
      throw new Error('unable to get data for all videos');
    }
    return items;
  }
}
export default API;
