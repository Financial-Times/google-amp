'use strict';

module.exports = body => body.replace(/<\/a>\s+([,;.:])/mg, '</a>$1');
