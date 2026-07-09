# Si ves error 404 en main.tsx o 400 en %BASE_URL%logo.png

Eso significa que GitHub Pages esta sirviendo el CODIGO FUENTE, no la version compilada.

## Solucion (haz esto en GitHub)

1. Abre tu repo en GitHub
2. Ve a **Settings** -> **Pages**
3. En **Build and deployment** -> **Source**
4. Selecciona **GitHub Actions** (NO "Deploy from a branch")
5. Si dice "Deploy from branch / main / root", cambialo a **GitHub Actions**

## Luego sube los cambios

```bash
cd dashboard
git add .
git commit -m "Fix deploy GitHub Pages"
git push
```

## Verifica el deploy

1. Ve a la pestana **Actions** en tu repo
2. Abre el workflow **Deploy GitHub Pages**
3. Debe terminar en verde (check)
4. Abre la URL que aparece en Settings -> Pages

## URL correcta

```
https://TU-USUARIO.github.io/dms-atraccion-dashboard/
```

(con barra al final)

## Como saber que funciona

En F12 -> Network NO debe aparecer:
- main.tsx (404)
- %BASE_URL%logo.png (400)

Debe aparecer algo como:
- index-XXXXX.js (200)
- productividad-atraccion.xlsx (200)
