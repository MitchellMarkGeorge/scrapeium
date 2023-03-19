import { codemirrorLang } from './scrapeium';

describe('codemirrorLang', () => {
  it('should work', () => {
    expect(codemirrorLang()).toEqual('codemirror-lang');
  });
});
