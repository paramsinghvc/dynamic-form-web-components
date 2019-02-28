export const CONFIG = [
	{
		id: "firstName",
		type: "TEXT",
		text: "First Name"
	},
	{
		id: "lastName",
		type: "TEXT",
		text: "Last Name"
	},
	{
		id: "occupation",
		type: "TEXT",
		text: `Occupation`,
		validations: [
			{
				type: "LENGTH",
				max: 20,
				min: 3
			},
			{
				type: "REQUIRED"
			}
		]
	},
	{
		id: "age",
		type: "NUMBER",
		text: `Age`,
		validations: [
			{
				type: "REQUIRED"
			},
			{
				type: "PATTERN",
				expression: "^\\d+$"
			},
			{
				type: "RANGE",
				min: 18,
				max: 60
			}
		]
	},
	{
		id: "city",
		type: "DROPDOWN",
		text: "City",
		dataSource: ["Delhi", "Mumbai", "Bangalore"]
	},
	{
		id: "state",
		type: "DROPDOWN",
		text: "State",
		dataSource: ["Karnataka", "Maharashtra", "Delhi"],
		events: {
			change: [
				{
					fieldId: "occupation",
					type: "SET_VALUE",
					valueField: "city",
					when: {
						fieldId: "city",
						fieldValue: "Delhi",
						type: "comparison",
						operator: "!="
					}
				}
			]
		}
	}
];

export const COMPONENTS_MAPPING = {
	TEXT: "app-input",
	DROPDOWN: "app-dropdown",
	NUMBER: "app-number-input"
};
