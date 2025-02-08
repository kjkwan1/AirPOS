import { MenuRelation } from "@core/services/configuration.model";

export const testMenu: MenuRelation = {
    menuId: 'TEST',
    company_id: 'TEST_COMPANY',
    categoryRelations: [
        {
            categoryId: 'cat1',
            categoryName: 'Snacks',
            itemRelations: [
                {
                    itemId: 'item6',
                    childItemIds: ['child1', 'child2', 'child3', 'child10', 'child11', 'child12'],
                    modifierIds: ['mod3', 'mod4', 'mod8', 'mod22']
                },
                {
                    itemId: 'item40',
                    modifierIds: ['mod1', 'mod3', 'mod4', 'mod26']
                },
                {
                    itemId: 'item41',
                    childItemIds: ['child1', 'child2', 'child3', 'child10', 'child11', 'child12'],
                    modifierIds: ['mod8']
                }
            ]
        },
        {
            categoryId: 'cat2',
            categoryName: 'Food',
            itemRelations: [
                {
                    itemId: 'item1',
                    childItemIds: ['child1', 'child2', 'child3'],
                    modifierIds: ['mod1', 'mod2', 'mod3', 'mod4', 'mod20', 'mod27']
                },
                {
                    itemId: 'item2',
                    childItemIds: ['child1', 'child2', 'child3', 'child10', 'child12'],
                    modifierIds: ['mod1', 'mod2', 'mod3', 'mod4', 'mod20', 'mod22', 'mod27', 'mod28']
                },
                {
                    itemId: 'item3',
                    childItemIds: ['child1', 'child2', 'child3', 'child11'],
                    modifierIds: ['mod21', 'mod22', 'mod23', 'mod24', 'mod25', 'mod28']
                },
                {
                    itemId: 'item20',
                    childItemIds: ['child10', 'child12'],
                    modifierIds: ['mod21', 'mod22', 'mod26', 'mod27', 'mod28']
                },
                {
                    itemId: 'item21',
                    childItemIds: ['child1', 'child2', 'child10'],
                    modifierIds: ['mod20', 'mod21', 'mod22', 'mod25', 'mod28']
                },
                {
                    itemId: 'item22',
                    childItemIds: ['child1', 'child2', 'child11'],
                    modifierIds: ['mod21', 'mod22', 'mod23', 'mod25', 'mod28']
                }
            ]
        },
        {
            categoryId: 'cat3',
            categoryName: 'Beverages',
            itemRelations: [
                {
                    itemId: 'item4',
                    modifierIds: ['mod5', 'mod26']
                },
                {
                    itemId: 'item5',
                    modifierIds: ['mod5', 'mod6', 'mod7', 'mod29', 'mod30']
                },
                {
                    itemId: 'item30',
                    modifierIds: ['mod5', 'mod29']
                },
                {
                    itemId: 'item31',
                    modifierIds: ['mod5', 'mod26', 'mod29']
                },
                {
                    itemId: 'item32',
                    modifierIds: ['mod5']
                }
            ]
        },
        {
            categoryId: 'cat4',
            categoryName: 'Desserts',
            itemRelations: [
                {
                    itemId: 'item7',
                    modifierIds: ['mod9', 'mod30']
                },
                {
                    itemId: 'item50',
                    modifierIds: ['mod30']
                },
                {
                    itemId: 'item51',
                    modifierIds: ['mod9', 'mod30']
                }
            ]
        }
    ]
};

export default testMenu;