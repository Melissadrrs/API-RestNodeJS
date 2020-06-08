/**
 * person.controller.js
 * Responsable por recibir las solicitudes http desde el router person.route.js
 */
const PersonRepository = require("../repositories/person.repository");
// LINEA AGREGADA: reemplazaremos los ctx.throw por throw errorFactory.
const errorFactory = require("../utils/logging/error-factory");
const repository = new PersonRepository();

const ToNum = (value) => {
  return value && !isNaN(value) ? parseInt(value) : 0;
};

const PaginationData = (data, query) => {
  const page = ToNum(query.page);
  const limit = ToNum(query.limit);

  if (page === 0 || limit === 0) return data;

  const start = (page - 1) * limit;
  const end = page * limit;
  return data.slice(start, end);
};

module.exports = class PersonController {
  /**
   *
   * @param {object} ctx: contexto de koa que contiene los parameteros de la solicitud, en este caso
   * desde el url de donde sacaremos el valor del parametro index (ctx.params.index)
   */
  async getByIndex(ctx) {
    const index =
      ctx.params.index && !isNaN(ctx.params.index)
        ? parseInt(ctx.params.index)
        : 0;
    const filter = { index: index };
    const data = await repository.findOne(filter);
    if (data) {
      ctx.body = data;
    } else {
      // LINEA AGREGADA: Manejamos los errores operacionales usando nuestra fabrica de errores
      throw errorFactory.NotFoundError(
        `No se ha encontrado la persona con el indice ${index}`
      );
    }
  }

  /**
   *
   * @param {object} ctx: contexto de koa que contiene los parameteros de la solicitud, en este caso desde el body,
   * obtendremos las propiedades de la persona a guardar a traves de ctx.request.body
   */
  async save(ctx) {
    const person = ctx.request.body;
    await repository.save(person, true);
    ctx.body = person;
  }

  async getByFilter(ctx) {
    const query = ctx.request.query;
    const filter = { $and: [] };
    let filterText = "";

    for (const propName in query) {
      if (query[propName] && propName !== "page" && propName !== "limit") {
        filter.$and.push({ [propName]: query[propName] });
        filterText = filterText + `\n ${[propName]}: ${query[propName]}`;
      }
    }

    const data = await repository.find(filter);
    if (data && data.length > 0) {
      ctx.body = PaginationData(data, query);
    } else {
      ctx.throw(404, `No se ha encontrado la persona:  ${filterText}`);
    }
  }

  async findByFilter(ctx) {
    const body = ctx.request.body;
    let valid = await repository.validate(body.person);
    valid = body.person && body.pagination && valid;

    if (valid) {
      const data = await repository.find(body.person);
      if (data && data.length > 0) {
        ctx.body = PaginationData(data, body.pagination);
      } else {
        ctx.throw(
          404,
          `No se ha encontrado la persona:  ${JSON.stringify(body.person)}`
        );
      }
    } else {
      ctx.throw(422, `Valor ${JSON.stringify(ctx.request.body)} no soportado`);
    }
  }
};
