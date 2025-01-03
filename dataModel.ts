export interface SignalRequest {
    Symbol: string
    Signal: string
    Volume: number
}
export interface OpenOrder {
    Ticket: number
    Symbol: string
    OrderType: string
    Profit: number
    OpenPrice: number
    StopLoss: number
    TakeProfit: number
}

export interface SymbolInfo {
    Symbol: string
    Bid: number
    Ask: number
    Time: Date
    Last: number
    Volume: number
}