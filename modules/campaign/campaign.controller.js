const { campaignService } = require("./campaign.service");

const campaignController = {
  async create(req, res) {
    const data = req.body;

    try {
      const campaign = await campaignService.create(data);

      res.success({
        message: `Campaign ${campaign.translations[0].name} created successfully.`,
        data: campaign,
      });
    } catch (error) {
      res.error({
        message: error.message || "Something went wrong",
        code: error.statusCode,
      });
    }
  },

  async update(req, res) {
    const _id = req.params.id;
    const data = req.body;

    try {
      const campaign = await campaignService.update(_id, data);

      res.success({
        message: `Campaign ${campaign.translations[0].name} updated successfully.`,
        data: campaign,
      });
    } catch (error) {
      res.error({
        message: error.message || "Something went wrong",
        code: error.statusCode,
      });
    }
  },

  async getAll(req, res) {
    const data = req.body;

    try {
      const { campaigns, total } = await campaignService.getAll(data);

      res.success({
        data: {
          campaigns,
          total,
          ...data,
        },
      });
    } catch (error) {
      res.error({
        message: error.message || "Something went wrong",
        code: error.statusCode,
      });
    }
  },

  async getDetails(req, res) {
    const filter = req.body;
    const lang = filter.lang || null;
    delete filter.lang;

    try {
      const campaign = await campaignService.getDetails(filter, lang);

      res.success({
        data: campaign,
      });
    } catch (error) {
      res.error({
        message: error.message || "Something went wrong",
        code: error.statusCode,
      });
    }
  },

  async delete(req, res) {
    const _id = req.params.id;

    try {
      const campaign = await campaignService.delete(_id);

      res.success({
        message: `Campaign ${campaign.translations[0].name} deleted successfully.`,
      });
    } catch (error) {
      res.error({
        message: error.message || "Something went wrong",
        code: error.statusCode,
      });
    }
  },
};

module.exports = { campaignController };
