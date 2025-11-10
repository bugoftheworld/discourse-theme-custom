import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
import { action } from "@ember/object";

export default class CustomLanguageSwitcher extends Component {
  @service currentUser;
  @service siteSettings;

  // 自定義語言名稱
  languageNames = {
    'en': 'English',
    'zh_TW': '繁體中文',
    'ja': '日本語',
    'de': 'Deutsch',
    'id': 'Bahasa Indonesia',
  };

  // 固定按鈕列表
  fixedButtons = [
    { value: "ai_discussion", name: "AI Discussion", url: "/c/en/ai/84" }
  ];

  // 使用原生 ComboBox 的 filter，不需要本地 filter 狀態
  get languageOrder() {
    // 依照 languageNames 宣告順序做排序依據
    return Object.keys(this.languageNames || {});
  }

  get availableLocales() {
    const locales = this.siteSettings.content_localization_supported_locales;
    console.log('availableLocales', locales);
    if (!locales) return [];

    const order = this.languageOrder;
    const list = locales
      .split("|")
      .filter(Boolean)
      .map((code, idx) => ({
        code,
        name: this.languageNames[code] || code,
        _originalIndex: idx,
        _orderIndex: order.indexOf(code) === -1 ? Number.MAX_SAFE_INTEGER : order.indexOf(code),
      }))
      .sort((a, b) => a._orderIndex - b._orderIndex || a._originalIndex - b._originalIndex)
      .map(({ _originalIndex, _orderIndex, ...rest }) => rest);

    return list;
  }

  // 提供給 ComboBox 的項目（包含固定按鈕）
  get localeOptions() {
    const options = this.availableLocales.map((l) => ({ id: l.code, name: l.name }));
    const extras = this.fixedButtons.map((b) => ({ id: `link:${b.value}`, name: b.name, url: window.location.origin === 'https://community.qnap.com' ? b.url : '/c/storage/23' }));
    return [...options, ...extras];
  }

  get currentLocale() {
    return I18n.currentLocale();
  }

  get currentLocaleId() {
    return I18n.currentLocale();
  }

  get currentLocaleName() {
    return this.languageNames[this.currentLocale] || this.currentLocale;
  }

  // 轉址邏輯（統一處理）
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
  onSelect(item) {
    if (!item) return;
    const id = typeof item === "string" ? item : String(item.id);
    if (id.startsWith("link:")) {
      // onChange 可能只傳回 id 字串，因此需要在 options 中找 url
      const option = this.localeOptions.find((o) => String(o.id) === id);
      const url = option && option.url;
      if (url) {
        window.location.href = window.location.origin + url;
      }
      return;
    }
    this.changeLocale(id);
  }
}
