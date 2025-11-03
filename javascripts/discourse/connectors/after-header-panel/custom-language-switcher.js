export default {
  shouldRender(args, component) {
    const siteSettings = component.siteSettings;
    // 只有當支援多語言時才顯示
    return siteSettings.content_localization_supported_locales &&
           siteSettings.content_localization_supported_locales.length > 0;
  }
};
