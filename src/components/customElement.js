export default class CustomElement extends HTMLElement {
	constructor(options = {}) {
		super();
		this._value = "";
		this.shadowEl = this.attachShadow({ mode: "open" });
		this.options = options;
		if (options.props) {
			const propDescriptors = {};
			for (const prop of options.props) {
				propDescriptors[prop] = {
					get() {
						const attrValue = this.getAttribute(prop);
						return this.getJSONParsedValue(attrValue);
					},
					set(value) {
						if (prop === "value") {
							this.dispatchEvent(
								new CustomEvent("change", {
									detail: value
								})
							);
						} else {
							this.dispatchEvent(
								new CustomEvent(
									prop === "value" ? `changed` : `${prop}Changed`,
									{
										detail: value
									}
								)
							);
						}
						if (value && typeof value === "object") {
							this.setAttribute(prop, JSON.stringify(value));
						} else {
							this.setAttribute(prop, value);
						}
					}
				};
			}
			Object.defineProperties(this, propDescriptors);
		}
	}
	getJSONParsedValue(value) {
		let parsedValue;
		try {
			parsedValue = JSON.parse(value);
		} catch (e) {
			parsedValue = value;
		}
		return parsedValue;
	}
	connectedCallback() {
		const inputFieldHolder = this.shadowEl.querySelector(".input-field");
		if (inputFieldHolder) {
			inputFieldHolder.insertAdjacentHTML(
				"afterbegin",
				`<label><p>${this.getAttribute("labelText")}</p></label>`
			);
		}
	}
}
