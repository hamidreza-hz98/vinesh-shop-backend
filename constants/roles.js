module.exports = {
  roles: {
    superadmin: {
      can: ["*"],
    },
    admin: {
      can: [
        "create:product",
        "update:product",
        "delete:product",
        "create:blog",
        "update:blog",
        "delete:blog",
        "view:dashboard",
      ],
    },
    viewer: {
      can: [
        "read:product",
        "read:blog",
        "read:dashboard",
      ],
    },
  },
};
