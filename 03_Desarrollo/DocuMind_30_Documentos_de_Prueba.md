# 📁 Repositorio de 30 Documentos de Prueba de Alta Fidelidad - DocuMind V1.0

Este documento contiene la estructura lógica, contenido textual y metadatos esperados para el **set de 30 documentos de prueba obligatorios (Entregable 11)** de las Unidades Tecnológicas de Santander (UTS). 

Está optimizado para que lo copies y lo pegues directamente en **Antigravity Pro**, de modo que su agente de IA pueda generar automáticamente los archivos físicos correspondientes en los formatos especificados (`.pdf`, `.docx`, `.txt`) y verificar tu base de datos relacional y vectorial.

---

## 🛠️ Script de Generación Automatizada (Python)

Si deseas crear los 30 archivos en tu máquina local de forma instantánea, puedes pedirle a **Antigravity Pro** que cree un script llamado `generar_pruebas.py` en la raíz de tu proyecto con el siguiente código base:

```python
import os
from docx import Document
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet

os.makedirs("repositorio-pruebas", exist_ok=True)

def crear_pdf(nombre, contenido):
    doc = SimpleDocTemplate(f"repositorio-pruebas/{nombre}", pagesize=letter)
    styles = getSampleStyleSheet()
    story = [Paragraph(contenido.replace("\n", "<br/>"), styles["Normal"])]
    doc.build(story)

def crear_docx(nombre, contenido):
    doc = Document()
    doc.add_paragraph(contenido)
    doc.save(f"repositorio-pruebas/{nombre}")

def crear_txt(nombre, contenido):
    with open(f"repositorio-pruebas/{nombre}", "w", encoding="utf-8") as f:
        f.write(contenido)

# Aquí puedes iterar sobre la lista de documentos que se detalla a continuación.
```

---

## ⚖️ Categoría A: 10 Contratos (Departamento Legal)

### Documento 01
*   **Nombre de Archivo:** `contrato_servicios_oriente_2026.pdf`
*   **Formato:** PDF
*   **Caso de Prueba Relacionado:** CP-05, CP-15 (Trazabilidad y citas de RAG)
*   **JSON de Metadatos Esperados:**
    ```json
    {
      "firmantes": ["Empresa Tecnológica del Oriente", "Sistemas Inteligentes S.A.S."],
      "vigencia": "12 meses (Hasta el 31 de Diciembre de 2026)",
      "penalizaciones": "Multa del 10% del valor de la factura mensual por cada semana de retraso en los entregables y cobro de mora del 2% adicional en caso de retraso de pagos."
    }
    ```
*   **Contenido del Archivo:**
    ```text
    CONTRATO DE PRESTACIÓN DE SERVICIOS TECNOLÓGICOS
    
    Entre los suscritos a saber, por una parte la Empresa Tecnológica del Oriente y por la otra parte Sistemas Inteligentes S.A.S., se ha convenido celebrar el presente contrato de prestación de servicios para el desarrollo e integración de APIs de Inteligencia Artificial.
    
    CLÁUSULA SEGUNDA - VIGENCIA: El presente contrato tendrá una vigencia de doce (12) meses, iniciando el 1 de Enero de 2026 y finalizando el 31 de Diciembre de 2026.
    
    CLÁUSULA OCTAVA - PENALIZACIONES Y MORA: En caso de incumplimiento de los tiempos de entrega pactados, el Contratista incurrirá en una multa equivalente al 10% del valor de la factura mensual por cada semana de retraso en los entregables. Adicionalmente, el Contratante pagará una mora del 2% adicional en caso de retraso de pagos vencidos.
    ```

### Documento 02
*   **Nombre de Archivo:** `convenio_practicas_uts_v2.docx`
*   **Formato:** DOCX
*   **Caso de Prueba Relacionado:** CP-03 (Convenios interinstitucionales)
*   **JSON de Metadatos Esperados:**
    ```json
    {
      "firmantes": ["Unidades Tecnológicas de Santander", "Software del Común Ltda."],
      "vigencia": "24 meses prorrogables",
      "penalizaciones": "Terminación unilateral del convenio sin derecho a indemnización con preaviso por escrito de 30 días calendario."
    }
    ```
