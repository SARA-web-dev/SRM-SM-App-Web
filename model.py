import sys
import json
import re
import os
from pdfminer.high_level import extract_text
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split
import joblib
import nltk
from nltk.corpus import stopwords
from datetime import datetime
import numpy as np

# Télécharger les stopwords français si nécessaire
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

STOPWORDS_FR = set(stopwords.words('french'))

# Domaines et compétences associées (base de données étendue)
DOMAINES_COMPETENCES = {
    'informatique': {
        'keywords': [ # Langages
            'python', 'java', 'javascript', 'typescript', 'sql', 'html', 'css', 'sass', 'less',
            'react', 'angular', 'vue', 'svelte', 'nextjs', 'nuxtjs', 'gatsby', 'node', 'express',
            'php', 'symfony', 'laravel', 'wordpress', 'drupal', 'c++', 'c#', 'dotnet', 'asp.net',
            'ruby', 'rails', 'go', 'golang', 'rust', 'scala', 'kotlin', 'swift', 'objective-c',
            'flutter', 'dart', 'react native', 'xamarin', 'ionic', 'cordova',
            # Cloud/DevOps
            'aws', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'terraform',
            'ansible', 'jenkins', 'gitlab ci', 'github actions', 'ci/cd', 'devops', 'sre',
            'microservices', 'serverless', 'lambda', 'cloudformation', 'helm', 'prometheus',
            'grafana', 'elk', 'elasticsearch', 'kibana', 'logstash', 'vault', 'consul',
            # Data/IA
            'machine learning', 'deep learning', 'neural networks', 'computer vision',
            'nlp', 'natural language processing', 'tensorflow', 'pytorch', 'scikit-learn',
            'pandas', 'numpy', 'matplotlib', 'seaborn', 'plotly', 'jupyter', 'google colab',
            'hadoop', 'spark', 'kafka', 'airflow', 'dbt', 'snowflake', 'bigquery', 'redshift',
            'postgresql', 'mysql', 'mongodb', 'redis', 'cassandra', 'neo4j', 'elasticsearch',
            'api', 'rest', 'graphql', 'websocket', 'grpc', 'openapi', 'swagger',
            # Sécurité
            'cybersecurity', 'pentesting', 'owasp', 'siem', 'soc', 'vulnerability', 'firewall',
            'encryption', 'ssl', 'tls', 'oauth', 'jwt', 'saml', 'ldap', 'active directory',
            # Outils
            'git', 'github', 'gitlab', 'bitbucket', 'jira', 'confluence', 'trello', 'slack',
            'figma', 'postman', 'docker', 'kubernetes', 'linux', 'bash', 'powershell',
            # === === Réseaux & Télécoms === ===
            # Protocoles & standards
            'tcp/ip', 'udp', 'http', 'https', 'ftp', 'smtp', 'pop3', 'imap', 'dns', 'dhcp',
            'ospf', 'bgp', 'mpls', 'vlan', 'vpn', 'ipsec', 'ssl', 'tls', '802.1x', 'stp', 'rstp',
            'qos', 'nat', 'pat', 'ipv4', 'ipv6', 'voip', 'sip', 'rtp', 'rtcp', 'webrtc',
            # Matériel & infrastructure
            'routeur', 'switch', 'firewall', 'load balancer', 'proxy', 'gateway', 'modem',
            'cisco', 'juniper', 'hp aruba', 'fortinet', 'palo alto', 'f5', 'barracuda',
            'access point', 'antenne', 'répéteur', 'câble fibre', 'câble cuivre', 'utp', 'stp',
            'sfp', 'qsfp', 'gbic', 'sfp+', 'dac', 'aoc', 'patch panel', 'baie 19',
            # Sans fil & mobile
            'wifi 6', 'wifi 6e', '5g', '4g lte', '3g', '2g', 'gsm', 'umts', 'hspa', 'nb-iot',
            'lora', 'sigfox', 'bluetooth', 'zigbee', 'z-wave', 'rfid', 'nfc', 'satellite',
            # Sécurité réseau
            'ids', 'ips', 'siem', 'soc', 'firewall next-gen', 'utm', 'waf', 'ddos mitigation',
            'penetration testing', 'vulnerability assessment', 'network forensics', 'zero trust',
            # Cloud & virtualisation réseau
            'sdn', 'nfv', 'openstack', 'kubernetes networking', 'docker networking', 'vxlan',
            'geneve', 'nsx', 'aci', 'aws vpc', 'azure vnet', 'gcp vpc', 'cloud networking',
            # Outils & supervision
            'wireshark', 'nmap', 'nessus', 'openvas', 'nagios', 'zabbix', 'prometheus', 'grafana',
            'ansible', 'terraform', 'cisco packet tracer', 'gns3', 'eve-ng', 'prtg',
            'snmp', 'netflow', 'sflow', 'ipfix', 'syslog', 'radius', 'tacacs+',
            'linux', 'windows', 'macos', 'android', 'ios', 'bash', 'powershell'],
        'weight': 1.0
    },
    'gestion': {
        'keywords': [# Finance/Compta
            'comptabilité', 'finance', 'budget', 'forecast', 'trésorerie', 'audit', 'contrôle de gestion',
            'reporting', 'analyse financière', 'ifrs', 'gaap', 'sap', 'oracle', 'excel', 'power bi',
            'tableau', 'qlikview', 'sap fico', 'hyperion', 'essbase', 'cash management',
            # RH
            'recrutement', 'talent acquisition', 'hr', 'paie', 'administration du personnel',
            'formation', 'learning and development', 'performance management', 'succession planning',
            'hris', 'workday', 'successfactors', 'adp', 'bamboohr', 'culture d\'entreprise',
            # Marketing
            'marketing', 'digital marketing', 'seo', 'sem', 'google ads', 'facebook ads',
            'social media', 'content marketing', 'email marketing', 'marketing automation',
            'hubspot', 'salesforce', 'crm', 'lead generation', 'brand management', 'publicité',
            # Stratégie
            'stratégie', 'planification stratégique', 'business plan', 'analyse swot',
            'benchmark', 'competitive analysis', 'due diligence', 'mergers acquisitions',
            # Général
            'powerpoint', 'word', 'outlook', 'teams', 'sharepoint', 'microsoft 365',
            'project management', 'agile', 'scrum', 'kanban', 'lean management', 'six sigma',
            # ===  Fiscalité & Commerce ===
            'fiscalité', 'impôt', 'tva', 'is', 'ir', 'tax compliance', 'droit fiscal',
            'optimisation fiscale', 'crédit d\'impôt', 'tax audit', 'transfer pricing',
            'droit douanier', 'douane', 'tarif douanier', 'incoterms', 'import export',
            'commerce international', 'trade finance', 'lettre de crédit', 'documentary credit',
            'supply chain finance', 'factoring', 'affacturage', 'lc', 'dp', 'da', 'dpu',
            'export', 'import', 'commodities', 'trading', 'négociation commerciale',
            'pricing', 'tarification', 'marge commerciale', 'kpi commercial', 'vente',
            'force de vente', 'sales management', 'account management', 'business development',
            'retail', 'e-commerce', 'marketplace', 'amazon', 'shopify', 'prestashop',
            'magento', 'woocommerce', 'seo e-commerce', 'sea', 'publicité digitale',
            'emailing', 'marketing automation', 'crm', 'salesforce', 'hubspot'],
        'weight': 1.0
    },
    'électricité et électromécanique': {
        'keywords': [# Électricité
            'circuit électrique', 'schéma électrique', 'automate programmable', 'plc', 'scada',
            'moteur électrique', 'transformateur', 'alternateur', 'redresseur', 'onduleur',
            'variateur', 'capteur', 'actionneur', 'relai', 'contacteur', 'disjoncteur',
            'câblage', 'câble', 'électrotechnique', 'électronique', 'électronique de puissance',
            # Automatisme
            'automatisme', 'robotique', 'système embarqué', 'arduino', 'raspberry pi',
            'microcontrôleur', 'pic', 'stm32', 'fpga', 'vhdl', 'verilog', 'labview',
            # Mécanique
            'mécanique', 'thermodynamique', 'fluide', 'hydraulique', 'pneumatique',
            'moteur thermique', 'transmission', 'engrenage', 'pompe', 'compresseur',
            'turbine', 'vannes', 'tuyauterie', 'chaudronnerie', 'soudage', 'tournage', 'fraisage',
            # Logiciels
            'matlab', 'simulink', 'autocad', 'solidworks', 'catia', 'inventor', 'solid edge',
            'ansys', 'comsol', 'labview', 'codesys', 'step7', 'tia portal', 'rslogix'],
        'weight': 1.0
    },
    'génie civil': {
        'keywords': [# Matériaux
            'béton', 'béton armé', 'béton précontraint', 'acier', 'charpente métallique',
            'bois', 'maçonnerie', 'plâtre', 'isolation', 'étanchéité', 'goudron', 'asphalte',
            # Structures
            'calcul de structure', 'résistance des matériaux', 'rdm', 'stabilité', 'fondation',
            'poutre', 'poteau', 'dalle', 'voile', 'mur de soutènement', 'pont', 'tunnel',
            'barrage', 'bâtiment', 'charpente', 'ossature', 'ossature bois', 'ossature métallique',
            # Logiciels
            'autocad', 'revit', 'tekla', 'robot structural', 'advance design', 'graitec',
            'arcgis', 'qgis', 'covadis', 'autocad civil 3d', 'infraworks', 'plaxis',
            # Génie civil
            'génie civil', 'construction', 'travaux publics', 'btp', 'vrd', 'assainissement',
            'hydraulique urbaine', 'géotechnique', 'étude de sol', 'topographie', 'géomètre',
            'métreur', 'conducteur travaux', 'planification chantier', 'méthode', 'planning'],
        'weight': 1.0
    },
    'logistique et transport': {
        'keywords': [# Supply Chain
            'supply chain', 'chaine logistique', 'logistique', 'transport', 'entrepôt',
            'stock', 'inventaire', 'gestion des stocks', 'wms', 'sap', 'oracle wms',
            'manutention', 'préparation commandes', 'picking', 'packing', 'expédition',
            'réception', 'cross docking', 'flux physique', 'flux d\'information',
            # Transport
            'transport routier', 'transport maritime', 'transport aérien', 'transport ferroviaire',
            'fret', 'logistique internationale', 'douane', 'incoterms', 'transit', 'cargaison',
            'palette', 'container', 'camion', 'semi-remorque', 'tms', 'transport management',
            # Optimisation
            'optimisation', 'lean logistics', 'juste à temps', 'kanban', 'mrp', 'drp',
            'forecasting', 'demand planning', 'replenishment', 's&op', 'sales and operations planning'],
        'weight': 1.0
    },
    'ressources humaines': {
        'keywords': [ # Recrutement
            'recrutement', 'talent acquisition', 'sourcing', 'entretien', 'assessment center',
            'linkedin', 'indeed', 'welcome to the jungle', 'cv', 'lettre motivation',
            'référence', 'background check', 'onboarding', 'integration', 'offre d\'emploi',
            # RH Général
            'gestion des talents', 'gpec', 'classement', 'mobilité interne', 'promotion',
            'rémunération', 'avantage social', 'intéressement', 'participation', 'prevoyance',
            'mutuelle', 'comité d\'entreprise', 'ce', 'dp', 'délégué du personnel', 'chssct',
            # Formation
            'formation', 'plan de formation', 'gpec', 'bilan compétences', 'vae',
            'droit du travail', 'convention collective', 'code du travail', 'licenciement',
            'rupture conventionnelle', 'départ négocié', 'prud\'hommes', 'inspection du travail'],
        'weight': 1.0
    }
}

