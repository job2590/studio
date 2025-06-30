# **App Name**: Calculadora de Valor BOB

## Core Features:

- Entrada Inicial de BOB: Campo de entrada para la cantidad inicial gastada en BOB.
- Tasa de Compra de Entrada: Campo de entrada para la tasa de compra de BOB/USDT utilizada en la transacción de Binance P2P.
- Entrada de Saldo USDT Actual: Campo de entrada para la cantidad actual de USDT restante en la billetera (por ejemplo, después de transferir a Redotpay).
- Tipo de Cambio Oficial (Tiempo Real): La aplicación obtiene automáticamente el tipo de cambio oficial actual de BOB/USDT en tiempo real utilizando una API externa como herramienta (por ejemplo, la API de Redotpay, la API del Banco Central o cualquier otra fuente confiable). Opcionalmente, el usuario puede ingresar manualmente esta tasa si es necesario, para mayor flexibilidad.
- Calcular Valor BOB: Utilizando el saldo actual de USDT y el tipo de cambio oficial en tiempo real, la aplicación calcula: - El valor BOB disponible que tiene actualmente el usuario. - La reducción porcentual en comparación con la cantidad inicial de BOB gastada.
- Pantalla Inicial de BOB: Muestra la cantidad original gastada en BOB.
- Pantalla de BOB Disponible: Muestra la cantidad calculada de BOB disponible para gastar según el tipo de cambio oficial.
- Pantalla de Reducción Porcentual: Muestra el porcentaje de reducción en el poder adquisitivo (cuánto valor se perdió debido a la diferencia de tipo de cambio).
- Modo Oscuro/Claro: Permite al usuario cambiar entre el modo oscuro y el modo claro.

## Style Guidelines:

- Azul moderado (#5DADE2), para transmitir confianza y estabilidad financiera.
- Azul grisáceo claro (#EBF5FB), para una apariencia limpia y profesional.
- Verde suave (#A3E4D7), para resaltar resultados positivos o valor disponible.
- Use 'Inter' (sans-serif) para todos los encabezados y el texto del cuerpo para garantizar la legibilidad y un aspecto moderno.
- Utilice iconos simples basados en líneas para representar la moneda, los cálculos y la información/ayuda.
- Mantenga el diseño limpio y sencillo, con campos de entrada y pantallas de resultados claramente separados para evitar confusiones.
- Aplique animaciones sutiles en las actualizaciones de valores para reflejar los cambios de forma dinámica y mejorar la experiencia del usuario.