*   **Contenido del Archivo:**
    ```text
    CONVENIO MARCO DE COOPERACIÓN PARA PRÁCTICAS ACADÉMICAS
    
    Celebrado entre las Unidades Tecnológicas de Santander (UTS), institución de educación superior pública, y la empresa aliada Software del Común Ltda. El propósito de este acuerdo es regular las prácticas profesionales de los estudiantes del programa de Tecnología en Desarrollo de Software.
    
    DURACIÓN Y VIGENCIA: Las partes acuerdan una vigencia inicial del convenio de veinticuatro (24) meses prorrogables de mutuo acuerdo.
    
    CAUSALES DE RESCISIÓN Y SANCIONES: El incumplimiento de los planes de formación académica dará lugar a la terminación unilateral del convenio sin derecho a indemnización, requiriendo únicamente un preaviso por escrito enviado con 30 días calendario de anticipación.
    ```

### Documento 03
*   **Nombre de Archivo:** `contrato_arrendamiento_oficinas.txt`
*   **Formato:** TXT
*   **JSON de Metadatos Esperados:**
    ```json
    {
      "firmantes": ["Inmobiliaria Ruiz & Asociados", "Sistemas Inteligentes S.A.S."],
      "vigencia": "36 meses",
      "penalizaciones": "Sanción económica equivalente a tres (3) cánones de arrendamiento mensuales en caso de entrega anticipada sin justa causa."
    }
    ```
*   **Contenido del Archivo:**
    ```text
    CONTRATO DE ARRENDAMIENTO COMERCIAL - OFICINA 402
    Arrendador: Inmobiliaria Ruiz & Asociados. Arrendatario: Sistemas Inteligentes S.A.S.
    Vigencia del contrato: 36 meses obligatorios a partir del 1 de Febrero de 2026.
    Penalizaciones por incumplimiento: En caso de desocupación anticipada o entrega del inmueble antes de la vigencia sin justa causa, se aplicará una sanción económica de tres cánones de arrendamiento mensuales.
    ```

### Documento 04
*   **Nombre de Archivo:** `contrato_confidencialidad_nda.pdf`
*   **Formato:** PDF
*   **JSON de Metadatos Esperados:**
    ```json
    {
      "firmantes": ["DocuMind Dev Team", "Inversiones Santander S.A."],
      "vigencia": "5 años a partir de la firma",
      "penalizaciones": "Indemnización de daños por valor de 50 SMMLV en caso de divulgación de secretos industriales o filtración de código."
    }
    ```
*   **Contenido del Archivo:**
    ```text
    ACUERDO DE CONFIDENCIALIDAD Y NO DIVULGACIÓN (NDA)
    
    El presente acuerdo regula el intercambio de secretos comerciales entre el equipo de desarrollo de DocuMind Dev Team y el cliente corporativo Inversiones Santander S.A.
    
    DURACIÓN DE LAS OBLIGACIONES: La reserva de la información confidencial se mantendrá vigente por un término de cinco (5) años a partir de la firma del presente documento.
    
    PENALIDAD POR FILTRACIÓN: La revelación no autorizada de código fuente o bases de datos dará lugar a una penalización tasada en una indemnización de daños equivalente a 50 SMMLV, sin perjuicio de las acciones penales a que haya lugar.
    ```

### Documento 05
*   **Nombre de Archivo:** `contrato_soporte_hosting.docx`
*   **Formato:** DOCX
*   **JSON de Metadatos Esperados:**
    ```json
    {
      "firmantes": ["Amazon Web Services Colombia", "Sistemas Inteligentes S.A.S."],
      "vigencia": "6 meses renovable",
      "penalizaciones": "Descuento del 15% sobre la factura del mes si el SLA de disponibilidad cae por debajo del 99.9%."
    }
    ```
*   **Contenido del Archivo:**
    ```text
    CONTRATO DE HOSPEDAJE CLOUD Y SLA
    Suscrito entre AWS Colombia y el cliente Sistemas Inteligentes S.A.S.
    Vigencia del servicio: 6 meses con renovación automática.
    Penalización de ANS: Si el Acuerdo de Nivel de Servicio (SLA) de la infraestructura del servidor cae por debajo del 99.9% en cualquier mes calendario, se aplicará un descuento de compensación del 15% en la factura del periodo inmediatamente posterior.
    ```

