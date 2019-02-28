export default (validationConfig, fieldId, formValues) => {
	const fieldValue = formValues[fieldId];
	let errors = {};
	validationConfig.forEach(validation => {
		switch (validation.type) {
			case "REQUIRED":
				if (!fieldValue) {
					errors["REQUIRED"] = "Required";
				}
				break;
			case "RANGE":
				{
					const { min, max } = validation;
					if (!(min <= fieldValue && fieldValue <= max)) {
						errors["RANGE"] = "Out of Range";
					}
				}
				break;
			case "LENGTH":
				{
					const { min = 0, max } = validation;
					if (!(min <= fieldValue.length && fieldValue.length <= max)) {
						errors["LENGTH"] = "Invalid Length";
					}
				}
				break;
			case "PATTERN":
				{
					const { expression } = validation;
					if (!new RegExp(expression).test(fieldValue)) {
						errors["PATTERN"] = `Doesn't match the pattern`;
					}
				}
				break;
			case "COMPARISON":
				{
					if (
						!booleanProcessor(
							{
								...validation,
								fieldValue
							},
							formValues
						)
					) {
						errors["COMPARISON"] = `Doesn't meet the conditions`;
					}
				}
				break;
			case "CUSTOM": {
				const { validator: customValidator, customMessage } = validation;
				if (!customValidator(fieldValue)) {
					errors["CUSTOM"] = customMessage || "Validation Failed";
				}
			}
			default:
				throw "Please pass a valid validation type";
		}
	});

	return errors;
};