# Données d'entraînement synthétiques pour le modèle
TRAINING_DATA = {
    'informatique': [
        "Développeur Python avec 3 ans d'expérience en Django et Flask. Maîtrise de SQL, Git, Docker.",
        "Ingénieur logiciel spécialisé en JavaScript, React, Node.js. Expérience en développement web.",
        "Data Scientist avec compétences en machine learning, TensorFlow, scikit-learn, Python.",
        "Administrateur système Linux, Docker, Kubernetes, AWS. DevOps et CI/CD.",
        "Développeur mobile Android/iOS, Flutter, React Native. Applications mobiles.",
        "Développeur full-stack Python/React chez Capgemini avec 5 ans d'expérience",
        "Architecte cloud AWS spécialisé en microservices et Kubernetes",
        "Data scientist senior avec expertise en TensorFlow et computer vision",
        "Lead dev mobile Flutter pour applications bancaires",
        "DevOps expert en CI/CD avec Jenkins et Docker",
        "Ingénieur sécurité avec certifications CISSP et pentesting",
        "Développeur blockchain Ethereum/Solidity",
        "Data engineer avec Spark et Kafka chez BlaBlaCar",
        "Architecte logiciel Java/Spring Boot",
        "Ingénieur machine learning NLP chez Doctolib",
        "Tech lead React/Node.js pour plateforme e-commerce",
        "SRE chez Google avec expertise Kubernetes et monitoring",
        "Développeur backend Go avec Redis et PostgreSQL",
        "Data architect avec Snowflake et dbt",
        "Cybersecurity analyst avec SIEM et incident response",
        "Mobile developer iOS Swift pour app santé",
        "Full-stack developer avec Next.js et Prisma",
        "DevOps avec Terraform et Ansible",
        "Data scientist avec PyTorch et transformers",
        "CTO avec expertise architecture scalable",
        "Ingénieur réseaux Cisco CCNP avec 8 ans sur infrastructure globale",
        "Administrateur systèmes Linux et réseaux avec expertise firewalls Fortinet",
        "Architecte réseaux SD-WAN pour 500 sites internationaux",
        "Technicien support réseaux avec maîtrise VLAN et VPN",
        "Ingénieur sécurité réseaux avec IDS/IPS et SOC",
        "Expert VoIP/UC avec Cisco Call Manager et Asterisk",
        "Consultant réseaux 5G et IoT pour opérateur mobile",
        "Ingénieur cloud networking AWS VPC et Azure VNet",
        "Administrateur réseaux avec monitoring Nagios et Zabbix",
        "Technicien fibre optique avec fusion splicing et OTDR",
        "Ingénieur radio mobile avec expertise 4G/5G",
        "Architecte sécurité réseaux Zero Trust",
        "Consultant SDN avec OpenStack et VMware NSX",
        "Ingénieur réseaux satellites VSAT",
        "Technicien WiFi enterprise avec Aruba et Ruckus",
        "Expert en infrastructure datacenter avec spine-leaf",
        "Ingénieur MPLS et BGP pour backbone réseau",
        "Administrateur systèmes avec load balancing F5",
        "Technicien réseaux sans fil avec certification CWNA",
        "Architecte réseaux avec automatisation Ansible"
    ],
    'gestion': [
        "Contrôleur de gestion avec expertise en analyse financière, reporting, Excel avancé.",
        "Manager commercial avec expérience en négociation, CRM, développement business.",
        "Consultant en management, stratégie d'entreprise, amélioration des processus.",
        "Responsable marketing digital, SEO, SEM, réseaux sociaux, analytics.",
        "Auditeur interne avec maîtrise des normes ISO, contrôle qualité, audit financier.",
        "Contrôleur de gestion senior chez LVMH avec consolidation financière",
        "CFO avec expertise IFRS et reporting international",
        "Consultant en stratégie chez McKinsey avec focus retail",
        "Directeur marketing digital pour marque de luxe",
        "Auditeur financier Big 4 avec certifications CPA",
        "Business analyst avec expertise Excel et Power BI",
        "Directeur commercial B2B avec CRM Salesforce",
        "Contrôleur de gestion industriel avec SAP",
        "Responsable paie et administration du personnel",
        "Consultant en transformation digitale",
        "Finance manager avec trésorerie et cash management",
        "Directeur des ressources humaines chez Total",
        "Chef de projet ERP SAP S/4HANA",
        "Analyste financier avec modélisation avancée",
        "Responsable marketing automation HubSpot",
        "Auditeur interne avec normes ISO 9001",
        "Business development manager SaaS",
        "Directeur financier startup scale-up",
        "Consultant RH avec expertise gpec",
        "Head of finance pour groupe international",
        "Chef fiscaliste avec optimisation IS et TVA pour groupe CAC40",
        "Responsable douane et commerce international avec Incoterms 2020",
        "Consultant fiscalité internationale et transfer pricing",
        "Expert-comptable avec expertise fiscale PME/PMI",
        "Responsable compliance douanière pour import/export textile",
        "Fiscaliste immobilier avec optimisation IS et plus-values",
        "Gestionnaire commerce international avec lettres de crédit",
        "Auditeur fiscal avec expertise contrôles fiscaux",
        "Responsable fiscalité groupe avec consolidation fiscale",
        "Négociateur commercial export vers marchés asiatiques",
        "Consultant TVA e-commerce et marketplaces",
        "Responsable douane avec tarif douanier et DDP",
        "Fiscaliste digital avec crédit d'impôt innovation",
        "Commercial grands comptes avec contrats internationaux",
        "Expert fiscalité crypto-actifs et blockchain",
        "Responsable commerce international avec supply chain finance",
        "Fiscaliste R&D avec crédit impôt recherche",
        "Business developer commerce B2B avec levée de fonds",
        "Responsable fiscalité immobilière et sociétés",
        "Consultant commerce international avec factoring et affacturage"
    ],
    'électricité et électromécanique': [
        "Ingénieur électricien spécialisé en automatisme industriel, PLC, SCADA.",
        "Technicien en électronique de puissance, variateurs, moteurs électriques.",
        "Ingénieur en énergies renouvelables, photovoltaïque, éolien.",
        "Automaticien avec expertise en robotique industrielle, capteurs, actionneurs.",
        "Ingénieur maintenance électromécanique, diagnostic, réparation équipements.",
        "Ingénieur électricien chez Schneider Electric",
        "Automaticien industriel avec Siemens S7",
        "Technicien maintenance électromécanique chez Airbus",
        "Ingénieur systèmes embarqués automobiles",
        "Expert en électronique de puissance pour énergies renouvelables",
        "Technicien en robotique industrielle ABB",
        "Ingénieur CVC avec expertise en régulation",
        "Electricien industriel avec automatisme",
        "Responsable maintenance préventive machines tournantes",
        "Ingénieur énergies renouvelables (solaire/éolien)",
        "Technicien instrumentation et mesure",
        "Projeteur électrique avec AutoCAD Electrical",
        "Ingénieur systèmes photovoltaïques",
        "Technicien automates programmables",
        "Maintenance industrielle hydraulique et pneumatique",
        "Ingénieur réseaux électriques HT/HTA",
        "Technicien maintenance turbines",
        "Electricien navale avec STCW",
        "Ingénieur systèmes d'alarme incendie",
        "Responsable travaux neufs électriques"
    ],
    'génie civil': [
        "Ingénieur structure spécialisé en béton armé, calcul de structures, Robot Structural.",
        "Conducteur de travaux BTP, planification chantier, suivi qualité, sécurité.",
        "Ingénieur géotechnique, étude de sols, fondations, stabilité des ouvrages.",
        "Architecte avec maîtrise d'AutoCAD, Revit, conception architecturale.",
        "Ingénieur VRD, voirie, réseaux divers, assainissement, hydraulique urbaine.",
        "Ingénieur structure béton armé chez Vinci",
        "Conducteur de travaux BTP chez Bouygues",
        "Chef de projet construction immobilière",
        "Ingénieur géotechnique avec étude de sol",
        "Technicien topographe avec station totale",
        "Projeteur bim avec Revit",
        "Ingénieur ponts et chaussées",
        "Responsable sécurité chantier",
        "Métreur avec expertise en métré",
        "Architecte DPLG avec maîtrise d'œuvre",
        "Ingénieur VRD avec expertise assainissement",
        "Conducteur engins de chantier",
        "Chef de chantier construction métallique",
        "Ingénieur tunnels avec TBM",
        "Technicien études de prix BTP",
        "Responsable qualité construction",
        "Ingénieur béton précontraint",
        "Projeteur structure avec Tekla",
        "Technicien méthodes travaux publics",
        "Directeur de travaux construction"
    ],
    'logistique et transport': [
        "Responsable supply chain, optimisation des flux, gestion des stocks, WMS.",
        "Logisticien transport international, douane, incoterms, transit.",
        "Gestionnaire d'entrepôt, manutention, préparation commandes, traçabilité.",
        "Planificateur logistique, forecasting, MRP, optimisation des approvisionnements.",
        "Consultant en amélioration continue, lean manufacturing, kaizen.",
        "Responsable supply chain chez Amazon",
        "Logisticien transport international avec Incoterms",
        "Gestionnaire d'entrepôt avec WMS",
        "Planificateur logistique avec SAP",
        "Responsable transport et distribution",
        "Coordinateur douane et import/export",
        "Supply chain analyst avec optimisation",
        "Responsable flux logistiques e-commerce",
        "Gestionnaire stock avec méthode Kanban",
        "Responsable transit et douane",
        "Logisticien pharma avec traçabilité",
        "Coordinateur supply chain international",
        "Responsable logistique industrielle",
        "Gestionnaire approvisionnement JIT",
        "Responsable entrepôt avec gestion d'équipe",
        "Analyste logistique avec Power BI",
        "Responsable transport frigorifique",
        "Logisticien automobile avec séquençage",
        "Coordinateur flux e-commerce",
        "Directeur supply chain Europe"
    ],
    'ressources humaines': [
        "Responsable recrutement, sourcing candidats, entretiens, assessment.",
        "Gestionnaire paie, droit du travail, SIRH, administration du personnel.",
        "Consultant en formation, ingénierie pédagogique, développement compétences.",
        "DRH généraliste, relations sociales, négociation, management équipes.",
        "Coach professionnel, développement personnel, accompagnement carrière.",
        "Responsable recrutement IT chez Ubisoft",
        "Gestionnaire paie avec 500+ collaborateurs",
        "Consultant formation et développement",
        "DRH PME avec gestion globale RH",
        "Responsable relations sociales et syndicales",
        "Business partner RH avec expertise IT",
        "Chargé de recrutement cadres",
        "Gestionnaire formation avec budget",
        "Responsable administration du personnel",
        "Consultant en gestion des talents",
        "Responsable diversité et inclusion",
        "Chargé de mission RH transformation",
        "Gestionnaire paie international",
        "Responsable développement RH",
        "Consultant bilan de compétences",
        "DRH adjoint avec expertise droit social",
        "Responsable formation digital learning",
        "Chargé de recrutement alternance",
        "Consultant RH avec expertise gpec",
        "Head of HR pour startup scale-up"
    ]
}