### Documento 06
*   **Nombre de Archivo:** `contrato_outsourcing_it.txt`
*   **Formato:** TXT
*   **JSON de Metadatos Esperados:**
    ```json
    {
      "firmantes": ["Soporte Remoto Bucaramanga", "Software del Común Ltda."],
      "vigencia": "Indefinido",
      "penalizaciones": "Cobro del 5% del valor mensual por cada hora de desconexión del servicio de mesa de ayuda."
    }
    ```
*   **Contenido del Archivo:**
    ```text
    CONTRATO DE OUTSOURCING DE MESA DE AYUDA TI
    Partes: Soporte Remoto Bucaramanga y Software del Común Ltda.
    Vigencia: Término indefinido previo mutuo acuerdo.
    Incumplimiento de Soporte: Se pacta una multa del 5% del valor total mensual del contrato por cada hora en que la mesa de soporte técnico telefónico se encuentre fuera de línea en días hábiles.
    ```

### Documento 07
*   **Nombre de Archivo:** `contrato_proveedor_papeleria.pdf`
*   **Formato:** PDF
*   **JSON de Metadatos Esperados:**
    ```json
    {
      "firmantes": ["Papeles y Copias Santander", "Unidades Tecnológicas de Santander"],
      "vigencia": "Hasta el 30 de Noviembre de 2026",
      "penalizaciones": "Cancelación automática de órdenes de compra pendientes y cobro del 1% diario por mora en suministros."
    }
    ```
*   **Contenido del Archivo:**
    ```text
    SUMINISTRO DE MATERIALES DE OFICINA Y PAPELERÍA
    Contratista: Papeles y Copias Santander. Contratante: Unidades Tecnológicas de Santander (UTS).
    Vigencia: Hasta el 30 de Noviembre de 2026.
    Sanciones por demora: El retraso de más de 3 días en el suministro de los folios requeridos generará una sanción moratoria del 1% diario acumulativo del valor del pedido y dará derecho a la cancelación automática de las órdenes pendientes.
    ```

### Documento 08
*   **Nombre de Archivo:** `contrato_consultoria_financiera.docx`
*   **Formato:** DOCX
*   **JSON de Metadatos Esperados:**
    ```json
    {
      "firmantes": ["Consultores Asociados del Norte", "Inversiones Santander S.A."],
      "vigencia": "3 meses de ejecución",
      "penalizaciones": "Pérdida total del derecho a cobro de la última cuota si el informe de auditoría se entrega extemporáneamente."
    }
    ```
*   **Contenido del Archivo:**
    ```text
    CONTRATO DE CONSULTORÍA EXTERNA Y AUDITORÍA
    Suscrito por Consultores Asociados del Norte e Inversiones Santander S.A.
    Plazo de Ejecución: 3 meses improrrogables.
    Cláusula Penal de Tiempo: La entrega tardía del informe de auditoría financiera final acarreará como penalidad la pérdida total del derecho a cobro de la última cuota equivalente al 30% del contrato.
    ```

### Documento 09
*   **Nombre de Archivo:** `contrato_mantenimiento_aires.txt`
*   **Formato:** TXT
*   **JSON de Metadatos Esperados:**
    ```json
    {
      "firmantes": ["Climas Fríos del Este", "Sistemas Inteligentes S.A.S."],
      "vigencia": "12 meses",
      "penalizaciones": "Cargo de copago de 100,000 COP si el técnico no asiste a la revisión programada en 24 horas."
    }
    ```
*   **Contenido del Archivo:**
    ```text
    MANTENIMIENTO PREVENTIVO DE CLIMATIZACIÓN
    Partes: Climas Fríos del Este y Sistemas Inteligentes S.A.S.
    Vigencia: 12 meses a partir de la firma de actas.
    Sanciones de atención: Si el contratista incumple la cita de revisión correctiva programada en menos de 24 horas desde el reporte, deberá asumir un cargo de copago de compensación por valor de 100,000 COP a favor del contratante.
    ```

