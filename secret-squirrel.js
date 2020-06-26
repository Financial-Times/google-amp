'use strict';

module.exports = {
	files: {
		allow: [
			'makefile',
			'certificate.cnf',
			'test/utils/hbs-app/bower_components/linked-dep-1'
		],
		allowOverrides: [],
	},
	strings: {
		deny: [],
		denyOverrides: [
			'ffffffff-ffff-ffff-ffff-ffffffffffff', // readme.md:36|37, test/amp-transform/slideshow.js:9|10|16|19|24|25, test/amp-transform/unfurl-video.js:66|71
			'146da558-4dee-11e3-8fa5-00144feabdc0', // server/controllers/redirect.js:4, test/smoke.js:16
			'acee4131-99c2-09d3-a635-873e61754ec6', // server/lib/article/article-flags.js:10
			'e8813dd4-d00d-11e5-831d-09f7778e7377', // server/lib/article/article-flags.js:54, test/utils/test-uuids.js:27
			'263615ca-d873-11e9-8f9b-77216ebe1f17', // server/controllers/amp-page.js:8
			'f3bb0944-4437-11ea-abea-0c7a29cd66fe', // server/controllers/amp-page.js:9
			'a26fbf7e-48f8-11ea-aeb3-955839e06441', // server/controllers/amp-page.js:10
			'0c13755a-6867-11ea-800d-da70cff6e4d3', // server/controllers/amp-page.js:11
			'b4284269-2951-3169-ab98-88c184da5e88', // test/amp-transform/blockquotes.js:39, test/utils/test-uuids.js:32
			'56f6ad50-da52-11e5-a72f-1e7744c66818', // test/amp-transform/external-image.js:7|25
			'0a5e1620-c0f5-11e5-846f-79b0e3d20eaf', // test/amp-transform/related-box.js:38|44
			'9a0e5ade-c0f8-11e5-9fdb-87b8d15baec2', // test/amp-transform/related-box.js:39
			'9010a752-585c-3230-9507-9990e3361e68', // test/amp-transform/unfurl-video.js:45, test/fixtures/video/9010a752-585c-3230-9507-9990e3361e68.json:2
			'72402230-e6db-11e6-967b-c88452263daf', // test/fixtures/72402230-e6db-11e6-967b-c88452263daf.json:3|127|129|130|147, test/integration/ads.js:8|24|27
			'dbb0bdae-1f0c-11e4-b0cb-b2227cce2b54', // test/fixtures/72402230-e6db-11e6-967b-c88452263daf.json:15, test/fixtures/ca04513c-e9c7-11e6-893c-082c54a7f539.json:15
			'acb24d4d-efa1-3916-8985-59d868208053', // test/fixtures/72402230-e6db-11e6-967b-c88452263daf.json:23
			'3de9af27-6403-3b84-b927-58e26c68e6a3', // test/fixtures/72402230-e6db-11e6-967b-c88452263daf.json:31
			'a48d1000-be8b-3634-a54a-79a737ba62ee', // test/fixtures/72402230-e6db-11e6-967b-c88452263daf.json:39
			'59fd6642-055c-30b0-b2b8-8120bc2990af', // test/fixtures/72402230-e6db-11e6-967b-c88452263daf.json:47
			'0a757042-e321-304f-97c0-e04337bc698e', // test/fixtures/72402230-e6db-11e6-967b-c88452263daf.json:55
			'dfa0c008-68a4-3901-9300-e35fb3c15cc4', // test/fixtures/72402230-e6db-11e6-967b-c88452263daf.json:63|79
			'3e0674b7-ea87-369a-b536-ead47dd076ae', // test/fixtures/72402230-e6db-11e6-967b-c88452263daf.json:71
			'f662a1e8-4e85-30c2-b02c-83436557ad31', // test/fixtures/72402230-e6db-11e6-967b-c88452263daf.json:87
			'70f66462-e313-3e83-ad39-d7724973d276', // test/fixtures/72402230-e6db-11e6-967b-c88452263daf.json:95
			'b224ad07-c818-3ad6-94af-a4d351dbb619', // test/fixtures/72402230-e6db-11e6-967b-c88452263daf.json:103
			'e569e23b-0c3e-3d20-8ed0-4c17b8177c05', // test/fixtures/72402230-e6db-11e6-967b-c88452263daf.json:111
			'e97e5795-7f5a-32d3-9daa-a41b1182e8dc', // test/fixtures/72402230-e6db-11e6-967b-c88452263daf.json:119
			'833d264c-e707-11e6-967b-c88452263daf', // test/fixtures/72402230-e6db-11e6-967b-c88452263daf.json:152|157|158
			'ca04513c-e9c7-11e6-893c-082c54a7f539', // test/fixtures/ca04513c-e9c7-11e6-893c-082c54a7f539.json:3|111|113|114|131, test/integration/brightcove.js:10|26|27
			'9b40e89c-e87b-3d4f-b72c-2cf7511d2146', // test/fixtures/ca04513c-e9c7-11e6-893c-082c54a7f539.json:23
			'03f40642-b279-3c0d-babb-65671a2fd5c3', // test/fixtures/ca04513c-e9c7-11e6-893c-082c54a7f539.json:31|95
			'476cb8ee-4410-3a8a-83c2-8733018f699e', // test/fixtures/ca04513c-e9c7-11e6-893c-082c54a7f539.json:39
			'd67cef02-e3ee-3260-8ac1-9c67d7a1263c', // test/fixtures/ca04513c-e9c7-11e6-893c-082c54a7f539.json:47|55
			'5c67d874-f84f-35b5-af31-b09f04ed5186', // test/fixtures/ca04513c-e9c7-11e6-893c-082c54a7f539.json:63
			'6ac7aa8d-7477-38f9-94e3-fb5576a516d4', // test/fixtures/ca04513c-e9c7-11e6-893c-082c54a7f539.json:71
			'fd12214a-9f96-3375-9b44-3cf2f2f753bc', // test/fixtures/ca04513c-e9c7-11e6-893c-082c54a7f539.json:79
			'cadbdb74-5419-3635-8c2a-79d61ba2e6a7', // test/fixtures/ca04513c-e9c7-11e6-893c-082c54a7f539.json:87
			'd8009323-f898-3207-b543-eab4427b7a77', // test/fixtures/ca04513c-e9c7-11e6-893c-082c54a7f539.json:103
			'b476ec0e-e9d5-11e6-893c-082c54a7f539', // test/fixtures/ca04513c-e9c7-11e6-893c-082c54a7f539.json:132|136|141
			'1eaebabd-d5b4-3deb-a325-8183feb9f9a3', // test/fixtures/video/3235593137001.json:2
			'3ee29f96-88e0-11e3-bb5f-00144feab7de', // test/utils/test-uuids.js:5
			'70d0bfd8-d1b3-11e5-831d-09f7778e7377', // test/utils/test-uuids.js:7
			'3559f46e-d9c5-11e5-98fd-06d75973fe09', // test/utils/test-uuids.js:8
			'c7b4c52e-ce4d-11e5-831d-09f7778e7377', // test/utils/test-uuids.js:9
			'5a454ee2-d996-11e5-98fd-06d75973fe09', // test/utils/test-uuids.js:10
			'71ec800a-d401-11e5-829b-8564e7528e54', // test/utils/test-uuids.js:11
			'7a199ac2-d8c2-11e5-98fd-06d75973fe09', // test/utils/test-uuids.js:12
			'cf290804-25e9-3e4b-8a19-efc090b6fca0', // test/utils/test-uuids.js:13
			'6a90c7e4-d681-11e5-829b-8564e7528e54', // test/utils/test-uuids.js:14
			'181a2b02-d63d-11e5-8887-98e7feb46f27', // test/utils/test-uuids.js:15
			'80c3164e-d644-11e5-8887-98e7feb46f27', // test/utils/test-uuids.js:16
			'562dba52-a83c-3d48-9577-4a490173db94', // test/utils/test-uuids.js:17
			'58dd0688-d63c-11e5-829b-8564e7528e54', // test/utils/test-uuids.js:18
			'19fe32bc-d6db-11e5-8887-98e7feb46f27', // test/utils/test-uuids.js:19
			'9bc4c15c-cf57-11e5-92a1-c5e23ef99c77', // test/utils/test-uuids.js:20
			'f33bc38e-d6a2-11e5-829b-8564e7528e54', // test/utils/test-uuids.js:21
			'9275f196-dfdd-3361-a375-f50e8b2d9a03', // test/utils/test-uuids.js:22
			'aa89fe88-d5a5-11e5-829b-8564e7528e54', // test/utils/test-uuids.js:23
			'7333e92a-d4a2-11e5-829b-8564e7528e54', // test/utils/test-uuids.js:24
			'a354acc6-d1d6-11e5-831d-09f7778e7377', // test/utils/test-uuids.js:25
			'3614af26-d177-11e5-92a1-c5e23ef99c77', // test/utils/test-uuids.js:26
			'1f707cd0-d408-11e5-8887-98e7feb46f27', // test/utils/test-uuids.js:28
			'0efb495a-d446-11e5-829b-8564e7528e54', // test/utils/test-uuids.js:29
			'da44fb1c-d485-11e5-8887-98e7feb46f27', // test/utils/test-uuids.js:30
			'e5fbd11a-d3ef-11e5-969e-9d801cf5e15b', // test/utils/test-uuids.js:31
			'c0e910c4-d005-11e5-831d-09f7778e7377', // test/utils/test-uuids.js:33
			'd930d316-5e5c-11e6-bb77-a121aa8abd95', // test/utils/test-uuids.js:34
			'94e97eee-ce9a-11e5-831d-09f7778e7377', // test/utils/test-uuids.js:37
			'845090a2-dad6-11e5-98fd-06d75973fe09', // test/utils/test-uuids.js:38
			'd5075216-da17-11e5-98fd-06d75973fe09', // test/utils/test-uuids.js:39
			'626718b0-da10-11e5-a72f-1e7744c66818', // test/utils/test-uuids.js:40
			'9b3c71f8-d97f-11e5-a72f-1e7744c66818', // test/utils/test-uuids.js:41
			'9509412a-d3e5-11e5-8887-98e7feb46f27', // test/utils/test-uuids.js:42
			'462ed854-dc54-11e5-a72f-1e7744c66818', // test/utils/test-uuids.js:43
			'735eb4c8-998f-11e5-9228-87e603d47bdc', // test/utils/test-uuids.js:44
			'2b9428ec-dc58-11e5-a72f-1e7744c66818', // test/utils/test-uuids.js:45
			'5e992146-db79-11e5-a72f-1e7744c66818', // test/utils/test-uuids.js:46
			'b6b12d2a-db91-11e5-9ba8-3abc1e7247e4', // test/utils/test-uuids.js:47
			'cfbb9740-857f-11e1-a394-00144feab49a', // test/utils/test-uuids.js:48
			'51d67b98-8588-11e1-90cd-00144feab49a', // test/utils/test-uuids.js:49
			'c1388d9a-85b1-11e1-90cd-00144feab49a', // test/utils/test-uuids.js:50
			'a9512a36-858c-11e1-a394-00144feab49a', // test/utils/test-uuids.js:51
			'5cf80b92-853b-11e1-a75a-00144feab49a', // test/utils/test-uuids.js:52
			'0b7fe1ba-855c-11e1-a394-00144feab49a', // test/utils/test-uuids.js:53
			'a78ac892-8550-11e1-a75a-00144feab49a', // test/utils/test-uuids.js:54
			'02c437c6-84f1-11e1-b4f5-00144feab49a', // test/utils/test-uuids.js:55
			'939c8348-84c4-11e1-a3c5-00144feab49a', // test/utils/test-uuids.js:56
			'25b50382-84b5-11e1-b4f5-00144feab49a', // test/utils/test-uuids.js:57
			'a7b17dd4-849c-11e1-b6f5-00144feab49a', // test/utils/test-uuids.js:58
			'42d2ab6a-847c-11e1-b6f5-00144feab49a', // test/utils/test-uuids.js:59
			'8fcac5da-8493-11e1-b4f5-00144feab49a', // test/utils/test-uuids.js:60
			'0d9ac810-83f5-11e1-82ca-00144feab49a', // test/utils/test-uuids.js:61
			'e020ef34-83e7-11e1-82ca-00144feab49a', // test/utils/test-uuids.js:62
			'387bb80e-cce6-11e4-b5a5-00144feab7de', // test/utils/test-uuids.js:63
			'd5ac853a-978a-11e5-95c7-d47aa298f769', // test/utils/test-uuids.js:66
			'9543d79e-e828-11e4-894a-00144feab7de', // test/utils/test-uuids.js:67
			'9cbd2018-e4c2-11e2-875b-00144feabdc0', // test/utils/test-uuids.js:68
			'e96b93ea-2933-11e2-9591-00144feabdc0', // test/utils/test-uuids.js:69
			'f26a9548-9c70-11e3-b535-00144feab7de', // test/utils/test-uuids.js:70
			'd283bb5e-ca8d-11e5-be0b-b7ece4e953a0', // test/utils/test-uuids.js:71
			'59192b0c-b994-11e3-b74f-00144feabdc0', // test/utils/test-uuids.js:72
			'74f09d76-a9f2-11e3-adab-00144feab7de', // test/utils/test-uuids.js:73
			'0630ca5a-e38a-11e4-b407-00144feab7de', // test/utils/test-uuids.js:74
			'514abee5-c09b-34f6-9a3a-865a64540a65', // test/utils/test-uuids.js:77
			'b0de8ce3-0822-3b6e-b8f1-b2c97bc92c88', // test/utils/test-uuids.js:78
			'21b5893e-ba3a-32dc-bf31-271449002cc0', // test/utils/test-uuids.js:79
			'f50909a8-95dd-3688-9b12-a67e1198e6d5', // test/utils/test-uuids.js:80
			'079a37bc-db50-11e7-a039-c64b1c09b482', // test/utils/test-uuids.js:83
		],
	},
};
