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
		this.selectEl.addEventListener("change", e => {
			this.value = e.target.value;
		});
	}

	attributeChangedCallback(attrName, oldValue, newValue) {
		const val = this.getJSONParsedValue(newValue);
		const oldVal = this.getJSONParsedValue(oldValue);
		if (shallowCompare(oldVal, val)) return;
		switch (attrName) {
			case "datasource": {
				this.selectEl.innerHTML = val.map(ds => `<option>${ds}</option>`);
			}
			case "value":
				console.log("val", val);
		}
	}
}
