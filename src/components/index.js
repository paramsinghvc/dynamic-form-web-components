import InputElement from "./inputElement";
import NumberInputElement from "./numberInput";
import DropdownElement from "./dropdownElement";

export const elementsConfig = {
	"app-input": InputElement,
	"app-number-input": NumberInputElement,
	"app-dropdown": DropdownElement
};

for (const [key, val] of Object.entries(elementsConfig)) {
	customElements.define(key, val);
}
