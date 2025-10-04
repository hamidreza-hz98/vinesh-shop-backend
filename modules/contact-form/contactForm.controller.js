const { contactFormService } = require("./contactForm.service");

const contactFormController = {
  async create(req, res) {
    const data = req.body;

    try {
      const contactForm = await contactFormService.create(data);

      res.success({
        message: "Contact form submitted successfully!",
        data: contactForm,
      });
    } catch (error) {
      res.error({
        message: error.message || "Something went wrong.",
        code: error.statusCode,
      });
    }
  },

  async update(req, res) {
    const _id = req.params.id;
    const data = req.body;

    try {
      const contactForm = await contactFormService.update(_id, data);

      res.success({
        message: "Contact form updated successfully.",
        data: contactForm,
      });
    } catch (error) {
      res.error({
        message: error.message || "Something went wrong.",
        code: error.statusCode,
      });
    }
  },

  async getAll(req, res) {
    const queries = req.body;

    try {
      const { contactForms, total } = await contactFormService.getAl(queries);

      res.success({
        data: {
          contactForms,
          total,
          ...queries,
        },
      });
    } catch (error) {
      res.error({
        message: error.message || "Something went wrong.",
        code: error.statusCode,
      });
    }
  },

  async delete(req, res) {
    const _id = req.params.id;

    try {
      const contactForm = await contactFormService.delete(_id);

      res.success({
        message: "Contact Form deleted successfully.",
        data: contactForm,
      });
    } catch (error) {
      res.error({
        message: error.message || "Something went wrong.",
        code: error.statusCode,
      });
    }
  },
};

module.exports = { contactFormController };
