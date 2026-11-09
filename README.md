# Implementación de operaciones CRUD en DynamoDB desde la interfaz

El sistema debe permitir la gestión de órdenes en DynamoDB a través de la interfaz de usuario. Los usuarios podrán crear, leer, actualizar y eliminar órdenes. Cada orden tiene un identificador único, un estado, una fecha de creación y una fecha de modificación. El sistema debe validar que los campos obligatorios estén presentes y que el identificador sea único. En caso de error, el sistema debe proporcionar un mensaje descriptivo.

## Informacion General

| Campo | Valor |
|-------|-------|
| **Tema** | Persistir ordenes en DynamoDB desde la interfaz |
| **Nivel** | advanced-l2 |
| **Tipo** | practical |
| **Tiempo estimado** | 8 horas |

## Fases del Reto

### Fase 0: Configuración del Proyecto

**Objetivo:** Obtener el proyecto base funcional enviando el Código Base a un asistente de IA, que lo analizará, corregirá errores y entregará cada archivo con su ruta.

**Tiempo estimado:** 15-30 minutos

**Instrucciones:**

- Asegúrate de tener instalado para ejecutar el proyecto: Node.js 18+, npm, VS Code o similar.
- Copia todo el contenido del campo **Código Base** de este reto — incluyendo el texto de instrucciones que aparece al inicio.
- Abre un asistente de IA (Claude en claude.ai, ChatGPT o Gemini — se recomienda Claude), pega el contenido copiado en el chat y envíalo.
- El asistente analizará los archivos, corregirá errores y entregará cada archivo con su ruta. Guárdalos en la carpeta donde quieras trabajar, respetando las rutas.
- Ejecuta `npm install && npm run build` (o `npm start`). Si no hay errores, estás listo.

**Entregable:** El proyecto compila/arranca sin errores.

<details>
<summary>Pistas de conocimiento</summary>

- Copia el Código Base completo incluyendo el texto de instrucciones al inicio — esas instrucciones le indican al asistente exactamente qué hacer con los archivos.
- Si el asistente no entrega todos los archivos al terminar el análisis, escríbele: "entrégame todos los archivos con su ruta".
- Si el proyecto tiene errores al arrancar, comparte el mensaje de error con el mismo asistente para que lo corrija.

</details>

### Fase 1: Configuración inicial del entorno

**Objetivo:** Configurar el entorno de desarrollo para interactuar con DynamoDB.

**Tiempo estimado:** 2 horas

**Instrucciones:**

- Configurar el proyecto para utilizar DynamoDB.
- Asegurar que la infraestructura se pueda versionar utilizando Terraform.

**Entregable:** Entorno de desarrollo configurado y listo para interactuar con DynamoDB.

<details>
<summary>Pistas de conocimiento</summary>

- Configuración de DynamoDB en el proyecto.
- Uso de Terraform para versionar la infraestructura.

</details>

### Fase 2: Implementación de la creación de órdenes

**Objetivo:** Implementar la funcionalidad para crear nuevas órdenes en DynamoDB.

**Tiempo estimado:** 3 horas

**Instrucciones:**

- Implementar la lógica para crear una nueva orden en DynamoDB.
- Validar que los campos obligatorios estén presentes y que el identificador sea único.
- Proporcionar un mensaje descriptivo en caso de error.

**Entregable:** Funcionalidad para crear nuevas órdenes en DynamoDB, incluyendo validaciones y manejo de errores.

<details>
<summary>Pistas de conocimiento</summary>

- Lógica de creación de órdenes en DynamoDB.
- Validación de campos obligatorios y unicidad del identificador.

</details>

### Fase 3: Implementación de la lectura, actualización y eliminación de órdenes

**Objetivo:** Implementar las funcionalidades para leer, actualizar y eliminar órdenes en DynamoDB.

**Tiempo estimado:** 3 horas

**Instrucciones:**

- Implementar la lógica para leer una orden existente en DynamoDB.
- Implementar la lógica para actualizar una orden existente en DynamoDB.
- Implementar la lógica para eliminar una orden existente en DynamoDB.
- Asegurar que las operaciones de lectura, actualización y eliminación sean idempotentes y consistentes.

