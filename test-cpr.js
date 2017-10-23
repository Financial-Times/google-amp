const {h, Component} = require('preact');
const cpr = require('@quarterto/cheerio-preact-replace');
const cheerio = require('cheerio');
const renderToString = require('preact-render-to-string');

class Transform extends Component {
	static get selector() {
		throw new Error('unimplemented');
	}

	static preprocess() {
		throw new Error('unimplemented');
	}

	render() {
		throw new Error('unimplemented');
	}
}

const createTransformer = (...transforms) => async function applyTransforms($) {
	const {replace, tree} = cpr($);
	const $el = $.root ? $.root() : $;

	await Promise.all(
		transforms.map(
			async transform => {
				const els = $el.find(transform.selector);
				if(els.length) {
					await Promise.all(
						els.map(async (i, el) => {
							const props = await transform.preprocess({
								el: $(el), applyTransforms
							});

							$(el).data('props', props);
						}).toArray()
					);
				}
			}
		)
	);

	transforms.forEach(
		transform => replace(transform.selector, el => {
			const props = $(el).data('props');
			return h(transform, props);
		})
	);

	return tree;
};

class Bar extends Transform {
	static get selector() {
		return '.bar';
	}

	static preprocess({el, applyTransforms}) {
		const text = $(el).text();
		return {text};
	}

	render({text}) {
		return h('h1', {}, 'it works ', text);
	}
}

const delay = ms => new Promise(r => setTimeout(r, ms));

class Baz extends Transform {
	static get selector() {
		return '.baz';
	}

	static async preprocess({el, applyTransforms}) {
		await delay(1000);
		return {text: 'this is a baz'};
	}

	render({text}) {
		return h('h1', {}, 'it works ', text);
	}
}

class Quux extends Transform {
	static get selector() {
		return '.quux';
	}

	static async preprocess({el, applyTransforms}) {
		return {
			children: await applyTransforms(el),
		};
	}

	render({text}) {
		return h('div', {}, 'quux', h('span', {class: 'baz'}));
	}
}

const transform = createTransformer(Bar, Baz, Quux);

const $ = cheerio.load(`<p>
	<span class="bar">foo</span>
	hello
	<span class="baz">baz</span>
	<span class="quux">baz</span>
</p>`);

console.log($.html());

transform($).then(tree =>
	console.log(renderToString(tree)),
	err => console.error(err.stack)
);
