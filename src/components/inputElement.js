import CustomElement from "./customElement";
import { shallowCompare, isNonEmptyObject } from "../utils";
import { createNode } from "../generator";

export default class InputElement extends CustomElement {
	static get observedAttributes() {
		return ["value", "validations"];
	}

	constructor({ type = "text" } = {}) {
		super({
			props: InputElement.observedAttributes
		});

		this.shadowEl.innerHTML = `
		<style>
			:host {
				display: block;
			}
			:host[hidden] {
				display: none;
			}
			.input-field {
				margin-top: var(--input-field-margin-top);
				margin-bottom: var(--input-field-margin-bottom);
			}
			label > p {
				font-size: 12px;
				font-weight: bold;
			}
			input {
				background-color: transparent;
				border: 2px solid #ccc;
				border-radius: 3px;
				outline: none;
				height: 40px;
				width: 100%;
				padding: 15px 10px;
				font-size: 14px;
				box-shadow: none;
				box-sizing: border-box;
				transition: box-shadow 0.3s, border-color 0.4s;
			}
			input.error {
				border-color: var(--error-red);
			}
			ul.errors-list {
				list-style: none;
				font-size: 12px;
				color: var(--error-red);
				padding-left: 0;
			}
		</style>
		<div class="input-field">
			<input type="${type}" />
			<ul class="errors-list">
			</ul>
		</div>
		`;
		this.inputEl = this.shadowRoot.querySelector("input");
	}

	connectedCallback() {
		super.connectedCallback();
		this.inputEl.value = this.value;
		this.inputEl.addEventListener("input", e => {
			this.value = e.target.value;
		});
	}

	attributeChangedCallback(attrName, oldValue, newValue) {
		const jsonParsedOldVal = this.getJSONParsedValue(oldValue);
		const jsonParsedNewVal = this.getJSONParsedValue(newValue);
		if (attrName === "value" && oldValue !== newValue) {
			this.value = newValue;
			if (this.inputEl) {
				this.inputEl.value = newValue;
			}
		}
		if (
			attrName === "validations" &&
			!shallowCompare(jsonParsedOldVal, jsonParsedNewVal)
		) {
			if (this.inputEl) {
				if (isNonEmptyObject(jsonParsedNewVal)) {
					this.inputEl.classList.add("error");
					this.renderErrors(jsonParsedNewVal);
				} else {
					this.inputEl.classList.remove("error");
					this.renderErrors();
				}
			}
		}
	}
	renderErrors(errorsMap = null) {
		const errorsUl = this.shadowRoot.querySelector(".errors-list");
		if (errorsUl) {
			errorsUl.innerHTML = "";
			if (!errorsMap) {
				return;
			}
			const liFragment = document.createDocumentFragment();
			for (const key of Object.keys(errorsMap)) {
				liFragment.appendChild(createNode("li", { content: errorsMap[key] }));
			}
			errorsUl.appendChild(liFragment);
		}
	}
	setAttribute(name, value) {
		super.setAttribute(name, value);
		this.inputEl && this.inputEl.setAttribute(name, value);
	}
}
