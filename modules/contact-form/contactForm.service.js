const ContactForm = require("../../models/ContactForm");
const throwError = require("../../middlewares/throw-error");
const { buildQuery } = require("../../lib/filter");

const contactFormService = {
  async exists(filter) {
    return await ContactForm.findOne(filter);
  },

  async create(data) {
    const contactForm = new ContactForm(data);

    return await contactForm.save();
  },

  async update(_id, data) {
    const existing = await this.exists({ _id });
    if (!existing) {
      throwError("Contact form not found", 404);
    }

    const contactForm = await ContactForm.findByIdAndUpdate(_id, data, {
      new: true,
    });

    return contactForm;
  },

  async getAl({ filter, search, sort, page = 1, page_size = 10 }) {
    const { criteria, sortOptions } = buildQuery({
      filter,
      search,
      searchFields: ["name", "phone", "email", "status"],
      sort,
      page,
      page_size,
    });

    const skip = (page - 1) * page_size;

    let [contactForms, total] = await Promise.all([
      ContactForm.find(criteria)
        .sort(sortOptions)
        .skip(skip)
        .limit(page_size)
        .lean(),
      ContactForm.countDocuments(criteria),
    ]);

    return { contactForms, total };
  },

  async delete(_id) {
    const existing = await this.exists({ _id });
    if (!existing) {
      throwError("Contact form not found", 404);
    }

    const contactForm = await ContactForm.findByIdAndDelete(_id);

    return contactForm;
  },
};

module.exports = { contactFormService };
