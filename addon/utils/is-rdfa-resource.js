export function isRdfaResource(value) {
  return Boolean(value && typeof value === "object" && !(value instanceof Date));
}

export default isRdfaResource;
