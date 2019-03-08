import CustomElement from "./customElement";
import { shallowCompare } from "../utils";

export default class DropdownElement extends CustomElement {
	static get observedAttributes() {
		return ["value", "datasource"];
	}

	constructor() {
		super({
			props: ["datasource", "value"]
		});
		this.shadowEl.innerHTML = `
		<style>
			.input-field {
				margin-top: var(--input-field-margin-top);
				margin-bottom: var(--input-field-margin-bottom);
			}
			label > p {
				font-size: 12px;
				font-weight: bold;
			}
			select {
				background: transparent;
				width: 100%;
				padding: 10px 15px;
				border: 1px solid #ccc;
				border-radius: 2px;
                height: 40px;
                font-size: 14px;
			}

		</style>
		<div class="input-field">
			<select>
			</select>
		</div>
			`;

		this.selectEl = this.shadowEl.querySelector("select");
	}
	connectedCallback() {
		super.connectedCallback();
		this.changeEventListener = e => {
			this.value = e.target.value;
		};
		this.selectEl.addEventListener("change", this.changeEventListener);
	}

	attributeChangedCallback(attrName, oldValue, newValue) {
		const val = this.getJSONParsedValue(newValue);
		const oldVal = this.getJSONParsedValue(oldValue);
		if (shallowCompare(oldVal, val)) return;
		switch (attrName) {
			case "datasource":
				{
					// TODO: Take id field from the consumer and assign value field as optionValue[id] in case of non primitive optionValue value.
					this.selectEl.innerHTML = val.map(
						optionValue =>
							`<option value="${optionValue}">${optionValue}</option>`
					);
					this.selectEl.value = this.value;
				}
				break;
			case "value":
				this.selectEl.value = val;
		}
	}

	disconnectedCallback() {
		this.selectEl.removeEventListener("change", this.changeEventListener);
	}
}
