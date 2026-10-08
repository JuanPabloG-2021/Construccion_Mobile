# Bitácora completa de desarrollo con IA

## Información general

- **Proyecto:** Aplicación móvil de reserva de clases de inglés
- **Tecnologías:** React Native, JavaScript, Expo Go, React Navigation, AsyncStorage e Ionicons
- **Ubicación de referencia:** Medellín, Colombia
- **Zona horaria:** GMT-05:00
- **Periodo de conversación disponible:** 4 al 7 de octubre de 2026
- **Objetivo:** documentar las preguntas, respuestas, decisiones técnicas, errores, correcciones y estado actual del proyecto.

> **Nota sobre horas:** el registro disponible solo aporta una hora de referencia explícita al inicio de la sesión (4 de octubre de 2026, 13:40 GMT-05:00) y la hora actual al cierre (7 de octubre de 2026, 22:11 GMT-05:00). No se inventan horas individuales para mensajes que no disponen de marca temporal.

---

# 4 de octubre de 2026

## 13:40 GMT-05:00 — Arquitectura inicial de reservas

### Pregunta / tema
Se analizó la responsabilidad de `ReservasContext`, `ReservasProvider`, `addReservation`, carga de reservas, `useStorage` y `AsyncStorage`.

### Conclusión
Se estableció inicialmente la siguiente separación:

```text
Pantallas
   ↓
useReserva
   ↓
ReservasContext
   ↓
ReservasProvider
   ↓
useStorage / AsyncStorage
```

- `reservas`: estado en memoria.
- `ReservasContext`: mecanismo para compartir el estado.
- `ReservasProvider`: administra estado y operaciones de reservas.
- `useReserva`: custom hook para consumir el contexto.
- `useStorage`: abstracción genérica de persistencia.
- `AsyncStorage`: almacenamiento persistente del dispositivo.

---

## Context, Provider y `useReserva`

### Pregunta
Se preguntó si el Context podía verse como una “caja” y qué función realizaba `useReserva`.

### Respuesta
La “caja” real es principalmente el estado mantenido dentro del Provider. El Context permite distribuirlo y `useReserva` simplifica su consumo desde las pantallas.

```text
ReservasProvider
├── reservas
├── loading
└── operaciones
       ↓
ReservasContext
       ↓
useReserva()
       ↓
Pantallas
```

---

## Análisis de `useAsyncStorage`

### Tema
Se revisó el uso de `useEffect`, `useCallback`, `AsyncStorage.getItem` y `AsyncStorage.setItem`.

### Conclusiones
- `useEffect` realiza la carga inicial automáticamente.
- `useCallback` memoriza una función, no la ejecuta automáticamente.
- `update(newValue)` actualiza el estado administrado por el hook y persiste el valor.
- `ready` permite saber si terminó la carga inicial.

```text
useEffect → lectura automática
useCallback → función estable para actualizar/persistir
```

---

## Decisión: `useStorage` fuera del flujo de reservas

Tras revisar el `ReservasProvider`, se observó que ya tenía:

- `reservas` y `loading`.
- carga mediante `AsyncStorage.getItem`.
- persistencia mediante `AsyncStorage.setItem`.
- `addReservation`.

### Decisión del proyecto
Por el momento no se utilizaría `useStorage.js` en reservas. Se mantendría la persistencia directamente en `ReservasProvider` y se reconsideraría `useStorage` al desarrollar Perfil.

---

## Protección con `if (loading) return`

Se aclaró que:

```js
if (loading) return;
```

evita que el efecto de persistencia guarde el arreglo inicial vacío antes de recuperar las reservas existentes.

```text
Inicio → reservas=[] / loading=true → no guardar
Carga completada → loading=false → permitir persistencia
```

---

## Integración de `DetalleClaseScreen`

### Flujo acordado

```text
Botón Reservar
   ↓
reservar()
   ↓
addReservation(clase, horario)
   ↓
setReservas(...)
   ↓
useEffect
   ↓
AsyncStorage
```

La pantalla no debe persistir directamente en AsyncStorage.

---

## Montaje de `ReservasProvider`

Se detectó que el Provider debía envolver las pantallas que consumieran reservas.

```text
SafeAreaProvider
   ↓
ReservasProvider
   ↓
NavigationContainer
   ↓
MainTabs
```

