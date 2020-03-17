module.exports = {
  lintOnSave: false,
    css: {
        loaderOptions: {
            sass: {
                prependData: `
                  @import "@/assets/scss/_vars.scss";
                  @import "@/assets/scss/_global.scss";
                `
            }
        }
    }
}
