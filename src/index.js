import "./styles.scss";
import Generator, { createComponents } from "./generator.js";
import { CONFIG } from "./config";

const genContainer = document.getElementById("generator");

const formValuesContainer = document.querySelector("#formValues #vContainer");

const renderFromValuesContainer = () => {
	formValuesContainer.innerText = JSON.stringify(formValues, null, 4);
};

const formValues = {
	firstName: "Param",
	lastName: "Singh",
	city: "Bangalore",
	state: "Karnataka"
};

renderFromValuesContainer();

Generator.createComponentGenerator(
	CONFIG,
	genContainer,
	formValues,
	renderFromValuesContainer
);
