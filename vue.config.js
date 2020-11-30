module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: `
            @import "@/assets/styles/helpers/_variables.scss";
            @import "@/assets/styles/helpers/_breakpoint.scss";
        `,
      },
    },
  },
};