---

## `ReservasScreen` y renderizado

Se estableció que `ReservasScreen` no debe ejecutar una nueva carga desde AsyncStorage. Consume `reservas` y `loading` desde el Context.

### Error encontrado

```text
TypeError: Cannot read property 'titulo' of undefined
```

El código utilizaba conceptualmente:

```js
reservas[0]?.clase.titulo
```

pero una reserva guardada tenía estructura plana:

```js
{
  id,
  title,
  level,
  teacher,
  price,
  schedule,
  creadoEn
}
```

Por tanto el acceso correcto era:

```js
reservas[0]?.title
```

### Aprendizaje
La estructura de la clase original y la estructura de `newReservation` eran diferentes.

---

# Desarrollo de validación de horarios

## Depuración de `horario`

Se recomendó utilizar `console.log()` para estudiar los valores reales:

```js
console.log('HORARIO:', horario);
console.log('RESERVAS:', reservas);
```

Comando habitual de Expo:

```bash
npx expo start
```

Y para limpiar caché cuando fuese necesario:

```bash
npx expo start --clear
```

---

## Acceso a los horarios guardados

Se aclaró que `reservas` es un arreglo, por lo que no existe:

```js
reservas.schedule
```

Para una reserva concreta:

```js
reservas[0].schedule
```

Y para comprobar todas las reservas se introdujo `.some()`.

---

## Aprendizaje de `.some()`

`.some()` responde si existe al menos un elemento que cumple una condición y siempre devuelve `true` o `false`.

```js
const existe = reservas.some(
  (reserva) => reserva.schedule === horario
);
```

Se comparó también con `.forEach()`:

- `.forEach()` realiza una acción por cada elemento.
- `.some()` busca si al menos uno satisface una condición.

---

## Evolución: duración y cruces reales

Se identificó que comparar solo horarios exactos era insuficiente porque las clases tenían `duracion` en minutos.

Se decidió guardar también:

```js
duration: clase.duracion
```

Cada reserva pasó conceptualmente a ser un intervalo:

```text
día + inicio + fin
```

Ejemplo:

```text
Vie 5:00 p.m. + 90 min
→ inicio 17:00
→ fin 18:30
```

### Fórmula de solapamiento adoptada

Dos intervalos del mismo día se cruzan cuando:

```js
newHour < existingEndTime &&
newEndTime > existingHour
```

junto con:

```js
existingDay === newDay
```

Esta fórmula cubre también el caso en que una clase nueva contiene completamente a una reserva existente.

---

## Separación de día y hora

Para:

```text
Vie 5:00 p.m.
```

se utilizó `split(' ')` para obtener el día y reconstruir la hora.

```js
const [day, ...remaining] = horario.split(' ');
const hourText = remaining.join(' ');
```

---

## Conversión de hora a minutos

Se desarrolló una función auxiliar para convertir:

```text
5:00 p.m. → 1020
6:30 p.m. → 1110
```

Se explicó que no hacía falta utilizar `Date` y que había que contemplar correctamente `12 a.m.` y `12 p.m.`.

La representación elegida fue “minutos transcurridos desde las 00:00”.

---

## Validación final con `.some()`

La validación evolucionó a:

```js
const verifyConflict = reservas.some((reserva) => {
    const [existingDay, ...existingSchedule] = reserva.schedule.split(' ');
    const existingHour = convertHoursToMinutes(existingSchedule.join(' '));
    const existingEndTime = existingHour + reserva.duration;

    return (
        existingDay === newDay &&
        newHour < existingEndTime &&
        newEndTime > existingHour
    );
});
```

---

## Error de `useCallback` con reservas antiguas

### Problema
`addReservation` estaba declarado con:

```js
}, [])
```

pero utilizaba `reservas` dentro del callback.

El callback conservaba el valor inicial del arreglo, por lo que la validación no detectaba conflictos actualizados.

### Corrección

```js
}, [reservas])
```

Así `addReservation` se actualiza cuando cambia `reservas`.

---

## Manejo del resultado de `addReservation`

Se acordó separar:

- reglas de negocio en el Provider;
- reacción visual en `DetalleClaseScreen`.

`addReservation` debe devolver resultados consistentes:

