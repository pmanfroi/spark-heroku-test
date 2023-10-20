import clsx, {ClassValue} from 'clsx'
import {twMerge} from 'tailwind-merge'

/**
 * Parse className input using twMerge and clsx to allow conditions and prevent conflicts.
 * @param {ClassValue} inputs - An array of ClassValue, containing n className and conditions
 * @returns {string} - A string of className
 */
const cns = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs))
}

export default cns
