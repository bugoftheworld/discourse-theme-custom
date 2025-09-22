import Component from '@ember/component';
import { ajax } from 'discourse/lib/ajax';

export default Component.extend({
    didInsertElement() {
        this._super(...arguments);
        let lang = I18n.currentLocale().toLowerCase();
        const qnapLangMapping = (lang) => {
            let tmpLang ='';
            let langMapping = {
                "da": "da-dk",
                "de": "de-de",
                "en": "en",
                "es": "es-es",
                "fr": "fr-fr",
                "hu": "hu-hu",
                "it": "it-it",
                "ja": "ja-jp",
                "ko": "ko-kr",
                "nl": "nl-nl",
                "pl_PL": "pl-pl",
                "pt": "pt-pt",
                "pt-br": "pt-br",
                "sv": "sv-se",
                "th": "th-th",
                "tr": "tr-tr",
                "vi": "vi-vn",
                "zh-cn": "zh-cn",
                "zh-tw": "zh-tw"
            };

            if (langMapping[lang] === undefined) {
                tmpLang = 'en';
            } else{
                tmpLang = langMapping[lang];
            }

            return tmpLang;
        }
        if (lang.indexOf('_') !== -1) {
            lang = lang.replace('_', '-');
        }

        lang = qnapLangMapping(lang);
        let apiUrl = 'https://www.qnap.com/api/v1/articles/community?locale=' + lang;

        ajax(apiUrl, {
            method: 'GET'
        }).then(({ data = [] } = {}) => {
        const total = 6;
        const news = data.slice().sort((a,b)=> new Date(b.date) - new Date(a.date));

        const groups = news.reduce((acc, it) => {
          const t = it.type || 'unknown';
          (acc[t] || (acc[t]=[])).push(it);
          return acc;
        }, {});

        const types = Object.keys(groups);
        let balanced = [];

        if (types.length) {
          const per = Math.floor(total / types.length);
          let rem = total - per * types.length;
          for (const t of types) {
            const take = per + (rem > 0 ? 1 : 0);
            if (rem > 0) rem--;
            balanced.push(...groups[t].slice(0, take));
          }

          if (balanced.length < total) {
            const taken = new Set(balanced.map(i => i.id));
            balanced.push(...news.filter(i => !taken.has(i.id)).slice(0, total - balanced.length));
          }
          balanced = balanced.slice(0, total);
        }

        balanced.sort((a,b)=> new Date(b.date) - new Date(a.date));
        balanced.forEach(n => { if (n.desc) n.desc = this.decodeEntitiesAndStrip(n.desc); });
        this.set('news', balanced);
      })
      .catch(err => console.error('Error fetching:', err));
    },
    decodeEntitiesAndStrip(str) {
        if (!str) return "";
        const div = document.createElement('div');
        div.innerHTML = str;
        return div.textContent || div.innerText || "";
    }
});
