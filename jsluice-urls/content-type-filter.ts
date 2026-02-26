/**
 * @param {HttpInput} input
 * @param {SDK} sdk
 * @returns {MaybePromise<Decision>}
 */
export async function run({ request, response }, sdk) {
  var headers = response.getHeader("Content-Type");
  if (headers == undefined) {
    return false;
  }
  return headers.some(h => h.includes("javascript"));
}