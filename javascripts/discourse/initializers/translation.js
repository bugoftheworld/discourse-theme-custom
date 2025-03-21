import {withPluginApi} from "discourse/lib/plugin-api";
import {defaultHomepage} from "discourse/lib/utilities";

export default {
    name: "translation",
    initialize() {
        withPluginApi("0.8.18", (api) => {
            const locale = I18n.currentLocale();
            I18n.translations[locale] = I18n.translations[locale] || {};
            I18n.translations[locale].js = I18n.translations[locale].js || {};
            I18n.translations[locale].js.login = I18n.translations[locale].js.login || {};
            I18n.translations[locale].js.login.oauth2_basic = I18n.translations[locale].js.login.oauth2_basic || {};
            I18n.translations[locale].js.login.oauth2_basic.name = 'QNAP ID';

            // covert ' to ’, https://meta.discourse.org/t/special-characters-encoding-issue-in-onboarding-tips/352169/2
            function replaceSingleQuotes(obj) {
                if (typeof obj === 'string') {
                    // 將字串拆分成 HTML 標籤與非標籤部分
                    return obj.split(/(<[^>]+>)/g).map(segment => {
                        // 如果 segment 是 HTML 標籤，則不做任何替換
                        if (segment.startsWith('<') && segment.endsWith('>')) {
                            return segment;
                        } else {
                            // 只取代非 HTML 部分的單引號
                            return segment.replace(/'/g, '’');
                        }
                    }).join('');
                } else if (typeof obj === 'object' && obj !== null) {
                    for (const key in obj) {
                        obj[key] = replaceSingleQuotes(obj[key]);
                    }
                }
                return obj;
            }

            // 只有在 user_tips 存在時才執行轉換
            if (I18n.translations[locale].js.user_tips) {
                I18n.translations[locale].js.user_tips = replaceSingleQuotes(I18n.translations[locale].js.user_tips);
            }
        });
    },
};
