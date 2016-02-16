
function existsAndMatches(value, regex) {
	if (!value)
		return false;
	return regex.test(value.toString());
}

function existsAndNumber(value) {
	return !isNaN(value);
}

module.exports = {
	stringRegex: existsAndMatches,
	isNumber: existsAndNumber
};