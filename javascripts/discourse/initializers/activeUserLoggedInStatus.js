import { withPluginApi } from "discourse/lib/plugin-api";
import { userLoggedInStatus } from "../utility";
import { defaultHomepage } from "discourse/lib/utilities";

export default {
    name: "activeUserLoggedInStatus",
    initialize() {
        withPluginApi("0.8.18", (api) => {
            //get isHomepage from defaultHomepage
            console.log("testing activeUserLoggedInStatus", defaultHomepage);
            api.onPageChange(() => {
                userLoggedInStatus(api, defaultHomepage);
                // console.log("testing Page changed");
            });
            api.onAppEvent("post-stream:posted", () => {
                userLoggedInStatus(api, defaultHomepage);
                // console.log("testing posted");
            });
        });
    },
};
