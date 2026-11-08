# Frontend — Workshop IA

Chat de referencia en React + Vite + TypeScript. **No se edita durante el
taller** — se descarga, se corre, y sirve para ver funcionando cada bloque
(Chat, Skills, RAG, Agentes, MCP) sin tocar código de UI.

Ya viene preparado para mostrar, cuando el backend los devuelva, un panel
"Ver proceso" colapsable con:

- `skill_used` — qué Skill se activó y por qué (Bloque 2).
- `sources` — los fragmentos recuperados por RAG (Bloque 3).
- `tool_calls` — las herramientas/llamadas que ejecutó el agente o un
  servidor MCP (Bloques 4 y 5).

Si el backend no manda esos campos (p. ej. en el Bloque 1, chat simple), el
panel simplemente no aparece — por eso el frontend nunca necesita cambios.

## Setup y ejecución

```bash
npm install
cp .env.example .env     # VITE_API_URL=http://localhost:8000
npm run dev               # http://localhost:5173
```

Requiere el backend corriendo (ver `../backend/README.md`).

## Alternativa sin frontend

Cada módulo del tutorial también muestra cómo probar el backend con `curl`
o Postman, por si prefieres (o necesitas) verificar la respuesta en crudo
antes de verla en la interfaz.