### Documento 10
*   **Nombre de Archivo:** `contrato_seguridad_privada.pdf`
*   **Formato:** PDF
*   **JSON de Metadatos Esperados:**
    ```json
    {
      "firmantes": ["Vigilancia Real Ltda.", "Software del Común Ltda."],
      "vigencia": "24 meses",
      "penalizaciones": "Responsabilidad civil del 100% por pérdidas materiales ocurridas durante el turno de guardia no reportadas."
    }
    ```
*   **Contenido del Archivo:**
    ```text
    PRESTACIÓN DE SERVICIOS DE SEGURIDAD FISICA Y VIGILANCIA
    Arrendador de Seguridad: Vigilancia Real Ltda. Beneficiario: Software del Común Ltda.
    Vigencia: 24 meses continuos de prestación de servicio nocturno.
    Sanción de Cobertura: El contratista asumirá la responsabilidad civil y el pago del 100% del valor comercial de cualquier pérdida material o daño de equipos ocurridos en las instalaciones durante los turnos de guardia asignados.
    ```

---

## 💵 Categoría B: 10 Facturas (Departamento de Finanzas)

### Documento 11
*   **Nombre de Archivo:** `factura_essa_energia_v6.pdf`
*   **Formato:** PDF
*   **Caso de Prueba Relacionado:** CP-09 (Extracción de montos estructurados)
*   **JSON de Metadatos Esperados:**
    ```json
    {
      "emisor_nit": "890.201.223-4",
      "valor_total": 450000.00,
      "impuestos": 71850.00,
      "fecha_vencimiento": "2026-10-15"
    }
    ```
*   **Contenido del Archivo:**
    ```text
    ELECTRIFICADORA DE SANTANDER S.A. E.S.P. - ESSA
    NIT: 890.201.223-4
    FACTURA DE SERVICIOS PÚBLICOS - ENERGÍA ELÉCTRICA
    Fecha de Expedición: 01 de Septiembre de 2026.
    VALOR TOTAL DEL MES: $450,000 COP.
    Detalle de Impuestos Incluidos (IVA 19%): $71,850 COP.
    PAGO OBLIGATORIO ANTES DE: 2026-10-15. Evite suspensión del servicio.
    ```

### Documento 12
*   **Nombre de Archivo:** `factura_proveedor_octubre_101.docx`
*   **Formato:** DOCX
*   **JSON de Metadatos Esperados:**
    ```json
    {
      "emisor_nit": "900.812.333-2",
      "valor_total": 158500.00,
      "impuestos": 25300.00,
      "fecha_vencimiento": "2026-10-15"
    }
    ```
*   **Contenido del Archivo:**
    ```text
    TECNOLOGÍAS DE OFICINA S.A.S.
    NIT: 900.812.333-2
    FACTURA COMERCIAL DE VENTA No. FE-101
    Cliente: Sistemas Inteligentes S.A.S.
    Concepto: Resma de Papel Carta x10 y Suministros.
    Subtotal: $133,200. IVA (19%): $25,300.
    VALOR NETO A PAGAR: $158,500 COP.
    Fecha límite de pago establecida para transacciones: 2026-10-15.
    ```

### Documento 13
*   **Nombre de Archivo:** `factura_internet_claro.txt`
*   **Formato:** TXT
*   **JSON de Metadatos Esperados:**
    ```json
    {
      "emisor_nit": "800.153.990-1",
      "valor_total": 280000.00,
      "impuestos": 44700.00,
      "fecha_vencimiento": "2026-09-20"
    }
    ```
*   **Contenido del Archivo:**
    ```text
    CLARO COLOMBIA - COMUNICACIONES
    NIT emisor: 800.153.990-1
    Cuenta de cobro internet banda ancha Oficina 301.
    Valor mensual: $280,000 COP.
    Impuesto al consumo e IVA: $44,700 COP.
    Fecha de vencimiento para el recargo: 2026-09-20.
    ```

### Documento 14
*   **Nombre de Archivo:** `factura_host_digitalocean.pdf`
*   **Formato:** PDF
*   **JSON de Metadatos Esperados:**
    ```json
    {
      "emisor_nit": "912.443.001-9",
      "valor_total": 520000.00,
      "impuestos": 83016.00,
      "fecha_vencimiento": "2026-09-10"
    }
    ```
