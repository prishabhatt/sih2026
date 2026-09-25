"""
indic_normalizer.py
Multilingual Indic Script Detection & Query Normalization Layer
Smart India Hackathon (SIH) 2026

Normalizes vernacular procurement queries into canonical Indian regulatory
terminology for embedding search, while tracking the user's target response language.
"""

import re
from typing import Tuple, Dict

SCRIPT_RANGES = [
    (0x0900, 0x097F, "Hindi (Devanagari)"),
    (0x0B80, 0x0BFF, "Tamil"),
    (0x0C00, 0x0C7F, "Telugu"),
    (0x0C80, 0x0CFF, "Kannada"),
    (0x0D00, 0x0D7F, "Malayalam"),
    (0x0980, 0x09FF, "Bengali"),
    (0x0A80, 0x0AFF, "Gujarati"),
    (0x0A00, 0x0A7F, "Punjabi (Gurmukhi)"),
    (0x0B00, 0x0B7F, "Odia"),
]

VERNACULAR_KEYWORD_MAP = {
    "तार": "cable wire IS 694 IS 7098",
    "केबल": "power cable IS 694 IS 7098",
    "बिजली": "electrical power voltage",
    "सरिया": "TMT steel rebar IS 1786 Fe 500D",
    "स्टील": "structural steel IS 2062 IS 1786",
    "कंक्रीट": "reinforced concrete IS 456 cement IS 269",
    "सीमेंट": "Portland cement IS 269",
    "पानी": "drinking water IS 10500 packaged water IS 14543",
    "पेयजल": "drinking water specification IS 10500",
    "पाइप": "HDPE pipe IS 4984 water supply",
    "स्ट्रीट लाइट": "LED street light luminaire IS 10322",
    "बत्ती": "LED luminaire IS 10322",
    "कंप्यूटर": "IT equipment safety IS 13252",
    "सर्वर": "IT server IS 13252",
    "गीजर": "electrical water heater appliance IS 302",

    "கம்பி": "TMT steel rebar IS 1786",
    "கேபிள்": "power cable IS 694 IS 7098",
    "குடிநீர்": "drinking water IS 10500 IS 14543",
    "குழாய்": "HDPE pipe IS 4984",
    "விளக்கு": "LED luminaire IS 10322",

    "కేబుల్": "power cable IS 694 IS 7098",
    "స్టీల్": "structural steel rebar IS 1786 IS 2062",
    "నీరు": "drinking water IS 10500",
    "పైపు": "HDPE pipe IS 4984",

    "bijli": "electrical power",
    "taar": "cable wire IS 694",
    "paani": "drinking water IS 10500",
    "saria": "TMT steel rebar IS 1786 Fe 500D"
}

def detect_language_script(text: str) -> str:
    """Detects the dominant Indian language script or English."""
    for ch in text:
        code = ord(ch)
        for start, end, name in SCRIPT_RANGES:
            if start <= code <= end:
                return name
    return "English"

def normalize_query(user_query: str) -> Tuple[str, str]:
    """
    Returns:
      canonical_query: Query expanded with canonical regulatory English terms.
      detected_language: Target response language for output synthesis.
    """
    detected_lang = detect_language_script(user_query)
    canonical = user_query.strip()

    query_lower = user_query.lower()
    expansions = []
    for term, canon in VERNACULAR_KEYWORD_MAP.items():
        if term in query_lower:
            expansions.append(canon)

    if expansions:
        canonical = f"{user_query} ({' '.join(expansions)})"

    return canonical, detected_lang

if __name__ == "__main__":
    tests = [
        "What are the spark test voltage requirements in IS 694?",
        "NHAI ब्रिज के लिए सरिया Fe 500D का एलॉन्गेशन कितना होना चाहिए?",
        "குடிநீர் விநியோகத்திற்கான HDPE குழாய் தரம் என்ன?",
        "11kV underground cable ke mandatory test kya hain?"
    ]
    for t in tests:
        q, lang = normalize_query(t)
        print(f"Original: {t}")
        print(f"Detected: {lang}")
        print(f"Canonical Search Query: {q}\n")
