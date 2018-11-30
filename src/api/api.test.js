import API from './api';
import 'isomorphic-fetch';

test('API returns object', () => {
  const chunkSignature = API.getChunkSignature('something');
  expect(typeof (chunkSignature)).toBe('object');
});

test('API module sends data back only after completing fetch()', async () => {
  const chunkSignature = await API.getChunkSignature('something');
  expect(chunkSignature.items.length).toBe(15);
});

test('API does not send back unnecessary data from response', async () => {
  const chunkSignature = await API.getChunkSignature('something');
  const chunkItems = await API.getChunkItems(chunkSignature);

  expect(chunkItems.pageInfo).toBe(undefined);
});

test('API ignores undefined nextPageToken, even if been called with one', async () => {
  const chunkSignature = await API.getChunkSignature('something', undefined);
  const chunkSignatureNoUndef = await API.getChunkSignature('something');

  expect(chunkSignature.nextPageToken).toBe(chunkSignatureNoUndef.nextPageToken);
});
/**
  * how to use toThorwError here?
  * Googled and nothing, even expect(throw new Error()) passes undetected
  * same with toThrow btw
  */

// returning undef is ok here
test('getChunkSignature returns undefined without requesting data from youtube api', async () => {
  expect(await API.getChunkSignature()).toEqual(undefined);
});
test('getChunkItems returns undefined without requesting data from youtube api', async () => {
  expect(await API.getChunkItems()).toEqual(undefined);
});