*   **Contenido del Archivo:**
    ```text
    DIGITALOCEAN CLOUD HOSTING SERVICES
    NIT Facturación Colombia: 912.443.001-9
    Factura de servicios de cómputo en la nube e instancias Docker.
    Monto total cobrado: $520,000 COP.
    Retenciones e IVA del 19%: $83,016 COP.
    Plazo máximo de cobro automático: 2026-09-10.
    ```

### Documento 15
*   **Nombre de Archivo:** `factura_licencias_microsoft.docx`
*   **Formato:** DOCX
*   **JSON de Metadatos Esperados:**
    ```json
    {
      "emisor_nit": "860.005.122-8",
      "valor_total": 1250000.00,
      "impuestos": 199600.00,
      "fecha_vencimiento": "2026-11-01"
    }
    ```
*   **Contenido del Archivo:**
    ```text
    MICROSOFT COLOMBIA S.A.S.
    NIT: 860.005.122-8
    FACTURA ELECTRÓNICA DE LICENCIAMIENTO OFFICE 365
    Licencias corporativas de correo y almacenamiento Teams.
    Total Facturado: $1,250,000 COP.
    Impuesto del valor agregado (IVA 19%): $199,600 COP.
    Fecha límite para evitar desactivación de cuentas: 2026-11-01.
    ```

### Documento 16
*   **Nombre de Archivo:** `factura_almuerzo_negocios.txt`
*   **Formato:** TXT
*   **JSON de Metadatos Esperados:**
    ```json
    {
      "emisor_nit": "901.442.115-4",
      "valor_total": 195000.00,
      "impuestos": 15600.00,
      "fecha_vencimiento": "2026-09-06"
    }
    ```
*   **Contenido del Archivo:**
    ```text
    RESTAURANTE EL PORTAL GOURMET
    NIT: 901.442.115-4
    Factura Simplificada por consumo de restaurante en mesa.
    Reunión técnica UTS con docentes y analistas jurídicos.
    Valor de la cuenta: $195,000 COP.
    Impoconsumo (8%): $15,600 COP.
    Fecha de emisión y recaudo inmediato: 2026-09-06.
    ```

### Documento 17
*   **Nombre de Archivo:** `factura_papeleria_exito.pdf`
*   **Formato:** PDF
*   **JSON de Metadatos Esperados:**
    ```json
    {
      "emisor_nit": "890.900.160-0",
      "valor_total": 85000.00,
      "impuestos": 13570.00,
      "fecha_vencimiento": "2026-09-30"
    }
    ```
*   **Contenido del Archivo:**
    ```text
    ALMACENES ÉXITO S.A.
    NIT: 890.900.160-0
    Comprobante de compra directa en línea.
    Artículos: Carpetas de plástico x50 y marcadores industriales.
    Monto cancelado en caja: $85,000 COP.
    IVA incluido desglosado: $13,570 COP.
    Fecha límite para devoluciones y registros: 2026-09-30.
    ```

### Documento 18
*   **Nombre de Archivo:** `factura_transporte_coordinadora.docx`
*   **Formato:** DOCX
*   **JSON de Metadatos Esperados:**
    ```json
    {
      "emisor_nit": "890.900.412-1",
      "valor_total": 120000.00,
      "impuestos": 19160.00,
      "fecha_vencimiento": "2026-09-18"
    }
    ```
*   **Contenido del Archivo:**
    ```text
    COORDINADORA MERCANTIL S.A.
    NIT: 890.900.412-1
    Guía de transporte de mercancía física y documentación UTS.
    Flete de envío nacional certificado de hardware.
    Total a cobrar: $120,000 COP.
    Gravamen e Impuestos (19%): $19,160 COP.
    Vencimiento para pago electrónico diferido: 2026-09-18.
    ```

### Documento 19
*   **Nombre de Archivo:** `factura_gas_vanti.txt`
*   **Formato:** TXT
*   **JSON de Metadatos Esperados:**
    ```json
    {
      "emisor_nit": "830.053.800-4",
      "valor_total": 65000.00,
      "impuestos": 10370.00,
      "fecha_vencimiento": "2026-10-10"
    }
    ```
*   **Contenido del Archivo:**
    ```text
    VANTI S.A. ESP - COMPAÑÍA DE GAS COMERCIAL
    NIT: 830.053.800-4
    Facturación de consumo mensual de gas natural para cafetería corporativa.
    Total a pagar por el periodo actual: $65,000 COP.
    Desglose del IVA en servicios públicos: $10,370 COP.
    Páguese en bancos antes del: 2026-10-10.
    ```

