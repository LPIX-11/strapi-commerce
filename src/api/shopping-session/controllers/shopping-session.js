'use strict';

/**
 * shopping-session controller
 */
const controller_api_name = 'api::shopping-session.shopping-session';
const controller_cart_api_name = 'api::shopping-cart.shopping-cart';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController(controller_api_name, ({ strapi }) => ({
  async create(ctx) {
    const { data } = ctx.request.body;

    const findOnEntry = await strapi.entityService.findMany(controller_api_name, { filters: { session_token: data.session_token } });

    if (findOnEntry.length) {
      const findOnCart = await strapi.entityService.findMany(controller_cart_api_name, { filters: { shopping_session: findOnEntry[0].id } });

      if (findOnCart.length) {
        await strapi.entityService.delete(controller_cart_api_name, findOnCart[0].id);
      }

      return { response: findOnEntry[0] }
    }

    const response = await strapi.entityService.create(
      controller_api_name,
      {
        data: data,
      }
    );

    return { response }
  },
  async findOne(ctx) {
    // some logic here
    const response = await super.findOne(ctx);
    // some more logic

    return response;
  },
  async find(ctx) {
    // some logic here
    const { data, meta } = await super.find(ctx);
    // some more logic

    return { data, meta };
  },
  async update(ctx) {
    // some logic here
    const response = await super.update(ctx);
    // some more logic

    return response;
  },
  async delete(ctx) {
    // some logic here
    const response = await super.delete(ctx);
    // some more logic

    return response;
  }
}));