```js
{ ok: false }
```

si existe conflicto y:

```js
{ ok: true }
```

cuando la reserva se añade correctamente.

Esto permite evitar disminuir cupos cuando no se puede reservar.

---

## Diferencia entre los `return` de `setReservas` y `addReservation`

Se explicó que:

```js
return prevReservations;
```

dentro del setter significa “este será el nuevo estado”.

En cambio:

```js
return { ok: false };
```

desde `addReservation` comunica el resultado a la pantalla.

Se detectó también el error:

```text
Cannot read property 'ok' of undefined
```

porque el camino exitoso de `addReservation` no devolvía ningún objeto.

---

## Limpieza temporal de reservas

Para eliminar datos generados durante pruebas se creó:

```js
const clearReservations = async () => {
    await AsyncStorage.removeItem(KEY_RESERVATIONS);
    setReservas([]);
};
```

Se identificó un error `undefined is not a function` que inicialmente apuntó a la exposición en Context, pero finalmente el usuario detectó que había colocado `clearReservations` después del `return` del Provider.

---

# Diseño de `ReservationScreen`

Se pasó de una lista sin estilos a una propuesta de cards con jerarquía:

```text
Card
├── Nivel
├── Título
├── Profesor + avatar
├── Horario + duración
└── Precio + Cancelar
```

### Recomendaciones principales

- `FlatList` para múltiples reservas.
- `flexDirection: 'row'` en filas.
- `justifyContent: 'space-between'` para precio y acción.
- `gap` para separación.
- chips para nivel.
- tarjetas con `borderRadius`, `padding`, `borderColor` y `backgroundColor`.
- tratar `Clear Reservations` como herramienta temporal de desarrollo.

Se detectó que para mostrar `item.avatar` tendría que existir ese campo en `newReservation`.

---

# Desarrollo del Perfil

## Modelo de datos

Se decidió que el perfil se representa como un único objeto, no un arreglo:

```js
const [usuario, setUsuario] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    foto: null
});
```

### Principio importante
Los componentes visuales pueden estar separados, pero todos modifican la misma entidad `usuario`.

---

## `ProfileTextInput`

Se identificó el patrón común de los campos de nombre, correo y teléfono.

Se creó un componente reutilizable:

```text
ProfileTextInput
├── label
├── value
├── onChangeText
└── placeholder
```

Se aclaró que el botón “Crear perfil” no debe estar dentro de `ProfileTextInput`, porque sería repetido una vez por campo. Debe vivir en `CreateProfileScreen`.

---

## Uso de `.map()` para generar inputs

Se introdujo un arreglo descriptivo:

```js
const campos = [
  { key: 'nombre', ... },
  { key: 'correo', ... },
  { key: 'telefono', ... }
];
```

Y la lectura dinámica:

```js
user[item.key]
```

Se explicó que:

```js
user['nombre'] === user.nombre
```

---

## Error de importación de `ProfileTextInput`

### Error

```text
Element type is invalid ... got: undefined
```

### Causa
El componente tenía `export default`, pero se importaba con llaves.

### Corrección

```js
import ProfileTextInput from '../components/ProfileTextInput.js';
```

No:

```js
import { ProfileTextInput } from ...
```

---

# Foto de perfil

Se discutió la posibilidad de subir imágenes desde galería.

### Restricción del proyecto
Con las dependencias instaladas no se implementaría selección de imágenes desde galería sin añadir otra librería.

### Decisión
Usar una imagen fija incluida en `assets` para el perfil.

Por tanto no se necesita persistir una fotografía seleccionada dinámicamente.

### Renderizado de imagen local
Se detectó que esto era incorrecto:

```jsx
<Image source={{ uri: 'assets/Profile.jpg' }} />
```

Para un recurso local se adoptó:

```jsx
<Image source={require('../../assets/Profile.jpg')} />
```

---

# Navegación del Perfil

Se decidió que Perfil debía ser un Stack dentro de la pestaña principal:

```text
MainTabs
└── Perfil
    └── PerfilStack
        ├── ProfileScreen
        ├── CreateProfileScreen
        └── futura EditProfileScreen
```

### Flujo sin perfil

```text
ProfileScreen
   ↓
EstadoVacio
   ↓
Crear perfil
   ↓
CreateProfileScreen
```

