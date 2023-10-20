/*
  Set, add, remove items from local or session storage

  Stored items are referenced via a key, which is a string, and can
  be any valid
*/

export const setLocalItem = (key, item) => _setItem(localStorage, key, item)
export const getLocalItem = (key) => _getItem(localStorage, key)
export const removeLocalItem = (key) => _removeItem(localStorage, key)

export const setSessionItem = (key, item) => _setItem(sessionStorage, key, item)
export const getSessionItem = (key) => _getItem(sessionStorage, key)
export const removeSessionItem = (key) => _removeItem(sessionStorage, key)

//*****************************************************************************
// Helpers
//*****************************************************************************

function _setItem(storageObj, key, item) {
  return storageObj.setItem(key, JSON.stringify(item))
}
function _getItem(storageObj, key) {
  return JSON.parse(storageObj.getItem(key))
}

function _removeItem(storageObj, key) {
  return storageObj.removeItem(key)
}
