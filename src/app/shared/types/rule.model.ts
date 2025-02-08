import { CanReferenceCompanyLevel } from "./reference.model";

export interface Rule extends CanReferenceCompanyLevel {
    id: string;
    type: RuleType;
    name: string;
    required: boolean;
}

export interface SelectionRule extends Rule {
    type: 'SELECTION';
    min: number;
    max: number;
    options?: {
        groupName?: string;
        isExclusive?: boolean;
    };
}

export interface QuantityRule extends Rule {
    type: 'QUANTITY';
    min: number;
    max: number;
    incrementBy?: number;
    defaultQuantity?: number;
    options?: {
        perItem?: boolean;
        allowFractions?: boolean;
    }
}

export interface CombinationRule extends Rule {
    type: 'COMBINATION';
    conditions: {
        requires?: Array<string>;
        excludes?: Array<string>;
        minTotal?: number;
        maxTotal?: number;
    },
    options?: Array<{
        allowSubstitutions?: boolean;
        substitutionGroups?: Array<{
            groupId: string;
            itemIds: Array<string>
        }>
    }>
}

export type RuleType =
    | 'SELECTION'
    | 'QUANTITY'
    | 'COMBINATION';