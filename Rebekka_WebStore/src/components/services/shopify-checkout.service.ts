import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface ShippingRate {
  handle: string;
  title: string;
  price: {
    amount: string;
    currencyCode: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ShopifyCheckoutService {
  private http = inject(HttpClient);

  // Reemplaza con tus credenciales de Shopify Storefront
  private shopifyDomain = 'TU_TIENDA.myshopify.com';
  private storefrontToken = 'TU_STOREFRONT_ACCESS_TOKEN';
  private graphqlUrl = `https://${this.shopifyDomain}/api/2024-01/graphql.json`;

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': this.storefrontToken
  });

  // Fetch de tarifas de envío desde un Cart de Shopify mediante dirección
  getShippingRates(cartId: string, shippingAddress: any): Observable<ShippingRate[]> {
    const query = `
      mutation cartShippingAddressUpdate($cartId: ID!, $address: MailingAddressInput!) {
        cartShippingAddressUpdate(cartId: $cartId, shippingAddress: $address) {
          cart {
            id
            deliveryGroups(first: 1) {
              nodes {
                deliveryOptions {
                  handle
                  title
                  estimatedCost {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      cartId,
      address: {
        address1: shippingAddress.address,
        address2: shippingAddress.apartment,
        city: shippingAddress.city,
        state: shippingAddress.state,
        country: shippingAddress.country,
        zip: shippingAddress.postalCode,
        firstName: shippingAddress.firstName,
        lastName: shippingAddress.lastName
      }
    };

    return this.http.post<any>(this.graphqlUrl, { query, variables }, { headers: this.headers }).pipe(
      map(res => {
        const options = res.data?.cartShippingAddressUpdate?.cart?.deliveryGroups?.nodes[0]?.deliveryOptions || [];
        return options.map((opt: any) => ({
          handle: opt.handle,
          title: opt.title,
          price: {
            amount: opt.estimatedCost.amount,
            currencyCode: opt.estimatedCost.currencyCode
          }
        }));
      })
    );
  }
}
