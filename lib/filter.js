const mongoose = require("mongoose");

/**
 * Parse sort string into mongoose sort object
 * @param {string} sort e.g. "createdAt:-1,name:1"
 */
const setSorting = (sort) => {
  if (!sort) return { createdAt: -1 }; // default sort
  const sortOptions = {};

  sort.split(",").forEach((field) => {
    const [key, value] = field.split(":");
    sortOptions[key.trim()] = parseInt(value, 10) || 1;
  });

  return sortOptions;
};

/**
 * Parse filter into mongoose query
 * @param {string|object} filters
 */
const setFilterCriteria = (filters) => {
  if (!filters) return {};
  const f = typeof filters === "string" ? JSON.parse(filters) : { ...filters };

  // normalize any $regex
  for (const key in f) {
    if (f[key] && typeof f[key] === "object" && f[key].$regex) {
      f[key].$regex = String(f[key].$regex);
    }
  }

  return f;
};


/**
 * Build search query across multiple fields
 * @param {string} search
 * @param {string[]} fields
 */
const setSearchCriteria = (search, fields = []) => {
  if (!search || !fields.length) return {};

  return {
    $or: fields.map((f) => ({
      [f]: { $regex: String(search), $options: "i" },
    })),
  };
};

/**
 * Generic query builder for mongoose
 * Converts page/pageSize to numbers and sets skip/limit
 * @param {Object} params
 * @param {object} params.filter
 * @param {string} params.search
 * @param {string[]} params.searchFields
 * @param {string} params.sort
 * @param {number|string} params.page
 * @param {number|string} params.pageSize
 */
const buildQuery = ({
  filter,
  search,
  searchFields = [],
  sort,
  page = 1,
  pageSize = 10,
}) => {
  const filterCriteria = setFilterCriteria(filter);
  const searchCriteria = setSearchCriteria(search, searchFields);
  const sortOptions = setSorting(sort);

  const criteria = { ...filterCriteria };

  if (searchCriteria.$or) {
    criteria.$or = [...(criteria.$or || []), ...searchCriteria.$or];
  }

  const pageNum = parseInt(page, 10) || 1;
  const limit = parseInt(pageSize, 10) || 10;
  const skip = (pageNum - 1) * limit;

  return {
    criteria,
    sortOptions,
    skip,
    limit,
  };
};

module.exports = {
  setSorting,
  setFilterCriteria,
  setSearchCriteria,
  buildQuery,
};
