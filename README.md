# 🎁 @maxmmyron/rehype-section-headings

A fork of [Tim Perkins'](https://github.com/tperkins001) great rehype package
[rehype-section-headings](https://github.com/tperkins001/rehype-section-headings).
I added a few customizable options that make it more suitable for my personal
use cases.

[![CI](https://github.com/maxmmyron/rehype-section-headings/actions/workflows/ci.yml/badge.svg)](https://github.com/maxmmyron/rehype-section-headings/actions/workflows/ci.yml)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**[rehype](https://github.com/rehypejs/rehype)** plugin to wrap all heading
elements and any following content with `<section>` tags

- [Installation](#installation)
- [Usage](#usage)
- [Example](#example)
- [API](#api)
  - [options](#options)
    - [options.sectionDataAttribute](#optionsheadingiddataattribute)
    - [options.maxHeadingLevel](#optionsmaxheadinglevel)
    - [options.headerWrap](#optionsheaderwrap)
    - [options.contentWrap](#optionscontentwrap)
- [License](#license)

## Installation

```bash
# npm
npm install @maxmmyron/rehype-section-headings

# yarn
yarn add @maxmmyron/rehype-section-headings

# pnpm
pnpm add @maxmmyron/rehype-section-headings
```

## Usage

```js
import rehype from "rehype";
import rehypeSectionHeadings from "@maxmmyron/rehype-section-headings";

rehype().use(rehypeSectionHeadings).process(/* html */);
```

## Example

The following script..

```js
import rehype from "rehype";
import rehypeSectionHeadings from "@maxmmyron/rehype-section-headings";

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
import rehypeSectionHeadings from "@maxmmyron/rehype-section-headings";

const html = `
<h1 id="heading-level-1">Heading level 1</h1>
<p>Hey, World!</p>
<span>This shouldn't <i>span</i> the whole page</span>
<h2 id="heading-level-2">Heading level 2</h2>
<p>Hello again, world!</p>
`;

rehype()
  .use(rehypeSectionHeadings, { sectionDataAttribute: "data-heading-id" })
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
import rehypeSectionHeadings from "@maxmmyron/rehype-section-headings";

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

rehype().use(rehypeSectionHeadings, { maxHeadingLevel: 2 }).process(html);
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

#### options.headerWrap

Type:
`Partial<Record<"h1" | "h2" | "h3" | "h4" | "h5" | "h6", string | Hast.Element>>`. Default: `{}`.

An optional element to wrap a particular header in. Useful as a jumping-off point when you need
to insert extra content with the header, while keeping the header itself as the
first child of the section. Can be specified as a string (i.e. `"div"` or `"aside"`), or as a hast element (which provides more granular element property control).

```js
import rehype from "rehype";
import rehypeSectionHeadings from "@maxmmyron/rehype-section-headings";

const html = `
<h1>Heading level 1</h1>
<p>Hey, World!</p>
<p>This is a bit of content.</p>
<h2>Heading level 2</h2>
<p>What is the meaning of life?</p>
`;

rehype()
  .use(rehypeSectionHeadings, { headerWrap: { h1: "aside" } })
  .process(html);
```

...results in the following output

```html
<section>
  <aside>
    <h1>Heading level 1</h1>
  </aside>
  <p>Hey, World!</p>
  <p>This is a bit of content.</p>
</section>
<section>
  <h2>Heading level 2</h2>
  <p>What is the meaning of life?</p>
</section>
```

You can also use [hast elements](https://github.com/syntax-tree/hast#element) to
describe the wrapping element:

```js
import rehype from "rehype";
import rehypeSectionHeadings from "@maxmmyron/rehype-section-headings";

const html = `
<h1>Heading level 1</h1>
<p>Hey, World!</p>
<p>This is a bit of content.</p>
<h2>Heading level 2</h2>
<p>What is the meaning of life?</p>
`;

rehype()
  .use(rehypeSectionHeadings, {
    headerWrap: {
      h1: {
        type: "element",
        tagName: "aside",
        properties: { className: ["aside"] },
        children: [],
      },
    },
  })
  .process(html);
```

...results in the following output

```html
<section>
  <aside class="aside">
    <h1>Heading level 1</h1>
  </aside>
  <p>Hey, World!</p>
  <p>This is a bit of content.</p>
</section>
<section>
  <h2>Heading level 2</h2>
  <p>What is the meaning of life?</p>
</section>
```

#### options.contentWrap

Type: `string | Hast.Element`. default: `null`.

An optional element to wrap the content of a section in. Useful as a jumping-off point when you need to further customize a section's content. Accepts either a string (i.e. a tag name like `"div"`) or a hast Element.

```js
import rehype from "rehype";
import rehypeSectionHeadings from "@maxmmyron/rehype-section-headings";

const html = `
<h1>Heading level 1</h1>
<p>Hey, World!</p>
<p>This is a bit of content.</p>
<img src="LK-99.png" alt="A supposed room-temperature superconductor." />
<h2>Heading level 2</h2>
<p>I want to believe!!!</p>
`;

rehype().use(rehypeSectionHeadings, { contentWrap: "main" }).process(html);
```

...results in the following output

```html
<section>
  <h1>Heading level 1</h1>
  <main>
    <p>Hey, World!</p>
    <p>This is a bit of content.</p>
    <img src="LK-99.png" alt="A supposed room-temperature superconductor." />
  </main>
</section>
<section>
  <h2>Heading level 2</h2>
  <main>
    <p>I want to believe!!!</p>
  </main>
</section>
```

We can also provide this as a hast element, to get more granular control over the element's properties:

```js
import rehype from "rehype";
import rehypeSectionHeadings from "@maxmmyron/rehype-section-headings";

const html = `
<h1>Heading level 1</h1>
<p>Hey, World!</p>
<p>This is a bit of content.</p>
<img src="LK-99.png" alt="A supposed room-temperature superconductor." />
<h2>Heading level 2</h2>
<p>I want to believe!!!</p>
`;

rehype()
  .use(rehypeSectionHeadings, {
    contentWrap: {
      type: "element",
      tagName: "main",
      properties: { className: ["content"] },
      children: [],
    },
  })
  .process(html);
```

...results in the following output

```html
<section>
  <h1>Heading level 1</h1>
  <main class="content">
    <p>Hey, World!</p>
    <p>This is a bit of content.</p>
    <img src="LK-99.png" alt="A supposed room-temperature superconductor." />
  </main>
</section>
<section>
  <h2>Heading level 2</h2>
  <main class="content">
    <p>I want to believe!!!</p>
  </main>
</section>
```

We can even combine this with [`options.headerWrap`](#optionsheaderwrap) to get even more control over the output:

```js
import rehype from "rehype";

const html = `
<h1>Heading level 1</h1>
<p>Hey, World!</p>
<p>This is a bit of content.</p>
<img src="LK-99.png" alt="A supposed room-temperature superconductor." />
<h2>Heading level 2</h2>
<p>I want to believe!!!</p>
`;

rehype()
  .use(rehypeSectionHeadings, {
    headerWrap: {
      h1: "header",
      h2: {
        type: "element",
        tagName: "aside",
        properties: { className: ["aside"] },
        children: [],
      },
    },
    contentWrap: {
      type: "element",
      tagName: "main",
      properties: { className: ["content"] },
      children: [],
    },
  })
  .process(html);
```

...results in the following output

```html
<section>
  <header>
    <h1>Heading level 1</h1>
  </header>
  <main class="content">
    <p>Hey, World!</p>
    <p>This is a bit of content.</p>
    <img src="LK-99.png" alt="A supposed room-temperature superconductor." />
  </main>
</section>
<section>
  <aside class="aside">
    <h2>Heading level 2</h2>
  </aside>
  <main class="content">
    <p>I want to believe!!!</p>
  </main>
</section>
```

### License

[MIT](LICENSE)