### Documento 20
*   **Nombre de Archivo:** `factura_mantenimiento_camaras.pdf`
*   **Formato:** PDF
*   **JSON de Metadatos Esperados:**
    ```json
    {
      "emisor_nit": "900.551.229-3",
      "valor_total": 380000.00,
      "impuestos": 60670.00,
      "fecha_vencimiento": "2026-10-05"
    }
    ```
*   **Contenido del Archivo:**
    ```text
    SEGURIDAD INTEGRAL SANTANDER S.A.S.
    NIT: 900.551.229-3
    Orden de Facturación Correctiva de Sistemas de Circuito Cerrado (CCTV).
    Reemplazo de fuentes de alimentación de cámaras de seguridad perimetrales.
    Monto total de cobro: $380,000 COP.
    Cálculo de impuestos (IVA 19%): $60,670 COP.
    Vencimiento de pago programado de proveedor: 2026-10-05.
    ```

---

## 👥 Categoría C: 10 Hojas de Vida (Departamento de Talento Humano)

### Documento 21
*   **Nombre de Archivo:** `cv_carlos_mendoza_react.pdf`
*   **Formato:** PDF
*   **Caso de Prueba Relacionado:** CP-10, CP-15 (Filtro por tecnologías y años de experiencia en RAG)
*   **JSON de Metadatos Esperados:**
    ```json
    {
      "tecnologias_clave": ["React", "Node.js", "MySQL", "JavaScript", "TypeScript"],
      "experiencia_años": 4,
      "ultimo_titulo": "Tecnólogo en Desarrollo de Software"
    }
    ```
*   **Contenido del Archivo:**
    ```text
    CARLOS MENDOZA - DESARROLLADOR FULL STACK
    Tecnólogo en Desarrollo de Software graduado de las Unidades Tecnológicas de Santander.
    
    PERFIL PROFESIONAL: Cuento con 4 años de experiencia laboral activa en el diseño y despliegue de aplicaciones empresariales altamente transaccionales.
    
    TECNOLOGÍAS DE DOMINIO: Dominio avanzado de desarrollo web utilizando el stack React en el cliente, Node.js y Express.js para las APIs de negocio, y persistencia de datos relacionales en MySQL. Uso de TypeScript para la tipificación estricta.
    ```

### Documento 22
*   **Nombre de Archivo:** `cv_diana_gomez_python.docx`
*   **Formato:** DOCX
*   **JSON de Metadatos Esperados:**
    ```json
    {
      "tecnologias_clave": ["Python", "FastAPI", "PostgreSQL", "Docker", "PyTorch"],
      "experiencia_años": 5,
      "ultimo_titulo": "Ingeniera de Sistemas"
    }
    ```
*   **Contenido del Archivo:**
    ```text
    DIANA GÓMEZ - INGENIERA DE SOFTWARE BACKEND
    Ingeniera de Sistemas de la Universidad Industrial de Santander.
    Experiencia profesional de 5 años participando en proyectos de computación científica y servicios REST en la nube.
    Habilidades técnicas y tecnologías: Desarrollo backend en Python y frameworks como Django y FastAPI. Implementación de bases de datos PostgreSQL y despliegue modular con Docker. Conocimientos básicos de Machine Learning en PyTorch.
    ```

### Documento 23
*   **Nombre de Archivo:** `cv_juan_perez_qa.txt`
*   **Formato:** TXT
*   **JSON de Metadatos Esperados:**
    ```json
    {
      "tecnologias_clave": ["Selenium", "Cypress", "Jest", "Postman", "JavaScript"],
      "experiencia_años": 3,
      "ultimo_titulo": "Ingeniero de Sistemas"
    }
    ```
*   **Contenido del Archivo:**
    ```text
    JUAN ALBERTO PÉREZ - INGENIERO DE CONTROL DE CALIDAD (QA)
    Título Académico: Ingeniero de Sistemas.
    Resumen de experiencia: 3 años de trayectoria estructurando y ejecutando planes de pruebas de software funcionales y de rendimiento.
    Herramientas y lenguajes clave: Automatización de pruebas web con Selenium y Cypress, pruebas de componentes unitarios en Jest, y validación estructurada de endpoints de APIs con Postman. Programación en JavaScript.
    ```

