export function isRdfaResource(value) {
  return value && typeof value === "object" && !(value instanceof Date);
}

export default isRdfaResource;
