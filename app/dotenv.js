let config = { parsed: {} };

if (!process.env.NODE_ENV) {
	const path = require('path');
	config = require('dotenv').config({ path: path.join(__dirname, '.env.local') });
}

module.exports = config;