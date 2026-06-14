# Portal de Patógenos Chile — Bundle SE 22-2026

Fecha de elaboración: 2026-06-09 · Semana epidemiológica: SE 22-2026

### FILE: data/curated/meta.json
```json
{
  "schema_version": 1,
  "epi_week": "SE 22-2026",
  "ew": "22",
  "year": 2026,
  "updated_at": "2026-06-09T00:00:00Z",
  "home_alert": {
    "text_es": "Alerta vigente SE 22 · 2026: vigilancia activa de hantavirus (39 casos, 13 fallecidos en 9 regiones) y arbovirus por Aedes aegypti (alerta sanitaria Arica–Los Ríos; brote autóctono en Rapa Nui). Influenza A en ascenso sostenido.",
    "text_en": "Active alert EW 22 · 2026: ongoing surveillance of hantavirus (39 cases, 13 deaths across 9 regions) and Aedes aegypti arboviruses (sanitary alert Arica–Los Ríos; autochthonous outbreak in Rapa Nui). Influenza A rising steadily."
  },
  "regional_context": {
    "last_check": "2026-06-09",
    "source": "PAHO Health Information Platform"
  }
}
```

### FILE: data/curated/banner_stats.json
```json
{
  "schema_version": 1,
  "updated_at": "2026-06-09T00:00:00Z",
  "stats": [
    {"id": "patogenos_vigilados", "value": "8",
     "label_es": "Patógenos vigilados", "label_en": "Pathogens monitored"},
    {"id": "regiones_alerta", "value": "9",
     "label_es": "Regiones con alerta", "label_en": "Regions on alert"},
    {"id": "casos_se", "value": "—",
     "label_es": "Casos esta SE", "label_en": "Cases this EW"},
    {"id": "ultima_act", "value": "2026-06-09",
     "label_es": "Última actualización", "label_en": "Last update"}
  ]
}
```

