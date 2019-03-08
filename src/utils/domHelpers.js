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
