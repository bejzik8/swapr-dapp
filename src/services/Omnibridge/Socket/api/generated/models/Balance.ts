/* tslint:disable */
/* eslint-disable */
/**
 * Movr Aggregator API
 * The Movr Aggregator API description
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import {
    BalanceResult,
    BalanceResultFromJSON,
    BalanceResultFromJSONTyped,
    BalanceResultToJSON,
} from './BalanceResult';

/**
 * 
 * @export
 * @interface Balance
 */
export interface Balance {
    /**
     * 
     * @type {boolean}
     * @memberof Balance
     */
    success: boolean;
    /**
     * 
     * @type {Array<BalanceResult>}
     * @memberof Balance
     */
    result: Array<BalanceResult>;
}

export function BalanceFromJSON(json: any): Balance {
    return BalanceFromJSONTyped(json, false);
}

export function BalanceFromJSONTyped(json: any, ignoreDiscriminator: boolean): Balance {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'success': json['success'],
        'result': ((json['result'] as Array<any>).map(BalanceResultFromJSON)),
    };
}

export function BalanceToJSON(value?: Balance | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'success': value.success,
        'result': ((value.result as Array<any>).map(BalanceResultToJSON)),
    };
}

