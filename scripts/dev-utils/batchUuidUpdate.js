#!/usr/bin/env node

'use strict';

const {purgeAmp} = require('../../worker/updates');
const contentToBePurged = require('./uuid-set').uuids;

// I decided to put a delay in this in case the purging end point got overloaded

for(let i = 0; i < contentToBePurged.length; i++) {
	setTimeout(() => {
		purgeAmp(`https://amp.ft.com/content/${contentToBePurged[i]}`);
	}, (i + 1) * 3000);
}

