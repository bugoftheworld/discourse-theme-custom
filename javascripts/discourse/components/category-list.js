import Component from '@ember/component';
import { ajax } from 'discourse/lib/ajax';

export default Component.extend({
    didInsertElement() {
        this._super(...arguments);

        const apiUrl = '/categories.json';

        ajax(apiUrl, {
            method: 'GET'
        }).then((data) => {
            const categories = data.category_list.categories;
            const visibleCategories = categories.filter(category => !category.read_restricted);

            // Find the AI subcategory specifically
            const aiSubcategory = categories.find(category =>
                category.slug === 'ai' && category.parent_category_id
            );

            // Process main categories
            visibleCategories.forEach(category => {
                category.description = category.description;
                category.name = category.name;
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

            // Add AI subcategory if it exists and is visible
            if (aiSubcategory && !aiSubcategory.read_restricted) {
                // Find parent category for proper URL construction
                const parentCategory = categories.find(cat => cat.id === aiSubcategory.parent_category_id);
                if (parentCategory) {
                    aiSubcategory.parentCategory = parentCategory;
                }

                // Process AI subcategory translations
                let translatedAiName = I18n.t(themePrefix("category.ai.name"));
                let translatedAiDesc = I18n.t(themePrefix("category.ai.description"));

                if (translatedAiDesc.indexOf('.theme_translations.') === -1) {
                    aiSubcategory.description = translatedAiDesc;
                }
                if (translatedAiName.indexOf('.theme_translations.') === -1) {
                    aiSubcategory.name = translatedAiName;
                }

                // Add to visible categories
                visibleCategories.push(aiSubcategory);
            }

            this.set('categories', visibleCategories);
        }).catch((error) => {
            console.error('Error fetching categories:', error);
        });
    }
});
