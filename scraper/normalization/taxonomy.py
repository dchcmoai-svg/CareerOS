STRIPE_TEAMS = {
    "Administrative": [],
    "Communications": [],
    "Corporate Development": [],
    "Corporate Security": [],
    "Corporate Strategy": [],
    "Data & Data Science": [],
    "Data Platform": [],
    "Design": [],
    "Executive": [],
    "Finance": [
        "Controllership",
        "Finance & Strategy",
        "Internal Audit",
        "Investor Relations",
        "Tax",
        "Treasury",
        "Workplace"
    ],
    "Global Partnerships": [],
    "Go-to-Market": [
        "Customer Success",
        "Global Strategic Pursuits",
        "GTM Partnerships",
        "Marketing",
        "Revenue Operations",
        "Sales",
        "Scaled Sales",
        "Solutions Architect"
    ],
    "Infrastructure & Corporate Tech": [],
    "Legal": [],
    "Machine Learning": [],
    "Operations": [
        "Technical Account Management"
    ],
    "People": [
        "Recruiting",
        "People Functions"
    ],
    "Products": [
        "Banking as a Service",
        "Climate",
        "Connect",
        "Crypto",
        "Mobile",
        "Link",
        "Metronome",
        "Money Movement and Storage",
        "New Financial Products",
        "Payments",
        "Platform",
        "Professional Services",
        "Privy",
        "Revenue & Financial Automation",
        "Stripe Tax",
        "Terminal"
    ],
    "Risk & Financial Crimes": [],
    "Security": [],
    "Tech Programs": [],
    "University": []
}

STRIPE_OFFICE_LOCATIONS = {
    "North America": [
        "Atlanta",
        "Chicago",
        "New York",
        "San Francisco Bridge HQ",
        "South San Francisco HQ",
        "Washington DC",
        "Seattle",
        "Toronto",
        "Mexico City"
    ],
    "Europe": [
        "Amsterdam",
        "Berlin",
        "London",
        "Dublin HQ",
        "Warsaw",
        "Bucharest",
        "Madrid",
        "Barcelona",
        "Paris",
        "Stockholm",
        "Luxembourg"
    ],
    "Asia Pacific": [
        "Sydney",
        "Melbourne",
        "Jakarta",
        "Bengaluru",
        "Tokyo",
        "Singapore",
        "Bangkok"
    ],
    "Latin America": [
        "São Paulo",
        "Mexico City"
    ],
    "Middle East": [
        "Dubai"
    ]
}

STRIPE_REMOTE_LOCATIONS = {
    "North America": [
        "United States",
        "Canada",
        "Mexico"
    ],
    "Europe": [
        "Austria",
        "Belgium",
        "Czechia",
        "Estonia",
        "France",
        "Germany",
        "Great Britain",
        "Ireland",
        "Israel",
        "Italy",
        "Netherlands",
        "Poland",
        "Portugal",
        "Romania",
        "Spain",
        "Sweden",
        "Switzerland"
    ],
    "Asia Pacific": [
        "Australia",
        "Hong Kong",
        "Indonesia",
        "India",
        "Japan",
        "Malaysia",
        "New Zealand",
        "South Korea",
        "Thailand"
    ],
    "Latin America": [
        "Argentina",
        "Brazil",
        "Chile",
        "Mexico"
    ]
}

TEAM_TO_DEPARTMENT = {}
for department, teams in STRIPE_TEAMS.items():
    TEAM_TO_DEPARTMENT[department] = department
    for team in teams:
        TEAM_TO_DEPARTMENT[team] = department


def flatten_taxonomy(taxonomy):
    values = []
    for parent, children in taxonomy.items():
        values.append(parent)
        values.extend(children)
    return values


def infer_department(team_name):
    return TEAM_TO_DEPARTMENT.get(team_name)
