import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
        adapter: adapter({
            pages: 'build/client',
            assets: 'build/client',
            fallback: null,
            precompress: false
            }),
    }
};

export default config;
