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
    ApprovalData,
    ApprovalDataFromJSON,
    ApprovalDataFromJSONTyped,
    ApprovalDataToJSON,
} from './ApprovalData';

/**
 * 
 * @export
 * @interface StartActiveRouteResponseDTO
 */
export interface StartActiveRouteResponseDTO {
    /**
     * 
     * @type {string}
     * @memberof StartActiveRouteResponseDTO
     */
    userTxType?: StartActiveRouteResponseDTOUserTxTypeEnum;
    /**
     * 
     * @type {string}
     * @memberof StartActiveRouteResponseDTO
     */
    txTarget?: string;
    /**
     * 
     * @type {string}
     * @memberof StartActiveRouteResponseDTO
     */
    chainId?: StartActiveRouteResponseDTOChainIdEnum;
    /**
     * 
     * @type {number}
     * @memberof StartActiveRouteResponseDTO
     */
    activeRouteId: number;
    /**
     * 
     * @type {string}
     * @memberof StartActiveRouteResponseDTO
     */
    txData?: string;
    /**
     * 
     * @type {string}
     * @memberof StartActiveRouteResponseDTO
     */
    txType?: StartActiveRouteResponseDTOTxTypeEnum;
    /**
     * 
     * @type {string}
     * @memberof StartActiveRouteResponseDTO
     */
    value?: string;
    /**
     * 
     * @type {number}
     * @memberof StartActiveRouteResponseDTO
     */
    userTxIndex?: number;
    /**
     * 
     * @type {number}
     * @memberof StartActiveRouteResponseDTO
     */
    totalUserTx: number;
    /**
     * 
     * @type {ApprovalData}
     * @memberof StartActiveRouteResponseDTO
     */
    approvalData?: ApprovalData;
}

/**
* @export
* @enum {string}
*/
export enum StartActiveRouteResponseDTOUserTxTypeEnum {
    Approve = 'approve',
    FundMovr = 'fund-movr',
    Claim = 'claim',
    DexSwap = 'dex-swap',
    Sign = 'sign'
}/**
* @export
* @enum {string}
*/
export enum StartActiveRouteResponseDTOChainIdEnum {
    Ethereum = 'ETHEREUM',
    Optimism = 'OPTIMISM',
    Bsc = 'BSC',
    Xdai = 'XDAI',
    Polygon = 'POLYGON',
    Fantom = 'FANTOM',
    Arbitrum = 'ARBITRUM',
    Avalanche = 'AVALANCHE'
}/**
* @export
* @enum {string}
*/
export enum StartActiveRouteResponseDTOTxTypeEnum {
    SendTransaction = 'eth_sendTransaction',
    SignMessage = 'eth_signMessage'
}

export function StartActiveRouteResponseDTOFromJSON(json: any): StartActiveRouteResponseDTO {
    return StartActiveRouteResponseDTOFromJSONTyped(json, false);
}

export function StartActiveRouteResponseDTOFromJSONTyped(json: any, ignoreDiscriminator: boolean): StartActiveRouteResponseDTO {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'userTxType': !exists(json, 'userTxType') ? undefined : json['userTxType'],
        'txTarget': !exists(json, 'txTarget') ? undefined : json['txTarget'],
        'chainId': !exists(json, 'chainId') ? undefined : json['chainId'],
        'activeRouteId': json['activeRouteId'],
        'txData': !exists(json, 'txData') ? undefined : json['txData'],
        'txType': !exists(json, 'txType') ? undefined : json['txType'],
        'value': !exists(json, 'value') ? undefined : json['value'],
        'userTxIndex': !exists(json, 'userTxIndex') ? undefined : json['userTxIndex'],
        'totalUserTx': json['totalUserTx'],
        'approvalData': !exists(json, 'approvalData') ? undefined : ApprovalDataFromJSON(json['approvalData']),
    };
}

export function StartActiveRouteResponseDTOToJSON(value?: StartActiveRouteResponseDTO | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'userTxType': value.userTxType,
        'txTarget': value.txTarget,
        'chainId': value.chainId,
        'activeRouteId': value.activeRouteId,
        'txData': value.txData,
        'txType': value.txType,
        'value': value.value,
        'userTxIndex': value.userTxIndex,
        'totalUserTx': value.totalUserTx,
        'approvalData': ApprovalDataToJSON(value.approvalData),
    };
}

