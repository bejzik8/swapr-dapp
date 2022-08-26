import { useEffect, useState } from 'react'

export const LayoutChangePageNames = ['swap']

export const useIsCurrentPageAdvTradeMode = (pageName: string) => {
  const [isCurrentPage, setCurrentPage] = useState(false)

  useEffect(() => {
    setCurrentPage(!!LayoutChangePageNames.find(name => pageName.includes(name)))
  }, [pageName])

  return isCurrentPage
}