def extract_text_from_pdf(pdf_path):
    """Extrait le texte d'un fichier PDF"""
    try:
        if not os.path.exists(pdf_path):
            print(f"Erreur: Fichier {pdf_path} introuvable", file=sys.stderr)
            return ""
        
        text = extract_text(pdf_path)
        if not text or len(text.strip()) < 50:
            print(f"Attention: Texte extrait très court ({len(text)} caractères)", file=sys.stderr)
        
        return text
    except Exception as e:
        print(f"Erreur lecture PDF {pdf_path}: {e}", file=sys.stderr)
        return ""

def clean_text(text):
    """Nettoie et normalise le texte"""
    if not text:
        return ""
    
    # Convertir en minuscules
    text = text.lower()
    
    # Supprimer les caractères spéciaux mais garder les espaces
    text = re.sub(r'[^\w\s]', ' ', text)
    
    # Supprimer les espaces multiples
    text = re.sub(r'\s+', ' ', text)
    
    # Supprimer les mots très courts (moins de 3 caractères)
    words = [word for word in text.split() if len(word) >= 3]
    
    # Supprimer les stopwords français
    words = [word for word in words if word not in STOPWORDS_FR]
    
    return ' '.join(words)

def extract_experience_years(text):
    """Extrait le nombre d'années d'expérience du CV"""
    if not text:
        return 0

    text_lower = text.lower()
    experience_years = 0

    # Patterns avancés
    patterns = [
        r'(\d+)\s*(?:ans?|années?)\s*(?:d[\'e]|de)?\s*(?:expérience|experience|exp|travail)',
        r'(?:expérience|experience|exp)\s*(?:de|d[\'e])?\s*(\d+)\s*(?:ans?|années?|years?)',
        r'(\d+)\s*(?:years?)\s*(?:of)?\s*(?:experience|exp)',
        r'(?:plus de|over)\s+(\d+)\s*(?:ans?|années?|years?)',
        r'(\d+)\+?\s*(?:ans?|années?)\s*(?:d[\'e]|de)?\s*(?:expérience|experience|travail)',
        r'(\d{4})\s*-\s*(\d{4})',  # Format 2018-2024
    ]

    for pattern in patterns:
        matches = re.findall(pattern, text_lower)
        if matches:
            for match in matches:
                if isinstance(match, tuple):
                    # Cas 2018-2024
                    start, end = int(match[0]), int(match[1])
                    years = end - start
                    experience_years = max(experience_years, years)
                else:
                    years = int(match)
                    experience_years = max(experience_years, years)

    # Fallback : compter les années mentionnées explicitement
    year_pattern = r'\b(20\d{2})\b'
    years = re.findall(year_pattern, text_lower)
    if years:
        current_year = datetime.now().year
        min_year = min(int(y) for y in years)
        experience_years = max(experience_years, current_year - min_year)

    return min(experience_years, 20)

