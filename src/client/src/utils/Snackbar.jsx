import { useSnackbar } from 'notistack'
import React from 'react'

const InnerSnackbarConfigurator = (props) => {
  props.setUseSnackbarRef(useSnackbar())
  return null;
}

let useSnackbarRef;
const setUseSnackbarRef = (useSnackbarRefProp) => {
  useSnackbarRef = useSnackbarRefProp
}

export const SnackbarConfigurator = () => {
  return <InnerSnackbarConfigurator setUseSnackbarRef={setUseSnackbarRef} />
}

export const snackActions = {
  success(msg) {
    this.toast(msg, 'success')
  },
  warning(msg) {
    this.toast(msg, 'warning')
  },
  info(msg) {
    this.toast(msg, 'info')
  },
  error(msg) {
    this.toast(msg, 'error')
  },
  toast(msg, variant = 'default') {
    useSnackbarRef.enqueueSnackbar(msg, { variant })
  }
}