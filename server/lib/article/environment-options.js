'use strict';

const lightSignupProduct = 'AMP';
const lightSignupMailinglist = 'google-amp';

module.exports = {
	brightcoveAccountId: process.env.BRIGHTCOVE_ACCOUNT_ID,
	brightcovePlayerId: 'default',
	lightSignupUrl: process.env.LIGHT_SIGNUP_URL || 'https://distro-light-signup-prod.herokuapp.com',
	lightSignupProduct: encodeURIComponent(lightSignupProduct),
	lightSignupMailinglist: encodeURIComponent(lightSignupMailinglist),
	enableLightSignup: (process.env.ENABLE_LIGHT_SIGNUP === 'true'),
	enableSidebarMenu: (process.env.ENABLE_SIDEBAR_MENU === 'true'),
	enableSocialShare: (process.env.ENABLE_SOCIAL_SHARE === 'true'),
	enableAds: (process.env.ENABLE_ADS === 'true'),
	enableLiveBlogs: (process.env.ENABLE_LIVE_BLOGS === 'true'),
	enableBarrier: (process.env.ENABLE_BARRIER === 'true'),
	thisYear: new Date().getFullYear(),
	unfurlVideos: (process.env.UNFURL_VIDEOS === 'true'),
};