"""def extract_experience_years(text):
    "Extrait le nombre d'années d'expérience du CV"
    if not text:
        return 0
    
    text_lower = text.lower()
    experience_years = 0
    
    # Patterns pour détecter l'expérience
    patterns = [
        r'(\d+)\s*(?:ans?|années?)\s*(?:d[\'e]|de)?\s*(?:expérience|experience)',
        r'(?:expérience|experience)\s*(?:de|d[\'e])?\s*(\d+)\s*(?:ans?|années?)',
        r'(\d+)\s*(?:years?)\s*(?:of)?\s*(?:experience|exp)',
        r'(?:experience|exp)\s*(?:of)?\s*(\d+)\s*(?:years?)',
    ]
    
    for pattern in patterns:
        matches = re.findall(pattern, text_lower)
        if matches:
            years = [int(match) for match in matches if match.isdigit()]
            if years:
                experience_years = max(experience_years, max(years))
    
    # Alternative: compter les emplois/stages mentionnés
    if experience_years == 0:
        job_keywords = ['stage', 'emploi', 'poste', 'position', 'job', 'work', 'travail']
        job_count = sum(len(re.findall(rf'\b{keyword}\b', text_lower)) for keyword in job_keywords)
        experience_years = min(job_count, 5)  # Maximum 5 ans basé sur le nombre d'emplois
    
    return min(experience_years, 20)  # Limiter à 20 ans maximum"""