### Flujo con perfil

```text
ProfileScreen
   ↓
mostrar datos del perfil
```

---

## Reutilización de `EstadoVacio`

El componente ya soportaba:

```text
icono
titulo
mensaje
```

por lo que podía reutilizarse tanto en Reservas como en Perfil.

Se corrigió la firma de pantalla de React Navigation:

```js
function ProfileScreen({ navigation })
```

en lugar de:

```js
function ProfileScreen(navigation)
```

---

## Aprendizaje de Flexbox con `EstadoVacio`

El componente tenía `flex: 1`, lo que provocaba que absorbiera el espacio disponible y empujara el botón al fondo.

Se explicó:

- `flex: 1`: participa y crece para ocupar espacio disponible.
- `justifyContent`: distribuye en el eje principal.
- `alignItems`: distribuye en el eje secundario.
- con `flexDirection: 'column'`, `justifyContent` controla principalmente la vertical.

Se recomendó agrupar:

```text
ProfileScreen
└── contenidoVacio
    ├── EstadoVacio
    └── botón Crear perfil
```

Y retirar `flex: 1` del contenedor interno de `EstadoVacio` cuando debe funcionar como componente reutilizable dentro de otros bloques.

Posteriormente se detectó que reutilizar `styles.contenido` para el estado vacío había eliminado `alignItems: 'center'`, estirando el botón de lado a lado.

Se recomendó un estilo independiente `contenidoVacio`.

---

# Diseño de `CreateProfileScreen`

La propuesta visual adoptada fue:

```text
Portada con color primario
       ↓
avatar circular superpuesto
       ↓
Título / formulario
       ↓
Nombre
Correo
Teléfono
       ↓
Guardar
```

Para superponer el avatar se propuso utilizar un margen superior negativo sobre un círculo centrado.

---

# Reintroducción de `useStorage` para Perfil

Al llegar al perfil se retomó la decisión inicial de evaluar `useStorage`.

La función:

```js
const update = useCallback(
    async (newValue) => {
        setStoredValue(newValue);
        try {
            await AsyncStorage.setItem(key, JSON.stringify(newValue));
        } catch (error) {
            ...
        }
    },
    [key]
);
```

se interpretó como:

```text
update(newValue)
├── actualiza storedValue en memoria
└── persiste newValue en AsyncStorage
```

`useCallback` mantiene la referencia de la función, pero no ejecuta el guardado hasta que se llama a `update()`.

---

## Diferencia entre `usuario` y `profile`

Se definió:

```text
usuario/user
→ estado temporal del formulario

profile
→ storedValue administrado por useStorage
```

`update(user)` actúa como puente entre ambos.

---

## Error de la llave de AsyncStorage

Se obtuvo un error parecido a:

```text
the bind value at index 1 is null
```

Se detectó una llamada incorrecta del estilo:

```js
useAsyncStorage(profile, null)
```

sin una key válida.

Se definió:

```js
const KEY_PROFILE = '@profile_mj20';
```

Y se utilizó:

```js
useStorage(KEY_PROFILE, null)
```

Se recordó además que si el hook retorna un arreglo debe consumirse mediante `[]`:

```js
const [profile, update, ready] = useStorage(KEY_PROFILE, null);
```

---

# `ProfileContext` y `ProfileProvider`

Para compartir el perfil entre `CreateProfileScreen` y `ProfileScreen`, se creó un Context específico.

Arquitectura:

```text
ProfileProvider
   ↓
useStorage(KEY_PROFILE, null)
   ↓
profile / update / ready
   ↓
ProfileContext
   ↓
useProfile()
   ↓
ProfileScreen + CreateProfileScreen
```

Se definió una operación de dominio:

```js
const createProfile = async (user) => {
    await update(user);
};
```

Se explicó que el Provider no conoce automáticamente el estado local: `CreateProfileScreen` se lo entrega mediante:

```js
createProfile(user)
```

---

## Dos Providers en `App.js`

La organización conceptual pasó a:

```text
SafeAreaProvider
└── ReservasProvider
    └── ProfileProvider
        └── NavigationContainer
            └── MainTabs
```

Los Providers mantienen dominios independientes.

---

