const convertTextToJson = (text) => {
	text = text.split('\n');
	let jsonFormat = {
		title: text[0],
		sub_title: text[1],
		values: []
	};
	let keys = text[2].split(',');

	for (var i = 3; i < text.length; i++) {
		let line = text[i].split(',');
		let list = {}
		for (let k in keys) {
			list[keys[k]] = line[k];
		}
		if (
			list['type'] === 'radio' || 
			list['type'] === 'dropdown' ||
			list['type'] === 'checkbox'
		) {
			list['value'] = list['value'].split('/');
		}

		jsonFormat['values'].push(list);
	}

	return jsonFormat;
}

export default convertTextToJson;