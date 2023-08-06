# 🎁 rehype-section-headings

[![CI](https://github.com/tperkins001/rehype-section-headings/actions/workflows/ci.yml/badge.svg)](https://github.com/tperkins001/rehype-section-headings/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**[rehype](https://github.com/rehypejs/rehype)** plugin to wrap all heading
elements and any following content with `<section>` tags

- [Installation](#installation)
- [Usage](#usage)
- [Example](#example)
- [API](#api)
  - [options](#options)
    - [options.sectionDataAttribute](#optionsheadingiddataattribute)
- [License](#license)

## Installation

```bash
# npm
npm install rehype-section-headings

# yarn
yarn add rehype-section-headings

# pnpm
pnpm add rehype-section-headings
```

## Usage

```js
import rehype from "rehype";
import rehypeSectionHeadings from "rehype-section-headings";

rehype().use(rehypeSectionHeadings).process(/* html */);
```

## Example

The following script..

```js
import rehype from "rehype";
import rehypeSectionHeadings from "rehype-section-headings";

const html = `
<h1>Heading level 1</h1>
<p>Hey, World!</p>
<span>This shouldn't <i>span</i> the whole page</span>
<h2>Heading level 2</h2>
<p>Hello again, world!</p>
`;

rehype().use(rehypeSectionHeadings).process(html);
```

...results in the following output

```html
<section>
	<h1>Heading level 1</h1>
	<p>Hey, World!</p>
	<span>This shouldn't <i>span</i> the whole page</span>
</section>
<section>
	<h2>Heading level 2</h2>
	<p>Hello again, world!</p>
</section>
```

## API

`rehype().use(rehypeSectionHeadings, [options])`

### options

#### options.sectionDataAttribute

Type: `string`. Default: `undefined`.

If any heading elements have an `id` attribute, this plugin will take the
data-\* attribute name specified here and add it against any `<section>` tags.

The value of the data-\* attribute will be the same as the heading elements `id`
attribute.

```js
import rehype from "rehype";
import rehypeSectionHeadings from "rehype-section-headings";

const html = `
<h1 id="heading-level-1">Heading level 1</h1>
<p>Hey, World!</p>
<span>This shouldn't <i>span</i> the whole page</span>
<h2 id="heading-level-2">Heading level 2</h2>
<p>Hello again, world!</p>
`;

rehype().use(rehypeSectionHeadings, { sectionDataAttribute: "data-heading-id" })
  .process(html);
```

...results in the following output

```html
<section data-heading-id="heading-level-1">
	<h1 id="heading-level-1">Heading level 1</h1>
	<p>Hey, World!</p>
	<span>This shouldn't <i>span</i> the whole page</span>
</section>
<section data-heading-id="heading-level-2">
	<h2 id="heading-level-2">Heading level 2</h2>
	<p>Hello again, world!</p>
</section>
```

#### options.maxHeadingLevel

Type: `(1 | 2 | 3 | 4 | 5 | 6)`. Default: `6`.

The maximum heading `<h*>` level to wrap in section tags. Any heading elements
with a level higher than the specified value will be ignored and wrapped within
the last section tag.

For example, a maxHeadingLevel of 2 will wrap all `<h1>` and `<h2>` elements in
`<section>` tags, but any `<h3>` or higher elements will be ignored and wrapped
within their corresponding `<h2>` section tag:

```js
import rehype from "rehype";
import rehypeSectionHeadings from "rehype-section-headings";

const html = `
<h1>Heading level 1</h1>
<p>Hey, World!</p>
<p>This is a bit of content.</p>
<h2>Heading level 2</h2>
<p>What is the meaning of life?</p>
<h3>Heading level 3</h3>
<p>Lorem ipsum means nothing to me.</p>
<h2>Heading level 2 (again)</h2>
<p>A bit more content</p>
`;

rehype().use(rehypeSectionHeadings, { maxHeadingLevel: 2 })
  .process(html);
```

...results in the following output

```html
<section>
	<h1>Heading level 1</h1>
	<p>Hey, World!</p>
	<p>This is a bit of content.</p>
</section>
<section>
	<h2>Heading level 2</h2>
	<p>What is the meaning of life?</p>
	<h3>Heading level 3</h3>
	<p>Lorem ipsum means nothing to me.</p>
</section>
<section>
	<h2>Heading level 2 (again)</h2>
	<p>A bit more content</p>
</section>
```

### License

[MIT](LICENSE)
