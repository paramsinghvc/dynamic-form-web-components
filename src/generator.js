import "./components";
import validator from "./tools/validator";
import eventHandlerBuilder from "./tools/eventBuilder";
import { COMPONENTS_MAPPING } from "./config";
import { createNode } from "./utils/domHelpers";

export default class Generator {
	static createComponentGenerator(...args) {
		return new Generator(...args);
	}

	constructor(
		componentsConfig,
		containerEl,
		formValues,
		formValueChangeCallback
	) {
		this.formElementsMap = {};
		this.formValidations = {};
		const formValuesProxied = new Proxy(formValues, {
			set(obj, prop, value) {
				obj[prop] = value;
				formValueChangeCallback();
				return true;
			}
		});
		this.createComponents(componentsConfig, containerEl, formValuesProxied);
	}

	renderComp(compConfig, formValues) {
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
					this.formValidations[compConfig.id] = errors;
					this.formElementsMap[compConfig.id].validations = errors;
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
						this.formElementsMap
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
				validations: this.formValidations[compConfig.id] || {}
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

		this.formElementsMap[compConfig.id] = node;
		return node;
	}

	createComponents(conf, containerEl, formValues) {
		for (const compConfig of conf) {
			const element = this.renderComp(compConfig, formValues);
			!!element ? containerEl.appendChild(element) : void 0;
		}
	}
}
