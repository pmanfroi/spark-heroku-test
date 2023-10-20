import reactHotToast, {Toaster} from 'react-hot-toast'

export const toast = reactHotToast
/*
  wrapper round react host toast to provide customization, themeing, etc
*/
export const ToastViewport = function () {
  return (
    <Toaster
      position="top-right"
      gutter={15}
      containerStyle={{
        marginTop: 60,
        marginRight: 18,
      }}
      toastOptions={{
        duration: 3000,
      }}
    />
  )
}

export default ToastViewport
