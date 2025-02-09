import { CombinationRule, QuantityRule, Rule, SelectionRule } from "@shared/types/rule.model";

const testRules: Rule[] = [
    {
        company_id: 'vendor_001',
        id: 'rule1',
        type: 'SELECTION',
        name: 'Side Selection',
        required: true,
        min: 2,
        max: 2,
        message: 'Please select exactly 2 side items'
    } as SelectionRule,
    {
        company_id: 'vendor_001',
        id: 'rule2',
        type: 'SELECTION',
        name: 'Sauce Selection',
        required: false,
        min: 0,
        max: 1,
        options: {
            groupName: 'Sauces',
            isExclusive: true
        },
        message: 'Choose one sauce (optional)'
    } as SelectionRule,
    {
        company_id: 'vendor_001',
        id: 'rule3',
        type: 'QUANTITY',
        name: 'Portion Size',
        required: true,
        min: 0.5,
        max: 2,
        incrementBy: 0.5,
        defaultQuantity: 1,
        options: {
            allowFractions: true
        },
        message: 'Select portion size (in lbs)'
    } as QuantityRule,
    {
        company_id: 'vendor_001',
        id: 'rule4',
        type: 'QUANTITY',
        name: 'Toppings Amount',
        required: false,
        min: 0,
        max: 3,
        options: {
            perItem: true
        },
        message: 'Add up to 3 of each topping'
    } as QuantityRule,
    {
        company_id: 'vendor_001',
        id: 'rule5',
        type: 'COMBINATION',
        name: 'Meal Combination',
        required: true,
        conditions: {
            requires: ['PROTEIN', 'SIDE'],
            minTotal: 2,
            maxTotal: 4
        },
        options: [{
            allowSubstitutions: true,
            substitutionGroups: {
                groupId: 'PROTEIN',
                itemIds: ['CHICKEN', 'BEEF', 'FISH', 'TOFU']
            }

        }],
        message: 'Create a valid meal combination'
    } as CombinationRule,
    {
        company_id: 'vendor_001',
        id: 'rule6',
        type: 'COMBINATION',
        name: 'Dietary Restrictions',
        required: true,
        conditions: {
            excludes: ['DAIRY', 'GLUTEN'],
        },
        message: 'Gluten and dairy free options only'
    } as CombinationRule
]

export default testRules