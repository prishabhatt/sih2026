const lucide = require('lucide-react');
const icons = [
    'MessageSquare',
    'X',
    'Send',
    'Sparkles',
    'Bot',
    'User',
    'ShieldCheck',
    'ArrowRight',
    'Copy',
    'Check',
    'RefreshCw',
    'Terminal',
    'FileText',
    'AlertTriangle',
    'Scale',
    'Mic',
    'MicOff',
    'Maximize2',
    'Minimize2',
    'ChevronDown',
    'Info',
    'Building2',
    'Lock',
    'Layers',
    'Award',
    'Paperclip'
];

for (const icon of icons) {
    if (!lucide[icon]) {
        console.error('MISSING ICON:', icon);
    } else {
        console.log('Found:', icon);
    }
}
