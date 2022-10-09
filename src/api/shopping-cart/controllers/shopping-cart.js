'use strict';

const { asyncForEach } = require('../../../utils/default-utils');

/**
 * shopping-cart controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const shopping_session_name = 'shopping-session';

module.exports = createCoreController('api::shopping-cart.shopping-cart', ({ strapi }) => ({
  async create(ctx) {

    if (ctx.request.header[shopping_session_name]) {
      const commerce_cart_session = ctx.request.header[shopping_session_name];

      // Retrieve shopping session
      const shopping_session = await strapi.entityService.findMany(`api::${shopping_session_name}.${shopping_session_name}`, { filters: { session_token: commerce_cart_session } });


      const { data } = ctx.request.body;

      // building order items
      let order_items = [];

      // Creating order items
      await asyncForEach(data.order_items, async item => {
        if (item.product_id && item.variation >= 0 && item.ordered_quantity) {

          const product = await strapi.entityService.findOne('api::product.product', item.product_id,
            {
              populate: {
                variations: { populate: { variation_media: true, attributes: true } }
              },
            });

          delete product.variations[item.variation].id;

          product.variations[item.variation].attributes.map((item) => {
            delete item.id
          })

          const order_item = await strapi.entityService.create('api::order-item.order-item', {
            data: {
              product: item.product_id,
              ordered_quantity: item.ordered_quantity,
              variation: product.variations[item.variation],
            }
          })

          order_items.push(order_item.id)

        } else {
          throw new Error('Please provide { product_id, variation, ordered_quantity }');
        }
      })

      // Assigning to new ctx
      let new_ctx = ctx;

      // Adding shopping session & ordered items to cart
      new_ctx.request.body.data.shopping_session = shopping_session[0].id;
      new_ctx.request.body.data.order_items = order_items;

      // some logic here
      const response = await super.create(new_ctx);
      // some more logic

      return response;
    }

    throw new Error('Please provide shopping-session in header');
  },
  async findOne(ctx) {
    // some logic here
    const response = await super.findOne(ctx);
    // some more logic

    return response;
  },
  async find(ctx) {
    // updating context
    let new_ctx = ctx;

    const filters = `filters[${shopping_session_name}[session_token]][$eq]=${ctx.request.header[shopping_session_name]}&populate=order_items.variation.variation_media,order_items.variation.attributes`;

    new_ctx.request.url += new_ctx.request.url.includes('?') ? `&${filters}` : `?${filters}`;

    // some logic here
    const { data, meta } = await super.find(new_ctx);
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
