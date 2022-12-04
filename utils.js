/**
 * Sort an object alphabetically by its property keys
 * Source: https://stackoverflow.com/a/49702242
 * @param object
 * @returns {{}}
 */
export function sortObjectAlphabetically(object) {
	return Object.keys(object)
		.sort()
		.reduce((acc, key) => ({
			...acc, [key]: object[key]
		}), {});
}
