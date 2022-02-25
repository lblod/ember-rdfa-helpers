import Component from '@glimmer/component';

export default class RdfaDataComponent extends Component {
  /**
   * Normalizes a model's rdfaBindings such that each property key
   * maps to an object with attributes 'property', 'datatype', 'content'
   */
  get normalizedRdfaBindings() {
    // TODO: research if caching this is worthwhile
    return normalizeRdfaBindings(this.args.rdfaBindings);
  }

  /**
   * Returns the used RDFa property.  Either by consuming the
   * supplied property argument, or by finding it from the
   * model's `prop` key.
   */
  get rdfaProperty() {
    if (this.args.property) {
      return this.args.property;
    }

    return (
      this.normalizedRdfaBindings[this.args.prop] &&
      `${this.normalizedRdfaBindings[this.args.prop].property}`
    );
  }

  /**
   * Returns the semantic type of the value if it has one.
   */
  get typeof() {
    if (this.value?.get?.('uri')) {
      return this.value.get('rdfaBindings.class');
    }

    return null;
  }

  /**
   * Returns the datatype of the value. Either by consuming the
   * supplied datatype argument, or by finding it from the
   * model's `prop` key.
   */
  get rdfaDatatype() {
    if (this.args.datatype) {
      return this.args.datatype;
    }

    return this.normalizedRdfaBindings[this.args.prop]?.datatype;
  }

  /**
   * Returns the content of a value my applying the 'content' function if provided
   */
  get rdfaContent() {
    return this.normalizedRdfaBindings[this.args.prop]?.content?.(this.value);
  }

  get value() {
    return this.args.model.get(this.args.prop);
  }
}

export function normalizeRdfaBindings(rdfaBindings) {
  const normalizedRdfaBindings = {};

  if (rdfaBindings) {
    Object.keys(rdfaBindings)
      .filter((prop) => prop != 'class')
      .forEach(function (prop) {
        const binding = rdfaBindings[prop];
        if (typeof binding == 'string') {
          normalizedRdfaBindings[prop] = { property: binding };
        } else {
          normalizedRdfaBindings[prop] = binding;
        }

        if (!normalizedRdfaBindings[prop].content) {
          const datatype = normalizedRdfaBindings[prop].datatype;
          normalizedRdfaBindings[prop].content = defaultContentFns(datatype);
        }
      });
  }

  return normalizedRdfaBindings;
}

function defaultContentFns(datatype) {
  switch (datatype) {
    case 'xsd:dateTime':
    case 'http://www.w3.org/2001/XMLSchema#dateTime':
      return (value) => value?.toISOString?.();

    case 'xsd:date':
    case 'http://www.w3.org/2001/XMLSchema#date':
      return (value) => value?.toISOString?.().substring(0, 10);

    case 'xsd:boolean':
    case 'http://www.w3.org/2001/XMLSchema#boolean':
      return (value) => (value ? 'true' : 'false');

    default:
      return null;
  }
}
