const Campaign = require("../../models/Campaign");
const { productService } = require("../product/product.service");
const throwError = require("../../middlewares/throw-error");
const { buildQuery } = require("../../lib/filter");
const { filterMedia } = require("../../lib/general");

const campaignService = {
  async exists(filter) {
    return await Campaign.findOne(filter);
  },

  async create(data) {
    const campaign = new Campaign(data);
    await campaign.save();

    if (campaign.products && campaign.products.length) {
      await productService.updateProductsInCampaign(
        campaign.products,
        true,
        campaign.translations
      );
    }

    return campaign;
  },

  async update(_id, data) {
    const existing = await this.exists({ _id });
    if (!existing) {
      throwError("Campaign not found", 404);
    }

    const oldProducts = existing.products.map((p) => p.toString());
    const newProducts = data.products
      ? data.products.map((p) => p.toString())
      : oldProducts;

    Object.assign(existing, data);
    await existing.save();

    const removedProducts = oldProducts.filter((p) => !newProducts.includes(p));
    if (removedProducts.length) {
      await productService.updateProductsInCampaign(
        removedProducts,
        false,
        existing.translations
      );
    }

    if (newProducts.length) {
      await productService.updateProductsInCampaign(
        newProducts,
        true,
        existing.translations
      );
    }

    return existing;
  },

  async getAll({
    filter,
    search,
    sort,
    page = 1,
    page_size = 10,
    lang = null,
  }) {
    const { criteria, sortOptions } = buildQuery({
      filter,
      search,
      searchFields: [
        "translations.name",
        "translations.slug",
        "translations.excerpt",
        "translations.description",
      ],
      sort,
      page,
      page_size,
    });

    const skip = (page - 1) * page_size;

    let [campaigns, total] = await Promise.all([
      Campaign.find(criteria)
        .sort(sortOptions)
        .skip(skip)
        .limit(page_size)
        .lean(),
      Campaign.countDocuments(criteria),
    ]);

    if (lang) {
      campaigns = campaigns.map((c) => {
        const translation = c.translations.find((t) => t.lang === lang) || {};
        return {
          ...c,
          ...translation,
          translations: undefined,
          _id: c._id,
        };
      });
    }

    return { campaigns, total };
  },

  async getDetails(filter, lang = null) {
    if (!filter || Object.keys(filter).length === 0) {
      throwError("Campaign does not exist.", 404);
    }

    let campaign = await Campaign.findOneAndUpdate(
      filter,
      { $inc: { visits: 1 } },
      { new: true }
    )
      .populate({
        path: "products",
        select: "translations media colors sizes rate quantity",
      })
      .populate({
        path: "banner",
        select:
          "filename originalName extension mimeType size path type translations",
      })
      .lean();

    if (!campaign) {
      throwError("Campaign does not exist.", 404);
    }

    if (lang) {
      const translation =
        (campaign.translations || []).find((t) => t.lang === lang) || {};
      campaign = { ...campaign, ...translation, translations: undefined };
    }

    if (lang) {
      if (campaign.products) {
        campaign.products = campaign.products.map((item) => {
          const t =
            (item.translations || []).find((tr) => tr.lang === lang) || {};
          return { ...t, ...item, translations: undefined, _id: item._id };
        });
      }
    }

    campaign.banner = filterMedia(campaign.banner);

    return campaign;
  },

  async delete(_id) {
    const campaign = await this.exists({ _id });
    if (!campaign) {
      throwError("Campaign not found", 404);
    }

    if (campaign.products && campaign.products.length) {
      await productService.updateProductsInCampaign(
        campaign.products,
        false,
        campaign.translations
      );
    }

    const updatedCampaign = await Campaign.findByIdAndDelete(_id);
    return updatedCampaign;
  },
};

module.exports = { campaignService };
