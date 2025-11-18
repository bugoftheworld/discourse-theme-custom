import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { schedule } from '@ember/runloop';

export default class AiTranslationToggle extends Component {
    @tracked showTranslationBanner = false;
    @tracked translationEnabled = false;

    constructor() {
        super(...arguments);
        // Check for translation button on initialization
        schedule('afterRender', this, this.checkTranslationButton);

        // Set up a MutationObserver to watch for DOM changes
        this.observer = new MutationObserver(() => {
            this.checkTranslationButton();
        });

        // Start observing the document for changes
        schedule('afterRender', this, () => {
            this.observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class']
            });
        });
    }

    willDestroy() {
        super.willDestroy(...arguments);
        if (this.observer) {
            this.observer.disconnect();
        }
    }

    checkTranslationButton() {
        const toggleBtn = document.querySelector('.btn-toggle-localized-content');

        if (toggleBtn) {
            // Button exists, so translation is available
            this.showTranslationBanner = true;

            // Check if translation is currently enabled
            this.translationEnabled = toggleBtn.classList.contains('btn-active');
        } else {
            // No translation button found
            this.showTranslationBanner = false;
            this.translationEnabled = false;
        }
    }

    @action
    toggleTranslation() {
        const toggleBtn = document.querySelector('.btn-toggle-localized-content');

        if (toggleBtn) {
            // Simulate a click on the actual translation button
            toggleBtn.click();

            // Update the state after a short delay to allow the DOM to update
            setTimeout(() => {
                this.checkTranslationButton();
            }, 100);
        }
    }
}
