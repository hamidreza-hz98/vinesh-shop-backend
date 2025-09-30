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

module.exports = { createOrderTrackNumber, filterMedia };