### FILE: data/curated/pathogens.json
```json
{
  "schema_version": 1,
  "updated_at": "2026-06-09T00:00:00Z",
  "epi_week": "SE 22-2026",
  "items": [
    {
      "id": "influenza",
      "name_es": "Influenza A/B",
      "name_en": "Influenza A/B",
      "icon": "bi-thermometer-half",
      "color": "#2563eb",
      "status": "endemic",
      "status_label_es": "Estacional",
      "status_label_en": "Seasonal",
      "page": "pathogens/influenza.html",
      "stats": [
        {"value": "45%", "label_es": "Positividad respiratoria SE 22", "label_en": "Respiratory positivity EW 22"},
        {"value": "27%", "label_es": "Influenza A (2º agente)", "label_en": "Influenza A (2nd agent)"},
        {"value": "61.2%", "label_es": "Cobertura vacunación", "label_en": "Vaccination coverage"}
      ],
      "summary_es": "La positividad de muestras respiratorias alcanzó 45% en la SE 22 (1–6 jun), con Influenza A como segundo agente más detectado y en alza sostenida. La cobertura de vacunación contra influenza se mantiene en torno a 61%, bajo la meta de invierno.",
      "summary_en": "Respiratory sample positivity reached 45% in EW 22 (Jun 1–6), with Influenza A the second most detected agent and rising steadily. Influenza vaccination coverage stands near 61%, below the winter target.",
      "sources": ["isp", "minsal"]
    },
    {
      "id": "rsv",
      "name_es": "Virus Respiratorio Sincicial",
      "name_en": "Respiratory Syncytial Virus",
      "icon": "bi-lungs",
      "color": "#059669",
      "status": "monitoring",
      "status_label_es": "Vigilancia",
      "status_label_en": "Surveillance",
      "page": "pathogens/rsv.html",
      "stats": [
        {"value": "—", "label_es": "Positividad VRS SE 22", "label_en": "RSV positivity EW 22"},
        {"value": "81.6%", "label_es": "Inmunización lactantes", "label_en": "Infant immunization"},
        {"value": "—", "label_es": "Hospitalizaciones VRS", "label_en": "RSV hospitalizations"}
      ],
      "summary_es": "El VRS se mantiene en proporción baja dentro de la circulación viral del invierno 2026, con predominio de rinovirus e influenza A. La inmunización de lactantes con anticuerpos monoclonales superó el 81% según el último reporte disponible.",
      "summary_en": "RSV remains a low proportion of viral circulation in winter 2026, with rhinovirus and influenza A predominating. Infant immunization with monoclonal antibodies exceeded 81% per the latest available report.",
      "sources": ["isp", "minsal"]
    },
    {
      "id": "covid19",
      "name_es": "COVID-19 (SARS-CoV-2)",
      "name_en": "COVID-19 (SARS-CoV-2)",
      "icon": "bi-virus",
      "color": "#7c3aed",
      "status": "endemic",
      "status_label_es": "Endémico",
      "status_label_en": "Endemic",
      "page": "pathogens/covid19.html",
      "stats": [
        {"value": "—", "label_es": "Positividad SARS-CoV-2 SE 22", "label_en": "SARS-CoV-2 positivity EW 22"},
        {"value": "16.3%", "label_es": "Distribución acumulada SE 18", "label_en": "Cumulative share EW 18"},
        {"value": "—", "label_es": "Variantes en monitoreo", "label_en": "Variants under monitoring"}
      ],
      "summary_es": "SARS-CoV-2 circula de forma endémica con baja positividad relativa durante el invierno 2026; en reportes recientes representó menos del 1% de las detecciones semanales. La OMS mantiene bajo monitoreo las variantes KP.3.1.1, NB.1.8.1, XFG y BA.3.2.",
      "summary_en": "SARS-CoV-2 circulates endemically with low relative positivity during winter 2026; in recent reports it accounted for under 1% of weekly detections. WHO keeps variants KP.3.1.1, NB.1.8.1, XFG and BA.3.2 under monitoring.",
      "sources": ["isp", "who"]
    },
    {
      "id": "hantavirus",
      "name_es": "Hantavirus (virus Andes)",
      "name_en": "Hantavirus (Andes virus)",
      "icon": "bi-house-down",
      "color": "#dc2626",
      "status": "alert",
      "status_label_es": "Alerta",
      "status_label_en": "Alert",
      "page": "pathogens/hantavirus.html",
      "stats": [
        {"value": "39", "label_es": "Casos confirmados 2026", "label_en": "Confirmed cases 2026"},
        {"value": "13", "label_es": "Fallecidos 2026", "label_en": "Deaths 2026"},
        {"value": "33%", "label_es": "Letalidad 2026", "label_en": "Case fatality 2026"}
      ],
      "summary_es": "Al 6 de mayo de 2026 se confirmaron 39 casos de hantavirus con 13 fallecidos (letalidad 33%) en 9 de 16 regiones, principalmente de la zona central y austral. El MINSAL mantiene alerta sanitaria reforzada desde enero de 2026.",
      "summary_en": "As of May 6, 2026, 39 hantavirus cases with 13 deaths (33% case fatality) were confirmed across 9 of 16 regions, mainly the central and southern zones. MINSAL has kept a reinforced sanitary alert in place since January 2026.",
      "sources": ["minsal", "paho"]
    },
    {
      "id": "dengue",
      "name_es": "Dengue",
      "name_en": "Dengue",
      "icon": "bi-bug",
      "color": "#ea580c",
      "status": "alert",
      "status_label_es": "Alerta",
      "status_label_en": "Alert",
      "page": "pathogens/dengue.html",
      "stats": [
        {"value": "22", "label_es": "Casos autóctonos Rapa Nui 2026", "label_en": "Autochthonous cases Rapa Nui 2026"},
        {"value": "14", "label_es": "Casos importados continente", "label_en": "Imported cases mainland"},
        {"value": "0", "label_es": "Casos autóctonos continente", "label_en": "Autochthonous cases mainland"}
      ],
      "summary_es": "En 2026 se reportaron 22 casos autóctonos en Rapa Nui (con alerta sanitaria insular) y 14 casos importados en el continente, sin transmisión local continental. La alerta sanitaria por Aedes aegypti se mantiene vigente entre Arica y Los Ríos.",
      "summary_en": "In 2026, 22 autochthonous cases were reported in Rapa Nui (island sanitary alert) plus 14 imported cases on the mainland, with no continental local transmission. The Aedes aegypti sanitary alert remains active from Arica to Los Ríos.",
      "sources": ["minsal", "paho"]
    },
    {
      "id": "mpox",
      "name_es": "Mpox (viruela símica)",
      "name_en": "Mpox",
      "icon": "bi-droplet-half",
      "color": "#9333ea",
      "status": "contained",
      "status_label_es": "Contenido",
      "status_label_en": "Contained",
      "page": "pathogens/mpox.html",
      "stats": [
        {"value": "—", "label_es": "Casos confirmados SE 22", "label_en": "Confirmed cases EW 22"},
        {"value": "Activa", "label_es": "Alerta sanitaria nacional", "label_en": "National sanitary alert"},
        {"value": "Ib", "label_es": "Clado de mayor preocupación regional", "label_en": "Regional clade of concern"}
      ],
      "summary_es": "Chile mantiene la alerta sanitaria nacional por Mpox con vigilancia activa y capacidad diagnóstica en el ISP, sin un brote local activo reportado esta semana. La región vigila la circulación del clado Ib tras su confirmación en Argentina en marzo de 2026.",
      "summary_en": "Chile maintains its national Mpox sanitary alert with active surveillance and ISP diagnostic capacity, with no active local outbreak reported this week. The region is monitoring clade Ib circulation after its confirmation in Argentina in March 2026.",
      "sources": ["minsal", "isp"]
    },
    {
      "id": "salmonella",
      "name_es": "Salmonella spp.",
      "name_en": "Salmonella spp.",
      "icon": "bi-cup-straw",
      "color": "#0891b2",
      "status": "endemic",
      "status_label_es": "Endémico",
      "status_label_en": "Endemic",
      "page": "pathogens/salmonella.html",
      "stats": [
        {"value": "—", "label_es": "Cepas notificadas SE 22", "label_en": "Strains reported EW 22"},
        {"value": "ENO", "label_es": "Vigilancia obligatoria", "label_en": "Mandatory surveillance"},
        {"value": "—", "label_es": "Brotes ETA activos", "label_en": "Active foodborne outbreaks"}
      ],
      "summary_es": "Salmonella spp. es un agente endémico de transmisión alimentaria bajo vigilancia obligatoria; los laboratorios clínicos envían semanalmente las cepas al ISP para estudio y susceptibilidad. No se dispone de cifra semanal trazable a una URL para la SE 22.",
      "summary_en": "Salmonella spp. is an endemic foodborne agent under mandatory surveillance; clinical labs submit strains weekly to ISP for characterization and susceptibility testing. No weekly figure traceable to a URL is available for EW 22.",
      "sources": ["isp", "minsal"]
    },
    {
      "id": "amr",
      "name_es": "Resistencia antimicrobiana (RAM)",
      "name_en": "Antimicrobial resistance (AMR)",
      "icon": "bi-shield-shaded",
      "color": "#475569",
      "status": "monitoring",
      "status_label_es": "Vigilancia",
      "status_label_en": "Surveillance",
      "page": "pathogens/amr.html",
      "stats": [
        {"value": "—", "label_es": "Aislados resistentes SE 22", "label_en": "Resistant isolates EW 22"},
        {"value": "ISP", "label_es": "Laboratorio de referencia", "label_en": "Reference laboratory"},
        {"value": "—", "label_es": "Alertas RAM activas", "label_en": "Active AMR alerts"}
      ],
      "summary_es": "La vigilancia de resistencia antimicrobiana se sustenta en el estudio de susceptibilidad de cepas enviadas al ISP (Salmonella, Shigella, Campylobacter, Listeria y agentes IAAS, entre otros). No hay un indicador semanal trazable a una URL para la SE 22.",
      "summary_en": "Antimicrobial resistance surveillance relies on susceptibility testing of strains submitted to ISP (Salmonella, Shigella, Campylobacter, Listeria and HAI agents, among others). No weekly indicator traceable to a URL is available for EW 22.",
      "sources": ["isp"]
    }
  ]
}
```

