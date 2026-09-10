# Digotec Analytics — Prueba Técnica
### Especialista en Analítica y Automatización Digital

Portal de analítica de cartera bancaria que cubre el ciclo completo: limpieza de datos, segmentación conductual, dashboard ejecutivo y aplicación web interactiva.

---

## Estructura del Proyecto

```
DIGOTEC/
├── data/
│   ├── dataset_clean.csv          # Dataset limpio (22,455 filas)
│   ├── clients_summary.csv        # Vista por cliente (2,200 filas)
│   ├── clients_summary.json       # Para el frontend React
│   └── alertas_vencimiento.json   # Tarjetas próximas a vencer
├── analysis/
│   └── analysis.ipynb             # Notebook de limpieza y segmentación
├── powerbi/
│   └── dashboard.pbix             # Reporte Power BI
├── app/                           # Aplicación Next.js
│   ├── app/
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── clientes/
│   │   └── alertas/
│   ├── components/
│   └── lib/
├── Documentacion/
│   ├── Digotec_Prueba_Tecnica_*.pdf
│   └── Digotec_Prueba_Analitica_*_Dataset.tsv
├── README.md
└── AI_NOTES.md
```

---

## 1. Análisis y Limpieza de Datos (Python)

### Requisitos
```bash
# Crear entorno virtual
python -m venv .venv
.venv\Scripts\activate   # Windows
# source .venv/bin/activate  # macOS/Linux

# Instalar dependencias
pip install pandas jupyter ipykernel openpyxl
```

### Ejecutar el Notebook
```bash
jupyter notebook analysis/analysis.ipynb
```
O desde VS Code: abrir el archivo `.ipynb` y ejecutar con el kernel del `.venv`.

### Problemas de calidad encontrados y decisiones tomadas

| Campo | Problema | Decisión |
|---|---|---|
| `segmento_cliente` | Inconsistencias: "JOVEN", "Joven", "joven", "Affluent " | Mapeo explícito a valores canónicos con `.strip().lower()` |
| `categoria_consumo` | Typos: "streamng", "Super Market", "tech", "Travels" | Diccionario de corrección |
| `ciudad` | 178 registros vacíos | Imputar como "Desconocida" — preferimos mantener los clientes |
| `fecha_vencimiento` | 3,464 nulos | Válido por negocio — las cuentas no tienen vencimiento |
| `cupo_credito` | 7,513 nulos | Válido — solo las Tarjetas de Crédito tienen cupo |

### Segmentos "Lovers" — Definición y criterio de negocio

Los Lovers se determinan por la **categoría de mayor monto_consumo total acumulado** en Tarjeta de Crédito de cada cliente. Se usa el monto total (no frecuencia) porque captura el **mayor valor de gasto**, que es más relevante para decisiones comerciales.

| Lover Type | Categorías agrupadas | Justificación comercial |
|---|---|---|
| **Food & Supermarket Lover** | Food, Supermarket | Mismo perfil de consumo cotidiano. Oportunidad: cashback en supermercados |
| **Tech Lover** | Technology | Afinidad digital. Oportunidad: financiamiento de gadgets/electrónicos |
| **Travel Lover** | Travel | Alto ticket por transacción. Oportunidad: millas, seguros de viaje |
| **Entertainment & Streaming Lover** | Entertainment, Streaming | Consumo digital de ocio. Oportunidad: planes de suscripciones |
| **Health & Wellness Lover** | Health | Perfil de cuidado personal. Oportunidad: convenios con clínicas/farmacias |
| **Education Lover** | Education | Inversión en desarrollo. Oportunidad: crédito educativo, becas |
| **Lifestyle Lover** | Fuel, Others | Consumo diverso. Segmento base |
| **Sin Perfil de Consumo** | N/A | Clientes sin Tarjeta de Crédito activa |

### Distribución resultante

| Segmento | Clientes | % |
|---|---|---|
| Food & Supermarket Lover | 529 | 24.0% |
| Entertainment & Streaming Lover | 326 | 14.8% |
| Travel Lover | 229 | 10.4% |
| Tech Lover | 205 | 9.3% |
| Lifestyle Lover | 188 | 8.5% |
| Health & Wellness Lover | 89 | 4.0% |
| Education Lover | 89 | 4.0% |
| Sin Perfil de Consumo | 545 | 24.8% |

### 3 Insights accionables

**1. Oportunidad de renovación proactiva:**  
Más de 1,000 tarjetas vencen en los próximos 90 días. Una campaña de renovación anticipada reduce el riesgo de pérdida del producto y mejora la retención, evitando que el cliente migre a competencia durante el proceso de renovación reactiva.

**2. Brecha de cross-selling significativa:**  
Solo el 18.7% de los clientes tiene 2 o más productos distintos. Los clientes multiproducto tienen un saldo promedio 3× mayor. El 75%+ de la cartera tiene un solo producto, representando una oportunidad concreta de vinculación (ej. ofrecer Tarjeta de Crédito a clientes con solo Cuenta de Ahorros).

**3. Segmento Joven — retención temprana vía canales digitales:**  
272 clientes del segmento Joven concentran el mayor porcentaje de uso de App y Web. Su ingreso promedio es el más bajo del portafolio. Estrategia: Tarjeta de Crédito de entrada con cupo bajo y beneficios en Streaming/Tecnología (sus Lovers dominantes) para construir historial crediticio y lealtad temprana.

---

## 2. Dashboard Power BI

