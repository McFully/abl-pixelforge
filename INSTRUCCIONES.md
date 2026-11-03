# PROYECTO: PIXELFORGE — COMPRESOR PROFESIONAL DE IMÁGENES PARA WINDOWS 11

## 1. OBJETIVO GENERAL

Desarrolla una aplicación de escritorio nativa para Windows 11, con una interfaz gráfica moderna, elegante y profesional, inspirada visualmente en el estilo de FV Double Tools mostrado como referencia.

La aplicación se llamará provisionalmente PIXELFORGE.

Debe ser un software especializado en optimización y conversión de imágenes, con especial atención a PNG → WebP y PNG → AVIF.

No quiero una simple interfaz que invoque un compresor básico. Quiero un sistema completo de optimización que utilice motores de compresión especializados, pruebe diferentes configuraciones, mida los resultados y seleccione las mejores opciones posibles.

REQUISITO FUNDAMENTAL:
La aplicación debe distinguir rigurosamente entre compresión sin pérdida y compresión con pérdida. Nunca debe anunciar un resultado como 100 % sin pérdida si no puede demostrar que conserva exactamente los píxeles originales.

## 2. PLATAFORMA Y TECNOLOGÍA

- Sistema operativo: Windows 11 de 64 bits.
- Aplicación de escritorio, sin necesidad de navegador.
- Funcionamiento completamente local.
- Sin APIs externas.
- Sin servicios en la nube.
- Sin suscripciones.
- Sin cuentas de usuario.
- Sin telemetría.
- Sin conexión obligatoria a Internet.
- Instalador independiente .exe.
- Todas las dependencias necesarias deben quedar incluidas o instaladas automáticamente.
- No exigir al usuario instalar Python, Node.js, FFmpeg ni herramientas adicionales.

Utiliza una arquitectura ligera, eficiente y apropiada para equipos Windows modestos.

Prioriza un consumo reducido de RAM y CPU, procesamiento por lotes y estabilidad.

Antes de elegir el framework, comprueba su compatibilidad con Windows 11 y su capacidad para generar un instalador autónomo.

## 3. DISEÑO VISUAL Y EXPERIENCIA DE USUARIO

La interfaz debe inspirarse en el estilo visual de FV Double Tools mostrado en la referencia.

Características:

- Diseño premium y profesional.
- Tema oscuro elegante.
- Fondo gris antracita.
- Paneles diferenciados mediante superficies ligeramente más claras.
- Bordes discretos.
- Esquinas redondeadas.
- Iconografía moderna y coherente.
- Tipografía limpia y legible.
- Acentos de color azul eléctrico o violeta.
- Indicadores visuales de progreso.
- Gráficos estadísticos.
- Microanimaciones discretas.
- Excelente organización del espacio.
- Diseño adaptable a diferentes resoluciones.

Evitar:
- Apariencia de página web metida dentro de una ventana.
- Interfaz anticuada.
- Botones excesivamente grandes.
- Exceso de colores.
- Elementos decorativos innecesarios.
- Información técnica abrumadora para usuarios normales.

La aplicación debe parecer un producto comercial profesional.

## 4. ESTRUCTURA PRINCIPAL

Organiza la aplicación mediante un menú lateral izquierdo con estas secciones:

1. Panel principal.
2. Compresión de imágenes.
3. Conversión de formatos.
4. Procesamiento por lotes.
5. Comparador de calidad.
6. Historial.
7. Configuración.

La zona central debe cambiar según la sección seleccionada.

## 5. PANEL PRINCIPAL

Crear un dashboard que muestre:

- Total de imágenes procesadas.
- Espacio total ahorrado.
- Porcentaje medio de reducción.
- Últimas conversiones.
- Formato más utilizado.
- Tiempo total de procesamiento.
- Actividad reciente.

Incluir una zona destacada de arrastrar y soltar imágenes.

Debe permitir seleccionar archivos y carpetas.

## 6. MOTOR DE COMPRESIÓN

Esta es la funcionalidad más importante del proyecto.

Implementar motores especializados:

### PNG
- OxiPNG.
- ZopfliPNG.
- OptiPNG.

### WebP
- libwebp.
- Modo Lossless.
- Modo Lossy.
- Método de compresión configurable.
- Esfuerzo de codificación máximo.
- Conservación de transparencia.

### AVIF
- libavif.
- Codificador AV1 compatible, como libaom.
- Modo Lossless.
- Modo Lossy.
- Esfuerzo de codificación configurable.
- Conservación de transparencia.
- Compatibilidad con diferentes profundidades de color.

Utilizar versiones estables y mantenidas de las herramientas.

No simular parámetros que un motor no admita.

## 7. MODOS DE COMPRESIÓN

Crear tres modos de funcionamiento.

### MODO 1: SIN PÉRDIDA REAL

Objetivo: conseguir el archivo más pequeño posible conservando exactamente los valores de los píxeles originales.

Configuraciones:

- WebP Lossless.
- AVIF Lossless.
- PNG optimizado.

El sistema debe probar las diferentes configuraciones disponibles y seleccionar el resultado más pequeño que supere la verificación de integridad.

