import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
import { action } from "@ember/object";

export default class CustomLanguageSwitcher extends Component {
  @service currentUser;
  @service siteSettings;

  // 🎨 自定義語言名稱
  languageNames = {
    'zh_TW': '繁體中文',
    'en': 'English',
    'ja': '日本語',
    'de': 'Deutsch',
    'id': 'Bahasa Indonesia',
  };

  // 🔘 固定按鈕列表
  fixedButtons = [
    { value: "ai_discussion", name: "AI Discussion", url: "/c/en/ai/84" }
  ];

  get availableLocales() {
    const locales = this.siteSettings.content_localization_supported_locales;
    if (!locales) return [];

    return locales.split("|").map(code => ({
      code: code,
      name: this.languageNames[code] || code
    }));
  }

  get currentLocale() {
    return I18n.currentLocale();
  }

  get currentLocaleName() {
    return this.languageNames[this.currentLocale] || this.currentLocale;
  }

  // 🔄 轉址邏輯（統一處理）
  redirectToLocale(localeCode) {
    const domain = window.location.origin;

    if (domain === "https://community.qnap.com") {
      window.location.href = domain + '/c/' + localeCode.replace('_', '').toLowerCase();
    } else {
      window.location.href = domain;
    }
  }

  @action
  changeLocale(localeCode) {
    if (this.currentUser) {
      // 登入用戶：更新用戶設定
      this.currentUser.set('locale', localeCode);
      this.currentUser.save(['locale']).then(() => {
        this.redirectToLocale(localeCode);
      });
    } else {
      // 訪客：設定 cookie 並轉址
      document.cookie = `locale=${localeCode};path=/;max-age=31536000`;
      this.redirectToLocale(localeCode);
    }
  }

  @action
  navigateToUrl(url) {
    window.location.href = url;
  }
}
