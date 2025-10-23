# gestion-citas
Una aplicacion donde se gesionan citas medicas con profesionales de la salud

# Creacion de la base de datos
Se utiliza la herramienta de diseño de base de datos WorkBench en la cual se crean el modelo de la base de datos que seria: Como de nieve, en el cual se crean los hechos juntos con sus metricas

# Creacion de carpetas
Se empieza por la creacion de las carpetas las cuales corresponden a cada parte rol del desarrollo: FrontEnd y Backed

# Carpeta BackEnd

## Usar proyecto con XAMPP (crear junction en htdocs)

Si quieres que Apache (XAMPP) sirva este proyecto desde `C:\xampp\htdocs` sin mover los archivos, puedes crear un enlace tipo "junction" que apunta a la carpeta del repositorio. Esto es útil cuando trabajas con el repo en una ubicación como OneDrive y no quieres copiarlo a `htdocs`.

> Nota: ejecutar los comandos requiere abrir PowerShell como Administrador.

1) Abre PowerShell como Administrador.

2) Ejecuta este comando (ajusta la ruta `Target` si tu usuario o ruta es distinta):

```powershell
New-Item -ItemType Junction -Path "C:\xampp\htdocs\gestion-citas" -Target "C:\Users\benja\OneDrive - Universidad Cooperativa de Colombia\Documents\Uni\POW\gestion-citas\gestion-citas"
```

3) Comprueba que el enlace fue creado (deberías ver `gestion-citas` dentro de `C:\xampp\htdocs`):

```powershell
Get-ChildItem 'C:\xampp\htdocs' | Where-Object Name -eq 'gestion-citas'
```

4) Reinicia Apache desde el XAMPP Control Panel.

5) Abre en el navegador (ejemplo):

```
http://localhost/gestion-citas/index/login_usuario.html
```

Advertencias y notas:
- Si ya existe `C:\xampp\htdocs\gestion-citas`, elimínala o renómbrala antes de crear la junction. Para eliminarla con PowerShell:

```powershell
Remove-Item 'C:\xampp\htdocs\gestion-citas' -Recurse -Force
```

	Ten cuidado: esto borrará cualquier contenido en esa carpeta.
- OneDrive: cuando el proyecto está dentro de OneDrive puede haber problemas de permisos o archivos en la nube; si encuentras errores de acceso considera mover el repo a una carpeta local fuera de OneDrive (por ejemplo `C:\dev\gestion-citas`).
- Permisos: asegura que Apache tenga permisos de lectura sobre la carpeta del proyecto.

Si otra persona clona este repositorio y quiere configurar lo mismo, debe:
- Clonar el repo en su máquina (por ejemplo `C:\Users\<usuario>\projects\gestion-citas`).
- Ejecutar el comando `New-Item` con su ruta local como `-Target`.
- Reiniciar Apache y abrir la URL `http://localhost/gestion-citas/`.
