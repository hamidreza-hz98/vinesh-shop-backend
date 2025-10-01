const createOrderTrackNumber = () => `ORD-${Math.floor(Math.random() * 10000)}`;

const filterMedia = (media) => {
  if (!media) return null;
  if (Array.isArray(media)) {
    return media.map((m) => {
      const t = (m.translations || []).find((tr) => tr.lang === lang) || {};
      return { ...m, ...t, translations: undefined };
    });
  } else {
    const t = (media.translations || []).find((tr) => tr.lang === lang) || {};
    return { ...media, ...t, translations: undefined };
  }
};

const calculateProductFinalPrice = (price, discount) => {
  const finalPrice = {
    amount: 0,
    currency: price.currency,
  };

  if (!discount || !price) return finalPrice;

  if (discount.type === "percentage") {
    finalPrice.amount = price.amount - price.amount * (discount.amount / 100);
  } else if (discount.type === "amount") {
    finalPrice.amount = price.amount - discount.amount;
  }

  if (finalPrice.amount < 0) finalPrice.amount = 0;

  return finalPrice;
};


const calculateCartPrice = (products, coupon, lang) => {
  const translation = products.map((product) => ({
    quantity: product.quantity,
    ...product.translations.find((item) => item.lang === lang),
  }));

  let finalPrice = {
    amount: 0,
    currency: translation[0].finalPrice.currency,
  };

  translation.map((product) => {
    return (finalPrice.amount += product.finalPrice.amount * product.quantity);
  });

  if (coupon) {
    const couponType = percentage ? "percentage" : "amount";
    finalPrice = calculateProductFinalPrice(finalPrice.amount, {
      amount: coupon.amount,
      type: couponType,
    });
  }

  return finalPrice
};

module.exports = {
  createOrderTrackNumber,
  filterMedia,
  calculateCartPrice,
  calculateProductFinalPrice,
};
