import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import Socket from "@utils/Socket";

const socket = Socket();

const InnerSnackbarConfigurator = (props) => {
  props.setUseSnackbarRef(useSnackbar())
  return null;
}

let useSnackbarRef;
const setUseSnackbarRef = (useSnackbarRefProp) => {
  useSnackbarRef = useSnackbarRefProp
}

export function SnackbarConfigurator() {

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    socket.on("alert",(payload) => {    
      enqueueSnackbar(payload?.message,payload?.options);
    });  
  });

  return(
    <>
      <InnerSnackbarConfigurator setUseSnackbarRef={setUseSnackbarRef} />
    </>
  );
}

export const useAlert = () => {

  const { enqueueSnackbar } = useSnackbar();

  const sendAlert = (message,options) => {
    enqueueSnackbar(message,options);
    if(options?.broadcast){
      socket.emit('alert',{
        message: message,
        options: options
      });
    }
  }

  return sendAlert
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