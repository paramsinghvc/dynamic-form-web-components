export const isObject = a => !!a && a.constructor.name === "Object";

export const isNonEmptyObject = a => isObject(a) && !!Object.keys(a).length;

export const shallowCompareObjects = (a, b) => {
	if (!!a && !!b && (!isObject(a) || !isObject(b))) {
		const aKeys = Object.keys(a);
		const bKeys = Object.keys(b);

		if (aKeys.length !== bKeys.length) {
			return false;
		}
		for (const key of aKeys) {
			if (!Object.is(a[key], b[key])) {
				return false;
			}
		}
		return true;
	} else {
		return Object.is(a, b);
	}
};

export const shallowCompare = (a, b) => {
	if (typeof a !== typeof b) {
		return false;
	}
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return false;
		for (let i = 0; i < a.length; i++) {
			if (!Object.is(a, b)) return false;
		}
	}
	return shallowCompareObjects(a, b);
};
