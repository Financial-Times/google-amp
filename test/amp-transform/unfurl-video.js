'use strict';

const {expect} = require('../utils/chai');
const transformBody = require('../../lib/transforms/body');
const nock = require('nock');

describe('video unfurl transform', () => {
	let mediaApi;

	beforeEach(() => {
		mediaApi = nock('https://next-media-api.ft.com')
			.get(/\/v1/)
			.reply(200, url => {
				const [, videoId] = url.match(/\/v1\/(.+)/) || [];
				return require(`../fixtures/video/${videoId}.json`);
			});
	});

	afterEach(() => {
		nock.cleanAll();
	});

	it('should transform brightcove videos', async () => {
		expect(
			await transformBody(`<div class="n-content-video n-content-video--brightcove">
				<a href="http://video.ft.com/3235593137001"></a>
			</div>`)
		).dom.to.equal(`<amp-video width="480" height="269" poster="https://httpsak-a.akamaihd.net/47628783001/47628783001_3235665917001_MAS-FTworld-kiev21.jpg?pubId=47628783001&videoId=3235593137001" controls layout="responsive">
	<source src="https://udso-a.akamaihd.net/47628783001/47628783001_3235682780001_210214-WRLD-Ukraine-Buckley.mp4?pubId=47628783001&videoId=3235593137001" type="video/mp4" media="(max-width: 720px)">
<source src="https://udso-a.akamaihd.net/47628783001/47628783001_3235682784001_210214-WRLD-Ukraine-Buckley.mp4?pubId=47628783001&videoId=3235593137001" type="video/mp4" media="(max-width: 640px)">
<source src="https://udso-a.akamaihd.net/47628783001/47628783001_3235682805001_210214-WRLD-Ukraine-Buckley.mp4?pubId=47628783001&videoId=3235593137001" type="video/mp4" media="(max-width: 400px)">
<source src="https://udso-a.akamaihd.net/47628783001/47628783001_3235682809001_210214-WRLD-Ukraine-Buckley.mp4?pubId=47628783001&videoId=3235593137001" type="video/mp4" media="(max-width: 400px)">
<source src="https://udso-a.akamaihd.net/47628783001/47628783001_3235682818001_210214-WRLD-Ukraine-Buckley.mp4?pubId=47628783001&videoId=3235593137001" type="video/mp4" media="(max-width: 480px)">
<source src="https://udso-a.akamaihd.net/47628783001/47628783001_3235682855001_210214-WRLD-Ukraine-Buckley.mp4?pubId=47628783001&videoId=3235593137001" type="video/mp4" media="(max-width: 1280px)">
</amp-video>`);

		mediaApi.isDone();
	});

	it('should transform internal videos', async () => {
		expect(
			await transformBody(`<div class="n-content-video n-content-video--internal">
				<a href="https://www.ft.com/video/9010a752-585c-3230-9507-9990e3361e68"></a>
			</div>`)
		).dom.to.equal(`<amp-video width="480" height="270"
		poster="https://bcsecure01-a.akamaihd.net/13/47628783001/201704/2536/47628783001_5402191225001_5402157396001-vs.jpg?pubId=47628783001&videoId=5402157396001"
		controls layout="responsive">
		<source
		src="https://bcsecure04-a.akamaihd.net/34/47628783001/201704/2536/47628783001_5402189291001_5402157396001.mp4?pubId=47628783001&videoId=5402157396001"
		type="video/mp4" media="(max-width: 480px)">
		<source
		src="https://bcsecure04-a.akamaihd.net/34/47628783001/201704/2536/47628783001_5402192260001_5402157396001.mp4?pubId=47628783001&videoId=5402157396001"
		type="video/mp4" media="(max-width: 640px)">
		<source
		src="https://bcsecure04-a.akamaihd.net/34/47628783001/201704/2536/47628783001_5402193902001_5402157396001.mp4?pubId=47628783001&videoId=5402157396001"
		type="video/mp4" media="(max-width: 960px)">
		</amp-video>`);

		mediaApi.isDone();
	});

	it('should strip video if api call fails', async () => {
		mediaApi
			.get(/\/v1\/ffffffff-ffff-ffff-ffff-ffffffffffff/)
			.reply(503, 'Service unavailable');

		expect(
			await transformBody(`<p><div class="n-content-video n-content-video--internal">
				<a href="https://www.ft.com/video/ffffffff-ffff-ffff-ffff-ffffffffffff"></a>
			</div></p>`)
		).dom.to.equal('<p></p>');
	});
});
