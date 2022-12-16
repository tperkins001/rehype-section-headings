import type { Plugin } from "unified";
import type { Element, ElementContent, Properties, Root, RootContent } from "hast";
import { visit } from "unist-util-visit";
import { validateDataAttribute } from "./dataAttribute";

export type RehypeSectionHeadingsOptions = {
	sectionDataAttribute?: string;
};

/**
 * Wraps all heading elements and any following content with `<section>` tags
 *
 * @param options An object with configuration properties that can alter the behaviour of this plugin
 * @param options.sectionDataAttribute If any heading elements have an `id` attribute, this plugin will take the
 * data-* attribute name specified here and add it against any `<section>` tags.
 * The value of the data-* attribute will be the same as the heading elements `id` attribute.
 *
 * @returns tree with all heading elements wrapped with a `<section>` tag
 */
const rehypeSectionHeadings: Plugin<[RehypeSectionHeadingsOptions?], Root> = (
	options: RehypeSectionHeadingsOptions = {},
) => {
	const sectionDataAttribute = options.sectionDataAttribute;

	if (sectionDataAttribute !== undefined) {
		validateDataAttribute(sectionDataAttribute);
	}

	return (tree) => {
		visit(tree, "element", (node, currentHeadingIdx, parent) => {
			if (!isHeadingNode(node.tagName) || currentHeadingIdx === null || parent === null) return;

			// Heading already surrounded by section
			// Apply sectionDataAttribute but don't wrap with additional `<section>` tags
			if (parent.type === "element" && parent.tagName === "section") {
				if (sectionDataAttribute === undefined) return;

				const headingElement = node;
				if (parent.properties === undefined || Object.keys(parent.properties).length === 0) {
					parent.properties = Object.create(null) as Properties;
				}

				parent.properties[sectionDataAttribute] = getIdFromElement(headingElement);
				return;
			}

			let nextHeadingIdx = currentHeadingIdx;
			while (++nextHeadingIdx < parent.children.length) {
				const nextNode = parent.children[nextHeadingIdx];
				if (nextNode?.type === "element" && isHeadingNode(nextNode.tagName)) {
					wrapWithSection(parent.children, currentHeadingIdx, nextHeadingIdx, sectionDataAttribute);
					return;
				}
			}

			wrapWithSection(parent.children, currentHeadingIdx, nextHeadingIdx, sectionDataAttribute);
		});
	};
};

function wrapWithSection(
	tree: RootContent[] | ElementContent[],
	currentHeadingIdx: number,
	nextHeadingIdx: number,
	headingIdAttributeName: string | undefined,
) {
	const headingElement = tree[currentHeadingIdx];
	let properties = Object.create(null) as Properties;

	if (headingIdAttributeName !== undefined && headingElement?.type === "element") {
		properties = {
			[headingIdAttributeName]: getIdFromElement(headingElement),
		};
	}

	const sectionContents = tree.slice(currentHeadingIdx, nextHeadingIdx) as ElementContent[];
	const section: Element = {
		type: "element",
		tagName: "section",
		children: sectionContents,
		properties,
	};

	tree.splice(currentHeadingIdx, sectionContents.length, section);
}

function isHeadingNode(tagName: string): boolean {
	return ["h1", "h2", "h3", "h4", "h5", "h6"].includes(tagName);
}

function getIdFromElement(element: Element): string | undefined {
	return element.type === "element" && element.properties?.id != null
		? element.properties.id?.toString()
		: undefined;
}

export default rehypeSectionHeadings;
