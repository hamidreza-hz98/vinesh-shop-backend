const Address = require("../../models/Address");
const throwError = require("../../middlewares/throw-error");
const { buildQuery } = require("../../lib/filter");

const addressService = {
  async exists(filter) {
    return await Address.findOne(filter);
  },

  async create(data) {
    const existing = await this.exists({ zipCode: data.zipCode });
    if (existing) {
      throwError("Address with this zip code already exists.");
    }

    const address = new Address(data);
    return await address.save();
  },

  async update(_id, data) {
    const existing = await this.exists({ _id });
    if (!existing) {
      throwError("Address not found", 404);
    }

    const address = await Address.findByIdAndUpdate(_id, data, { new: true });
    return address;
  },

  async getAll({ filter, search, sort, page = 1, page_size = 10 }) {
    const { criteria, sortOptions } = buildQuery({
      filter,
      search,
      searchFields: [
        "name",
        "recipientName",
        "recipientPhone",
        "address",
        "zipCode",
        "user.firstName",
        "user.lastName",
        "user.phone",
      ],
      sort,
      page,
      page_size,
    });

    const skip = (page - 1) * page_size;

    const [addresses, total] = await Promise.all([
      Address.find(criteria)
        .sort(sortOptions)
        .skip(skip)
        .limit(page_size)
        .lean(),
      Address.countDocuments(criteria),
    ]);

    return { addresses, total };
  },

  async getDetails(_id) {
    const address = await this.exists({ _id });
    if (!address) {
      throwError("Address not found", 404);
    }

    return address;
  },

  async getUserAddresses(user) {
    const addresses = await Address.find({ user });

    return addresses;
  },

  async getUserAddressDetails(_id, user) {
    const address = await Address.findOne({ _id, user });

    if (!address) {
      throwError("Address not found", 404);
    }

    return address;
  },

async makeDefault(_id, user) {
  await Address.updateMany({ user }, { $set: { isDefault: false } });

  const address = await Address.findOneAndUpdate(
    { _id, user },
    { $set: { isDefault: true } },
    { new: true }
  );

  return address;
},


  async delete(_id) {
    const existing = await Address.findOne({ _id });

    if (!existing) {
      throwError("Address not found", 404);
    }

    const address = await Address.findByIdAndDelete(_id);

    return address;
  },
};

module.exports = { addressService };