### FILE: data/curated/highlights.json
```json
{
  "schema_version": 1,
  "updated_at": "2026-06-09T00:00:00Z",
  "items": [
    {
      "id": "hl-flu-se22",
      "title_es": "Positividad respiratoria sube a 45% en la SE 22",
      "title_en": "Respiratory positivity rises to 45% in EW 22",
      "metric_value": "45%",
      "metric_label_es": "Positividad respiratoria SE 22",
      "metric_label_en": "Respiratory positivity EW 22",
      "link": "pathogens/influenza.html"
    },
    {
      "id": "hl-hanta-se22",
      "title_es": "Hantavirus: 39 casos y 13 fallecidos en 2026",
      "title_en": "Hantavirus: 39 cases and 13 deaths in 2026",
      "metric_value": "33%",
      "metric_label_es": "Letalidad acumulada 2026",
      "metric_label_en": "Cumulative case fatality 2026",
      "link": "pathogens/hantavirus.html"
    },
    {
      "id": "hl-dengue-se22",
      "title_es": "Dengue: brote autóctono activo en Rapa Nui",
      "title_en": "Dengue: active autochthonous outbreak in Rapa Nui",
      "metric_value": "22",
      "metric_label_es": "Casos autóctonos Rapa Nui 2026",
      "metric_label_en": "Autochthonous cases Rapa Nui 2026",
      "link": "pathogens/dengue.html"
    },
    {
      "id": "hl-flu-vacc-se22",
      "title_es": "Cobertura de vacunación contra influenza en 61%",
      "title_en": "Influenza vaccination coverage at 61%",
      "metric_value": "61.2%",
      "metric_label_es": "Cobertura nacional influenza",
      "metric_label_en": "National influenza coverage",
      "link": "pathogens/influenza.html"
    }
  ]
}
```

