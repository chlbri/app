//#region ../../node_modules/@bemedev/sleep/lib/index.js
var sleep = (milliseconds = 100) => {
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
};
//#endregion
export { sleep as t };
