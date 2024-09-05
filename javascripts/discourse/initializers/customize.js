import { withPluginApi } from "discourse/lib/plugin-api";
import { defaultHomepage } from "discourse/lib/utilities";

export default {
    name: "custom-settings",
    initialize() {
        withPluginApi("0.8.18", (api) => {
            const updateMultilingualCategoryInSidebar = () => {
                // update multilingual category name in sidebar
                $('[data-section-name="categories"] li.sidebar-section-link-wrapper').each(function(e){
                    const match = $(this).find('a.sidebar-section-link').attr('href').match(/\/c\/([^\/]+)/);
                    const category = match ? match[1] : null;
                    let translatedCategoryName = I18n.t(themePrefix("category." + category + ".name"));
                    if (category &&
                        translatedCategoryName.indexOf('.theme_translations.') === -1 &&
                        $(this).find('a.sidebar-section-link .sidebar-section-link-content-text').length) {
                        $(this).find('a.sidebar-section-link .sidebar-section-link-content-text')[0].innerHTML = translatedCategoryName;
                    }
                });
            }

            // Function to start observing changes in the DOM
            const observeSidebar = () => {
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'childList') {
                            // Check if #d-sidebar is in the DOM
                            if (document.querySelector('#d-sidebar')) {
                                updateMultilingualCategoryInSidebar();
                            }
                        }
                    });
                });

                // Start observing the body for changes in the DOM
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            };

            api.onPageChange(() => {
                const currentRoute = api.container.lookup("router:main").currentRouteName;
                const isHomepage = currentRoute === `discovery.${defaultHomepage()}`;
                const applicationController = api.container.lookup("controller:application");
                const main = document.getElementById("main");
                const domain = window.location.origin;
                main.classList.add("discourse-theme--q");


                if (isHomepage) {
                    applicationController.set("showSidebar", false);
                    main.classList.add("isHomepage");
                    const loadLatestTopics = async () => {
                        const response = await fetch(`${domain}/latest.json`);
                        const data = await response.json();
                        const topics = data.topic_list.topics;
                        if (topics) {
                            const featureListWrapper = document.getElementsByClassName("featured-lists__wrapper")[0];
                            const featureListContainer = document.getElementsByClassName("featured-lists__list-container")[0];
                            featureListWrapper.classList.add("full-width");
                            featureListContainer.classList.add("contents");
                        }
                        updateLangs();
                    }
                    const updateLangs = () => {
                        const langUpdate = [
                            { wrap: ".featured-lists__list-header", selector: "h2", order: 0, content: I18n.t(themePrefix("features_list.latest.status")) },
                            { wrap: ".featured-lists__list-header", selector: "a", order: 0, content: I18n.t(themePrefix("features_list.latest.all")) },
                            { wrap: ".featured-lists__list-header", selector: "button", order: 0, content: I18n.t(themePrefix("features_list.latest.new")) },
                            { wrap: ".custom-search-banner-wrap", selector: "h1", order: 0, content: I18n.t(themePrefix("search_banner.headline")) },
                            { wrap: ".custom-search-banner-wrap", selector: "p", order: 0, content: I18n.t(themePrefix("search_banner.subhead")) },
                            { wrap: ".footer-links", selector: "a", order: 0, content: I18n.t(themePrefix("footer.privacy_policy")) },
                            { wrap: ".footer-links", selector: "a", order: 1, content: I18n.t(themePrefix("footer.terms_of_service")) },
                            { wrap: ".footer-links", selector: "a", order: 2, content: I18n.t(themePrefix("footer.about")) },
                            { wrap: "[data-easyfooter-section=\"third-party-forums\"]", selector: "span", order: 0, content: I18n.t(themePrefix("footer.third_party_forums")) },
                        ];

                        langUpdate.forEach(({ wrap, selector, order = 0, content }) => {
                            const wrapperElement = document.querySelector(wrap);
                            if (wrapperElement) {
                                const elements = wrapperElement.querySelectorAll(selector);
                                if (elements[order]) {
                                    elements[order].innerHTML = content;
                                }
                            }
                        });
                    }

                    loadLatestTopics();
                } else {
                    applicationController.set("showSidebar", true);
                    main.classList.remove("isHomepage");
                }

                // Wait for #d-sidebar to appear before running the function
                if (document.querySelector('#d-sidebar')) {
                    updateMultilingualCategoryInSidebar();
                } else {
                    observeSidebar();
                }

                const siteStatus = document.getElementById("siteStatus");
                if (domain === "https://community.qnap.com") {
                    siteStatus.innerText = "Beta";
                } else {
                    siteStatus.innerText = "Testing";
                }
            });
        });
    },
};
