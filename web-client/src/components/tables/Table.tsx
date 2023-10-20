import {toPairs} from 'ramda'
import reactTable from 'react-table'
import {twMerge} from 'tailwind-merge'

import FormTitle from '@/components/forms/FormTitle'
import cns from '@/utils/classnames'

//*****************************************************************************
// Interface
//*****************************************************************************
// To customize styling of specific table elements
type ClassNamesShape = {
  table: string
  header: string
  headerRow: string
  headerCell: string
  body: string
  row: string
  cell: string
}
interface Props {
  title: string
  columns: {[key: string]: any}[]
  data: {[key: string]: any}[]
  className?: string
  classNames?: ClassNamesShape
}
const defaultProps = {
  classNames: {},
  columns: [],
  data: [],
}
//*****************************************************************************
// Components
//*****************************************************************************

const Table = ({title, columns, data, classNames, className}: Props) => {
  const _b = reactTable.useTable({columns: columns, data: data}),
    getTableProps = _b.getTableProps,
    getTableBodyProps = _b.getTableBodyProps,
    headerGroups = _b.headerGroups,
    rows = _b.rows,
    prepareRow = _b.prepareRow
  const ourStyle = {
    header: 'text-red',
  }
  const cn = {
    table: 'table-fixed',
    header: 'text-xs font-semibold text-zinc-500 text-left',
    headerRow: '',
    headerCell: 'pl-6 pb-4',
    body: 'text-zinc-400 text-sm',
    row: 'border-t last:border-b border-zinc-800',
    cell: 'px-6 py-4',
  }

  const _hStyle = twMerge(cn.header, ourStyle.header)
  // Apply custom styling
  for (let _i = 0, _c = toPairs(cn); _i < _c.length; _i++) {
    const _d = _c[_i],
      key = _d[0],
      value = _d[1]
    cn[key] = cns(value, classNames === null || classNames === void 0 ? void 0 : classNames[key])
  }
  return (
    <div className={className}>
      {title && <FormTitle title={title} />}
      <table {...getTableProps()} className={cn.table}>
        <thead className={cn.header}>
          {headerGroups.map(function (headerGroup) {
            return (
              /* Current header row */
              <tr {...headerGroup.getHeaderGroupProps()} className={cn.headerRow}>
                {headerGroup.headers.map(function (column) {
                  return (
                    /* Current header cell */
                    <th {...column.getHeaderProps()} className={cn.headerCell}>
                      {column.render('Header')}
                    </th>
                  )
                })}
              </tr>
            )
          })}
        </thead>

        <tbody {...getTableBodyProps()} className={cn.body}>
          {rows.map(function (row) {
            prepareRow(row)
            return (
              /* table row */
              <tr {...row.getRowProps()} className={cn.row}>
                {row.cells.map(function (cell) {
                  let props
                  /* table cell */
                  // Allowing column specific class names
                  const colClassName =
                    (props = cell === null || cell === void 0 ? void 0 : cell.column) === null ||
                    props === void 0
                      ? void 0
                      : props.className
                  return (
                    <td className={cns(cn.cell, colClassName)} {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
Table.defaultProps = defaultProps
export default Table
