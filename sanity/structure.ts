import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
    S.list()
        .title('Content')
        .items([
            // Blog Posts Section
            S.listItem()
                .title('📝 Blog Posts')
                .child(
                    S.list()
                        .title('Blog Posts by Status')
                        .items([
                            S.listItem()
                                .title('📝 Drafts')
                                .child(
                                    S.documentList()
                                        .title('Draft Posts')
                                        .filter('_type == "blogPost" && status == "draft"')
                                        .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                                ),
                            S.listItem()
                                .title('⏳ Pending Review')
                                .child(
                                    S.documentList()
                                        .title('Pending Posts')
                                        .filter('_type == "blogPost" && status == "pending"')
                                        .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                                ),
                            S.listItem()
                                .title('✅ Published')
                                .child(
                                    S.documentList()
                                        .title('Published Posts')
                                        .filter('_type == "blogPost" && status == "published"')
                                        .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                                ),
                            S.listItem()
                                .title('📦 Archived')
                                .child(
                                    S.documentList()
                                        .title('Archived Posts')
                                        .filter('_type == "blogPost" && status == "archived"')
                                        .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                                ),
                            S.divider(),
                            S.listItem()
                                .title('All Blog Posts')
                                .child(
                                    S.documentTypeList('blogPost')
                                        .title('All Blog Posts')
                                        .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                                ),
                        ])
                ),

            S.divider(),

            // Top 5 Lists Section
            S.listItem()
                .title('🏆 Top 5 Lists')
                .child(
                    S.list()
                        .title('Top 5 List Items')
                        .items([
                            S.listItem()
                                .title('⏳ Pending Review')
                                .child(
                                    S.documentList()
                                        .title('Pending Items')
                                        .filter('_type == "listItem" && status == "pending"')
                                        .defaultOrdering([{ field: '_createdAt', direction: 'desc' }])
                                ),
                            S.listItem()
                                .title('🔄 Needs Verification')
                                .child(
                                    S.documentList()
                                        .title('Needs Verification')
                                        .filter('_type == "listItem" && status == "needs_verification"')
                                        .defaultOrdering([{ field: 'verificationDate', direction: 'asc' }])
                                ),
                            S.divider(),
                            S.listItem()
                                .title('By Category')
                                .child(
                                    S.list()
                                        .title('Categories')
                                        .items([
                                            S.listItem()
                                                .title('💎 Hidden Gems')
                                                .child(
                                                    S.documentList()
                                                        .title('Hidden Gems')
                                                        .filter('_type == "listItem" && category == "Hidden Gems"')
                                                        .defaultOrdering([{ field: 'town', direction: 'asc' }, { field: 'rank', direction: 'asc' }])
                                                ),
                                            S.listItem()
                                                .title('🧭 Activities')
                                                .child(
                                                    S.documentList()
                                                        .title('Activities')
                                                        .filter('_type == "listItem" && category == "Activities"')
                                                        .defaultOrdering([{ field: 'town', direction: 'asc' }, { field: 'rank', direction: 'asc' }])
                                                ),
                                            S.listItem()
                                                .title('🍽️ Food & Drinks')
                                                .child(
                                                    S.documentList()
                                                        .title('Food & Drinks')
                                                        .filter('_type == "listItem" && category == "Food & Drinks"')
                                                        .defaultOrdering([{ field: 'town', direction: 'asc' }, { field: 'rank', direction: 'asc' }])
                                                ),
                                            S.listItem()
                                                .title('🥪 Street Food')
                                                .child(
                                                    S.documentList()
                                                        .title('Street Food')
                                                        .filter('_type == "listItem" && category == "Street Food"')
                                                        .defaultOrdering([{ field: 'town', direction: 'asc' }, { field: 'rank', direction: 'asc' }])
                                                ),
                                            S.listItem()
                                                .title('🏛️ Cultural Heritage')
                                                .child(
                                                    S.documentList()
                                                        .title('Cultural Heritage')
                                                        .filter('_type == "listItem" && category == "Cultural Heritage"')
                                                        .defaultOrdering([{ field: 'town', direction: 'asc' }, { field: 'rank', direction: 'asc' }])
                                                ),
                                        ])
                                ),
                            S.divider(),
                            S.listItem()
                                .title('All List Items')
                                .child(
                                    S.documentTypeList('listItem')
                                        .title('All List Items')
                                        .defaultOrdering([{ field: 'town', direction: 'asc' }, { field: 'rank', direction: 'asc' }])
                                ),
                        ])
                ),

            S.divider(),

            // Ambassadors Section
            S.listItem()
                .title('👥 Ambassadors')
                .child(
                    S.documentTypeList('ambassador')
                        .title('Ambassadors')
                        .defaultOrdering([{ field: 'name', direction: 'asc' }])
                ),

            S.divider(),

            // Towns Section
            S.listItem()
                .title('City Management')
                .child(
                    S.documentTypeList('town')
                        .title('Towns')
                        .defaultOrdering([{ field: 'order', direction: 'asc' }])
                ),
        ])
