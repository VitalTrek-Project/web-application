/**
 * Normaliza la lista de recursos devuelta por MockAPI (array plano o clave anidada).
 *
 * @param {import('axios').AxiosResponse} response
 * @param {string} [collectionKey]
 * @returns {Object[]}
 */
export function extractResourceList(response, collectionKey) {
  const status = response?.status ?? 200;
  if (status < 200 || status >= 400) {
    return [];
  }

  const data = response?.data;
  if (Array.isArray(data)) {
    return data.filter(Boolean);
  }

  if (data && collectionKey && Array.isArray(data[collectionKey])) {
    return data[collectionKey].filter(Boolean);
  }

  if (data && typeof data === "object") {
    return [data];
  }

  return [];
}