## Error `iterator method is not callable`

### Problema
En `ProfileScreen` se hizo:

```js
const [profile, ready] = useProfile();
```

pero el Context exponía un objeto:

```js
{
  profile,
  ready,
  createProfile
}
```

### Corrección

```js
const { profile, ready } = useProfile();
```

Se reforzó la regla:

```text
Array  → destructuración []
Objeto → destructuración {}
```

También se recomendó corregir el mensaje de error copiado en `useProfile` para que mencione `ProfileProvider` y no `ReservasProvider`.

---

# Diseño de `ProfileScreen`

Se recomendó conservar consistencia con creación:

```text
Portada
Avatar fijo
Nombre destacado
Información personal
Editar perfil
```

Para nombre, correo y teléfono se creó el concepto reutilizable `ProfileInfo`.

### Estructura recomendada

```text
ProfileInfo
├── icono
├── información (flex: 1)
│   ├── etiqueta
│   └── valor
└── acción
```

Se corrigió un diseño donde `flexDirection: 'row'` estaba aplicado al contenedor equivocado. Se recomendó ponerlo en la card principal y usar `flex: 1` únicamente en el bloque de información para empujar la acción hacia la derecha.

---

## Iteración de datos del perfil

Se detectó otro punto importante: `profile` es un objeto y no permite:

```js
profile.map(...)
```

Se creó `profileFields` como array descriptivo:

```js
[
  { key: 'nombre', etiqueta: 'Nombre', icono: 'person-outline' },
  { key: 'correo', etiqueta: 'Correo electrónico', icono: 'mail-outline' },
  { key: 'telefono', etiqueta: 'Teléfono', icono: 'call-outline' }
]
```

Y se utilizó:

```js
profile[item.key]
```

para obtener cada valor.

---

# Estrategia de edición

Se compararon dos alternativas:

1. convertir cada dato directamente en `TextInput` al pulsar “Editar”;
2. disponer de un único botón “Editar perfil” y navegar a `EditProfileScreen`.

### Decisión recomendada
La segunda opción es más sencilla y escalable.

```text
ProfileScreen
   ↓
Editar perfil
   ↓
EditProfileScreen
   ↓
ProfileTextInput reutilizados
   ↓
updateProfile(user)
```

Esto permite reutilizar los componentes ya creados para el formulario.

---

# Guardado y navegación tras crear el perfil

Se recomendó encapsular:

```js
const handleCreateProfile = async () => {
    await createProfile(user);
    navigation.goBack();
};
```

como alternativa a navegar explícitamente de nuevo a `ProfileScreen`, ya que esta última era la pantalla anterior del Stack.

Se habló también de notificaciones temporales tipo toast. Sin añadir librerías, podrían construirse con estado + `setTimeout`; si se navega inmediatamente, la notificación tendría que vivir en la pantalla destino o en un nivel global para no desmontarse con `CreateProfileScreen`.

---

# Tipos de teclado y validaciones del formulario

Se amplió `ProfileTextInput` para aceptar una configuración del teclado.

Campos:

```text
nombre   → default
correo   → email-address
teléfono → phone-pad
```

### Error detectado
Desde el formulario se pasaba:

```js
keyboard={item.keyboard}
```

pero el componente utilizaba:

```js
keyboardType={type}
```

`type` era `undefined`, por lo que siempre aparecía el teclado por defecto.

### Corrección
Utilizar el mismo nombre de prop de extremo a extremo, por ejemplo:

```js
keyboardType={keyboard}
```

También se corrigió:

```js
value={item.value}
```

porque `item.value` no existía. La fuente correcta era:

```js
value={user[item.key]}
```

---

# Validación de campos vacíos

Se propuso:

```js
const hayCamposVacios = Object.values(user).some(
    (value) => !value || value.trim() === ''
);
```

Y si existe algún campo vacío:

```text
Alert
↓
return
↓
NO crear perfil
```

### Error final encontrado
El estado se había inicializado como:

```js
const [user, setUser] = useState([]);
```

Por ello:

```js
Object.values(user)
```

producía inicialmente:

```js
[]
```

Y:

```js
[].some(...)
```

devuelve `false`, permitiendo guardar un perfil vacío.

### Corrección final

