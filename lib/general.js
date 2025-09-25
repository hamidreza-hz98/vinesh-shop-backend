const createOrderTrackNumber = () => `ORD-${Math.floor(Math.random() * 10000)}`;

module.exports = { createOrderTrackNumber };
