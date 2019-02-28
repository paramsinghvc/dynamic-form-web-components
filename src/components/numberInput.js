import InputElement from "./inputElement";

export default class NumberInputElement extends InputElement {
	constructor() {
		super({
			type: "number"
		});
	}
}
