import {Workbook, Worksheet, Row} from 'exceljs'
import {drop} from 'ramda'

export const getWorksheets = (wb: Workbook): any => {
  const workSheets: any = {}
  wb.eachSheet((ws) => {
    if (notHidden(ws)) workSheets[ws.name] = ws
  })
  return workSheets
}

// First entry is always null, so we just drop it
export const getWorksheetRowValueList = (row: any): any[] => drop(1, row.values)

export const getWorksheetRowData = (workSheet: Worksheet, row: Row): object => {
  const propNames: string[] = getWorksheetRowValueList(workSheet.getRow(1))
  const dataList = getWorksheetRowValueList(row)
  // prettier-ignore
  const rowData = propNames.reduce((acc: any, propName: string, i: number) => ({
    ...acc, [propName]: dataList[i]
  }), {})
  return rowData
}

export const getWorkSheetData = (workSheet: Worksheet): object[] => {
  const data: object[] = []
  workSheet.eachRow((row, rowNumber) => {
    if (rowNumber == 1) return // skip the header row
    data.push(getWorksheetRowData(workSheet, row))
  })
  return data
}

const notHidden = (ws: Worksheet) => ws.name[0] !== '.'
