import Component from '@ember/component';
import { ajax } from 'discourse/lib/ajax';

export default Component.extend({
    didInsertElement() {
        this._super(...arguments);

        const apiUrl = '/categories.json?include_subcategories=true';

        ajax(apiUrl, {
            method: 'GET'
        }).then((data) => {
            const categories = data.category_list.categories;
            const visibleCategories = categories.filter(category => !category.read_restricted);

            let aiSubCategory = null;
            categories.forEach(category => {
                if (category.subcategory_list) {
                    const aiSub = category.subcategory_list.find(sub => sub.name === "AI");
                    if (aiSub && !aiSub.read_restricted) {
                        aiSubCategory = aiSub;
                        aiSubCategory.parent_category = {
                            slug: category.slug,
                            id: category.id
                        };
                    }
                }
            });

            visibleCategories.forEach(category => {
                category.description = category.description;
                category.name = category.name;
                category.categoryUrl = `/c/${category.slug}/${category.id}`;

                if(category.slug) {
                    let translatedCategoryName = I18n.t(themePrefix("category." + category.slug + ".name"));
                    let translatedCategoryDesc = I18n.t(themePrefix("category." + category.slug + ".description"));
                    if (translatedCategoryDesc.indexOf('.theme_translations.') === -1) {
                        category.description = translatedCategoryDesc;
                    }
                    if (translatedCategoryName.indexOf('.theme_translations.') === -1) {
                        category.name = translatedCategoryName;
                    }
                }
            });

            if (aiSubCategory) {
                if(aiSubCategory.slug) {
                    let translatedCategoryName = I18n.t(themePrefix("category." + aiSubCategory.slug + ".name"));
                    let translatedCategoryDesc = I18n.t(themePrefix("category." + aiSubCategory.slug + ".description"));
                    if (translatedCategoryDesc.indexOf('.theme_translations.') === -1) {
                        aiSubCategory.description = translatedCategoryDesc;
                    }
                    if (translatedCategoryName.indexOf('.theme_translations.') === -1) {
                        aiSubCategory.name = translatedCategoryName;
                    }
                }
                aiSubCategory.categoryUrl = `/c/${aiSubCategory.parent_category.slug}/${aiSubCategory.slug}/${aiSubCategory.id}`;
                visibleCategories.push(aiSubCategory);
            }

            this.set('categories', visibleCategories);
        }).catch((error) => {
            console.error('Error fetching categories:', error);
        });
    }
});
