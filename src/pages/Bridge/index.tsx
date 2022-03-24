import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { CurrencyAmount } from '@swapr/sdk'
import { useDispatch, useSelector } from 'react-redux'
import { Tabs } from './Tabs'
import AppBody from '../AppBody'
import { AssetSelector } from './AssetsSelector'
import { RowBetween } from '../../components/Row'
import ArrowIcon from '../../assets/svg/arrow.svg'
import { BridgeActionPanel } from './ActionPanel/BridgeActionPanel'
import { BridgeModal } from './BridgeModals/BridgeModal'
import { BridgeTransactionsSummary } from './BridgeTransactionsSummary'
import { BridgeTransactionSummary } from '../../state/bridgeTransactions/types'
import { NetworkSwitcher as NetworkSwitcherPopover, networkOptionsPreset } from '../../components/NetworkSwitcher'
import { useActiveWeb3React } from '../../hooks'
import { SHOW_TESTNETS } from '../../constants'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { BridgeTabs, isNetworkDisabled } from './utils'
import { createNetworksList, getNetworkOptions } from '../../utils/networksList'
import { useOmnibridge } from '../../services/Omnibridge/OmnibridgeProvider'
import { AppState } from '../../state'
import { selectBridgeFilteredTransactions } from '../../services/Omnibridge/store/Omnibridge.selectors'
import { omnibridgeUIActions } from '../../services/Omnibridge/store/UI.reducer'
import { BridgeSelectionWindow } from './BridgeSelectionWindow'
import CurrencyInputPanel from '../../components/CurrencyInputPanelBridge'
import { useBridgeModal } from './useBridgeModal'
import {
  useBridgeActionHandlers,
  useBridgeCollectHandlers,
  useBridgeFetchDynamicLists,
  useBridgeInfo,
  useBridgeListsLoadingStatus,
  useBridgeTxsFilter
} from '../../services/Omnibridge/hooks/Omnibrige.hooks'
import { BridgeModalStatus, BridgeTxsFilter } from '../../services/Omnibridge/Omnibridge.types'

const Wrapper = styled.div`
  width: 100%;
  max-width: 432px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

const Title = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 18px;
  line-height: 22px;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.purple2};
`

const Row = styled(RowBetween)`
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  align-items: stretch;
  justify-content: space-between;

  @media (max-width: 374px) {
    flex-direction: column;
  }
`

const SwapButton = styled.button<{ disabled: boolean }>`
  padding: 0 16px;
  border: none;
  background: none;
  cursor: ${({ disabled }) => (disabled ? 'auto' : 'pointer')};

  @media only screen and (max-width: 600px) {
    padding: 8px;
  }
`

const AssetWrapper = styled.div`
  flex: 1 0 35%;
`