**Archivo:** `powerbi/dashboard.pbix`

### Fuente de datos
- `data/clients_summary.csv` → página ejecutiva, Lovers, segmentos
- `data/dataset_clean.csv` → página de alertas de vencimiento

### KPIs implementados
- Clientes Únicos (`DISTINCTCOUNT`)
- Saldo Total / Promedio (`SUM`, `AVERAGE`)
- Consumo TC Total / Promedio
- Clientes Multiproducto (`COUNTROWS + FILTER`)
- % Utilización TC (`DIVIDE`)
- Tarjetas con vencimiento <90 días

### Páginas del reporte
1. **Vista Ejecutiva** — KPIs + Donut de Lovers + distribución por segmento y ciudad
2. **Alertas de Vencimiento** — tabla de tarjetas próximas a vencer con formato condicional

---

## 3. Aplicación React / Next.js

### Stack
- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** — estilos
- **Recharts** — visualizaciones
- **JSON estático** — datos pre-procesados sin backend

### Requisitos
```bash
cd app
npm install
npm run dev
# Abrir http://localhost:3000
```

### Páginas
| Ruta | Descripción |
|---|---|
| `/login` | Login de demostración — cualquier usuario/contraseña |
| `/dashboard` | KPIs ejecutivos + Lovers chart + PBI embed + insights |
| `/clientes` | Tabla filtrable por segmento, ciudad, producto y Lover type |
| `/alertas` | Tarjetas próximas a vencer con clasificación de urgencia |

### Filtros implementados (≥3 requeridos por el PDF)
1. **Segmento** (Mass, Premium, Affluent, Joven, PyME)
2. **Ciudad** (Quito, Guayaquil, Cuenca, Manta, Ambato, Loja)
3. **Producto** (Tarjeta de Crédito, Cuenta de Ahorros, etc.)
4. **Lover type** (Food, Tech, Travel, etc.) — bonus

### Power BI Embebido
El componente `PowerBIEmbed.tsx` está implementado con la estructura técnica completa. Para activarlo en un entorno corporativo se necesita:

1. **Azure AD App Registration** con permisos `Dataset.Read.All` y `Report.Read.All`
2. **Power BI Workspace ID** (GUID del workspace donde está el reporte)
3. **Report ID** (GUID del reporte publicado)
4. **Licencia Power BI Pro** o **Premium Per User**

Implementación:
```bash
npm install powerbi-client-react
```
```tsx
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';

<PowerBIEmbed
  embedConfig={{
    type: 'report',
    id: process.env.NEXT_PUBLIC_PBI_REPORT_ID,
    embedUrl: 'https://app.powerbi.com/reportEmbed',
    accessToken: embedToken, // generado en backend con Azure AD
    tokenType: models.TokenType.Embed,
  }}
/>
```

Esta limitación **no penaliza la evaluación** según el documento de la prueba.

---

## 4. Integración Microsoft 365 / SharePoint (SPFx)

### Arquitectura propuesta

```
Dataset TSV (origen)
       ↓
Azure Function (Python) — ejecuta el script de limpieza cada 24h
       ↓
Azure Blob Storage / SharePoint List (datos limpios)
       ↓
Power BI Service (refresh automático desde Blob)
       ↓
SPFx Web Part (powerbi-client-react + Azure AD MSAL)
       ↓
Power Automate → alerta Teams/email para tarjetas <30 días
```

### Migración de la App React a SPFx

Los componentes de la app están diseñados para ser **stateless y prop-driven**, lo que facilita su uso como SPFx Web Parts:

1. **Cada componente** (`KPICard`, `LoversChart`, `ClientesTable`) recibe datos por props — no los busca solo
2. En SPFx, el contexto del Web Part provee las propiedades de configuración (Workspace ID, permisos, URLs)
3. El estado de autenticación se reemplaza por `MSGraphClient` de SPFx (Azure AD integrado)

### Automatización propuesta (Power Automate)

**Flujo: Alerta de Vencimiento de Tarjetas**
- **Trigger**: Recurrente — cada lunes 8:00 AM
- **Acción 1**: HTTP → llama a la API que lee `alertas_vencimiento.json` o SharePoint List
- **Acción 2**: Filtra tarjetas con vencimiento ≤ 30 días
- **Acción 3**: Por cada alerta → envía mensaje a canal Teams del equipo comercial con: nombre cliente, segmento, días para vencer, cupo
- **Acción 4**: Opcional → crea tarea en Planner para el asesor del cliente

### Almacenamiento en entorno corporativo
- **Datos limpios**: Azure Data Lake Gen2 o SharePoint Document Library
- **Parámetros de configuración**: SharePoint Tenant App Catalog (propiedades de tenant)
- **Credenciales y secretos**: Azure Key Vault (nunca en código)
- **Permisos**: Azure AD Groups con RBAC — analistas solo leen, administradores pueden actualizar

---

## URL pública (Bonus)

> _Agregar URL de Vercel una vez desplegado_

---

## Tecnologías utilizadas

| Categoría | Tecnología | Versión |
|---|---|---|
| Análisis de datos | Python + pandas | 3.11+ / 2.x |
| Notebook | Jupyter | — |
| BI | Power BI Desktop | — |
| Frontend | Next.js | 14 |
| Estilos | Tailwind CSS | 4.x |
| Gráficos | Recharts | — |
| Lenguaje | TypeScript | 5.x |
| Deploy | Vercel | — |
