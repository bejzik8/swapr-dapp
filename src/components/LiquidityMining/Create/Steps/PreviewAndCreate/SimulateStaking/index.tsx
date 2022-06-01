import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { SmoothGradientCard } from '../../../../styleds'
import styled from 'styled-components'
import Loader from '../../../../../Loader'
import Slider from '../../../../../Slider'

import useDebouncedChangeHandler from '../../../../../../utils/useDebouncedChangeHandler'
import { Pair, Price, Token, TokenAmount } from '@swapr/sdk'
import { useTokenOrPairNativeCurrency } from '../../../../../../hooks/useTokenOrPairNativeCurrency'
import { parseUnits } from 'ethers/lib/utils'
import { calculatePercentage } from '../../../../../../utils'
import { Flex } from 'rebass'
import { ReactComponent as CashIcon } from '../../../../../../assets/svg/cash-icon.svg'
import { ReactComponent as CryptoIcon } from '../../../../../../assets/svg/crypto-icon.svg'
import { ReactComponent as RefreshIcon } from '../../../../../../assets/svg/refresh-icon.svg'
import NumericalInput from '../../../../../Input/NumericalInput'
import { TYPE } from '../../../../../../theme'

const SwitchContainer = styled(Flex)`
  font-size: 10px;
  display: flex;
  font-weight: 600;
  color: ${props => props.theme.text5};
  line-height: 11px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
`
const SimulatedValue = styled.div`
  font-family: 'Fira Mono';
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  line-height: 22px;
  /* identical to box height */

  text-align: right;
  letter-spacing: 0.02em;
  text-transform: uppercase;

  color: ${props => props.theme.text2};
`
const AmountFlex = styled(Flex)`
  width: max-content;
  background: #000000;
  backdrop-filter: blur(20px);
  border-radius: 4px;
  padding: 8px 12px;
  align-self: center;
`

const SimulateOption = styled.div<{ isActive: boolean }>`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: ${props => (props.isActive ? props.theme.text2 : props.theme.lightPurple2)};
  ${props => props.isActive && 'text-decoration: underline; text-underline-offset: 7px;'};
`
const StyledNumericalInput = styled(NumericalInput)<{ value: string }>`
  color: ${props => props.theme.text2};
  width: ${({ value }) => (value && value.length > 24 ? '250' : value ? 17 + value?.length * 8 : 20)}px;
  max-height: 38px;
  font-weight: 600;
  font-size: 16px;
  line-height: 16px;
  text-transform: uppercase;
  ::placeholder {
    color: ${props => props.theme.text2};
  }
`

const DOLLAR_AMOUNT_MAX_SIMULATION = 10000000

interface RewardSummaryProps {
  tokenOrPair: Token | Pair | null
  stakingCap: TokenAmount | null
  nativeCurrencyUSDPrice: Price
  setSimulatedStakedAmount: (value: string) => void
  setSimulatedPrice: (value: any) => void
  simulatedPrice: any
  loading: boolean
}
enum SimulateOptions {
  AMOUNT = 'Amount',
  PRICE = 'Price',
}