### FILE: data/curated/news.json
```json
{
  "schema_version": 1,
  "updated_at": "2026-06-09T00:00:00Z",
  "items": [
    {
      "id": "flu-se22",
      "iso_date": "2026-06-09",
      "date_label": "SE 22 · Jun 2026",
      "title_es": "Influenza A en alza por sexta semana consecutiva",
      "title_en": "Influenza A rising for a sixth consecutive week",
      "link": "pathogens/influenza.html",
      "tags": ["update"],
      "severity": "medium",
      "summary_es": "En la SE 22 la positividad respiratoria llegó a 45% e Influenza A se consolidó como segundo agente, mientras la cobertura de vacunación se mantiene en torno a 61%.",
      "summary_en": "In EW 22 respiratory positivity reached 45% and Influenza A consolidated as the second agent, while vaccination coverage holds near 61%."
    },
    {
      "id": "dengue-rapanui-se22",
      "iso_date": "2026-05-25",
      "date_label": "SE 21 · May 2026",
      "title_es": "Dengue: brote autóctono en Rapa Nui y casos importados en el continente",
      "title_en": "Dengue: autochthonous outbreak in Rapa Nui and imported cases on the mainland",
      "link": "pathogens/dengue.html",
      "tags": ["incident", "alert"],
      "severity": "high",
      "summary_es": "Se contabilizan 22 casos autóctonos en Rapa Nui y 14 importados en el continente, con alerta sanitaria por Aedes aegypti vigente entre Arica y Los Ríos.",
      "summary_en": "There are 22 autochthonous cases in Rapa Nui and 14 imported on the mainland, with an active Aedes aegypti sanitary alert from Arica to Los Ríos."
    },
    {
      "id": "hanta-se22",
      "iso_date": "2026-05-06",
      "date_label": "SE 19 · May 2026",
      "title_es": "Hantavirus: 39 casos y 13 fallecidos en 9 regiones",
      "title_en": "Hantavirus: 39 cases and 13 deaths across 9 regions",
      "link": "pathogens/hantavirus.html",
      "tags": ["incident", "alert"],
      "severity": "high",
      "summary_es": "El MINSAL reportó 39 casos confirmados con 13 fallecidos (letalidad 33%), por sobre la temporada 2025, manteniendo la alerta sanitaria reforzada desde enero.",
      "summary_en": "MINSAL reported 39 confirmed cases with 13 deaths (33% case fatality), above the 2025 season, keeping the reinforced sanitary alert active since January."
    },
    {
      "id": "mpox-cladeIb-se22",
      "iso_date": "2026-03-17",
      "date_label": "SE 11 · Mar 2026",
      "title_es": "Mpox: vigilancia regional del clado Ib tras caso en Argentina",
      "title_en": "Mpox: regional surveillance of clade Ib after case in Argentina",
      "link": "pathogens/mpox.html",
      "tags": ["update", "policy"],
      "severity": "info",
      "summary_es": "Argentina confirmó su primer caso de Mpox clado Ib, de mayor severidad y contagiosidad; Chile mantiene alerta sanitaria nacional y vigilancia activa en el ISP.",
      "summary_en": "Argentina confirmed its first clade Ib Mpox case, of higher severity and transmissibility; Chile maintains its national sanitary alert and active ISP surveillance."
    }
  ]
}
```

