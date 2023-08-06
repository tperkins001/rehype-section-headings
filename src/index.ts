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
  wrap?: Partial<Record<Headers, string | Element>>;
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
  options: RehypeSectionHeadingsOptions = {}
) => {
  const sectionDataAttribute = options.sectionDataAttribute;
  const maxHeadingRank = options.maxHeadingRank ?? 6;
  const wrap = options.wrap ?? {};

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
            wrap
          );
          return;
        }
      }

      wrapWithSection(
        parent.children,
        currentHeadingIdx,
        nextHeadingIdx,
        sectionDataAttribute,
        wrap
      );
    });
  };
};

function wrapWithSection(
  tree: RootContent[] | ElementContent[],
  currentHeadingIdx: number,
  nextHeadingIdx: number,
  headingIdAttributeName: string | undefined,
  wrap: Partial<Record<Headers, string | Element>>
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

  if (
    headingElement?.type === "element" &&
    Object.keys(wrap).includes(headingElement.tagName)
  ) {
    const wrapper = wrap[headingElement.tagName as Headers];
    if (typeof wrapper === "string") {
      if (wrapper !== "") {
        const wrapperElement: Element = {
          type: "element",
          tagName: wrapper,
          children: [headingElement],
        };

        tree.splice(currentHeadingIdx, 1, wrapperElement);
      }
    } else {
      if (isElement(wrapper)) {
        const wrapperElement: Element = {
          type: "element",
          tagName: wrapper.tagName,
          children: [headingElement],
          properties: {
            ...wrapper.properties,
          },
        };

        tree.splice(currentHeadingIdx, 1, wrapperElement);
      }
    }
  }

  const sectionContents = tree.slice(
    currentHeadingIdx,
    nextHeadingIdx
  ) as ElementContent[];

  const section: Element = {
    type: "element",
    tagName: "section",
    children: sectionContents,
    properties,
  };

  tree.splice(currentHeadingIdx, sectionContents.length, section);
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
