import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
import { defaultHomepage } from "discourse/lib/utilities";

export default class CustomHomepageContent extends Component {
    @service router;
    @service site;

    get isHomepage() {
        const { currentRouteName } = this.router;
        return currentRouteName === `discovery.${defaultHomepage()}`;
    }

    get isUserLoggedIn() {
        console.log('testing isUserLoggedIn--', this.site.currentUser);
        return this.site?.currentUser !== null;
    }

    get displayBlock() {
        const { blockType } = this.args;
        switch (blockType) {
            case 'block1':
                return 'Before topic list';
            case 'block2':
                return 'After topic list';
            case 'block3':
                return 'Content for Block 3';
            default:
                return 'Default Content';
        }
    }
}