### FILE: data/curated/pathogens/influenza.json
```json
{
  "schema_version": 1,
  "pathogen": "influenza",
  "updated_at": "2026-06-09T00:00:00Z",
  "status": "endemic",
  "headline_stats": [
    {"id": "positivity", "value": "45%",
     "label_es": "Positividad respiratoria SE 22", "label_en": "Respiratory positivity EW 22"},
    {"id": "fluA_share", "value": "27%",
     "label_es": "Influenza A (2º agente)", "label_en": "Influenza A (2nd agent)"},
    {"id": "vacc_coverage", "value": "61.2%",
     "label_es": "Cobertura vacunación", "label_en": "Vaccination coverage"}
  ],
  "notes_es": "Durante la SE 22 (1–6 junio 2026) la positividad de muestras respiratorias alcanzó 45%, superando el 41,4% de la semana previa, con rinovirus predominante e Influenza A como segundo agente en alza sostenida. Casi un tercio de las consultas de urgencia fueron de causa respiratoria. La cobertura de vacunación contra influenza se ubica en torno a 61%, por debajo de la meta de invierno.",
  "notes_en": "During EW 22 (Jun 1–6, 2026) respiratory sample positivity reached 45%, up from 41.4% the prior week, with rhinovirus predominating and Influenza A the second agent rising steadily. Nearly a third of emergency consultations were respiratory. Influenza vaccination coverage stands near 61%, below the winter target.",
  "sources": [
    {"id": "minsal_invierno_se22",
     "name": "La Tercera — Reporte Campaña de Invierno 2026, SE 22",
     "url": "https://www.latercera.com/nacional/noticia/percepcion-de-riesgo-a-la-baja-la-razon-detras-de-las-lentas-campanas-de-vacunacion/",
     "retrieved_at": "2026-06-09"},
    {"id": "minsal_invierno_se21",
     "name": "El Periodista — Reporte Campaña de Invierno 2026, SE 20",
     "url": "https://www.elperiodista.cl/2026/05/positividad-de-virus-respiratorios-supera-el-45-y-aumenta-circulacion-de-influenza-a/",
     "retrieved_at": "2026-06-09"},
    {"id": "isp_resp_se10",
     "name": "ISP — Informe de Circulación de Virus Respiratorios SE10-2026",
     "url": "https://ispch.cl/wp-content/uploads/2026/03/Informe-circulacion-virus-respiratorios-SE10-17-03-2026-1.pdf",
     "retrieved_at": "2026-06-09"}
  ]
}
```

### FILE: data/curated/pathogens/rsv.json
```json
{
  "schema_version": 1,
  "pathogen": "rsv",
  "updated_at": "2026-06-09T00:00:00Z",
  "status": "monitoring",
  "headline_stats": [
    {"id": "positivity", "value": "—",
     "label_es": "Positividad VRS SE 22", "label_en": "RSV positivity EW 22"},
    {"id": "infant_immun", "value": "81.6%",
     "label_es": "Inmunización lactantes", "label_en": "Infant immunization"}
  ],
  "notes_es": "El VRS mantiene una proporción baja dentro de la circulación viral del invierno 2026 (1–3% en reportes recientes), con predominio de rinovirus e influenza A. La inmunización de lactantes con anticuerpos monoclonales superó el 81% en el reporte de abril. No se dispone de positividad VRS específica para la SE 22 trazable a una URL.",
  "notes_en": "RSV holds a low share of viral circulation in winter 2026 (1–3% in recent reports), with rhinovirus and influenza A predominating. Infant immunization with monoclonal antibodies exceeded 81% in the April report. RSV-specific positivity for EW 22 traceable to a URL is not available.",
  "sources": [
    {"id": "minsal_invierno_se14",
     "name": "MINSAL — Segundo Reporte Campaña de Invierno 2026 (inmunización VRS)",
     "url": "https://www.minsal.cl/segundo-reporte-de-campana-de-invierno-2026-rinovirus-influenza-a-y-covid-19-son-los-virus-de-mayor-circulacion-en-el-pais/",
     "retrieved_at": "2026-06-09"},
    {"id": "isp_resp_se18",
     "name": "ISP — Vigilancia de Virus Respiratorios (acumulado SE 18)",
     "url": "https://www.ispch.gob.cl/virusrespiratorios/",
     "retrieved_at": "2026-06-09"}
  ]
}
```

### FILE: data/curated/pathogens/covid19.json
```json
{
  "schema_version": 1,
  "pathogen": "covid19",
  "updated_at": "2026-06-09T00:00:00Z",
  "status": "endemic",
  "headline_stats": [
    {"id": "positivity", "value": "—",
     "label_es": "Positividad SARS-CoV-2 SE 22", "label_en": "SARS-CoV-2 positivity EW 22"},
    {"id": "cum_share_se18", "value": "16.3%",
     "label_es": "Distribución acumulada SE 18", "label_en": "Cumulative share EW 18"}
  ],
  "notes_es": "SARS-CoV-2 circula de forma endémica con baja positividad relativa durante el invierno 2026; en reportes recientes representó menos del 1% de las detecciones semanales, aunque acumula 16,3% de la distribución a la SE 18. La OMS mantiene bajo monitoreo las variantes KP.3.1.1, NB.1.8.1, XFG y BA.3.2. No hay positividad semanal para la SE 22 trazable a una URL.",
  "notes_en": "SARS-CoV-2 circulates endemically with low relative positivity during winter 2026; in recent reports it accounted for under 1% of weekly detections, though it represents 16.3% of the cumulative distribution through EW 18. WHO keeps variants KP.3.1.1, NB.1.8.1, XFG and BA.3.2 under monitoring. No weekly positivity for EW 22 is traceable to a URL.",
  "sources": [
    {"id": "isp_resp_se18",
     "name": "ISP — Vigilancia de Virus Respiratorios (acumulado SE 18)",
     "url": "https://www.ispch.gob.cl/virusrespiratorios/",
     "retrieved_at": "2026-06-09"},
    {"id": "isp_resp_se10_variants",
     "name": "ISP — Informe de Circulación de Virus Respiratorios SE10-2026 (variantes)",
     "url": "https://ispch.cl/wp-content/uploads/2026/03/Informe-circulacion-virus-respiratorios-SE10-17-03-2026-1.pdf",
     "retrieved_at": "2026-06-09"}
  ]
}
```