export default function SimulateStaking({
  tokenOrPair,
  stakingCap,
  setSimulatedStakedAmount,
  setSimulatedPrice,
  simulatedPrice,
  nativeCurrencyUSDPrice,
  loading,
}: RewardSummaryProps) {
  const { loading: loadingNativeTokenPrice, derivedNativeCurrency: nativeTokenPrice } = useTokenOrPairNativeCurrency(
    tokenOrPair ? tokenOrPair : undefined
  )

  const handleLocalStakingCapChange = useCallback(
    rawValue => {
      setSimulatedPrice(rawValue)
    },
    [setSimulatedPrice]
  )
  useEffect(() => {
    if (nativeTokenPrice && nativeCurrencyUSDPrice)
      setSimulatedPrice(nativeTokenPrice.multiply(nativeCurrencyUSDPrice).toFixed(2))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingNativeTokenPrice, nativeTokenPrice])

  const [simulateOption, setSimulateOption] = useState<SimulateOptions>(SimulateOptions.AMOUNT)
  const [showUSDValue, setShowUSDValue] = useState(true)
  const [simulatedValuePercentage, setSimulatedValuePercentage] = useState(10)
  const liquidityPercentChangeCallback = useCallback((value: number) => {
    setSimulatedValuePercentage(value)
  }, [])
  const [innerLiquidityPercentage, setInnerLiquidityPercentage] = useDebouncedChangeHandler(
    simulatedValuePercentage,
    liquidityPercentChangeCallback,
    10
  )
  const maxStakedSimulatedAmount = useMemo(() => {
    const simulatedPriceAdjusted = simulatedPrice || '0'

    const base = stakingCap
      ? parseFloat(stakingCap.multiply(simulatedPriceAdjusted).toSignificant(22))
      : DOLLAR_AMOUNT_MAX_SIMULATION

    const baseInUsd = parseFloat(simulatedPriceAdjusted)

    const baseValue = showUSDValue ? base : base / baseInUsd

    const baseCurrency = tokenOrPair instanceof Token ? tokenOrPair : tokenOrPair?.liquidityToken

    if (baseCurrency && base !== 0 && baseInUsd !== 0) {
      setSimulatedStakedAmount(
        parseUnits(
          calculatePercentage(base / baseInUsd, simulatedValuePercentage).toString(),
          baseCurrency.decimals
        ).toString()
      )
    }

    return calculatePercentage(baseValue, simulatedValuePercentage)
  }, [setSimulatedStakedAmount, tokenOrPair, simulatedPrice, simulatedValuePercentage, stakingCap, showUSDValue])

  const handleUSDValueClick = useCallback(() => {
    setShowUSDValue(!showUSDValue)
  }, [showUSDValue])

  const handleResetClick = useCallback(() => {
    setSimulatedValuePercentage(10)
    setSimulatedPrice(
      nativeTokenPrice && nativeCurrencyUSDPrice ? nativeTokenPrice.multiply(nativeCurrencyUSDPrice).toFixed(2) : '0'
    )
  }, [nativeCurrencyUSDPrice, nativeTokenPrice, setSimulatedPrice])

  return (
    <SmoothGradientCard
      justifyContent={'space-between !important'}
      flexDirection={'column'}
      alignItems={'center'}
      padding={'18px 28px'}
      height={'162px'}
      width={'354px'}
    >
      <Flex width={'100%'} padding={'10px 12px'} justifyContent={'space-between'}>
        <SimulateOption
          onClick={() => setSimulateOption(SimulateOptions.AMOUNT)}
          isActive={simulateOption === SimulateOptions.AMOUNT}
        >
          SIMULATED STAKING
        </SimulateOption>
        <SimulateOption
          onClick={() => setSimulateOption(SimulateOptions.PRICE)}
          isActive={simulateOption === SimulateOptions.PRICE}
        >
          SIMULATED PRICE
        </SimulateOption>
      </Flex>
      {loading || loadingNativeTokenPrice ? (
        <Loader />
      ) : (
        <>
          {SimulateOptions.AMOUNT === simulateOption && (
            <>
              <SimulatedValue>
                {maxStakedSimulatedAmount.toLocaleString('en-us')}{' '}
                {showUSDValue
                  ? 'USD'
                  : tokenOrPair instanceof Token
                  ? tokenOrPair.symbol
                  : `${tokenOrPair?.token0.symbol}/${tokenOrPair?.token1.symbol}`}
              </SimulatedValue>
              <Slider value={innerLiquidityPercentage} size={16} onChange={setInnerLiquidityPercentage} />
            </>
          )}
          {SimulateOptions.PRICE === simulateOption && (
            <AmountFlex>
              <StyledNumericalInput placeholder="0" value={simulatedPrice} onUserInput={handleLocalStakingCapChange} />
              <TYPE.largeHeader alignSelf={'center'} fontSize={13} color={'dark4'} letterSpacing="0.08em">
                USD
              </TYPE.largeHeader>
            </AmountFlex>
          )}
        </>
      )}

      <Flex justifyContent={SimulateOptions.AMOUNT === simulateOption ? 'space-between' : 'center'} width={'100%'}>
        {SimulateOptions.AMOUNT === simulateOption && (
          <SwitchContainer onClick={handleUSDValueClick}>
            {showUSDValue ? <CashIcon /> : <CryptoIcon />} SHOW IN {showUSDValue ? 'CRYPTO' : 'USD'}
          </SwitchContainer>
        )}

        <SwitchContainer onClick={handleResetClick}>
          RESET <RefreshIcon />
        </SwitchContainer>
      </Flex>
    </SmoothGradientCard>
  )
}
