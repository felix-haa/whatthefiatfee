import { useContext } from 'react'

import Table from 'react-bootstrap/Table'

import { calculateFee, convertToFiat } from '../lib/calculator'
import { FiatContext } from '../components/FiatProvider'
import { CurrentDataType } from '../lib/types'

const FeeTable = ({
  fees,
  currentData,
}: {
  fees: { fee: number }[]
  currentData: CurrentDataType[]
  txnSize: number
  currency: string
}): JSX.Element => {
  const { currency } = useContext(FiatContext)
  let locale = 'en-US'
  let fiatValue = currentData[0].usd
  switch (currency) {
    case 'eur':
      locale = 'de-DE'
      fiatValue = currentData[0].eur
      break
    case 'gbp':
      locale = 'en-GB'
      fiatValue = currentData[0].gbp
      break
  }

  const tableRows = {
    '0.5h': [],
    '1h': [],
    '1.5h': [],
    '2h': [],
    '3h': [],
    '4h': [],
    '6h': [],
    '8h': [],
    '12h': [],
    '16h': [],
    '24h': [],
  }

  let counter = 0
  Object.entries(tableRows).forEach(([key]) => {
    fees.slice(counter, counter + 5).map((fee) => tableRows[key].push(fee.fee))
    counter += 5
  })

  return (
    <>
      <Table bordered size="sm" responsive="sm" className="mb-1">
        <thead>
          <tr>
            <th></th>
            <th>5%</th>
            <th>20%</th>
            <th>50%</th>
            <th>80%</th>
            <th>95%</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(tableRows).map(
            ([tableHeader, tableData], tableRowIndex) => {
              return (
                <tr key={tableRowIndex}>
                  <th>{tableHeader}</th>
                  {tableData.map((fee, tableDataIndex) => {
                    return (
                      <td key={tableDataIndex}>
                        {convertToFiat(calculateFee(fee, fiatValue), locale)}
                      </td>
                    )
                  })}
                </tr>
              )
            }
          )}
        </tbody>
      </Table>
      <p className="source text-muted text-right font-weight-light">
        Fee estimates by{' '}
        <a href="https://whatthefee.io" className="text-reset" target="_black">
          WhatTheFee.io
        </a>
      </p>
    </>
  )
}

export default FeeTable
