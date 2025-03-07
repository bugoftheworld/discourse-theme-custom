import { withPluginApi } from "discourse/lib/plugin-api";
import { userLoggedInStatus } from "../utility";
import { defaultHomepage } from "discourse/lib/utilities";

export default {
    name: "activeUserLoggedInStatus",
    initialize() {
        withPluginApi("0.8.18", (api) => {
            //get isHomepage from defaultHomepage
            const isHomepage = () => {
                const { currentRouteName } = api.router;
                return currentRouteName === `discovery.${defaultHomepage()}`;
            };
            console.log("testing activeUserLoggedInStatus--", isHomepage);
            api.onPageChange(() => {
                userLoggedInStatus(api, isHomepage);
                // console.log("testing Page changed");
            });
            api.onAppEvent("post-stream:posted", () => {
                userLoggedInStatus(api, isHomepage);
                // console.log("testing posted");
            });
        });
    },
};