def extract_skills_for_domain(text, domaine):
    """Extrait les compétences pertinentes pour un domaine donné"""
    if not text or not domaine:
        return []
    
    text_clean = clean_text(text)
    domaine_clean = domaine.lower().strip()
    
    # Trouver le domaine correspondant
    domain_info = None
    for domain_key, info in DOMAINES_COMPETENCES.items():
        if domain_key in domaine_clean or domaine_clean in domain_key:
            domain_info = info
            break
    
    if not domain_info:
        # Domaine non reconnu, retourner une liste vide
        return []
    
    # Chercher les compétences dans le texte
    found_skills = []
    for skill in domain_info['keywords']:
        # Recherche exacte et variations
        skill_patterns = [
            rf'\b{re.escape(skill)}\b',
            rf'\b{re.escape(skill.replace(" ", ""))}\b',  # Sans espaces
            rf'\b{re.escape(skill.replace("-", ""))}\b',  # Sans tirets
        ]
        
        for pattern in skill_patterns:
            if re.search(pattern, text_clean, re.IGNORECASE):
                found_skills.append(skill)
                break
    
    # Supprimer les doublons et limiter le nombre
    unique_skills = list(set(found_skills))
    return unique_skills[:15]  # Limiter à 15 compétences maximum

def train_or_load_model():
    """Entraîne ou charge le modèle de classification"""
    model_path = os.path.join(os.path.dirname(__file__), 'domain_classifier.joblib')
    vectorizer_path = os.path.join(os.path.dirname(__file__), 'tfidf_vectorizer.joblib')
    
    # Vérifier si les modèles existent déjà
    if os.path.exists(model_path) and os.path.exists(vectorizer_path):
        try:
            model = joblib.load(model_path)
            vectorizer = joblib.load(vectorizer_path)
            return model, vectorizer
        except:
            pass  # Si erreur de chargement, réentraîner
    
    # Préparer les données d'entraînement
    texts = []
    labels = []
    
    for domain, examples in TRAINING_DATA.items():
        for example in examples:
            texts.append(clean_text(example))
            labels.append(domain)
    
    # Créer et entraîner le vectoriseur TF-IDF
    vectorizer = TfidfVectorizer(
        max_features=1000,
        ngram_range=(1, 2),
        min_df=1,
        max_df=0.95
    )
    
    X = vectorizer.fit_transform(texts)
    
    # Entraîner le modèle Naive Bayes
    model = MultinomialNB(alpha=0.1)
    model.fit(X, labels)
    
    # Sauvegarder les modèles
    try:
        joblib.dump(model, model_path)
        joblib.dump(vectorizer, vectorizer_path)
    except Exception as e:
        print(f"Attention: Impossible de sauvegarder le modèle: {e}", file=sys.stderr)
    
    return model, vectorizer