IMPORTANTE:

No confundir calidad 100 con compresión sin pérdida.

En este modo:
- No se permite cuantización con pérdida.
- No se permite reducir dimensiones.
- No se permite reducir profundidad de color.
- No se permite eliminar canales de color.
- No se permite modificar transparencias.
- No se permite alterar los valores RGB de píxeles transparentes cuando se exija conservación exacta.
- No se permite modificar perfiles de color de forma que cambie la interpretación de la imagen.

Si no consigue reducir el tamaño, comunicarlo claramente.

### MODO 2: MÁXIMA CALIDAD VISUAL

Permitir compresión con pérdida mediante estos niveles:

- 95 %.
- 90 %.
- 85 %.
- 80 %.
- Personalizado.

Generar versiones WebP y AVIF.

Los porcentajes deben identificarse como niveles de calidad del codificador, no como porcentajes matemáticos de fidelidad ni como reducción de peso garantizada.

Mostrar siempre el tamaño final y el ahorro conseguido.

### MODO 3: COMPRESIÓN INTELIGENTE AUTOMÁTICA

El usuario introduce una imagen y el programa:

1. Analiza el contenido.
2. Identifica si es fotografía, ilustración, captura, logotipo o imagen con transparencia.
3. Prueba diferentes configuraciones.
4. Compara los resultados.
5. Evalúa el peso y la calidad.
6. Selecciona las mejores alternativas.

Permitir establecer un límite de peso máximo.

Por ejemplo:
- Conseguir un archivo inferior a 1 MB.
- Intentar mantener calidad visual superior.
- No modificar dimensiones.
- Informar si el objetivo no puede alcanzarse sin sacrificar calidad.

## 8. SISTEMA DE COMPARACIÓN

Crear una tabla de resultados con estas columnas:

- Formato.
- Modo de compresión.
- Nivel de calidad.
- Tamaño final.
- Ahorro en KB.
- Reducción porcentual.
- Tiempo empleado.
- Estado de integridad.

Ejemplo de presentación:

| Formato | Calidad | Peso | Reducción |
|---|---:|---:|---:|
| PNG original | Original | 2,60 MB | 0 % |
| WebP Lossless | Sin pérdida | Resultado real | Resultado real |
| WebP | 95 % | Resultado real | Resultado real |
| WebP | 90 % | Resultado real | Resultado real |
| AVIF Lossless | Sin pérdida | Resultado real | Resultado real |
| AVIF | 95 % | Resultado real | Resultado real |
| AVIF | 90 % | Resultado real | Resultado real |

No utilizar cifras ficticias. Todos los valores deben proceder de archivos realmente generados.

## 9. VISUALIZACIÓN ANTES Y DESPUÉS

Crear un comparador visual premium.

Debe permitir:

- Visualizar imagen original.
- Visualizar imagen comprimida.
- Comparación lateral.
- Comparación mediante deslizador.
- Zoom.
- Ampliación.
- Comprobación de transparencia mediante fondo de cuadrícula.
- Visualización de dimensiones.
- Visualización del peso original y final.

Añadir un indicador que permita distinguir:

- Sin pérdida verificada.
- Con pérdida.
- No verificado.

## 10. VERIFICACIÓN MATEMÁTICA DE CALIDAD

Implementar un verificador independiente del motor de compresión.

Para los formatos sin pérdida:

1. Abrir la imagen original.
2. Decodificar el archivo resultante.
3. Normalizar ambas imágenes a una representación común sin perder información.
4. Comparar dimensiones.
5. Comparar profundidad de color.
6. Comparar canales.
7. Comparar valores RGBA de todos los píxeles.
8. Comparar los valores RGB de píxeles transparentes cuando corresponda.
9. Generar un resultado de verificación.

Cuando se exija equivalencia visual exacta, también deben contemplarse perfiles ICC, gestión de color y metadatos relevantes.

El sistema debe diferenciar entre:
- Igualdad exacta de píxeles.
- Equivalencia visual tras gestión de color.
- Archivo con pérdida.
- Verificación incompleta.

No etiquetar como sin pérdida un archivo que no haya superado las comprobaciones correspondientes.

## 11. PROCESAMIENTO POR LOTES

Permitir:

- Arrastrar cientos de imágenes.
- Seleccionar carpetas completas.
- Procesar subcarpetas opcionalmente.
- Seleccionar formatos de salida.
- Aplicar una configuración común.
- Configurar límites de peso.
- Elegir carpeta de destino.
- Mantener estructura de carpetas.
- Saltar archivos ya procesados.
- Cancelar procesos.
- Reanudar tareas pendientes cuando sea técnicamente posible.

Implementar procesamiento concurrente controlado para no saturar ordenadores con poca memoria RAM.

## 12. CONVERSIÓN DE FORMATOS

Admitir:

- PNG.
- JPG/JPEG.
- WebP.
- AVIF.
- BMP.
- TIFF.

Formatos de salida:

- WebP.
- AVIF.
- PNG.
- JPG.

No convertir automáticamente una imagen a un formato que implique pérdida cuando el usuario haya seleccionado sin pérdida.

