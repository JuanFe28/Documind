import os
import json
from docx import Document
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "repositorio_documentos_prueba")
os.makedirs(OUTPUT_DIR, exist_ok=True)

DOCS = [
    # --- Categoría A: 10 Contratos ---
    {
        "nombre": "contrato_servicios_oriente_2026.pdf",
        "tipo": "pdf",
        "categoria": "Contratos",
        "contenido": """CONTRATO DE PRESTACIÓN DE SERVICIOS TECNOLÓGICOS

Entre los suscritos a saber, por una parte la Empresa Tecnológica del Oriente y por la otra parte Sistemas Inteligentes S.A.S., se ha convenido celebrar el presente contrato de prestación de servicios para el desarrollo e integración de APIs de Inteligencia Artificial.

CLÁUSULA SEGUNDA - VIGENCIA: El presente contrato tendrá una vigencia de doce (12) meses, iniciando el 1 de Enero de 2026 y finalizando el 31 de Diciembre de 2026.

CLÁUSULA OCTAVA - PENALIZACIONES Y MORA: En caso de incumplimiento de los tiempos de entrega pactados, el Contratista incurrirá en una multa equivalente al 10% del valor de la factura mensual por cada semana de retraso en los entregables. Adicionalmente, el Contratante pagará una mora del 2% adicional en caso de retraso de pagos vencidos."""
    },
    {
        "nombre": "convenio_practicas_uts_v2.docx",
        "tipo": "docx",
        "categoria": "Contratos",
        "contenido": """CONVENIO MARCO DE COOPERACIÓN PARA PRÁCTICAS ACADÉMICAS

Celebrado entre las Unidades Tecnológicas de Santander (UTS), institución de educación superior pública, y la empresa aliada Software del Común Ltda. El propósito de este acuerdo es regular las prácticas profesionales de los estudiantes del programa de Tecnología en Desarrollo de Software.

DURACIÓN Y VIGENCIA: Las partes acuerdan una vigencia inicial del convenio de veinticuatro (24) meses prorrogables de mutuo acuerdo.

CAUSALES DE RESCISIÓN Y SANCIONES: El incumplimiento de los planes de formación académica dará lugar a la terminación unilateral del convenio sin derecho a indemnización, requiriendo únicamente un preaviso por escrito enviado con 30 días calendario de anticipación."""
    },
    {
        "nombre": "contrato_arrendamiento_oficinas.txt",
        "tipo": "txt",
        "categoria": "Contratos",
        "contenido": """CONTRATO DE ARRENDAMIENTO COMERCIAL - OFICINA 402
Arrendador: Inmobiliaria Ruiz & Asociados. Arrendatario: Sistemas Inteligentes S.A.S.
Vigencia del contrato: 36 meses obligatorios a partir del 1 de Febrero de 2026.
Penalizaciones por incumplimiento: En caso de desocupación anticipada o entrega del inmueble antes de la vigencia sin justa causa, se aplicará una sanción económica de tres cánones de arrendamiento mensuales."""
    },
    {
        "nombre": "contrato_confidencialidad_nda.pdf",
        "tipo": "pdf",
        "categoria": "Contratos",
        "contenido": """ACUERDO DE CONFIDENCIALIDAD Y NO DIVULGACIÓN (NDA)

El presente acuerdo regula el intercambio de secretos comerciales entre el equipo de desarrollo de DocuMind Dev Team y el cliente corporativo Inversiones Santander S.A.

DURACIÓN DE LAS OBLIGACIONES: La reserva de la información confidencial se mantendrá vigente por un término de cinco (5) años a partir de la firma del presente documento.

PENALIDAD POR FILTRACIÓN: La revelación no autorizada de código fuente o bases de datos dará lugar a una penalización tasada en una indemnización de daños equivalente a 50 SMMLV, sin perjuicio de las acciones penales a que haya lugar."""
    },
    {
        "nombre": "contrato_soporte_hosting.docx",
        "tipo": "docx",
        "categoria": "Contratos",
        "contenido": """CONTRATO DE HOSPEDAJE CLOUD Y SLA
Suscrito entre AWS Colombia y el cliente Sistemas Inteligentes S.A.S.
Vigencia del servicio: 6 meses con renovación automática.
Penalización de ANS: Si el Acuerdo de Nivel de Servicio (SLA) de la infraestructura del servidor cae por debajo del 99.9% en cualquier mes calendario, se aplicará un descuento de compensación del 15% en la factura del periodo inmediatamente posterior."""
    },
    {
        "nombre": "contrato_outsourcing_it.txt",
        "tipo": "txt",
        "categoria": "Contratos",
        "contenido": """CONTRATO DE OUTSOURCING DE MESA DE AYUDA TI
Partes: Soporte Remoto Bucaramanga y Software del Común Ltda.
Vigencia: Término indefinido previo mutuo acuerdo.
Incumplimiento de Soporte: Se pacta una multa del 5% del valor total mensual del contrato por cada hora en que la mesa de soporte técnico telefónico se encuentre fuera de línea en días hábiles."""
    },
    {
        "nombre": "contrato_proveedor_papeleria.pdf",
        "tipo": "pdf",
        "categoria": "Contratos",
        "contenido": """SUMINISTRO DE MATERIALES DE OFICINA Y PAPELERÍA
Contratista: Papeles y Copias Santander. Contratante: Unidades Tecnológicas de Santander (UTS).
Vigencia: Hasta el 30 de Noviembre de 2026.
Sanciones por demora: El retraso de más de 3 días en el suministro de los folios requeridos generará una sanción moratoria del 1% diario acumulativo del valor del pedido y dará derecho a la cancelación automática de las órdenes pendientes."""
    },
    {
        "nombre": "contrato_consultoria_financiera.docx",
        "tipo": "docx",
        "categoria": "Contratos",
        "contenido": """CONTRATO DE CONSULTORÍA EXTERNA Y AUDITORÍA
Suscrito por Consultores Asociados del Norte e Inversiones Santander S.A.
Plazo de Ejecución: 3 meses improrrogables.
Cláusula Penal de Tiempo: La entrega tardía del informe de auditoría financiera final acarreará como penalidad la pérdida total del derecho a cobro de la última cuota equivalente al 30% del contrato."""
    },
    {
        "nombre": "contrato_mantenimiento_aires.txt",
        "tipo": "txt",
        "categoria": "Contratos",
        "contenido": """MANTENIMIENTO PREVENTIVO DE CLIMATIZACIÓN
Partes: Climas Fríos del Este y Sistemas Inteligentes S.A.S.
Vigencia: 12 meses a partir de la firma de actas.
Sanciones de atención: Si el contratista incumple la cita de revisión correctiva programada en menos de 24 horas desde el reporte, deberá asumir un cargo de copago de compensación por valor de 100,000 COP a favor del contratante."""
    },
    {
        "nombre": "contrato_seguridad_privada.pdf",
        "tipo": "pdf",
        "categoria": "Contratos",
        "contenido": """PRESTACIÓN DE SERVICIOS DE SEGURIDAD FISICA Y VIGILANCIA
Arrendador de Seguridad: Vigilancia Real Ltda. Beneficiario: Software del Común Ltda.
Vigencia: 24 meses continuos de prestación de servicio nocturno.
Sanción de Cobertura: El contratista asumirá la responsabilidad civil y el pago del 100% del valor comercial de cualquier pérdida material o daño de equipos ocurridos en las instalaciones durante los turnos de guardia asignados."""
    },

    # --- Categoría B: 10 Facturas ---
    {
        "nombre": "factura_essa_energia_v6.pdf",
        "tipo": "pdf",
        "categoria": "Facturas",
        "contenido": """ELECTRIFICADORA DE SANTANDER S.A. E.S.P. - ESSA
NIT: 890.201.223-4
FACTURA DE SERVICIOS PÚBLICOS - ENERGÍA ELÉCTRICA
Fecha de Expedición: 01 de Septiembre de 2026.
VALOR TOTAL DEL MES: $450,000 COP.
Detalle de Impuestos Incluidos (IVA 19%): $71,850 COP.
PAGO OBLIGATORIO ANTES DE: 2026-10-15. Evite suspensión del servicio."""
    },
    {
        "nombre": "factura_proveedor_octubre_101.docx",
        "tipo": "docx",
        "categoria": "Facturas",
        "contenido": """TECNOLOGÍAS DE OFICINA S.A.S.
NIT: 900.812.333-2
FACTURA COMERCIAL DE VENTA No. FE-101
Cliente: Sistemas Inteligentes S.A.S.
Concepto: Resma de Papel Carta x10 y Suministros.
Subtotal: $133,200. IVA (19%): $25,300.
VALOR NETO A PAGAR: $158,500 COP.
Fecha límite de pago establecida para transacciones: 2026-10-15."""
    },
    {
        "nombre": "factura_internet_claro.txt",
        "tipo": "txt",
        "categoria": "Facturas",
        "contenido": """CLARO COLOMBIA - COMUNICACIONES
NIT emisor: 800.153.990-1
Cuenta de cobro internet banda ancha Oficina 301.
Valor mensual: $280,000 COP.
Impuesto al consumo e IVA: $44,700 COP.
Fecha de vencimiento para el recargo: 2026-09-20."""
    },
    {
        "nombre": "factura_host_digitalocean.pdf",
        "tipo": "pdf",
        "categoria": "Facturas",
        "contenido": """DIGITALOCEAN CLOUD HOSTING SERVICES
NIT Facturación Colombia: 912.443.001-9
Factura de servicios de cómputo en la nube e instancias Docker.
Monto total cobrado: $520,000 COP.
Retenciones e IVA del 19%: $83,016 COP.
Plazo máximo de cobro automático: 2026-09-10."""
    },
    {
        "nombre": "factura_licencias_microsoft.docx",
        "tipo": "docx",
        "categoria": "Facturas",
        "contenido": """MICROSOFT COLOMBIA S.A.S.
NIT: 860.005.122-8
FACTURA ELECTRÓNICA DE LICENCIAMIENTO OFFICE 365
Licencias corporativas de correo y almacenamiento Teams.
Total Facturado: $1,250,000 COP.
Impuesto del valor agregado (IVA 19%): $199,600 COP.
Fecha límite para evitar desactivación de cuentas: 2026-11-01."""
    },
    {
        "nombre": "factura_almuerzo_negocios.txt",
        "tipo": "txt",
        "categoria": "Facturas",
        "contenido": """RESTAURANTE EL PORTAL GOURMET
NIT: 901.442.115-4
Factura Simplificada por consumo de restaurante en mesa.
Reunión técnica UTS con docentes y analistas jurídicos.
Valor de la cuenta: $195,000 COP.
Impoconsumo (8%): $15,600 COP.
Fecha de emisión y recaudo inmediato: 2026-09-06."""
    },
    {
        "nombre": "factura_papeleria_exito.pdf",
        "tipo": "pdf",
        "categoria": "Facturas",
        "contenido": """ALMACENES ÉXITO S.A.
NIT: 890.900.160-0
Comprobante de compra directa en línea.
Artículos: Carpetas de plástico x50 y marcadores industriales.
Monto cancelado en caja: $85,000 COP.
IVA incluido desglosado: $13,570 COP.
Fecha límite para devoluciones y registros: 2026-09-30."""
    },
    {
        "nombre": "factura_transporte_coordinadora.docx",
        "tipo": "docx",
        "categoria": "Facturas",
        "contenido": """COORDINADORA MERCANTIL S.A.
NIT: 890.900.412-1
Guía de transporte de mercancía física y documentación UTS.
Flete de envío nacional certificado de hardware.
Total a cobrar: $120,000 COP.
Gravamen e Impuestos (19%): $19,160 COP.
Vencimiento para pago electrónico diferido: 2026-09-18."""
    },
    {
        "nombre": "factura_gas_vanti.txt",
        "tipo": "txt",
        "categoria": "Facturas",
        "contenido": """VANTI S.A. ESP - COMPAÑÍA DE GAS COMERCIAL
NIT: 830.053.800-4
Facturación de consumo mensual de gas natural para cafetería corporativa.
Total a pagar por el periodo actual: $65,000 COP.
Desglose del IVA en servicios públicos: $10,370 COP.
Páguese en bancos antes del: 2026-10-10."""
    },
    {
        "nombre": "factura_mantenimiento_camaras.pdf",
        "tipo": "pdf",
        "categoria": "Facturas",
        "contenido": """SEGURIDAD INTEGRAL SANTANDER S.A.S.
NIT: 900.551.229-3
Orden de Facturación Correctiva de Sistemas de Circuito Cerrado (CCTV).
Reemplazo de fuentes de alimentación de cámaras de seguridad perimetrales.
Monto total de cobro: $380,000 COP.
Cálculo de impuestos (IVA 19%): $60,670 COP.
Vencimiento de pago programado de proveedor: 2026-10-05."""
    },

    # --- Categoría C: 10 Hojas de Vida ---
    {
        "nombre": "cv_carlos_mendoza_react.pdf",
        "tipo": "pdf",
        "categoria": "Hojas de Vida",
        "contenido": """CARLOS MENDOZA - DESARROLLADOR FULL STACK
Tecnólogo en Desarrollo de Software graduado de las Unidades Tecnológicas de Santander.

PERFIL PROFESIONAL: Cuento con 4 años de experiencia laboral activa en el diseño y despliegue de aplicaciones empresariales altamente transaccionales.

TECNOLOGÍAS DE DOMINIO: Dominio avanzado de desarrollo web utilizando el stack React en el cliente, Node.js y Express.js para las APIs de negocio, y persistencia de datos relacionales en MySQL. Uso de TypeScript para la tipificación estricta."""
    },
    {
        "nombre": "cv_diana_gomez_python.docx",
        "tipo": "docx",
        "categoria": "Hojas de Vida",
        "contenido": """DIANA GÓMEZ - INGENIERA DE SOFTWARE BACKEND
Ingeniera de Sistemas de la Universidad Industrial de Santander.
Experiencia profesional de 5 años participando en proyectos de computación científica y servicios REST en la nube.
Habilidades técnicas y tecnologías: Desarrollo backend en Python y frameworks como Django y FastAPI. Implementación de bases de datos PostgreSQL y despliegue modular con Docker. Conocimientos básicos de Machine Learning en PyTorch."""
    },
    {
        "nombre": "cv_juan_perez_qa.txt",
        "tipo": "txt",
        "categoria": "Hojas de Vida",
        "contenido": """JUAN ALBERTO PÉREZ - INGENIERO DE CONTROL DE CALIDAD (QA)
Título Académico: Ingeniero de Sistemas.
Resumen de experiencia: 3 años de trayectoria estructurando y ejecutando planes de pruebas de software funcionales y de rendimiento.
Herramientas y lenguajes clave: Automatización de pruebas web con Selenium y Cypress, pruebas de componentes unitarios en Jest, y validación estructurada de endpoints de APIs con Postman. Programación en JavaScript."""
    },
    {
        "nombre": "cv_maria_rodriguez_devops.pdf",
        "tipo": "pdf",
        "categoria": "Hojas de Vida",
        "contenido": """MARÍA RODRÍGUEZ - INGENIERA DE DEVOPS CLOUD
Último título académico obtenido: Especialista en Redes y Telecomunicaciones de la UTS.
Trayectoria laboral: 6 años liderando la transición e infraestructura de aplicaciones empresariales locales a entornos cloud modernos.
Habilidades e infraestructura TI: Administración de servicios Amazon Web Services (AWS), automatización de recursos mediante Terraform (IaC), orquestación de contenedores y clusters en Kubernetes, y pipelines de CI/CD en Jenkins bajo servidores Linux."""
    },
    {
        "nombre": "cv_andres_silva_mobile.docx",
        "tipo": "docx",
        "categoria": "Hojas de Vida",
        "contenido": """ANDRÉS SILVA - DESARROLLADOR DE APLICACIONES MÓVILES
Profesión: Tecnólogo en Sistemas.
Habilidades del perfil: 3 años de experiencia en desarrollo de aplicaciones nativas e híbridas de alta usabilidad para celulares.
Tecnologías de especialidad: Programación reactiva utilizando Flutter y lenguaje de programación Dart. Almacenamiento ágil e integraciones en tiempo real con Firebase Cloud, y despliegue oficial en tiendas de Android y iOS."""
    },
    {
        "nombre": "cv_sofia_castro_analytics.txt",
        "tipo": "txt",
        "categoria": "Hojas de Vida",
        "contenido": """SOFÍA CASTRO - ANALISTA DE DATOS CORPORATIVOS
Nivel Educativo: Tecnóloga en Sistemas.
Experiencia: 2 años procesando datos estructurados para la toma de decisiones empresariales.
Especialidades: Consultas SQL avanzadas para bases de datos relacionales, visualización interactiva de tableros de control en PowerBI, y automatización y limpieza estadística utilizando el stack de Python (Pandas y Numpy) y análisis en lenguaje R."""
    },
    {
        "nombre": "cv_pedro_gomez_frontend.pdf",
        "tipo": "pdf",
        "categoria": "Hojas de Vida",
        "contenido": """PEDRO GÓMEZ - DESARROLLADOR FRONTEND UI/UX
Estudios Universitarios: Profesional en Diseño de Medios Interactivos.
Resumen de carrera: 4 años dedicados al maquetado de interfaces de usuario adaptativas, optimizando la accesibilidad web.
Tecnologías clave: Desarrollo web fluido utilizando Vue.js y SSR en Nuxt.js. Estilizado ágil con TailwindCSS, control del estado web en JavaScript nativo y codificación semántica bajo estándares modernos de HTML5 y CSS3."""
    },
    {
        "nombre": "cv_lucia_lopez_security.docx",
        "tipo": "docx",
        "categoria": "Hojas de Vida",
        "contenido": """LUCÍA LÓPEZ - INGENIERA DE SEGURIDAD INFORMÁTICA / ETHICAL HACKER
Formación académica principal: Ingeniera de Sistemas de la UIS.
Experiencia profesional acumulada: 7 años realizando análisis de vulnerabilidades e intrusión controlada en aplicaciones.
Habilidades en ciberseguridad: Auditorías técnicas y de red en Kali Linux utilizando Wireshark, pruebas de penetración y explotación controlada de servidores con Metasploit, y aseguramiento del Backend bajo los estándares OWASP Top 10. Scripting defensivo en Python."""
    },
    {
        "nombre": "cv_david_pinto_scrum.txt",
        "tipo": "txt",
        "categoria": "Hojas de Vida",
        "contenido": """DAVID PINTO - SCRUM MASTER & GERENTE DE PROYECTOS ÁGILES
Educación formal: Administrador de Empresas con certificación oficial Scrum Alliance.
Tiempo de experiencia: 5 años facilitando metodologías ágiles en equipos multidisciplinarios de desarrollo de software.
Herramientas de gestión ágil: Gestión del backlog de producto y sprints en Jira y Confluence, planificación de metas en Asana y visualización de portafolios a gran escala con Jira Align. Facilitador de ceremonias ágiles."""
    },
    {
        "nombre": "cv_laura_morales_design.pdf",
        "tipo": "pdf",
        "categoria": "Hojas de Vida",
        "contenido": """LAURA MORALES - DISEÑADORA UI/UX Y PRODUCT DESIGNER
Grado Profesional: Diseñadora Gráfica graduada de la Universidad de Investigación y Desarrollo.
Perfil operativo: 3 años de trayectoria en el diseño de prototipos de alta fidelidad de aplicaciones web y móviles.
Suite creativa y de diseño: Creación y maquetado de flujos de usuario completos e interactivos en Figma. Ilustración vectorial compleja con Adobe Illustrator, manipulación digital en Photoshop y modelado 3D interactivo en Blender para soporte multimedia."""
    }
]

def crear_pdf(filepath, contenido):
    doc = SimpleDocTemplate(filepath, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []
    for paragraph in contenido.split("\n\n"):
        story.append(Paragraph(paragraph.replace("\n", "<br/>"), styles["Normal"]))
        story.append(Spacer(1, 12))
    doc.build(story)

def crear_docx(filepath, contenido):
    doc = Document()
    for paragraph in contenido.split("\n\n"):
        doc.add_paragraph(paragraph)
    doc.save(filepath)

def crear_txt(filepath, contenido):
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(contenido)

def main():
    print(f"Generando 30 documentos de prueba en {OUTPUT_DIR}...")
    for idx, doc in enumerate(DOCS, 1):
        filepath = os.path.join(OUTPUT_DIR, doc["nombre"])
        if doc["tipo"] == "pdf":
            crear_pdf(filepath, doc["contenido"])
        elif doc["tipo"] == "docx":
            crear_docx(filepath, doc["contenido"])
        elif doc["tipo"] == "txt":
            crear_txt(filepath, doc["contenido"])
        print(f"[{idx}/30] Creado: {doc['nombre']} ({doc['categoria']})")
    print("\n¡Todos los 30 documentos fueron generados con éxito!")

if __name__ == "__main__":
    main()
