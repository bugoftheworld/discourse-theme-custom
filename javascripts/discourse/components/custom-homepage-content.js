import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
import { defaultHomepage } from "discourse/lib/utilities";
import { withPluginApi } from "discourse/lib/plugin-api";
import { userLoggedInStatus } from "../utilis";

export default class CustomHomepageContent extends Component {
    @service router;

    get isHomepage() {
        const { currentRouteName } = this.router;
        return currentRouteName === `discovery.${defaultHomepage()}`;
    }

    get isUserLoggedIn() {
        return this.api?.getCurrentUser() !== null;
    }

    constructor() {
        super(...arguments);

        withPluginApi("0.8.18", (api) => {
            this.api = api;

            window.checkUserLoggedIn = false;

            api.onPageChange(() => {
                if(!window.checkUserLoggedIn){
                    userLoggedInStatus(api);
                    window.checkUserLoggedIn = true;
                    console.log("Page changed");
                }
            });
        });
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