```js
const [user, setUser] = useState({
    nombre: '',
    correo: '',
    telefono: ''
});
```

Así:

```js
Object.values(user)
```

produce inicialmente:

```js
['', '', '']
```

y la validación funciona correctamente.

---

# Estado actual de la arquitectura

```text
App
│
├── SafeAreaProvider
│
├── ReservasProvider
│   ├── reservas
│   ├── loading
│   ├── addReservation
│   └── clearReservations (temporal)
│
├── ProfileProvider
│   ├── profile
│   ├── ready
│   ├── createProfile
│   └── useStorage
│
└── NavigationContainer
    └── MainTabs
        ├── Clases
        │   └── ClasesStack
        ├── Reservas
        │   └── ReservationScreen
        └── Perfil
            └── ProfileStack
                ├── ProfileScreen
                ├── CreateProfileScreen
                └── futura EditProfileScreen
```

---

# Estado funcional actual

## Reservas

Implementado o comprendido:

- creación de reservas;
- persistencia con AsyncStorage;
- consulta desde `ReservasScreen`;
- renderizado con `FlatList`;
- almacenamiento de duración;
- conversión de horarios a minutos;
- detección de solapamientos del mismo día;
- `useCallback` dependiente de `reservas`;
- retorno `{ ok: false }` ante conflicto;
- evitar reducción de cupos si la reserva no puede crearse;
- limpieza temporal de datos para pruebas.

Pendiente:

- cancelación real individual de reservas;
- eliminar herramientas de desarrollo como “Clear Reservations”;
- terminar estilos definitivos.

## Perfil

Implementado o comprendido:

- `ProfileTextInput` reutilizable;
- generación de inputs mediante `.map()`;
- estado de formulario como objeto;
- `ProfileContext` y `ProfileProvider`;
- `useProfile`;
- persistencia mediante `useStorage`;
- key `@profile_mj20`;
- creación del perfil;
- detección de perfil inexistente con `EstadoVacio`;
- navegación hacia creación mediante Stack;
- renderizado de datos del perfil;
- imagen fija desde `assets/Profile.jpg`;
- `ProfileInfo` reutilizable;
- tipos de teclado por campo;
- validación de campos vacíos.

Pendiente:

- validar formato del correo;
- definir reglas finales del teléfono (longitud/formato);
- crear `EditProfileScreen`;
- implementar actualización del perfil reutilizando `ProfileTextInput`;
- decidir diseño final del feedback de creación/edición;
- limpiar funciones y textos temporales de depuración.

---

# Decisiones técnicas vigentes

1. **Reservas** mantiene persistencia directamente en `ReservasProvider` por ahora.
2. **Perfil** utiliza `ProfileProvider` + `useStorage` + AsyncStorage.
3. `profile` es un objeto, no un array.
4. `user` es el estado temporal del formulario y también debe ser objeto.
5. La foto de perfil será fija desde `assets/Profile.jpg`.
6. No se añadirán nuevas librerías para selección de imágenes.
7. `ProfileScreen` será la pantalla inicial del Stack de Perfil.
8. Si no existe perfil, se muestra `EstadoVacio` y la acción “Crear perfil”.
9. Para edición se prefiere una pantalla `EditProfileScreen` completa en lugar de editar cada campo en línea.
10. Las reglas de negocio pertenecen a Providers/funciones de dominio; las pantallas manejan interacción y feedback visual.

---

# Principales aprendizajes de JavaScript / React Native durante la conversación

- diferencia entre objetos `{}` y arrays `[]`;
- destructuración de arrays frente a objetos;
- `.map()` para transformar/renderizar colecciones;
- `.some()` para responder si algún elemento cumple una condición;
- `Object.values()` para recorrer valores de un objeto;
- propiedades dinámicas con `obj[key]`;
- `useCallback` y sus dependencias;
- `useEffect` para efectos automáticos;
- diferencia entre estado local y persistencia;
- Context + Provider para compartir estado;
- `flex: 1`, `justifyContent`, `alignItems` y `flexDirection`;
- diferencias entre imágenes locales con `require()` y remotas mediante `uri`;
- `keyboardType` para adaptar el teclado del dispositivo;
- early return para detener operaciones inválidas;
- separación entre lógica de dominio, persistencia y presentación.