### FILE: data/curated/pathogens/hantavirus.json
```json
{
  "schema_version": 1,
  "pathogen": "hantavirus",
  "updated_at": "2026-06-09T00:00:00Z",
  "status": "alert",
  "headline_stats": [
    {"id": "cases_2026", "value": "39",
     "label_es": "Casos confirmados 2026", "label_en": "Confirmed cases 2026"},
    {"id": "deaths_2026", "value": "13",
     "label_es": "Fallecidos 2026", "label_en": "Deaths 2026"},
    {"id": "cfr_2026", "value": "33%",
     "label_es": "Letalidad 2026", "label_en": "Case fatality 2026"},
    {"id": "regions", "value": "9",
     "label_es": "Regiones con casos", "label_en": "Regions with cases"}
  ],
  "notes_es": "Al 6 de mayo de 2026 el MINSAL confirmó 39 casos de hantavirus con 13 fallecidos (letalidad 33%), por sobre la temporada 2025 (44 casos, 8 fallecidos, 18%). Los casos se distribuyen en 9 de 16 regiones, principalmente de la zona central y austral. El agente es el virus Andes, cuyo reservorio es el ratón de cola larga; el MINSAL mantiene alerta sanitaria reforzada desde enero de 2026.",
  "notes_en": "As of May 6, 2026, MINSAL confirmed 39 hantavirus cases with 13 deaths (33% case fatality), above the 2025 season (44 cases, 8 deaths, 18%). Cases span 9 of 16 regions, mainly the central and southern zones. The agent is Andes virus, whose reservoir is the long-tailed pygmy rice rat; MINSAL has kept a reinforced sanitary alert in place since January 2026.",
  "sources": [
    {"id": "minsal_hanta_efe_may06",
     "name": "SWI swissinfo / EFE — Cifras MINSAL hantavirus 2026",
     "url": "https://www.swissinfo.ch/spa/chile-registra-39-casos-de-hantavirus-en-lo-que-va-de-2026-y-un-aumento-de-la-letalidad/91376634",
     "retrieved_at": "2026-06-09"},
    {"id": "minsal_hanta_t13_may07",
     "name": "T13 — MINSAL informa casos de hantavirus (9 regiones)",
     "url": "https://www.t13.cl/noticia/nacional/en-medio-preocupacion-por-crucero-minsal-informa-cifra-casos-hantavirus-chile-7-5-2026",
     "retrieved_at": "2026-06-09"},
    {"id": "minsal_hanta_verano",
     "name": "MINSAL — Campaña de Verano: casos de hantavirus y recomendaciones",
     "url": "https://www.minsal.cl/campana-de-verano-minsal-informa-sobre-casos-de-hantavirus-y-entrega-recomendaciones/",
     "retrieved_at": "2026-06-09"}
  ]
}
```

