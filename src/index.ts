import type { Plugin } from "unified";
import type {
  Element,
  ElementContent,
  Properties,
  Root,
  RootContent,
} from "hast";
import { visit } from "unist-util-visit";
import { isElement } from "hast-util-is-element";
import { validateDataAttribute } from "./dataAttribute";

type Headers = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export type RehypeSectionHeadingsOptions = {
  sectionDataAttribute?: string;
  maxHeadingRank?: 1 | 2 | 3 | 4 | 5 | 6;
  headerWrap?: Partial<Record<Headers, string | Element>>;
  contentWrap?: string | Element;
};

/**
 * Wraps all heading elements and any following content with `<section>` tags
 *
 * @param options An object with configuration properties that can alter the behaviour of this plugin
 * @param options.sectionDataAttribute If any heading elements have an `id` attribute, this plugin will take the
 * data-* attribute name specified here and add it against any `<section>` tags.
 * The value of the data-* attribute will be the same as the heading elements `id` attribute.
 * @param options.maxHeadingRank The maximum heading rank to wrap with `<section>` tags.
 * For example, if `maxHeadingRank` is set to `3`, then only `<h1>`, `<h2>` and `<h3>` elements will be wrapped.
 * @param options.headerWrap An object that allows you to specify a custom wrapper element for each heading element.
 * For example, if you want to wrap all `<h1>` elements with a `<div>` tag, you can do so by specifying `{ h1: "div" }`.
 * If you want to add additional properties to the wrapper element, you can do so by specifying a hast Element object.
 * @param options.contentWrap Allows you to specify a custom wrapper element for the content of each section.
 *
 * @returns tree with all heading elements wrapped with a `<section>` tag
 */
const rehypeSectionHeadings: Plugin<[RehypeSectionHeadingsOptions?], Root> = (
  options: RehypeSectionHeadingsOptions = {}
) => {
  // extract properties
  const sectionDataAttribute = options.sectionDataAttribute;
  const maxHeadingRank = options.maxHeadingRank ?? 6;
  const headerWrap = options.headerWrap ?? {};
  const contentWrap = options.contentWrap ?? null;

  if (sectionDataAttribute !== undefined) {
    validateDataAttribute(sectionDataAttribute);
  }

  // @ts-ignore
  return (tree) => {
    visit(tree, "element", (node, currentHeadingIdx, parent) => {
      if (
        !isHeadingNode(node.tagName, maxHeadingRank) ||
        currentHeadingIdx === null ||
        parent === null
      )
        return;

      // Heading already surrounded by section
      // Apply sectionDataAttribute but don't wrap with additional `<section>` tags
      if (parent.type === "element" && parent.tagName === "section") {
        if (sectionDataAttribute === undefined) return;

        const headingElement = node;
        if (
          parent.properties === undefined ||
          Object.keys(parent.properties).length === 0
        ) {
          parent.properties = Object.create(null) as Properties;
        }

        parent.properties[sectionDataAttribute] =
          getIdFromElement(headingElement);
        return;
      }

      let nextHeadingIdx = currentHeadingIdx;
      while (++nextHeadingIdx < parent.children.length) {
        const nextNode = parent.children[nextHeadingIdx];
        if (
          nextNode?.type === "element" &&
          isHeadingNode(nextNode.tagName, maxHeadingRank)
        ) {
          wrapWithSection(
            parent.children,
            currentHeadingIdx,
            nextHeadingIdx,
            sectionDataAttribute,
            headerWrap,
            contentWrap
          );
          return;
        }
      }

      wrapWithSection(
        parent.children,
        currentHeadingIdx,
        nextHeadingIdx,
        sectionDataAttribute,
        headerWrap,
        contentWrap
      );
    });
  };
};

function wrapWithSection(
  tree: RootContent[] | ElementContent[],
  currentHeadingIdx: number,
  nextHeadingIdx: number,
  headingIdAttributeName: string | undefined,
  headerWrap: Partial<Record<Headers, string | Element>>,
  contentWrap: string | Element | null
) {
  const headingElement = tree[currentHeadingIdx];
  let properties = Object.create(null) as Properties;

  if (
    headingIdAttributeName !== undefined &&
    headingElement?.type === "element"
  ) {
    properties = {
      [headingIdAttributeName]: getIdFromElement(headingElement),
    };
  }

  // wrap heading element
  if (
    headingElement?.type === "element" &&
    Object.keys(headerWrap).includes(headingElement.tagName)
  ) {
    const wrapper = headerWrap[headingElement.tagName as Headers];

    if (wrapper !== undefined && wrapper !== null && wrapper !== "") {
      tree.splice(currentHeadingIdx, 1, {
        type: "element",
        tagName: typeof wrapper === "string" ? wrapper : wrapper.tagName,
        children: [headingElement],
        properties:
          typeof wrapper === "string" || !isElement(wrapper)
            ? {}
            : wrapper.properties,
      });
    }
  }

  // wrap main contents
  if (contentWrap !== null && contentWrap !== "") {
    const mainContents = tree.slice(
      currentHeadingIdx + 1,
      nextHeadingIdx
    ) as ElementContent[];

    tree.splice(currentHeadingIdx + 1, mainContents.length, {
      type: "element",
      tagName:
        typeof contentWrap === "string" ? contentWrap : contentWrap.tagName,
      children: mainContents,
      properties: typeof contentWrap === "string" ? {} : contentWrap.properties,
    });
  }

  // wrap heading & main in <section>
  const sectionContents = tree.slice(
    currentHeadingIdx,
    contentWrap ? currentHeadingIdx + 2 : nextHeadingIdx
  ) as ElementContent[];

  tree.splice(currentHeadingIdx, sectionContents.length, {
    type: "element",
    tagName: "section",
    children: sectionContents,
    properties,
  });
}

function isHeadingNode(
  tagName: string,
  maxHeadingRank: 1 | 2 | 3 | 4 | 5 | 6 = 6
): boolean {
  return Array.from({ length: maxHeadingRank })
    .map((_, i) => `h${i + 1}`)
    .includes(tagName);
}

function getIdFromElement(element: Element): string | undefined {
  return element.type === "element" && element.properties?.id != null
    ? element.properties.id?.toString()
    : undefined;
}

export default rehypeSectionHeadings;