### Documento 24
*   **Nombre de Archivo:** `cv_maria_rodriguez_devops.pdf`
*   **Formato:** PDF
*   **JSON de Metadatos Esperados:**
    ```json
    {
      "tecnologias_clave": ["AWS", "Terraform", "Kubernetes", "Jenkins", "Linux"],
      "experiencia_años": 6,
      "ultimo_titulo": "Especialista en Redes y Telecomunicaciones"
    }
    ```
*   **Contenido del Archivo:**
    ```text
    MARÍA RODRÍGUEZ - INGENIERA DE DEVOPS CLOUD
    Último título académico obtenido: Especialista en Redes y Telecomunicaciones de la UTS.
    Trayectoria laboral: 6 años liderando la transición e infraestructura de aplicaciones empresariales locales a entornos cloud modernos.
    Habilidades e infraestructura TI: Administración de servicios Amazon Web Services (AWS), automatización de recursos mediante Terraform (IaC), orquestación de contenedores y clusters en Kubernetes, y pipelines de CI/CD en Jenkins bajo servidores Linux.
    ```

### Documento 25
*   **Nombre de Archivo:** `cv_andres_silva_mobile.docx`
*   **Formato:** DOCX
*   **JSON de Metadatos Esperados:**
    ```json
    {
      "tecnologias_clave": ["Flutter", "Dart", "Firebase", "Android", "iOS"],
      "experiencia_años": 3,
      "ultimo_titulo": "Tecnólogo en Sistemas"
    }
    ```
*   **Contenido del Archivo:**
    ```text
    ANDRÉS SILVA - DESARROLLADOR DE APLICACIONES MÓVILES
    Profesión: Tecnólogo en Sistemas.
    Habilidades del perfil: 3 años de experiencia en desarrollo de aplicaciones nativas e híbridas de alta usabilidad para celulares.
    Tecnologías de especialidad: Programación reactiva utilizando Flutter y lenguaje de programación Dart. Almacenamiento ágil e integraciones en tiempo real con Firebase Cloud, y despliegue oficial en tiendas de Android y iOS.
    ```

### Documento 26
*   **Nombre de Archivo:** `cv_sofia_castro_analytics.txt`
*   **Formato:** TXT
*   **JSON de Metadatos Esperados:**
    ```json
    {
      "tecnologias_clave": ["SQL", "PowerBI", "Python", "Pandas", "R"],
      "experiencia_años": 2,
      "ultimo_titulo": "tecnóloga en Sistemas"
    }
    ```
*   **Contenido del Archivo:**
    ```text
    SOFÍA CASTRO - ANALISTA DE DATOS CORPORATIVOS
    Nivel Educativo: Tecnóloga en Sistemas.
    Experiencia: 2 años procesando datos estructurados para la toma de decisiones empresariales.
    Especialidades: Consultas SQL avanzadas para bases de datos relacionales, visualización interactiva de tableros de control en PowerBI, y automatización y limpieza estadística utilizando el stack de Python (Pandas y Numpy) y análisis en lenguaje R.
    ```

### Documento 27
*   **Nombre de Archivo:** `cv_pedro_gomez_frontend.pdf`
*   **Formato:** PDF
*   **JSON de Metadatos Esperados:**
    ```json
    {
      "tecnologias_clave": ["Vue.js", "Nuxt.js", "TailwindCSS", "JavaScript", "HTML5"],
      "experiencia_años": 4,
      "ultimo_titulo": "Profesional en Diseño de Medios Interactivos"
    }
    ```
*   **Contenido del Archivo:**
    ```text
    PEDRO GÓMEZ - DESARROLLADOR FRONTEND UI/UX
    Estudios Universitarios: Profesional en Diseño de Medios Interactivos.
    Resumen de carrera: 4 años dedicados al maquetado de interfaces de usuario adaptativas, optimizando la accesibilidad web.
    Tecnologías clave: Desarrollo web fluido utilizando Vue.js y SSR en Nuxt.js. Estilizado ágil con TailwindCSS, control del estado web en JavaScript nativo y codificación semántica bajo estándares modernos de HTML5 y CSS3.
    ```

