import { Injectable } from '@angular/core';

// Declaración global para evitar errores de TypeScript con el script de Mercado Pago
declare var MercadoPago: any;

@Injectable({
  providedIn: 'root'
})
export class MercadoPagoService {
  private mp: any;
  private publicKey = 'APP_USR-TU_PUBLIC_KEY_DE_MERCADO_PAGO'; // Reemplaza con tu Public Key

  constructor() {
    this.initMercadoPago();
  }

  private initMercadoPago() {
    if (typeof MercadoPago !== 'undefined') {
      this.mp = new MercadoPago(this.publicKey, {
        locale: 'es-MX'
      });
    }
  }

  // Tokeniza la tarjeta de forma segura en el cliente sin exponer los datos sensibles al backend
  async createCardToken(cardData: {
    cardNumber: string;
    cardholderName: string;
    cardExpirationMonth: string;
    cardExpirationYear: string;
    securityCode: string;
    identificationType: string;
    identificationNumber: string;
  }) {
    if (!this.mp) {
      throw new Error('Mercado Pago SDK no inicializado');
    }

    const cardToken = await this.mp.createCardToken({
      cardNumber: cardData.cardNumber,
      cardholderName: cardData.cardholderName,
      cardExpirationMonth: cardData.cardExpirationMonth,
      cardExpirationYear: cardData.cardExpirationYear,
      securityCode: cardData.securityCode,
      identificationType: cardData.identificationType,
      identificationNumber: cardData.identificationNumber,
    });

    return cardToken; // Esto te devuelve un token (ej. 'tok_123456...') que enviarás a tu backend
  }
}
