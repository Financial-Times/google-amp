'use strict';

module.exports = [
	// test articles (more likely to fail, so test them earlier):
	// '3ee29f96-88e0-11e3-bb5f-00144feab7de',
	// real articles:
	'70d0bfd8-d1b3-11e5-831d-09f7778e7377',
	'3559f46e-d9c5-11e5-98fd-06d75973fe09',
	'c7b4c52e-ce4d-11e5-831d-09f7778e7377',
	'5a454ee2-d996-11e5-98fd-06d75973fe09', // firstFT
	'71ec800a-d401-11e5-829b-8564e7528e54',
	'7a199ac2-d8c2-11e5-98fd-06d75973fe09', // firstFT
	'cf290804-25e9-3e4b-8a19-efc090b6fca0', // blogs
	'6a90c7e4-d681-11e5-829b-8564e7528e54',
	'181a2b02-d63d-11e5-8887-98e7feb46f27',
	'80c3164e-d644-11e5-8887-98e7feb46f27',
	'562dba52-a83c-3d48-9577-4a490173db94',
	'58dd0688-d63c-11e5-829b-8564e7528e54',
	'19fe32bc-d6db-11e5-8887-98e7feb46f27',
	'9bc4c15c-cf57-11e5-92a1-c5e23ef99c77', // life and arts
	'f33bc38e-d6a2-11e5-829b-8564e7528e54',
	'9275f196-dfdd-3361-a375-f50e8b2d9a03', // brussels briefing
	'aa89fe88-d5a5-11e5-829b-8564e7528e54', // firstFT
	'7333e92a-d4a2-11e5-829b-8564e7528e54',
	'a354acc6-d1d6-11e5-831d-09f7778e7377',
	'3614af26-d177-11e5-92a1-c5e23ef99c77',
	// 'e8813dd4-d00d-11e5-831d-09f7778e7377', temporarily disabled while we fix the image tag
	'1f707cd0-d408-11e5-8887-98e7feb46f27',
	'0efb495a-d446-11e5-829b-8564e7528e54', // firstFT
	'da44fb1c-d485-11e5-8887-98e7feb46f27',
	'e5fbd11a-d3ef-11e5-969e-9d801cf5e15b',
	'b4284269-2951-3169-ab98-88c184da5e88',
	'c0e910c4-d005-11e5-831d-09f7778e7377', // lunch with the ft
	'f89bc888-8029-11e2-96ba-00144feabdc0', // Interactive graphic (HTTP)
	'd930d316-5e5c-11e6-bb77-a121aa8abd95', // UUID with ft-concept tag

	// QA Test List
	'94e97eee-ce9a-11e5-831d-09f7778e7377',
	'845090a2-dad6-11e5-98fd-06d75973fe09',
	'd5075216-da17-11e5-98fd-06d75973fe09',
	'626718b0-da10-11e5-a72f-1e7744c66818',
	'9b3c71f8-d97f-11e5-a72f-1e7744c66818',
	'9509412a-d3e5-11e5-8887-98e7feb46f27',
	'462ed854-dc54-11e5-a72f-1e7744c66818',
	'735eb4c8-998f-11e5-9228-87e603d47bdc',
	'2b9428ec-dc58-11e5-a72f-1e7744c66818',
	'5e992146-db79-11e5-a72f-1e7744c66818',
	'b6b12d2a-db91-11e5-9ba8-3abc1e7247e4',
	'cfbb9740-857f-11e1-a394-00144feab49a',
	'51d67b98-8588-11e1-90cd-00144feab49a',
	'c1388d9a-85b1-11e1-90cd-00144feab49a',
	'a9512a36-858c-11e1-a394-00144feab49a',
	'5cf80b92-853b-11e1-a75a-00144feab49a',
	'0b7fe1ba-855c-11e1-a394-00144feab49a',
	'a78ac892-8550-11e1-a75a-00144feab49a',
	'02c437c6-84f1-11e1-b4f5-00144feab49a',
	'939c8348-84c4-11e1-a3c5-00144feab49a',
	'25b50382-84b5-11e1-b4f5-00144feab49a',
	'a7b17dd4-849c-11e1-b6f5-00144feab49a',
	'42d2ab6a-847c-11e1-b6f5-00144feab49a',
	'8fcac5da-8493-11e1-b4f5-00144feab49a',
	'0d9ac810-83f5-11e1-82ca-00144feab49a',
	'e020ef34-83e7-11e1-82ca-00144feab49a',
	'387bb80e-cce6-11e4-b5a5-00144feab7de',

	// Slideshows
	'd5ac853a-978a-11e5-95c7-d47aa298f769',
	'9543d79e-e828-11e4-894a-00144feab7de',
	'9cbd2018-e4c2-11e2-875b-00144feabdc0',
	'e96b93ea-2933-11e2-9591-00144feabdc0',
	'f26a9548-9c70-11e3-b535-00144feab7de',
	'd283bb5e-ca8d-11e5-be0b-b7ece4e953a0',
	'59192b0c-b994-11e3-b74f-00144feabdc0',
	'74f09d76-a9f2-11e3-adab-00144feab7de',
	'0630ca5a-e38a-11e4-b407-00144feab7de',
];

if(module === require.main) {
	console.log(module.exports.join('\n'));
}
