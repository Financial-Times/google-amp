const {h, Component} = require('preact');
const {parseDOM} = require('htmlparser2');
const renderToString = require('@quarterto/preact-render-array-to-string');
const createTransformer = require('@quarterto/markup-components')(require('preact'));
const textContent = require('@quarterto/domhandler-text-content');

class Bar extends Component {
	static selector = '.bar';

	static preprocess({el}) {
		const text = textContent(el);
		return {text};
	}

	render({text}) {
		return <h1>
			it works {text}
		</h1>;
	}
}

const delay = ms => new Promise(r => setTimeout(r, ms));

class Baz extends Component {
	static selector = '.baz';

	static async preprocess({el}) {
		await delay(1000);
		return {text: `this is a baz ${Date.now()} ${Math.random()}`};
	}

	render({text}) {
		return <h1>
			it works {text}
		</h1>;
	}
}

class Quux extends Component {
	static selector = '.quux';

	static preprocess() {}

	render({children}) {
		return <div>
			quux

			<foo>{children}</foo>
		</div>
	}
}

const transform = createTransformer(Bar, Baz, Quux);

const html = `<p>
	<span class="bar">foo</span>
	hello
	<span class="baz">baz</span>
	<span class="quux">
		baz
		<span class="baz">child baz</span>
	</span>
</p>`;

const dom = parseDOM(html);

console.log(html);
console.log('----------');

console.time('processing');

transform(dom).then(tree => {
	console.timeEnd('processing');
	console.log(renderToString(tree));
}, err => console.error(err.stack));
