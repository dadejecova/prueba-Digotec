// Tipos TypeScript para los datos del proyecto
// Esto define la "forma" de cada objeto cliente y alerta.
// TypeScript nos avisa si intentamos acceder a un campo que no existe.

export interface Cliente {
  cliente_id: string;
  nombre_cliente: string;
  segmento_cliente: string;
  ciudad: string;
  edad: number;
  ingreso_estimado: number;
  total_productos: number;
  lista_productos: string;
  saldo_total: number;
  consumo_total_tc: number;
  cupo_total_tc: number;
  n_productos_distintos: number;
  es_multiproducto: boolean;
  utilizacion_tc_pct: number | null;
  lover_type: string;
  categoria_dominante: string;
  dias_venc_minimo: number | null;
  canales_usados: string;
}

export interface Alerta {
  cliente_id: string;
  nombre_cliente: string;
  segmento_cliente: string;
  ciudad: string;
  producto: string;
  fecha_vencimiento: string;
  dias_para_vencimiento: number;
  cupo_credito: number;
  saldo_producto: number;
}

export interface KPI {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  color: string;
}