Conservar las dimensiones originales por defecto.

## 13. HISTORIAL

Crear un historial local con:

- Nombre del archivo.
- Fecha.
- Formato de origen.
- Formato de destino.
- Peso original.
- Peso final.
- Ahorro.
- Configuración utilizada.
- Resultado de verificación.
- Ubicación del archivo.

Permitir abrir la carpeta, repetir la operación y eliminar registros.

## 14. CONFIGURACIÓN

Incluir:

- Carpeta de destino predeterminada.
- Nivel de concurrencia.
- Calidad predeterminada.
- Formato predeterminado.
- Modo de compresión.
- Conservación de metadatos.
- Conservación de perfiles ICC.
- Conservación de transparencia.
- Sobrescritura de archivos.
- Avisos de finalización.

## 15. SEGURIDAD Y CONSERVACIÓN DE ARCHIVOS

Nunca sobrescribir el original por defecto.

Generar los archivos resultantes en una carpeta independiente.

Implementar:
- Validación de archivos.
- Control de errores.
- Gestión de archivos corruptos.
- Protección ante interrupciones.
- Limpieza de archivos temporales.
- Registro de errores.
- Comprobación de espacio disponible.

## 16. RENDIMIENTO

Optimizar especialmente para ordenadores con:

- 8 GB de RAM.
- Procesadores de bajo consumo.
- Windows 11.
- Almacenamiento SSD o HDD.

No cargar todas las imágenes de un lote simultáneamente en memoria.

Utilizar procesamiento por bloques cuando resulte apropiado.

Evitar procesos redundantes.

Permitir ajustar el nivel de concurrencia.

## 17. INSTALADOR WINDOWS

Generar un instalador profesional:

PIXELFORGE-Setup.exe

Debe incluir:
- Instalación sencilla.
- Acceso directo en escritorio opcional.
- Entrada en el menú Inicio.
- Desinstalador.
- Inclusión de dependencias.
- Funcionamiento sin conexión.
- Versión y número de compilación.

La aplicación debe ejecutarse directamente desde Windows sin abrir terminales ni ventanas de consola.

## 18. PRUEBAS Y CONTROL DE CALIDAD

Antes de considerar terminado el proyecto, probar:

- Fotografías PNG.
- Ilustraciones.
- Logotipos.
- Capturas de pantalla.
- Imágenes con transparencia.
- Imágenes con degradados.
- Imágenes de gran tamaño.
- Imágenes con perfiles ICC.
- Imágenes de 8 y 16 bits.

Verificar:
- Exactitud de los resultados sin pérdida.
- Compatibilidad de los archivos generados.
- Funcionamiento de WebP.
- Funcionamiento de AVIF.
- Conservación de transparencias.
- Comparación visual.
- Procesamiento por lotes.
- Instalación y desinstalación.
- Consumo de memoria.

No considerar finalizada ninguna funcionalidad que únicamente tenga una interfaz visual sin implementación real.

## 19. METODOLOGÍA DE DESARROLLO

Trabaja por fases:

FASE 1: Arquitectura, estructura del proyecto y diseño visual.

FASE 2: Integración de los motores reales de compresión.

FASE 3: Conversión WebP y AVIF.

FASE 4: Compresión sin pérdida y verificación matemática.

FASE 5: Compresión con pérdida y perfiles de calidad.

FASE 6: Procesamiento por lotes.

FASE 7: Comparador visual y estadísticas.

FASE 8: Historial y configuración.

FASE 9: Pruebas de funcionamiento y rendimiento.

FASE 10: Generación del instalador definitivo.

Cada fase debe quedar funcional antes de avanzar a la siguiente.

## 20. CRITERIOS DE ACEPTACIÓN

El proyecto solamente se considerará terminado cuando:

- La aplicación sea funcional.
- Todas las secciones estén implementadas.
- Los motores de compresión sean reales.
- WebP y AVIF generen archivos válidos.
- Los modos sin pérdida superen las verificaciones.
- Los modos con pérdida informen claramente de su naturaleza.
- Los resultados muestren pesos reales.
- El procesamiento por lotes funcione.
- El historial funcione.
- La interfaz tenga acabado profesional.
- El instalador funcione en Windows 11.
- No haya errores críticos pendientes.

## INSTRUCCIÓN FINAL

Actúa como un equipo profesional formado por arquitectos de software, desarrolladores especializados en procesamiento de imágenes, ingenieros de rendimiento y diseñadores de interfaces de escritorio.

No simplifiques el proyecto eliminando funcionalidades.

No sustituyas motores reales por simulaciones.

No inventes porcentajes de compresión.

No prometas reducciones de peso que no hayan sido medidas.

Prioriza siempre la fidelidad de imagen, la eficiencia de compresión, la estabilidad y la experiencia de usuario.

El resultado debe ser un producto de escritorio profesional, completo, autónomo y listo para distribuir mediante su instalador de Windows 11.

Antes de implementar cada fase, analiza la arquitectura y las dependencias necesarias. Después, desarrolla, ejecuta pruebas reales y corrige los errores encontrados.

No des por terminada una tarea hasta haber comprobado que funciona.