def calculate_domain_score(text, domaine, model, vectorizer):
    """Calcule le score de correspondance avec le domaine"""
    if not text:
        return 0.3
    
    try:
        # Transformer le texte avec le vectoriseur
        text_clean = clean_text(text)
        X = vectorizer.transform([text_clean])
        
        # Prédire les probabilités pour chaque domaine
        probabilities = model.predict_proba(X)[0]
        classes = model.classes_
        
        # Trouver la probabilité pour le domaine demandé
        domaine_clean = domaine.lower().strip()
        domain_score = 0.3  # Score par défaut
        
        for i, class_name in enumerate(classes):
            if class_name in domaine_clean or domaine_clean in class_name:
                domain_score = probabilities[i]
                break
        
        return min(max(domain_score, 0.1), 1.0)  # Entre 0.1 et 1.0
        
    except Exception as e:
        print(f"Erreur calcul score domaine: {e}", file=sys.stderr)
        return 0.3

def predict_internship_score(domaine, cv_path):
    """Fonction principale de prédiction du score de stage"""
    try:
        # Charger ou entraîner le modèle
        model, vectorizer = train_or_load_model()
        
        # Extraire le texte du CV
        cv_text = extract_text_from_pdf(cv_path)
        if not cv_text:
            return {
                'score': 0.2,
                'skills': [],
                'experience': 0,
                'domain': domaine,
                'error': 'Impossible de lire le CV'
            }
        
        # Analyser le CV
        experience_years = extract_experience_years(cv_text)
        skills = extract_skills_for_domain(cv_text, domaine)
        domain_score = calculate_domain_score(cv_text, domaine, model, vectorizer)
        
        # Calculer les scores partiels
        exp_score = min(experience_years / 5.0, 1.0)  # Normalisé sur 5 ans
        
        # Score de compétences basé sur le domaine
        domain_info = None
        for domain_key, info in DOMAINES_COMPETENCES.items():
            if domain_key in domaine.lower() or domaine.lower() in domain_key:
                domain_info = info
                break
        
        if domain_info:
            max_skills = len(domain_info['keywords'])
            skill_score = min(len(skills) / max(max_skills * 0.3, 1), 1.0)  # 30% des compétences = score max
        else:
            skill_score = min(len(skills) / 10.0, 1.0)  # Score générique
        
        # Score final pondéré
        final_score = (
            0.4 * domain_score +      # 40% correspondance domaine
            0.35 * skill_score +      # 35% compétences
            0.25 * exp_score          # 25% expérience
        )
        
        # Assurer que le score est dans une plage raisonnable
        final_score = max(0.15, min(final_score, 0.95))
        
        return {
            'score': round(final_score, 3),
            'skills': skills[:10],  # Limiter à 10 compétences
            'experience': experience_years,
            'domain': domaine,
            'domain_score': round(domain_score, 3),
            'skill_score': round(skill_score, 3),
            'exp_score': round(exp_score, 3)
        }
        
    except Exception as e:
        print(f"Erreur dans predict_internship_score: {e}", file=sys.stderr)
        return {
            'score': 0.3,
            'skills': [],
            'experience': 0,
            'domain': domaine,
            'error': str(e)
        }

