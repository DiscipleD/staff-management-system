/**
 * @author Disciple_D
 * @homepage https://github.com/discipled/
 * @since 22/05/2017
 */

const isObject = object => typeof object === 'object';

const isArray = array => Object.prototype.toString.call(array) === '[object Array]';

const copy = input => {
	if (!isObject(input)) return input;
	else if (isArray(input)) return input.map(item => copy(item));
	return Object
		.keys(input)
		.reduce((obj, key) => {
			obj[key] = copy(input[key]);
			return obj;
		}, {});
};

export { copy, isArray, isObject };

