import "./styles.scss";
import { createComponents } from "./generator.js";
import { CONFIG } from "./config";

const container = document.getElementById("app");
const genContainer = document.getElementById("generator");

const formValuesContainer = document.querySelector("#formValues #vContainer");

const renderFromValuesContainer = () => {
	formValuesContainer.innerText = JSON.stringify(formValues, null, 4);
};

const formValues = new Proxy(
	{
		firstName: "Param",
		lastName: "Singh"
	},
	{
		set(obj, prop, value) {
			obj[prop] = value;
			renderFromValuesContainer();
			return true;
		}
	}
);

renderFromValuesContainer();

createComponents(CONFIG, genContainer, formValues);
