const moment = require("moment");

const calculateCouponExpiryStatus = (expiryDate) => {
  const now = moment();
  const expiry = moment(expiryDate);

  if (now.isAfter(expiry, "day")) {
    return "expired";
  } else {
    return "active";
  }
};

module.exports = {
  calculateCouponExpiryStatus,
};
