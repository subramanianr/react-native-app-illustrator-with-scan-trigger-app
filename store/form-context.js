import React from 'react';

const FormContext = React.createContext();

const initialState = {sessionData: {}, codes: [], pallet: ''};

function formReducer(state, action) {
  switch (action.type) {
    case 'SESSION_DATA': {
      return {...state, sessionData: action.data};
    }
    case 'PALLET_CODE': {
      return {...state, pallet: action.data};
    }
    case 'SUBMIT_BARCODES': {
      return {...state, codes: action.data};
    }
    case 'DEVICE_INFO': {
      return {...state, deviceInformation: action.data};
    }
    case 'SITE_INFO': {
      return {...state, siteInformation: action.data};
    }
    case 'CARRIER_LIST': {
      return {...state, carrierList: action.data};
    }
    case 'RESET_SESSION': {
      return {...state, sessionData: {}, codes: [], pallet: ''};
    }
    case 'RESET_STATE': {
      return initialState;
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function FormProvider({children}) {
  const [state, dispatch] = React.useReducer(formReducer, initialState);

  const value = {state, dispatch};
  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

function useForm() {
  const context = React.useContext(FormContext);

  if (context === undefined) {
    throw new Error('useForm must be used within a FormProvider');
  }

  return context;
}

function FormConsumer(props) {
  return (
    <FormContext.Consumer>
      {context => {
        if (context === undefined) {
          throw new Error('FormConsumer must be used within a FormProvider');
        }
        // eslint-disable-next-line no-undef
        return children(context);
      }}
    </FormContext.Consumer>
  );
}

export {FormProvider, useForm, FormConsumer};
