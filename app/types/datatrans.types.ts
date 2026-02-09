// Datatrans TypeScript type definitions

export interface DatatransConfig {
  form: string;
  params: DatatransParams;
  opened?: () => void;
  loaded?: () => void;
  error?: (data: DatatransError) => void;
  cancelled?: () => void;
  success?: (data: DatatransSuccess) => void;
}

export interface DatatransParams {
  merchantId: string;
  amount: number;
  currency: string;
  refno: string;
  paymentmethod?: string;
  style?: DatatransStyle;
  APL?: ApplePayConfig;
}

export interface DatatransStyle {
  backgroundColor?: string;
  textColor?: string;
  buttonBackgroundColor?: string;
  buttonTextColor?: string;
}

export interface ApplePayConfig {
  label: string;
  merchantCapabilities: string[];
  supportedNetworks: string[];
}

export interface DatatransError {
  error?: string;
  message?: string;
  code?: string;
}

export interface DatatransSuccess {
  transactionId?: string;
  acquirerAuthorizationCode?: string;
  amount?: number;
  currency?: string;
  refno?: string;
}

export interface TransactionVerification {
  transactionId: string;
  refno: string;
}

export interface TransactionResponse {
  success: boolean;
  message: string;
  transactionData?: {
    id: string;
    status: string;
    amount: number;
    currency: string;
    refno: string;
  };
  error?: string;
}

// Extend the Window interface for Datatrans
declare global {
  interface Window {
    Datatrans?: {
      startPayment: (config: DatatransConfig) => void;
    };
  }
}
