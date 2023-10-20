import cn from '../classnames'

describe('CN', () => {
  it('returns classname', () => {
    const className = 'bg-red-500'

    expect(cn(className)).toBe(className)
  })
  it('returns merged classname', () => {
    const className = 'px-40 h-40'
    const bgRed = 'bg-red-500'
    const output = `${className} ${bgRed}`

    expect(cn(className, bgRed)).toBe(output)
  })
  it('returns conditional classname', () => {
    const className = 'px-40 h-40'
    const bgRed = 'bg-red-500'
    const bgBlue = 'bg-blue-500'
    const isBgRed = true
    const output = `${className} ${bgRed}`

    expect(cn(className, isBgRed ? bgRed : bgBlue)).toBe(output)
  })
  it('returns conditional classname using foo:boolean syntax', () => {
    const className = 'px-40 h-40'
    const bgRed = 'bg-red-500'
    const isBgRed = true
    const output = `${className} ${bgRed}`

    expect(cn(className, {[`${bgRed}`]: isBgRed})).toBe(output)
  })
  it('fixes classname conflicts', () => {
    const className = 'px-40 h-4'
    const override = 'px-20'
    const output = 'h-4 px-20'

    expect(cn(className, override)).toBe(output)
  })
})
