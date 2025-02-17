import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
import { defaultHomepage } from "discourse/lib/utilities";
import { withPluginApi } from "discourse/lib/plugin-api";

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

            const userLoggedInStatus = () => {
                fetch('https://account.qnap.com/oauth/login_status', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        app_id: '668ce78379a25e1282cf47e2'
                    }),
                    credentials: 'include'
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === "connected") {
                            // User is logged in
                        } else {
                            const CURRENTUSER = api.getCurrentUser();
                            if (CURRENTUSER){
                                CURRENTUSER.destroySession();
                            }
                        }
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
            };

            api.onPageChange(() => {
                if(!window.checkUserLoggedIn){
                    userLoggedInStatus();
                    window.checkUserLoggedIn = true;
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