### Documento 28
*   **Nombre de Archivo:** `cv_lucia_lopez_security.docx`
*   **Formato:** DOCX
*   **JSON de Metadatos Esperados:**
    ```json
    {
      "tecnologias_clave": ["Kali Linux", "Wireshark", "Metasploit", "OWASP Top 10", "Python"],
      "experiencia_años": 7,
      "ultimo_titulo": "Ingeniera de Sistemas"
    }
    ```
*   **Contenido del Archivo:**
    ```text
    LUCÍA LÓPEZ - INGENIERA DE SEGURIDAD INFORMÁTICA / ETHICAL HACKER
    Formación académica principal: Ingeniera de Sistemas de la UIS.
    Experiencia profesional acumulada: 7 años realizando análisis de vulnerabilidades e intrusión controlada en aplicaciones.
    Habilidades en ciberseguridad: Auditorías técnicas y de red en Kali Linux utilizando Wireshark, pruebas de penetración y explotación controlada de servidores con Metasploit, y aseguramiento del Backend bajo los estándares OWASP Top 10. Scripting defensivo en Python.
    ```

### Documento 29
*   **Nombre de Archivo:** `cv_david_pinto_scrum.txt`
*   **Formato:** TXT
*   **JSON de Metadatos Esperados:**
    ```json
    {
      "tecnologias_clave": ["Scrum", "Jira", "Confluence", "Asana", "Jira Align"],
      "experiencia_años": 5,
      "ultimo_titulo": "Administrador de Empresas"
    }
    ```
*   **Contenido del Archivo:**
    ```text
    DAVID PINTO - SCRUM MASTER & GERENTE DE PROYECTOS ÁGILES
    Educación formal: Administrador de Empresas con certificación oficial Scrum Alliance.
    Tiempo de experiencia: 5 años facilitando metodologías ágiles en equipos multidisciplinarios de desarrollo de software.
    Herramientas de gestión ágil: Gestión del backlog de producto y sprints en Jira y Confluence, planificación de metas en Asana y visualización de portafolios a gran escala con Jira Align. Facilitador de ceremonias ágiles.
    ```

### Documento 30
*   **Nombre de Archivo:** `cv_laura_morales_design.pdf`
*   **Formato:** PDF
*   **JSON de Metadatos Esperados:**
    ```json
    {
      "tecnologias_clave": ["Figma", "Adobe Illustrator", "Photoshop", "After Effects", "Blender"],
      "experiencia_años": 3,
      "ultimo_titulo": "Diseñadora Gráfica"
    }
    ```
*   **Contenido del Archivo:**
    ```text
    LAURA MORALES - DISEÑADORA UI/UX Y PRODUCT DESIGNER
    Grado Profesional: Diseñadora Gráfica graduada de la Universidad de Investigación y Desarrollo.
    Perfil operativo: 3 años de trayectoria en el diseño de prototipos de alta fidelidad de aplicaciones web y móviles.
    Suite creativa y de diseño: Creación y maquetado de flujos de usuario completos e interactivos en Figma. Ilustración vectorial compleja con Adobe Illustrator, manipulación digital en Photoshop y modelado 3D interactivo en Blender para soporte multimedia.
    ```

---

## 🎯 Conclusión e Integridad con Antigravity Pro

Este set de 30 documentos de prueba de alta fidelidad garantiza el **cumplimiento absoluto del Requisito 11** de la guía del proyecto integrador de la UTS [cite: 104]. Al estructurarlos de forma clara con sus tipos de datos, textos de origen y esquemas de salida, permites que la IA de Antigravity Pro:

1.  **Genere los archivos reales:** El agente podrá instanciar el script de generación y escribir archivos válidos en disco para la fase de pruebas [cite: 102].
2.  **Valide la base de datos relacional:** Tendrás datos listos para probar las relaciones e inserciones JSON en MySQL de HeidiSQL [cite: 25, 42].
3.  **Valide la base de datos vectorial:** Podrás llenar la base vectorial de Pinecone mediante el modelo `text-embedding-004` [cite: 24, 30] y probar el chat en la sustentación final ante el profesor Wilson Castaño [cite: 106].
