import axios from 'axios'

type RecordType = {
  orderLogId: string
  appId: string
  clientBackUrl: string
  authToken?: string | null
  invoiceGatewayId?: string | null
  [key: string]: unknown
}

export enum PaymentMode {
  Split = 'split',
  Default = 'default',
}

export enum OpenPageMethod {
  HISTORY_PUSH = 'history_push',
  OPEN_WINDOW = 'open_window',
}

export type PaymentResult = {
  success: boolean
  message: string
  openPageMethod?: OpenPageMethod
  paymentUrl?: string
}

export interface PaymentStrategy {
  execute(record: RecordType): Promise<PaymentResult>
}

type StandardApiResponse = {
  code: string
  message: string
  openPageMethod?: OpenPageMethod
  result: {
    paymentUrl: string
    [key: string]: any
  }
}

abstract class BasePaymentStrategy implements PaymentStrategy {
  async execute(record: RecordType): Promise<PaymentResult> {
    try {
      const standardResponse = await this.makeRequest(record)

      if (standardResponse.code === 'SUCCESS') {
        return {
          success: true,
          message: standardResponse.message,
          paymentUrl: standardResponse.result.paymentUrl,
          openPageMethod: standardResponse.openPageMethod,
        }
      } else {
        const errorMessage = standardResponse.message
        return {
          success: false,
          message: errorMessage,
        }
      }
    } catch (error) {
      const errorMessage = this.handleError(error)
      return {
        success: false,
        message: errorMessage,
      }
    }
  }

  protected abstract makeRequest(record: RecordType): Promise<StandardApiResponse>

  protected formatMessage(code: string): string {
    const codeMessages: Record<string, string> = {
      SUCCESS: 'Operation was successful',
      ERROR: 'An error occurred',
    }

    return codeMessages[code as keyof typeof codeMessages] || 'Unknown error'
  }

  protected handleError(error: unknown): string {
    console.error('Payment execution failed:', error)
    return 'Failed to execute payment. Please try again later.'
  }
}

export class OrderSplitPaymentStrategy extends BasePaymentStrategy {
  protected async makeRequest(record: RecordType): Promise<StandardApiResponse> {
    const response = await axios.post(
      `${process.env.REACT_APP_API_BASE_ROOT}/order/${record.orderLogId}/payment/link`,
      { appId: record.appId },
    )

    const {
      code,
      message,
      result: { link },
    } = response.data

    return {
      code,
      message,
      openPageMethod: OpenPageMethod.OPEN_WINDOW,
      result: {
        paymentUrl: link,
      },
    }
  }
}

export class OrderDefaultPaymentStrategy extends BasePaymentStrategy {
  protected async makeRequest(record: RecordType): Promise<StandardApiResponse> {
    const response = await axios.post(
      `${process.env.REACT_APP_API_BASE_ROOT}/tasks/payment/`,
      {
        orderId: record.orderLogId,
        clientBackUrl: record.clientBackUrl,
        invoiceGatewayId: record.invoiceGatewayId,
      },
      {
        headers: {
          authorization: `Bearer ${record.authToken}`,
        },
      },
    )

    const { code, result, message } = response.data

    return {
      code,
      message,
      openPageMethod: OpenPageMethod.HISTORY_PUSH,
      result: {
        paymentUrl: `/tasks/payment/${result.id}`,
      },
    }
  }
}

export class OrderPaymentStrategyContext {
  static strategyMap = new Map<PaymentMode, new () => PaymentStrategy>([
    [PaymentMode.Split, OrderSplitPaymentStrategy],
    [PaymentMode.Default, OrderDefaultPaymentStrategy],
  ])

  static execute(mode: PaymentMode, record: RecordType): Promise<PaymentResult> {
    const strategy = this.getStrategy(mode)
    return strategy.execute(record)
  }

  static getStrategy(mode: PaymentMode): PaymentStrategy {
    const StrategyClass = this.strategyMap.get(mode) || this.strategyMap.get(PaymentMode.Default)
    if (!StrategyClass) {
      throw new Error('Default payment strategy not found')
    }
    return new StrategyClass()
  }
}
