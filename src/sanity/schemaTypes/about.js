export default {
    name: 'nosotros',
    title: 'Nosotros',
    type: 'document',
    fields: [
        { name: 'spanish', type: 'text', title: 'Texto (Español)', options: { rows: 14 } },
        { name: 'english', type: 'text', title: 'Texto (Inglés)', options: { rows: 14 } }
    ],
    preview: {
        select: { es: 'spanish', en: 'english' },
        prepare({ es, en }) {
            const raw = es || en || '';
            const snippet = raw.replace(/\s+/g, ' ').slice(0, 80) + (raw.length > 80 ? '…' : '');
            return {
                title: 'Nosotros',
                subtitle: snippet || 'Sin texto todavía'
            };
        }
    }
};
