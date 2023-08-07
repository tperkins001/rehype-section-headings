import { beforeAll, describe, expect, test } from "vitest";
import rehypeSectionHeadings from "../src/index";

import type { Root } from "hast";
import type { Processor } from "unified";
import { h } from "hastscript";
import { toHtml } from "hast-util-to-html";
import { rehype } from "rehype";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";

const main = (...args) => h("main", ...args);
const section = (...args) => h("section", ...args);
const h1 = (...args) => h("h1", ...args);
const h2 = (...args) => h("h2", ...args);
const h3 = (...args) => h("h3", ...args);
const h4 = (...args) => h("h4", ...args);
const h5 = (...args) => h("h5", ...args);
const h6 = (...args) => h("h6", ...args);
const p = (...args) => h("p", ...args);
const span = (...args) => h("span", ...args);
const div = (...args) => h("div", ...args);
const aside = (...args) => h("aside", ...args);
const header = (...args) => h("header", ...args);

describe("without options", () => {
  let processor: Processor<Root, Root, Root, string>;

  beforeAll(() => {
    processor = rehype()
      .use(rehypeParse, { fragment: true })
      .use(rehypeSectionHeadings)
      .use(rehypeStringify);
  });

  test("wrap single heading", () => {
    // Arrange
    // prettier-ignore
    const original = toHtml(
			[
				h2("Hello, World"),
				p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
			],
		);

    // prettier-ignore
    const expected = toHtml(
			[
				section(
					[h2("Hello, World"),
					p("Lorem ipsum dolor sit amet, consectetur adipiscing elit")]),
			],
		);

    // Act
    processor.process(original, (_, actual) => {
      // Assert
      expect(actual?.value).toStrictEqual(expected);
    });
  });

  test("wrap multiple headings", () => {
    // Arrange
    // prettier-ignore
    const original = toHtml(
			[
				h2("Hello, World"),
				p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
				h2("Hey, World"),
				p("Ut enim ad minim veniam, quis nostrud exercitation ullamco")
			],
		);

    // prettier-ignore
    const expected = toHtml(
			[
				section(
					[h2("Hello, World"),
					p("Lorem ipsum dolor sit amet, consectetur adipiscing elit")]),
				section(
					[h2("Hey, World"),
					p("Ut enim ad minim veniam, quis nostrud exercitation ullamco")])
			],
		);

    // Act
    processor.process(original, (_, actual) => {
      // Assert
      expect(actual?.value).toStrictEqual(expected);
    });
  });

  test("wrap multiple headings (different heading levels)", () => {
    // Arrange
    // prettier-ignore
    const original = toHtml(
			[
				h1("Heading 1"),
				p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
				h2("Heading 2"),
				p("Ut enim ad minim veniam, quis nostrud exercitation ullamco"),
				h3("Heading 3"),
				p("aboris nisi ut aliquip ex ea commodo consequat"),
				h4("Heading 4"),
				p("Duis aute irure dolor in reprehenderit in voluptate velit esse"),
				h5("Heading 5"),
				p("cillum dolore eu fugiat nulla pariatur."),
				h6("Heading 6"),
				p("Excepteur sint occaecat cupidatat non proident")
			],
		);

    // prettier-ignore
    const expected = toHtml(
			[
				section(
					[h1("Heading 1"),
					p("Lorem ipsum dolor sit amet, consectetur adipiscing elit")]),
				section(
					[h2("Heading 2"),
					p("Ut enim ad minim veniam, quis nostrud exercitation ullamco")]),
				section(
					[h3("Heading 3"),
					p("aboris nisi ut aliquip ex ea commodo consequat")]),
				section(
					[h4("Heading 4"),
					p("Duis aute irure dolor in reprehenderit in voluptate velit esse")]),
				section(
					[h5("Heading 5"),
					p("cillum dolore eu fugiat nulla pariatur.")]),
				section(
					[h6("Heading 6"),
					p("Excepteur sint occaecat cupidatat non proident")])
			],
		);

    // Act
    processor.process(original, (_, actual) => {
      // Assert
      expect(actual?.value).toStrictEqual(expected);
    });
  });

  test("no wrap if no headings", () => {
    // Arrange
    // prettier-ignore
    const original = toHtml(
			[
				main(
					p("Hello, World"),
					p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
					span("sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"),
				)
			],
		);

    // prettier-ignore
    const expected = toHtml(
			[
				main(
					p("Hello, World"),
					p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
					span("sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"),
				)
			],
		);

    // Act
    processor.process(original, (_, actual) => {
      // Assert
      expect(actual?.value).toStrictEqual(expected);
    });
  });

  test("no section wrap if document has existing section (no headings)", () => {
    // Arrange
    // prettier-ignore
    const original = toHtml(
			[
				section([
					p("Hello, World"),
					p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
					span("sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"),
				])
			],
		);

    // prettier-ignore
    const expected = toHtml(
			[
				section([
					p("Hello, World"),
					p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
					span("sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"),
				])
			],
		);

    // Act
    processor.process(original, (_, actual) => {
      // Assert
      expect(actual?.value).toStrictEqual(expected);
    });
  });

  test("no section wrap if document has existing section (and contains h1, h2 etc.)", () => {
    // Arrange
    // prettier-ignore
    const original = toHtml(
			[
				section([
					h1("Hello, World"),
					p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
				]),
				section([
					h2("sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"),
					span("Ut enim ad minim veniam, quis nostrud exercitation")
				])
			],
		);

    // prettier-ignore
    const expected = toHtml(
			[
				section([
					h1("Hello, World"),
					p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
				]),
				section([
					h2("sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"),
					span("Ut enim ad minim veniam, quis nostrud exercitation")
				])
			],
		);

    // Act
    processor.process(original, (_, actual) => {
      // Assert
      expect(actual?.value).toStrictEqual(expected);
    });
  });

  test("wrap heading if last element in fragment", () => {
    // Arrange
    // prettier-ignore
    const original = toHtml(
			[
				p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
				p("sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"),
				h2("Hello, World"),
			],
		);

    // prettier-ignore
    const expected = toHtml(
			[
				p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
				p("sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"),
				section([
					h2("Hello, World")
				]),
			],
		);

    // Act
    processor.process(original, (_, actual) => {
      // Assert
      expect(actual?.value).toStrictEqual(expected);
    });
  });

  test("wrap heading if only element in fragment", () => {
    // Arrange
    // prettier-ignore
    const original = toHtml(
			[
				h2("Hello, World"),
			],
		);

    // prettier-ignore
    const expected = toHtml(
			[
				section([
					h2("Hello, World")
				]),
			],
		);

    // Act
    processor.process(original, (_, actual) => {
      // Assert
      expect(actual?.value).toStrictEqual(expected);
    });
  });

  test("wrap multiple headings (maintain attributes)", () => {
    // Arrange
    // prettier-ignore
    const original = toHtml(
			[
				h2({id: "lorem-ipsum", class: "heading"}, "Hello, World"),
				p({class: "paragraph"}, "Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
				h2({id: "ut-enim", class: "heading"}, "Hey, World"),
				p({class: "paragraph"}, "Ut enim ad minim veniam, quis nostrud exercitation ullamco")
			],
		);

    // prettier-ignore
    const expected = toHtml(
			[
				section(
					[h2({id: "lorem-ipsum", class: "heading"}, "Hello, World"),
					p({class: "paragraph"}, "Lorem ipsum dolor sit amet, consectetur adipiscing elit")]),
				section(
					[h2({id: "ut-enim", class: "heading"}, "Hey, World"),
					p({class: "paragraph"}, "Ut enim ad minim veniam, quis nostrud exercitation ullamco")])
			],
		);

    // Act
    processor.process(original, (_, actual) => {
      // Assert
      expect(actual?.value).toStrictEqual(expected);
    });
  });

  test("existing section attributes are maintained (and contains h1, h2 etc.)", () => {
    // Arrange
    // prettier-ignore
    const original = toHtml(
			[
				section({id: "main-section"}, [
					h1({class: "heading"}, "Heading 1"),
					p({class: "paragraph"}, "Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
					span({class: "span"}, "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"),
				]),
				section({id: "main-section"}, [
					h2({class: "heading"}, "Heading 2"),
					p({class: "paragraph"}, "Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
					span({class: "span"}, "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"),
				])
			],
		);

    // prettier-ignore
    const expected = toHtml(
			[
				section({id: "main-section"}, [
					h1({class: "heading"}, "Heading 1"),
					p({class: "paragraph"}, "Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
					span({class: "span"}, "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"),
				]),
				section({id: "main-section"}, [
					h2({class: "heading"}, "Heading 2"),
					p({class: "paragraph"}, "Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
					span({class: "span"}, "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"),
				])
			],
		);

    // Act
    processor.process(original, (_, actual) => {
      // Assert
      expect(actual?.value).toStrictEqual(expected);
    });
  });

  test("existing section attributes are maintained (no headings)", () => {
    // Arrange
    // prettier-ignore
    const original = toHtml(
			[
				section({id: "main-section"}, [
					p({class: "paragraph"}, "Hello, World"),
					p({class: "paragraph"}, "Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
					span({class: "span"}, "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"),
				])
			],
		);

    // prettier-ignore
    const expected = toHtml(
			[
				section({id: "main-section"}, [
					p({class: "paragraph"}, "Hello, World"),
					p({class: "paragraph"}, "Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
					span({class: "span"}, "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"),
				])
			],
		);

    // Act
    processor.process(original, (_, actual) => {
      // Assert
      expect(actual?.value).toStrictEqual(expected);
    });
  });

  test("existing section (nested)", () => {
    // Arrange
    // prettier-ignore
    const original = toHtml(
			[
				main([
					section({id: "main-section"}, [
						h1("Heading!"),
						p({class: "paragraph"}, "Hello, World"),
						p({class: "paragraph"}, "Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
						span({class: "span"}, "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"),
					])
				])
			],
		);

    // prettier-ignore
    const expected = toHtml(
			[
				main([
					section({id: "main-section"}, [
						h1("Heading!"),
						p({class: "paragraph"}, "Hello, World"),
						p({class: "paragraph"}, "Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
						span({class: "span"}, "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"),
					])
				])
			],
		);

    // Act
    processor.process(original, (_, actual) => {
      // Assert
      expect(actual?.value).toStrictEqual(expected);
    });
  });
});

describe("with sectionDataAttribute", () => {
  let processor: Processor<Root, Root, Root, string>;

  beforeAll(() => {
    processor = rehype()
      .use(rehypeParse, { fragment: true })
      .use(rehypeSectionHeadings, { sectionDataAttribute: "data-heading-id" })
      .use(rehypeStringify);
  });

  test("wrap heading (with id's)", () => {
    // Arrange
    // prettier-ignore
    const original = toHtml(
			[
				h2({id: 'hello-world'}, "Hello, World"),
				p({id: 'lorem-ipsum'}, "Lorem ipsum dolor sit amet, consectetur adipiscing elit")
			],
		);

    // prettier-ignore
    const expected = toHtml(
			[
				section({"data-heading-id": "hello-world"},
					[h2({id: 'hello-world'}, "Hello, World"),
					p({id: 'lorem-ipsum'}, "Lorem ipsum dolor sit amet, consectetur adipiscing elit")])
			],
		);

    // Act
    processor.process(original, (_, actual) => {
      // Assert
      expect(actual?.value).toStrictEqual(expected);
    });
  });

  test("wrap heading (without id's)", () => {
    // Arrange
    // prettier-ignore
    const original = toHtml(
			[
				h2("Hello, World"),
				p({id: 'lorem-ipsum'}, "Lorem ipsum dolor sit amet, consectetur adipiscing elit")
			],
		);

    // prettier-ignore
    const expected = toHtml(
			[
				section(
					[h2("Hello, World"),
					p({id: 'lorem-ipsum'}, "Lorem ipsum dolor sit amet, consectetur adipiscing elit")])
			],
		);

    // Act
    processor.process(original, (_, actual) => {
      // Assert
      expect(actual?.value).toStrictEqual(expected);
    });
  });

  test("wrap multiple headings (with id's)", () => {
    // Arrange
    // prettier-ignore
    const original = toHtml(
			[
				h2({id: 'hello-world'}, "Hello, World"),
				p({id: 'lorem-ipsum'}, "Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
				h2({id: 'hey-world'}, "Hey, World"),
				p({id: 'ut-enim'}, "Ut enim ad minim veniam, quis nostrud exercitation ullamco")
			],
		);

    // prettier-ignore
    const expected = toHtml(
			[
				section({"data-heading-id": "hello-world"},
					[h2({id: 'hello-world'}, "Hello, World"),
					p({id: 'lorem-ipsum'}, "Lorem ipsum dolor sit amet, consectetur adipiscing elit")]),
				section({"data-heading-id": "hey-world"},
					[h2({id: 'hey-world'}, "Hey, World"),
					p({id: 'ut-enim'}, "Ut enim ad minim veniam, quis nostrud exercitation ullamco")])
			],
		);

    // Act
    processor.process(original, (_, actual) => {
      // Assert
      expect(actual?.value).toStrictEqual(expected);
    });
  });

  test("wrap multiple headings (without id's)", () => {
    // Arrange
    // prettier-ignore
    const original = toHtml(
			[
				h2("Hello, World"),
				p({id: 'lorem-ipsum'}, "Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
				h2("Hey, World"),
				p({id: 'ut-enim'}, "Ut enim ad minim veniam, quis nostrud exercitation ullamco")
			],
		);

    // prettier-ignore
    const expected = toHtml(
			[
				section(
					[h2("Hello, World"),
					p({id: 'lorem-ipsum'}, "Lorem ipsum dolor sit amet, consectetur adipiscing elit")]),
				section(
					[h2("Hey, World"),
					p({id: 'ut-enim'}, "Ut enim ad minim veniam, quis nostrud exercitation ullamco")])
			],
		);

    // Act
    processor.process(original, (_, actual) => {
      // Assert
      expect(actual?.value).toStrictEqual(expected);
    });
  });

  test("wrap multiple headings (with attributes)", () => {
    // Arrange
    // prettier-ignore
    const original = toHtml(
			[
				h2({ id: "heading-id", class: "hello" }, "Hello, World"),
				p({id: 'lorem-ipsum'}, "Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
				h2({ id: "heading-id-again", class: "hey" }, "Hey, World"),
				p({id: 'ut-enim'}, "Ut enim ad minim veniam, quis nostrud exercitation ullamco")
			],
		);

    // prettier-ignore
    const expected = toHtml(
			[
				section({"data-heading-id": "heading-id"},
					[h2({ id: "heading-id", class: "hello" }, "Hello, World"),
					p({id: 'lorem-ipsum'}, "Lorem ipsum dolor sit amet, consectetur adipiscing elit")]),
				section({"data-heading-id": "heading-id-again"},
					[h2({ id: "heading-id-again", class: "hey" }, "Hey, World"),
					p({id: 'ut-enim'}, "Ut enim ad minim veniam, quis nostrud exercitation ullamco")])
			],
		);

    // Act
    processor.process(original, (_, actual) => {
      // Assert
      expect(actual?.value).toStrictEqual(expected);
    });
  });

  test("existing sections (heading without id)", () => {
    // Arrange
    // prettier-ignore
    const original = toHtml(
			[
				section(
					[h2("Hello, World"),
					p({id: 'lorem-ipsum'}, "Lorem ipsum dolor sit amet, consectetur adipiscing elit")]),
				section(
					[h2("Hey, World"),
					p({id: 'ut-enim'}, "Ut enim ad minim veniam, quis nostrud exercitation ullamco")])
			],
		);

    // prettier-ignore
    const expected = toHtml(
			[
				section(
					[h2("Hello, World"),
					p({id: 'lorem-ipsum'}, "Lorem ipsum dolor sit amet, consectetur adipiscing elit")]),
				section(
					[h2("Hey, World"),
					p({id: 'ut-enim'}, "Ut enim ad minim veniam, quis nostrud exercitation ullamco")])
			],
		);

    // Act
    processor.process(original, (_, actual) => {
      // Assert
      expect(actual?.value).toStrictEqual(expected);
    });
  });

  test("existing sections (heading with id)", () => {
    // Arrange
    // prettier-ignore
    const original = toHtml(
			[
				section(
					[h2({id: "hello-world"}, "Hello, World"),
					p({id: 'lorem-ipsum'}, "Lorem ipsum dolor sit amet, consectetur adipiscing elit")]),
				section(
					[h2({id: "hey-world"}, "Hey, World"),
					p({id: 'ut-enim'}, "Ut enim ad minim veniam, quis nostrud exercitation ullamco")])
			],
		);

    // prettier-ignore
    const expected = toHtml(
			[
				section({"data-heading-id": "hello-world"},
					[h2({id: "hello-world"}, "Hello, World"),
					p({id: 'lorem-ipsum'}, "Lorem ipsum dolor sit amet, consectetur adipiscing elit")]),
				section({"data-heading-id": "hey-world"},
					[h2({id: "hey-world"}, "Hey, World"),
					p({id: 'ut-enim'}, "Ut enim ad minim veniam, quis nostrud exercitation ullamco")])
			],
		);

    // Act
    processor.process(original, (_, actual) => {
      // Assert
      expect(actual?.value).toStrictEqual(expected);
    });
  });
});

describe("data attribute validation", () => {
  test("sectionDataAttribute should be 'string'", () => {
    // Arrange
    const processorWithOption = rehype()
      .use(rehypeParse, { fragment: true })
      // @ts-expect-error we provide the wrong type here to validate we check type
      .use(rehypeSectionHeadings, { sectionDataAttribute: 1 })
      .use(rehypeStringify);

    // prettier-ignore
    const original = toHtml(
			[
				h2("Hello, World"),
				p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
			],
		);

    // Act
    expect(() => processorWithOption.process(original)).toThrowError(
      /^sectionDataAttribute must be of type 'string'$/
    );
  });

  test("sectionDataAttribute should fail if no value is provided", () => {
    // Arrange
    const processorWithOption = rehype()
      .use(rehypeParse, { fragment: true })
      .use(rehypeSectionHeadings, { sectionDataAttribute: "" })
      .use(rehypeStringify);

    // prettier-ignore
    const original = toHtml(
			[
				h2("Hello, World"),
				p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
			],
		);

    // Act
    expect(() => processorWithOption.process(original)).toThrowError(
      "sectionDataAttribute '' is an invalid data-* attribute"
    );
  });

  test("sectionDataAttribute should fail if no hyphen exists after 'data'", () => {
    // Arrange
    const processorWithOption = rehype()
      .use(rehypeParse, { fragment: true })
      .use(rehypeSectionHeadings, { sectionDataAttribute: "data" })
      .use(rehypeStringify);

    // prettier-ignore
    const original = toHtml(
			[
				h2("Hello, World"),
				p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
			],
		);

    // Act
    expect(() => processorWithOption.process(original)).toThrowError(
      "sectionDataAttribute 'data' is an invalid data-* attribute"
    );
  });

  test("sectionDataAttribute should fail if no attribute name provided after data-*", () => {
    // Arrange
    const processorWithOption = rehype()
      .use(rehypeParse, { fragment: true })
      .use(rehypeSectionHeadings, { sectionDataAttribute: "data-" })
      .use(rehypeStringify);

    // prettier-ignore
    const original = toHtml(
			[
				h2("Hello, World"),
				p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
			],
		);

    // Act
    expect(() => processorWithOption.process(original)).toThrowError(
      "sectionDataAttribute 'data-' is an invalid data-* attribute"
    );
  });

  test("sectionDataAttribute should fail if attribute name contains a semi-colon", () => {
    // Arrange
    const processorWithOption = rehype()
      .use(rehypeParse, { fragment: true })
      .use(rehypeSectionHeadings, { sectionDataAttribute: "data-ab;c" })
      .use(rehypeStringify);

    // prettier-ignore
    const original = toHtml(
			[
				h2("Hello, World"),
				p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
			],
		);

    // Act
    expect(() => processorWithOption.process(original)).toThrowError(
      "sectionDataAttribute 'data-ab;c' is an invalid data-* attribute"
    );
  });

  test("sectionDataAttribute should fail if attribute name contains capital letters", () => {
    // Arrange
    const processorWithOption = rehype()
      .use(rehypeParse, { fragment: true })
      .use(rehypeSectionHeadings, { sectionDataAttribute: "data-ABC" })
      .use(rehypeStringify);

    // prettier-ignore
    const original = toHtml(
			[
				h2("Hello, World"),
				p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
			],
		);

    // Act
    expect(() => processorWithOption.process(original)).toThrowError(
      "sectionDataAttribute 'data-ABC' is an invalid data-* attribute"
    );
  });
});

describe("with maxHeadingLevel", () => {
  let processor: Processor<Root, Root, Root, string>;

  beforeAll(() => {
    processor = rehype()
      .use(rehypeParse, { fragment: true })
      .use(rehypeSectionHeadings, { maxHeadingRank: 2 })
      .use(rehypeStringify);
  });

  test("wraps normally", () => {
    // Arrange
    // prettier-ignore
    const original = toHtml(
			[
				h1("Heaidng h1"),
				p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
				h2("Heading h2"),
				p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
			],
		);

    // prettier-ignore
    const expected = toHtml(
			[
				section(
					[h1("Heaidng h1"),
					p("Lorem ipsum dolor sit amet, consectetur adipiscing elit")]),
				section(
					[h2("Heading h2"),
					p("Lorem ipsum dolor sit amet, consectetur adipiscing elit")]),
			],
		);

    // Act
    processor.process(original, (_, actual) => {
      // Assert
      expect(actual?.value).toStrictEqual(expected);
    });
  });

  test("does not wrap if maxHeadingRank is lower than the heading rank", () => {
    // Arrange
    // prettier-ignore
    const original = toHtml(
			[
				h3("Heaidng h3"),
				p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
				p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
			],
		);

    // prettier-ignore
    const expected = toHtml(
			[
				h3("Heaidng h3"),
				p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
				p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
			],
		);

    // Act
    processor.process(original, (_, actual) => {
      // Assert
      expect(actual?.value).toStrictEqual(expected);
    });
  });

  test("wraps higher headings within parent section", () => {
    // Arrange
    // prettier-ignore
    const original = toHtml(
			[
				h1("Heading h1"),
				p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
				h2("Heading h2"),
				p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
				h3("Heading h3"),
				p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
			],
		);

    // prettier-ignore
    const expected = toHtml(
			[
				section(
					[h1("Heading h1"),
					p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"),]),
				section(
					[h2("Heading h2"),
					p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
					h3("Heading h3"),
					p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"),]),
			],
		);

    // Act
    processor.process(original, (_, actual) => {
      // Assert
      expect(actual?.value).toStrictEqual(expected);
    });
  });
});

describe("with headingWrap", () => {
  test("wraps headings based on wrap option", () => {
    // Arrange
    const processorWithOption = rehype()
      .use(rehypeParse, { fragment: true })
      .use(rehypeSectionHeadings, { headerWrap: { h1: "div", h2: "aside" } })
      .use(rehypeStringify);

    // Arrange
    // prettier-ignore
    const original = toHtml(
			[
				h1("Heading h1"),
				p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
				h2("Heading h2"),
				p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
			],
		);

    // prettier-ignore
    const expected = toHtml(
			[
				section(
					[div(h1("Heading h1")),
					p("Lorem ipsum dolor sit amet, consectetur adipiscing elit")]),
				section(
					[aside(h2("Heading h2")),
					p("Lorem ipsum dolor sit amet, consectetur adipiscing elit")]),
			],
		);

    // Act
    processorWithOption.process(original, (_, actual) => {
      // Assert
      expect(actual?.value).toStrictEqual(expected);
    });
  });

  test("does not wrap unpsecified headings", () => {
    // Arrange
    const processorWithOption = rehype()
      .use(rehypeParse, { fragment: true })
      .use(rehypeSectionHeadings, { headerWrap: { h1: "div", h2: "aside" } })
      .use(rehypeStringify);

    // Arrange
    // prettier-ignore
    const original = toHtml(
			[
				h1("Heading h1"),
				p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
				h2("Heading h2"),
				p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
				h3("Heading h3"),
				p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
			],
		);

    // prettier-ignore
    const expected = toHtml(
			[
				section(
					[div(h1("Heading h1")),
					p("Lorem ipsum dolor sit amet, consectetur adipiscing elit")]),
				section(
					[aside(h2("Heading h2")),
					p("Lorem ipsum dolor sit amet, consectetur adipiscing elit")]),
				section(
					[h3("Heading h3"),
					p("Lorem ipsum dolor sit amet, consectetur adipiscing elit")]),

			],
		);

    // Act
    processorWithOption.process(original, (_, actual) => {
      // Assert
      expect(actual?.value).toStrictEqual(expected);
    });
  });

  test("does not wrap if property value is undefined or empty string", () => {
    // Arrange
    const processorWithOption = rehype()
      .use(rehypeParse, { fragment: true })
      .use(rehypeSectionHeadings, { headerWrap: { h1: undefined, h2: "" } })
      .use(rehypeStringify);

    // Arrange
    // prettier-ignore
    const original = toHtml(
			[
				h1("Heading h1"),
				p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
				h2("Heading h2"),
				p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
			],
		);

    // prettier-ignore
    const expected = toHtml(
			[
				section(
					[h1("Heading h1"),
					p("Lorem ipsum dolor sit amet, consectetur adipiscing elit")]),
				section(
					[h2("Heading h2"),
					p("Lorem ipsum dolor sit amet, consectetur adipiscing elit")]),
			],
		);

    // Act
    processorWithOption.process(original, (_, actual) => {
      // Assert
      expect(actual?.value).toStrictEqual(expected);
    });
  });

  test("works with hast Node as wrap value", () => {
    // Arrange
    const processorWithOption = rehype()
      .use(rehypeParse, { fragment: true })
      .use(rehypeSectionHeadings, {
        headerWrap: {
          h1: {
            type: "element",
            tagName: "div",
            properties: { className: ["header-wrapper"] },
            children: [],
          },
          h2: "aside",
        },
      })
      .use(rehypeStringify);

    // Arrange
    // prettier-ignore
    const original = toHtml(
			[
				h1("Heading h1"),
				p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
				h2("Heading h2"),
				p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
			],
		);

    // prettier-ignore
    const expected = toHtml(
			[
				section(
					[div({className: ["header-wrapper"]}, h1("Heading h1")),
					p("Lorem ipsum dolor sit amet, consectetur adipiscing elit")]),
				section(
					[aside(h2("Heading h2")),
					p("Lorem ipsum dolor sit amet, consectetur adipiscing elit")]),
			],
		);

    // Act
    processorWithOption.process(original, (_, actual) => {
      // Assert
      expect(actual?.value).toStrictEqual(expected);
    });
  });
});

describe("with contentWrap", () => {
  test("wraps content based on wrap option", () => {
    // Arrange
    const processorWithOption = rehype()
      .use(rehypeParse, { fragment: true })
      .use(rehypeSectionHeadings, { contentWrap: "main" })
      .use(rehypeStringify);

    // Arrange
    // prettier-ignore
    const original = toHtml(
			[
				h1("Heading h1"),
				p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
				h2("Heading h2"),
				p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
			],
		);

    // prettier-ignore
    const expected = toHtml(
			[
				section(
					[h1("Heading h1"),
					main(p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"))]),
				section(
					[h2("Heading h2"),
					main(p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"))]),
			],
		);

    // Act
    processorWithOption.process(original, (_, actual) => {
      // Assert
      expect(actual?.value).toStrictEqual(expected);
    });
  });

  test("wraps content using hast element as wrap option", () => {
    // Arrange
    const processorWithOption = rehype()
      .use(rehypeParse, { fragment: true })
      .use(rehypeSectionHeadings, {
        contentWrap: {
          type: "element",
          tagName: "main",
          properties: { className: ["content-wrapper"] },
          children: [],
        },
      })
      .use(rehypeStringify);

    // Arrange
    // prettier-ignore
    const original = toHtml(
			[
				h1("Heading h1"),
				p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
				h2("Heading h2"),
				p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
			],
		);

    // prettier-ignore
    const expected = toHtml(
			[
				section(
					[h1("Heading h1"),
					main({className: ["content-wrapper"]}, p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"))]),
				section(
					[h2("Heading h2"),
					main({className: ["content-wrapper"]}, p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"))]),
			],
		);

    // Act
    processorWithOption.process(original, (_, actual) => {
      // Assert
      expect(actual?.value).toStrictEqual(expected);
    });
  });

  test("wraps content with headerWrap option as well", () => {
    // Arrange
    const processorWithOption = rehype()
      .use(rehypeParse, { fragment: true })
      .use(rehypeSectionHeadings, {
        contentWrap: "main",
        headerWrap: {
          h1: "header",
          h2: "aside",
        },
      })
      .use(rehypeStringify);

    // Arrange
    // prettier-ignore
    const original = toHtml(
			[
				h1("Heading h1"),
				p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
				h2("Heading h2"),
				p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
			],
		);

    // prettier-ignore
    const expected = toHtml(
			[
				section(
					[header(h1("Heading h1")),
					main(p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"))]),
				section(
					[aside(h2("Heading h2")),
					main(p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"))]),
			],
		);

    // Act
    processorWithOption.process(original, (_, actual) => {
      // Assert
      expect(actual?.value).toStrictEqual(expected);
    });
  });

  test("does not wrap if property value is undefined or empty string", () => {
    // Arrange
    const processorWithOption = rehype()
      .use(rehypeParse, { fragment: true })
      .use(rehypeSectionHeadings, { contentWrap: "" })
      .use(rehypeStringify);

    // Arrange
    // prettier-ignore
    const original = toHtml(
			[
				h1("Heading h1"),
				p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
				h2("Heading h2"),
				p("Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
			],
		);

    // prettier-ignore
    const expected = toHtml(
			[
				section(
					[h1("Heading h1"),
					p("Lorem ipsum dolor sit amet, consectetur adipiscing elit")]),
				section(
					[h2("Heading h2"),
					p("Lorem ipsum dolor sit amet, consectetur adipiscing elit")]),
			],
		);

    // Act
    processorWithOption.process(original, (_, actual) => {
      // Assert
      expect(actual?.value).toStrictEqual(expected);
    });
  });
});