**Entregable:** Funcionalidades para leer, actualizar y eliminar órdenes en DynamoDB, asegurando idempotencia y consistencia.

<details>
<summary>Pistas de conocimiento</summary>

- Lógica de lectura, actualización y eliminación de órdenes en DynamoDB.
- Asegurar idempotencia y consistencia en las operaciones.

</details>

## Dimensiones Evaluadas

- **queEs**: ¿Qué es una orden y cómo se representa en DynamoDB?
- **paraQueSirve**: ¿Para qué sirve cada una de las operaciones CRUD en el contexto de la gestión de órdenes?
- **comoSeUsa**: ¿Cómo se utiliza Terraform para versionar la infraestructura?
- **erroresComunes**: ¿Cuáles son los errores comunes al interactuar con DynamoDB y cómo se manejan?
- **queDecisionesImplica**: ¿Qué decisiones implica la implementación de las operaciones CRUD en DynamoDB desde la interfaz?

## Criterios de Evaluacion

- Configuración correcta del entorno de desarrollo para interactuar con DynamoDB.
- Implementación correcta de la funcionalidad para crear nuevas órdenes en DynamoDB, incluyendo validaciones y manejo de errores.
- Implementación correcta de las funcionalidades para leer, actualizar y eliminar órdenes en DynamoDB, asegurando idempotencia y consistencia.
- Uso correcto de Terraform para versionar la infraestructura.
- Manejo adecuado de errores comunes al interactuar con DynamoDB.

## Como trabajar con un asistente de IA

Hay dos caminos, elegi uno:

- **AGENTS.md** (recomendado) — instrucciones nativas del repo. Abri esta carpeta con tu agente local (Claude Code, Cursor, Codex, Copilot, Gemini) y las carga solo. Sabe que archivos faltan y con que comando se verifica, y completa el scaffold escribiendo en disco.
- **PROMPT_MEJORA.md** — para copiar y pegar en un chat (claude.ai, ChatGPT) si no tenes un agente en el IDE. Declara lo mismo que AGENTS.md; los archivos que te devuelva el chat los guardas en esta carpeta respetando las rutas.

Ninguno de los dos resuelve las fases del reto: eso es tu trabajo.

## Mapa de componentes

El repo tiene una carpeta por componente. Cada uno se instala y verifica dentro de la suya.

| Componente | Carpeta | Rol | Capa | Track | Tecnologias |
|---|---|---|---|---|---|
| `api` | `api/` | practice | server | Node | DynamoDB |
| `client` | `client/` | chapter, support | client | React | React |
| `infra` | `infra/` | support | infra | Terraform (AWS) | Terraform |
| `infra-local` | (raiz) | support | infra | Compose local | DynamoDB |

## Orden de arranque

1. `docker compose up -d` (en la raiz) — levanta la infraestructura local.
2. `cd infra && terraform fmt -check -recursive && terraform init -backend=false && terraform validate` — componente `infra` (support).
3. `cd api && npm install && npm run build` — componente `api` (practice).
4. `cd client && npm install && npm run build` — componente `client` (chapter, support).

### Contratos entre componentes

- `api` expone http (api: http://localhost:3000):
  - `POST /orders`
  - `GET /orders/:id`
  - `PUT /orders/:id`
  - `DELETE /orders/:id`
- `client` expone http (api: http://localhost:3000):
  - `POST /orders`
  - `GET /orders`
  - `GET /orders/:id`
  - `PUT /orders/:id`
  - `DELETE /orders/:id`

## Herramientas

- **Terraform**: Herramienta de trabajo del candidato: usala en la fase donde se depura o se prueba la solucion (no es una dependencia del proyecto).

## Verificacion

El proyecto esta listo para trabajar cuando este comando corre sin errores:

```bash
(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && (cd infra && terraform fmt -check -recursive && terraform init -backend=false && terraform validate) && docker compose config -q
```

---

*Reto generado automaticamente por Challenge Generator - Pragma*