### FILE: data/curated/pathogens/dengue.json
```json
{
  "schema_version": 1,
  "pathogen": "dengue",
  "updated_at": "2026-06-09T00:00:00Z",
  "status": "alert",
  "headline_stats": [
    {"id": "autoch_rapanui_2026", "value": "22",
     "label_es": "Casos autóctonos Rapa Nui 2026", "label_en": "Autochthonous cases Rapa Nui 2026"},
    {"id": "imported_mainland_2026", "value": "14",
     "label_es": "Casos importados continente", "label_en": "Imported cases mainland"},
    {"id": "autoch_mainland_2026", "value": "0",
     "label_es": "Casos autóctonos continente", "label_en": "Autochthonous cases mainland"}
  ],
  "notes_es": "En 2026 se reportaron 22 casos autóctonos de dengue en Rapa Nui, único territorio nacional con transmisión vectorial local establecida por Aedes aegypti, y 14 casos importados en el continente sin transmisión local. El MINSAL mantiene alerta sanitaria por Aedes aegypti entre Arica y Parinacota y Los Ríos, reforzada tras la detección del vector en el aeropuerto de Santiago en enero de 2026.",
  "notes_en": "In 2026, 22 autochthonous dengue cases were reported in Rapa Nui, the only national territory with established local Aedes aegypti vector transmission, plus 14 imported cases on the mainland with no local transmission. MINSAL maintains an Aedes aegypti sanitary alert from Arica y Parinacota to Los Ríos, reinforced after the vector was detected at Santiago's airport in January 2026.",
  "sources": [
    {"id": "unab_arbovirus_may25",
     "name": "Alerta Noticias Temuco — Dengue: casos importados y autóctonos 2026 (UNAB)",
     "url": "https://alertanoticiastemuco.cl/2026/05/25/alertas-sanitarias-chile-sarampion-dengue-ebola/",
     "retrieved_at": "2026-06-09"},
    {"id": "denguevisualatlas_rapanui_mar",
     "name": "Dengue Visual Atlas — Brote en Rapa Nui (SEREMI Valparaíso)",
     "url": "https://denguevisualatlas.com/en/dengue-in-easter-island-rapa-nui-outbreak-update-march-2026/",
     "retrieved_at": "2026-06-09"},
    {"id": "minsal_aedes_alerta",
     "name": "RedSalud / MINSAL — Alerta sanitaria por Aedes aegypti (Arica–Los Ríos)",
     "url": "https://www.redsalud.cl/noticias/alerta-sanitaria-por-mosquito-transmisor-del-dengue-y-otras-enfermedades",
     "retrieved_at": "2026-06-09"}
  ]
}
```

### FILE: data/curated/pathogens/mpox.json
```json
{
  "schema_version": 1,
  "pathogen": "mpox",
  "updated_at": "2026-06-09T00:00:00Z",
  "status": "contained",
  "headline_stats": [
    {"id": "cases_se22", "value": "—",
     "label_es": "Casos confirmados SE 22", "label_en": "Confirmed cases EW 22"},
    {"id": "national_alert", "value": "Activa",
     "label_es": "Alerta sanitaria nacional", "label_en": "National sanitary alert"},
    {"id": "clade_concern", "value": "Ib",
     "label_es": "Clado de mayor preocupación regional", "label_en": "Regional clade of concern"}
  ],
  "notes_es": "Chile mantiene la alerta sanitaria nacional por Mpox declarada en 2024, con vigilancia activa y capacidad diagnóstica por PCR en el ISP, sin un brote local activo reportado esta semana. A nivel regional se vigila el clado Ib, de mayor severidad y contagiosidad, confirmado en Argentina en marzo de 2026. No hay cifra de casos para la SE 22 trazable a una URL.",
  "notes_en": "Chile maintains its national Mpox sanitary alert declared in 2024, with active surveillance and ISP PCR diagnostic capacity, with no active local outbreak reported this week. Regionally, clade Ib, of higher severity and transmissibility, is being monitored after confirmation in Argentina in March 2026. No case figure for EW 22 is traceable to a URL.",
  "sources": [
    {"id": "minsal_mpox_alerta",
     "name": "MINSAL / La Tercera — Alerta sanitaria nacional por Mpox",
     "url": "https://www.latercera.com/nacional/noticia/viruela-del-mono-minsal-declara-alerta-sanitaria-de-manera-preventiva-y-llama-a-la-precaucion-en-viajes-al-extranjero/OTNWIAXZE5HNJOKFT3HBTR4GIY/",
     "retrieved_at": "2026-06-09"},
    {"id": "mpox_cladeIb_argentina",
     "name": "Diario de Cuyo — Primer caso de Mpox clado Ib en Argentina",
     "url": "https://www.diariodecuyo.com.ar/salud/confirman-el-primer-caso-viruela-del-mono-argentina-n6568363",
     "retrieved_at": "2026-06-09"}
  ]
}
```

