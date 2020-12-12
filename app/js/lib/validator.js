module.exports = {
    isEnum: (input, enumType) => {
        if (!Object.values(enumType).includes(input)) {
            throw new Error('Invalid enum type: ' + input);
        }
    },
    isArray: (input) => {
        if (!Array.isArray(input)) {
            throw new Error('Invalid array: ' + input);
        }
    }
}