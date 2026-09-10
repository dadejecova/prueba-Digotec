# AI_NOTES.md — Uso de Inteligencia Artificial en este proyecto

Este archivo documenta de forma transparente cómo se utilizó IA en el desarrollo de esta prueba técnica, en cumplimiento con las instrucciones del documento de evaluación.

---

## Herramienta utilizada

**Antigravity (Google DeepMind)** — Asistente de IA de programación integrado en el IDE, basado en Claude Sonnet 4.6.

---

## Cómo se utilizó

### 1. Generación y revisión del Notebook Python
- La IA propuso la estructura del notebook y los diccionarios de normalización de datos sucios
- El criterio de negocio para los Lovers (qué categorías agrupar y por qué) fue definido y validado conjuntamente con el analista
- Cada celda del notebook incluye comentarios explicando la lógica, para que el código sea comprensible sin la IA

### 2. Estructura del proyecto Next.js
- La IA generó el boilerplate de la app (layout, routing, componentes base)
- El analista dirigió las decisiones de diseño: qué filtros incluir, qué KPIs priorizar, qué información mostrar en el panel de alertas

### 3. Documentación
- La IA ayudó a estructurar el README y este archivo
- Los insights de negocio y las recomendaciones comerciales fueron razonadas y validadas por el analista

### 4. Análisis inicial del dataset
- La IA ejecutó comandos para inspeccionar el dataset antes de abrir el notebook, identificando los problemas de calidad (inconsistencias de segmentos, typos en categorías, nulos)
- Esto aceleró la fase de exploración inicial

---

## Lo que NO hizo la IA

- **No tomó decisiones de negocio sola**: qué Lovers crear, cómo agruparlas, qué insights son accionables — todo fue razonado con el analista
- **No generó los insights**: los 3 insights del notebook y del dashboard son conclusiones del análisis de los datos reales, no texto genérico
- **No hizo el Power BI**: el dashboard se construyó manualmente con Power BI Desktop
- **No eligió el stack**: Next.js, Recharts y la estructura por componentes fueron decisiones técnicas del desarrollador

---

## Reflexión sobre el uso de IA en analítica

La IA es útil como **acelerador de productividad**, no como sustituto del criterio técnico. En este proyecto:

- **Ahorró tiempo** en: boilerplate de componentes React, estructura de notebook, comandos de exploración de datos
- **Requirió criterio humano** en: definición de reglas de negocio, validación de resultados, decisiones de UX, interpretación de los datos

En un entorno corporativo con Microsoft 365, el mismo principio aplica: Power Automate y Copilot aceleran la automatización, pero el analista define las reglas, valida las salidas y defiende las decisiones ante el negocio.
