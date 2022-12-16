/**
 * Validate provided data attribute value. If invalid, will always throw an error.
 *
 * Note: data attributes must adhere to XML Name production, EXCEPT semi-colon (:) and upper case ASCII alphas (A-Z)
 *
 * Refer to the following links on the relevant specs for data attributes
 *
 * {@link https://html.spec.whatwg.org/multipage/dom.html#embedding-custom-non-visible-data-with-the-data-*-attributes HTML Spec - Data Attributes}
 *
 * {@link https://html.spec.whatwg.org/multipage/infrastructure.html#xml-compatible HTML Spec - XML Compatible}
 *
 * {@link https://www.w3.org/TR/xml/#NT-Name XML Name Production}
 * @param dataAttribute The data attribute to validate
 */
export function validateDataAttribute(dataAttribute: string): void {
	if (typeof dataAttribute !== "string") {
		throw new TypeError("sectionDataAttribute must be of type 'string'");
	}

	const regex =
		/^data-[_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u{10000}-\u{EFFFF}][_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u{10000}-\u{EFFFF}-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/u;

	if (!regex.test(dataAttribute)) {
		throw new Error(`sectionDataAttribute '${dataAttribute}' is an invalid data-* attribute`);
	}
}
