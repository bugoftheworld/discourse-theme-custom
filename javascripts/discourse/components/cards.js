import Component from "@ember/component";
import i18n from 'discourse-common/helpers/i18n';

export default Component.extend({
    didInsertElement() {
        const cardsData = i18n(themePrefix + 'cards');

        this.set("cards", cardsData);
    }
});