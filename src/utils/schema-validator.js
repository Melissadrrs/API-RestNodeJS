// LINEA AGREGADA: reemplazaremos los ctx.throw por throw errorFactory.
const errorFactory = require("../utils/logging/error-factory");

const validateRequest = (contextPart, label, schema, options) => {
  if (!schema) return;
  const { error } = schema.validate(contextPart, options);
  if (error) {
    // LINEA MODIFICADA: Manejamos los errores operacionales usando nuestra fabrica de errores
    throw errorFactory.UnknownError(`Invalid ${label} - ${error.message}`);
  }
};
// middleware de validacion que usaremos para validar los request pasandole un determinado esquema
const validate = (schema) => (ctx, next) => {
  try {
    validateRequest(ctx.headers, "Headers", schema.headers, {
      allowUnknown: true,
    });
    validateRequest(ctx.params, "URL Parameters", schema.params);
    validateRequest(ctx.query, "URL Query", schema.query);
    if (ctx.request.body) {
      validateRequest(ctx.request.body, "Request Body", schema.body);
    }
    return next();
  } catch (error) {
    // LINEA AGREGADA: Manejamos los errores operacionales usando nuestra fabrica de errores
    throw errorFactory.InvalidInputError(
      `Solicitud no válida: ${error.message}`
    );
  }
};

module.exports = validate;
