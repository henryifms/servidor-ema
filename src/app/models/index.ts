Object.values(models).forEach((model: any) => {
  if (model.associate) {
    model.associate(models);
  }
});
