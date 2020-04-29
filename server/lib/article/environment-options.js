'use strict';

module.exports = {
	brightcoveAccountId: process.env.BRIGHTCOVE_ACCOUNT_ID,
	brightcovePlayerId: 'default',
	enableSidebarMenu: (process.env.ENABLE_SIDEBAR_MENU === 'true'),
	enableSocialShare: (process.env.ENABLE_SOCIAL_SHARE === 'true'),
	enableAds: (process.env.ENABLE_ADS === 'true'),
	enableBarrier: (process.env.ENABLE_BARRIER === 'true'),
	thisYear: new Date().getFullYear(),
	unfurlBrightcove: (process.env.UNFURL_BRIGHTCOVE === 'true'),
};