export default function Bridge() {
  const dispatch = useDispatch()
  const { chainId, account } = useActiveWeb3React()
  const omnibridge = useOmnibridge()

  const bridgeSummaries = useSelector((state: AppState) =>
    selectBridgeFilteredTransactions(state, account ?? undefined)
  )

  useBridgeFetchDynamicLists()
  //new modal interface
  const { modalData, setModalData, setModalState } = useBridgeModal()
  const { bridgeCurrency, currencyBalance, parsedAmount, typedValue, fromChainId, toChainId } = useBridgeInfo()
  const {
    onCurrencySelection,
    onUserInput,
    onToNetworkChange,
    onFromNetworkChange,
    onSwapBridgeNetworks
  } = useBridgeActionHandlers()
  const { collectableTx, setCollectableTx, collecting, setCollecting, collectableCurrency } = useBridgeCollectHandlers()
  const listsLoading = useBridgeListsLoadingStatus()

  const [activeTab, setActiveTab] = useState<BridgeTabs>('bridge')

  const toPanelRef = useRef(null)
  const fromPanelRef = useRef(null)

  const [showToList, setShowToList] = useState(false)
  const [showFromList, setShowFromList] = useState(false)

  const setTxsFilter = useBridgeTxsFilter()

  const collectableTxAmount = bridgeSummaries.filter(tx => tx.status === 'redeem').length
  const isNetworkConnected = fromChainId === chainId
  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalance, chainId)
  const atMaxAmountInput = Boolean((maxAmountInput && parsedAmount?.equalTo(maxAmountInput)) || !isNetworkConnected)
  const { from, to } = useSelector((state: AppState) => state.omnibridge.UI)

  const [displayedValue, setDisplayedValue] = useState('')

  useEffect(() => {
    //when user change chain we will get error because address of token isn't on the list (we have to fetch tokens again and then we can correct pair tokens)
    dispatch(omnibridgeUIActions.setShowAvailableBridges(false))
    if (!collecting) {
      onUserInput('')
      setDisplayedValue('')
      onCurrencySelection('')
    }
    dispatch(omnibridgeUIActions.setFrom({ chainId }))
  }, [from.chainId, to.chainId, dispatch, chainId, onCurrencySelection, collecting, onUserInput])

  const handleResetBridge = useCallback(() => {
    if (!chainId) return
    setDisplayedValue('')
    onUserInput('')
    onCurrencySelection('')

    setActiveTab('bridge')
    setTxsFilter(BridgeTxsFilter.RECENT)
    setModalState(BridgeModalStatus.CLOSED)
    if (collecting) {
      setCollecting(false)
      // setCollectableTx(null)
      //toggle between collect - bridge tab
      // NOTE: i dont think its needed anymore
      setModalData({
        symbol: '',
        typedValue: '',
        fromChainId: chainId,
        toChainId: fromChainId
      })
      return
    }

    //after bridging txn
    setModalData({
      symbol: '',
      typedValue: '',
      fromChainId: fromChainId,
      toChainId: toChainId
    })
  }, [
    chainId,
    collecting,
    fromChainId,
    onCurrencySelection,
    onUserInput,
    setCollecting,
    setModalData,
    setModalState,
    setTxsFilter,
    toChainId
  ])

  const handleMaxInput = useCallback(() => {
    maxAmountInput && onUserInput(isNetworkConnected ? maxAmountInput.toExact() : '')
  }, [maxAmountInput, isNetworkConnected, onUserInput])

  const handleSubmit = useCallback(async () => {
    if (!chainId) return

    await omnibridge.triggerBridging()
  }, [chainId, omnibridge])

  const handleModal = useCallback(async () => {
    omnibridge.triggerModalDisclaimerText()

    setModalData({
      symbol: bridgeCurrency?.symbol,
      typedValue,
      fromChainId,
      toChainId
    })

    setModalState(BridgeModalStatus.DISCLAIMER)
  }, [omnibridge, setModalData, bridgeCurrency, typedValue, fromChainId, toChainId, setModalState])

  const handleTriggerCollect = useCallback(
    (tx: BridgeTransactionSummary) => {
      if (!tx) return
      const { toChainId, value, assetName, fromChainId, txHash } = tx

      setCollectableTx(txHash)
      setCollecting(true)
      setActiveTab('collect')
      setModalData({ fromChainId, toChainId, symbol: assetName, typedValue: value })
    },
    [setCollectableTx, setCollecting, setModalData]
  )

  const handleCollect = useCallback(async () => {
    await omnibridge.collect()
    setCollecting(false)
  }, [omnibridge, setCollecting])

  const fromNetworkList = useMemo(
    () =>
      createNetworksList({
        networkOptionsPreset,
        isNetworkDisabled,
        onNetworkChange: onFromNetworkChange,
        selectedNetworkChainId: collecting && collectableTx ? collectableTx.fromChainId : fromChainId,
        activeChainId: !!account ? chainId : -1
      }),
    [account, chainId, collectableTx, collecting, fromChainId, onFromNetworkChange]
  )

  const toNetworkList = useMemo(
    () =>
      createNetworksList({
        networkOptionsPreset,
        isNetworkDisabled,
        onNetworkChange: onToNetworkChange,
        selectedNetworkChainId: collecting && collectableTx ? collectableTx.toChainId : toChainId,
        activeChainId: !!account ? chainId : -1
      }),
    [account, chainId, collectableTx, collecting, onToNetworkChange, toChainId]
  )

  return (
    <Wrapper>
      <Tabs
        collecting={collecting}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collectableTxAmount={collectableTxAmount}
        setTxsFilter={setTxsFilter}
        handleResetBridge={handleResetBridge}
        handleTriggerCollect={handleTriggerCollect}
        firstTxnToCollect={collectableTx}
      />
      {activeTab !== 'history' && (
        <AppBody>
          <RowBetween mb="12px">
            <Title>{collecting ? 'Collect' : 'Swapr Bridge'}</Title>
          </RowBetween>
          <Row mb="12px">
            <AssetWrapper ref={fromPanelRef}>
              <AssetSelector
                label="from"
                onClick={SHOW_TESTNETS ? () => setShowFromList(val => !val) : () => null}
                disabled={SHOW_TESTNETS ? activeTab === 'collect' : true}
                networkOption={getNetworkOptions({
                  chainId: collecting && collectableTx ? collectableTx.fromChainId : fromChainId,
                  networkList: fromNetworkList
                })}
              />
              <NetworkSwitcherPopover
                networksList={fromNetworkList}
                showWalletConnector={false}
                parentRef={fromPanelRef}
                show={SHOW_TESTNETS ? showFromList : false}
                onOuterClick={SHOW_TESTNETS ? () => setShowFromList(false) : () => null}
                placement="bottom"
              />
            </AssetWrapper>
            <SwapButton onClick={onSwapBridgeNetworks} disabled={activeTab === 'collect'}>
              <img src={ArrowIcon} alt="arrow" />
            </SwapButton>
            <AssetWrapper ref={toPanelRef}>
              <AssetSelector
                label="to"
                onClick={SHOW_TESTNETS ? () => setShowToList(val => !val) : () => null}
                disabled={SHOW_TESTNETS ? activeTab === 'collect' : true}
                networkOption={getNetworkOptions({
                  chainId: collecting && collectableTx ? collectableTx.toChainId : toChainId,
                  networkList: toNetworkList
                })}
              />
              <NetworkSwitcherPopover
                networksList={toNetworkList}
                showWalletConnector={false}
                parentRef={toPanelRef}
                show={SHOW_TESTNETS ? showToList : false}
                onOuterClick={SHOW_TESTNETS ? () => setShowToList(false) : () => null}
                placement="bottom"
              />
            </AssetWrapper>
          </Row>
          {/* New component CurrencyInput for Bridge */}
          <CurrencyInputPanel
            label="Amount"
            value={activeTab === 'collect' ? (collecting && collectableTx ? collectableTx.value : '') : typedValue}
            displayedValue={displayedValue}
            setDisplayedValue={setDisplayedValue}
            showMaxButton={activeTab !== 'collect' && !atMaxAmountInput}
            currency={activeTab === 'collect' ? collectableCurrency : bridgeCurrency}
            onUserInput={onUserInput}
            onMax={activeTab === 'collect' ? undefined : handleMaxInput}
            onCurrencySelect={onCurrencySelection}
            disableCurrencySelect={activeTab === 'collect' || !isNetworkConnected}
            disabled={activeTab === 'collect'}
            id="bridge-currency-input"
            hideBalance={
              activeTab === 'collect'
                ? collecting && collectableTx
                  ? ![collectableTx.fromChainId, collectableTx.toChainId].includes(chainId ?? 0)
                  : true
                : false
            }
            isLoading={!!account && isNetworkConnected && listsLoading}
            chainIdOverride={collecting && collectableTx ? collectableTx.toChainId : undefined}
          />
          <BridgeActionPanel
            account={account}
            fromNetworkChainId={fromChainId}
            toNetworkChainId={collecting && collectableTx ? collectableTx.toChainId : toChainId}
            handleModal={handleModal}
            handleCollect={handleCollect}
            isNetworkConnected={isNetworkConnected}
            collecting={collecting}
            setCollecting={setCollecting}
          />
        </AppBody>
      )}
      {activeTab === 'bridge' && <BridgeSelectionWindow />}
      {!collecting && (
        <BridgeTransactionsSummary
          transactions={bridgeSummaries}
          collectableTx={collectableTx}
          handleTriggerCollect={handleTriggerCollect}
        />
      )}
      <BridgeModal
        handleResetBridge={handleResetBridge}
        setCollecting={setCollecting}
        setStatus={setModalState}
        modalData={modalData}
        handleSubmit={handleSubmit}
      />
    </Wrapper>
  )
}
