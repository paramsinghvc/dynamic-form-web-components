export const OPERATORS = {
	"=": (a, b) => a === b,
	"!=": (a, b) => a !== b,
	"<": (a, b) => a < b,
	"<=": (a, b) => a <= b,
	">": (a, b) => a > b,
	">=": (a, b) => a >= b
};

export default (config, formValues) => {
	const { type, operator, fieldId, fieldValue } = config;
	if (type === "COMPOUND") {
		return operator === "AND"
			? conditions.reduce(
					(accumulator, cond) => accumulator && booleanProcessor(cond),
					true
			  )
			: conditions.reduce(
					(accumulator, cond) => accumulator || booleanProcessor(cond),
					false
			  );
	} else {
		return OPERATORS[operator](formValues[fieldId], fieldValue);
	}
};
