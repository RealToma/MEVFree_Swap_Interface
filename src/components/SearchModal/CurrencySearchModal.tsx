import usePrevious from 'hooks/usePrevious'
import { Currency, Token } from 'mevswap/sdk-core'
import { memo, useCallback, useEffect, useState } from 'react'
import { TokenList } from 'uniswap/token-lists'

import useLast from '../../hooks/useLast'
import { WrappedTokenInfo } from '../../state/lists/wrappedTokenInfo'
import Modal from '../Modal'
import { CurrencySearch } from './CurrencySearch'
import { ImportList } from './ImportList'
import { ImportToken } from './ImportToken'
import Manage from './Manage'

interface CurrencySearchModalProps {
  isOpen: boolean
  onDismiss: () => void
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherSelectedCurrency?: Currency | null
  showCommonBases?: boolean
  showCurrencyAmount?: boolean
  disableNonToken?: boolean
}

export enum CurrencyModalView {
  search,
  manage,
  importToken,
  importList,
}

export default memo(function CurrencySearchModal(
  this: any,
  {
    isOpen,
    onDismiss,
    onCurrencySelect,
    selectedCurrency,
    otherSelectedCurrency,
    showCommonBases = false,
    showCurrencyAmount = true,
    disableNonToken = false,
  }: CurrencySearchModalProps
) {
  const [modalView, setModalView] = useState<CurrencyModalView>(CurrencyModalView.manage)
  const lastOpen = useLast(isOpen)

  //console.log('CurrencySearchModal entry')

  useEffect(() => {
    if (isOpen && !lastOpen) {
      setModalView(CurrencyModalView.search)
    }
  }, [isOpen, lastOpen])

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onCurrencySelect(currency)
      onDismiss()
    },
    [onDismiss, onCurrencySelect]
  )

  // for token import view
  const prevView = usePrevious(modalView)

  // used for import token flow
  const [importToken, setImportToken] = useState<Token | undefined>()

  // used for import list
  const [importList, setImportList] = useState<TokenList | undefined>()
  const [listURL, setListUrl] = useState<string | undefined>()

  const showImportView = useCallback(() => setModalView(CurrencyModalView.importToken), [setModalView])
  const showManageView = useCallback(() => setModalView(CurrencyModalView.manage), [setModalView])
  const handleBackImport = useCallback(
    () => setModalView(prevView && prevView !== CurrencyModalView.importToken ? prevView : CurrencyModalView.search),
    [setModalView, prevView]
  )

  //console.log('CurrencySearchModal switch')
  // change min height if not searching
  let minHeight: number | undefined = 80
  let content: any = null
  switch (modalView) {
    case CurrencyModalView.search:
      content = (
        <CurrencySearch
          isOpen={isOpen}
          onDismiss={onDismiss}
          onCurrencySelect={handleCurrencySelect}
          selectedCurrency={selectedCurrency}
          otherSelectedCurrency={otherSelectedCurrency}
          showCommonBases={showCommonBases}
          showCurrencyAmount={showCurrencyAmount}
          disableNonToken={disableNonToken}
          showImportView={showImportView}
          setImportToken={setImportToken}
          showManageView={showManageView}
        />
      )
      break
    case CurrencyModalView.importToken:
      if (importToken) {
        minHeight = undefined
        content = (
          <ImportToken
            tokens={[importToken]}
            onDismiss={onDismiss}
            list={importToken instanceof WrappedTokenInfo ? importToken.list : undefined}
            onBack={handleBackImport}
            handleCurrencySelect={handleCurrencySelect}
          />
        )
      }
      break
    case CurrencyModalView.importList:
      minHeight = 40
      if (importList && listURL) {
        content = <ImportList list={importList} listURL={listURL} onDismiss={onDismiss} setModalView={setModalView} />
      }
      break
    case CurrencyModalView.manage:
      content = (
        <Manage
          onDismiss={onDismiss}
          setModalView={setModalView}
          setImportToken={setImportToken}
          setImportList={setImportList}
          setListUrl={setListUrl}
        />
      )
      break
  }
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={80} minHeight={minHeight}>
      {content}
    </Modal>
  )
})
