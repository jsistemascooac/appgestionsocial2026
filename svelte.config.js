import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = { 	kit: { 
		 alias: {
		"@/*": "./path/to/lib/*",
		},
		experimental: {
			remoteFunctions: true
		},
		
		adapter: adapter() 
	},
	compilerOptions: {
			experimental: {
				async: true
			}
		}, };

export default config;
