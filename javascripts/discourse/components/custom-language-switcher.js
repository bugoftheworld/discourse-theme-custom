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

  // 使用原生 ComboBox 的 filter，不需要本地 filter 狀態

  // 將語言代碼正規化並回傳對應顯示名稱
  nameForLocale(code) {
    if (!code) return "";
    const normalized = String(code).replace(/-/g, "_"); // en-US -> en_US
    const base = normalized.split("_")[0]; // en_US -> en
    return (
      this.languageNames[normalized] ||
      this.languageNames[base] ||
      normalized
    );
  }

  get availableLocales() {
    const locales = this.siteSettings.content_localization_supported_locales;
    if (!locales) return [];

    return locales.split("|").map((code) => ({
      code,
      name: this.nameForLocale(code),
    }));
  }

  // 提供給 ComboBox 的項目（包含固定按鈕）
  get localeOptions() {
    const options = this.availableLocales.map((l) => ({ id: l.code, name: l.name }));
    const extras = this.fixedButtons.map((b) => ({ id: `link:${b.value}`, name: b.name, url: b.url }));
    return [...options, ...extras];
  }

  get currentLocale() {
    return I18n.currentLocale();
  }

  get currentLocaleId() {
    return I18n.currentLocale();
  }

  get currentLocaleName() {
    return this.nameForLocale(this.currentLocale);
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

  @action
  onSelect(item) {
    if (!item) return;
    const id = typeof item === "string" ? item : String(item.id);
    if (id.startsWith("link:")) {
      if (item.url) {
        window.location.href = item.url;
      } else {
        window.location.href = window.location.origin;
      }
      return;
    }
    this.changeLocale(id);
  }
}
