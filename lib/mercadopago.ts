import { MercadoPagoConfig } from "mercadopago"

export function getMpClient() {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN
  if (!accessToken) throw new Error("MERCADOPAGO_ACCESS_TOKEN não configurado")
  return new MercadoPagoConfig({ accessToken })
}