if __name__ == "__main__":
    try:
        # Vérifier les arguments
        if len(sys.argv) < 2:
            print(json.dumps({
                'score': 0.2,
                'skills': [],
                'experience': 0,
                'error': 'Arguments manquants'
            }))
            sys.exit(1)
        
        # Charger les données d'entrée
        input_data = json.loads(sys.argv[1])
        domaine = input_data.get('domaine', '').strip()
        cv_path = input_data.get('cv_path', '').strip()
        
        if not domaine or not cv_path:
            print(json.dumps({
                'score': 0.2,
                'skills': [],
                'experience': 0,
                'error': 'Domaine ou chemin CV manquant'
            }))
            sys.exit(1)
        
        # Prédire le score
        result = predict_internship_score(domaine, cv_path)
        
        # Retourner le résultat
        print(json.dumps(result, ensure_ascii=False))
        
    except json.JSONDecodeError as e:
        print(json.dumps({
            'score': 0.2,
            'skills': [],
            'experience': 0,
            'error': f'Erreur JSON: {e}'
        }), file=sys.stderr)
        sys.exit(1)
        
    except Exception as e:
        print(json.dumps({
            'score': 0.2,
            'skills': [],
            'experience': 0,
            'error': f'Erreur générale: {e}'
        }), file=sys.stderr)
        sys.exit(1) 


