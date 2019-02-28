import "./components";
import validator from "./tools/validator";
import eventHandlerBuilder from "./tools/eventBuilder";
import { COMPONENTS_MAPPING } from "./config";

const formElementsMap = {};

export const createNode = (
	nodeName,
	{ classes = [], content = "", attrs = {}, children, events = {}, props = {} }
) => {
	const el = document.createElement(nodeName);
	classes.forEach(c => el.classList.add(c));
	for (let [key, value] of Object.entries(attrs)) {
		el.setAttribute(key, value);
	}
	for (let [key, value] of Object.entries(props)) {
		el[key] = value;
	}
	for (let [eventName, eventHandler] of Object.entries(events)) {
		el.addEventListener(eventName, eventHandler);
	}
	if (content) {
		el.appendChild(document.createTextNode(content));
	}
	if (children) {
		if (Array.isArray(children)) {
			const frag = document.createDocumentFragment();
			children.forEach(c => frag.appendChild(c));
			el.appendChild(frag);
		} else {
			el.appendChild(children);
		}
	}

	return el;
};

const formValidations = {};
const renderComp = (compConfig, formValues) => {
	const elementName = COMPONENTS_MAPPING[compConfig.type];
	const events = {
		change: e => {
			formValues[compConfig.id] = e.detail;
			if (compConfig.validations) {
				const errors = validator(
					compConfig.validations,
					compConfig.id,
					formValues
				);
				formValidations[compConfig.id] = errors;
				console.log(formValidations);
				formElementsMap[compConfig.id].validations = errors;
			}
		}
	};
	if (compConfig.events) {
		for (const [eventName, eventHandlers] of Object.entries(
			compConfig.events
		)) {
			let existingHandler;
			if (events[eventName]) {
				existingHandler = events[eventName];
			}

			events[eventName] = e => {
				existingHandler && existingHandler(e);
				const evaulatedEventHandlers = eventHandlerBuilder(
					eventHandlers,
					formValues,
					formElementsMap
				);
				Array.isArray(evaulatedEventHandlers)
					? evaulatedEventHandlers.forEach(evaulatedEventHandler =>
							evaulatedEventHandler(e.detail)
					  )
					: evaulatedEventHandlers(e.detail);
			};
		}
	}
	const node = createNode(elementName, {
		props: {
			value: formValues[compConfig.id] || "",
			datasource: compConfig.dataSource || [],

			validations: formValidations[compConfig.id] || {}
		},
		attrs: {
			placeholder: compConfig.text || "",
			name: compConfig.id,
			labelText: compConfig.text,
			...compConfig.attrs
		},
		events,
		children: (compConfig.children || []).map(childConfig =>
			renderComp(childConfig, formValues)
		)
	});

	formElementsMap[compConfig.id] = node;
	return node;
};

export const createComponents = (conf, containerEl, formValues) => {
	for (const compConfig of conf) {
		const element = renderComp(compConfig, formValues);
		!!element ? containerEl.appendChild(element) : void 0;
	}
};
