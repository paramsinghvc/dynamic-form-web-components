export default (eventHandlers, formValues, formElementsMap) => {
	const handleEvent = eventHandler => {
		switch (eventHandler.type) {
			case "SET_VALUE":
				return value => {
					formValues[eventHandler.fieldId] = eventHandler.valueField
						? formValues[eventHandler.valueField]
						: eventHandler.value === "SELF"
						? value
						: eventHandler.value;
					formElementsMap[eventHandler.fieldId].value =
						formValues[eventHandler.fieldId];
				};
		}
	};
	if (Array.isArray(eventHandlers)) {
		return eventHandlers.map(eventHandler => handleEvent(eventHandler));
	} else {
		return handleEvent(eventHandlers);
	}
};
