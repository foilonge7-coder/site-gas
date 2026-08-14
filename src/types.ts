export interface ComboProduct {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  tagColor: string; // e.g. bg-blue-600, bg-emerald-600, etc.
  img: string;
  originalPrice: string;
  currentPrice: string;
  discount: string;
  hasGas: boolean;
  hasWater: boolean;
  waterQuantity?: number;
  gasQuantity?: number;
}

export interface BrandOption {
  nome: string;
  desc: string;
}

export interface SalesItem {
  name: string;
  item: string;
  price: string;
  img: string;
}

export interface OrderForm {
  combo: ComboProduct;
  gasBrand?: string;
  waterBrand?: string;
  waterBrand2?: string;
  customerName: string;
  phone: string;
  address: string;
  neighborhood: string;
  observations: string;
  paymentMethod: 'pix' | 'cartao_credito' | 'cartao_debito' | 'dinheiro';
  changeFor?: string;
}