### FILE: data/curated/pathogens/salmonella.json
```json
{
  "schema_version": 1,
  "pathogen": "salmonella",
  "updated_at": "2026-06-09T00:00:00Z",
  "status": "endemic",
  "headline_stats": [
    {"id": "strains_se22", "value": "—",
     "label_es": "Cepas notificadas SE 22", "label_en": "Strains reported EW 22"},
    {"id": "surveillance", "value": "ENO",
     "label_es": "Vigilancia obligatoria", "label_en": "Mandatory surveillance"}
  ],
  "notes_es": "Salmonella spp. es un agente endémico de transmisión alimentaria sujeto a vigilancia de laboratorio obligatoria: los laboratorios clínicos envían semanalmente las cepas aisladas al ISP, que realiza el estudio de susceptibilidad antimicrobiana y caracterización. No se dispone de una cifra semanal trazable a una URL para la SE 22; se reporta el marco de vigilancia.",
  "notes_en": "Salmonella spp. is an endemic foodborne agent under mandatory laboratory surveillance: clinical labs submit isolated strains weekly to ISP, which performs antimicrobial susceptibility testing and characterization. No weekly figure traceable to a URL is available for EW 22; the surveillance framework is reported.",
  "sources": [
    {"id": "isp_vigilancia_lab",
     "name": "ISP — Vigilancia de Laboratorio (agentes de notificación)",
     "url": "https://www.ispch.gob.cl/biomedico/vigilancia-de-laboratorio/",
     "retrieved_at": "2026-06-09"}
  ]
}
```

### FILE: data/curated/pathogens/amr.json
```json
{
  "schema_version": 1,
  "pathogen": "amr",
  "updated_at": "2026-06-09T00:00:00Z",
  "status": "monitoring",
  "headline_stats": [
    {"id": "resistant_se22", "value": "—",
     "label_es": "Aislados resistentes SE 22", "label_en": "Resistant isolates EW 22"},
    {"id": "reference_lab", "value": "ISP",
     "label_es": "Laboratorio de referencia", "label_en": "Reference laboratory"}
  ],
  "notes_es": "La vigilancia de resistencia antimicrobiana (RAM) se sustenta en el estudio de susceptibilidad de las cepas enviadas al ISP en el marco de la vigilancia de laboratorio (Salmonella, Shigella, Campylobacter, Listeria y agentes asociados a la atención de salud, entre otros). No existe un indicador semanal trazable a una URL para la SE 22; se reporta el marco de vigilancia.",
  "notes_en": "Antimicrobial resistance (AMR) surveillance relies on susceptibility testing of strains submitted to ISP under laboratory surveillance (Salmonella, Shigella, Campylobacter, Listeria and healthcare-associated agents, among others). No weekly indicator traceable to a URL is available for EW 22; the surveillance framework is reported.",
  "sources": [
    {"id": "isp_vigilancia_lab",
     "name": "ISP — Vigilancia de Laboratorio (susceptibilidad antimicrobiana)",
     "url": "https://www.ispch.gob.cl/biomedico/vigilancia-de-laboratorio/",
     "retrieved_at": "2026-06-09"}
  ]
}
```

### NOTAS PARA EL EDITOR
- Cambios principales en esta semana: actualización a SE 22-2026 (período 1–6 jun). Influenza A en alza sostenida (≈6ª–7ª semana) con positividad respiratoria global de 45% (sube desde 41,4% en SE 19/20); cobertura de vacunación contra influenza ≈61,2%. Hantavirus y dengue se mantienen en `status:"alert"` sin cambios estructurales respecto de semanas previas; solo se actualizó el número de SE en el banner de la home.
- Fuentes que no respondieron / no entregaron dato semanal SE 22: el boletín ISP de virus respiratorios más reciente con cifras desglosadas trazables es SE 10-2026 (PDF) y el resumen web acumulado a SE 18. Los reportes MINSAL de Campaña de Invierno (puntos de prensa semanales) sí cubren SE 20–22 vía prensa institucional/medios; no se ubicó el PDF ISP individual de SE 22 con URL directa al cierre.
- Cifras marcadas con "—": positividad semanal específica de VRS, SARS-CoV-2, salmonella y RAM para la SE 22 (sin dato semanal trazable a URL); casos Mpox SE 22 (sin brote local activo notificado). Salmonella y RAM se reportan con el marco de vigilancia de laboratorio del ISP, no con conteo semanal.
- Items nuevos de news.json con severidad alta: `hanta-se22` (39 casos / 13 fallecidos, 33% letalidad) y `dengue-rapanui-se22` (22 autóctonos en Rapa Nui + 14 importados continente). Ambos llevan `tags:["incident","alert"]` y por tanto aparecen en el panel destacado de `events.html`.
- Notas de trazabilidad: varias cifras de hantavirus y dengue provienen de declaraciones del MINSAL recogidas por agencias/medios (EFE, T13, prensa regional UNAB) por no haberse ubicado el dataset DEIS/EPI con URL directa al cierre; se recomienda al editor validar contra epi.minsal.cl y deis.minsal.cl antes de publicar y, de existir el dato oficial, reemplazar la URL en el campo `sources` correspondiente.
