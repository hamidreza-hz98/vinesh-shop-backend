// lib/query.js
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
  return typeof filters === "string" ? JSON.parse(filters) : filters;
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
      [f]: { $regex: search, $options: "i" },
    })),
  };
};

/**
 * Generic query builder for mongoose
 */
const buildQuery = ({ filter, search, searchFields, sort, page, pageSize }) => {
  const filterCriteria = setFilterCriteria(filter);
  const searchCriteria = setSearchCriteria(search, searchFields);
  const sortOptions = setSorting(sort);

  const criteria = { ...filterCriteria, ...searchCriteria };

  return { criteria, sortOptions, page, pageSize };
};

module.exports = {
  setSorting,
  setFilterCriteria,
  setSearchCriteria,
  buildQuery,
};
