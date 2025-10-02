'use server';

import { z } from 'zod';

const EmailSchema = z.object({
    email: z.string().email(),
    hp: z.string().optional(), // honeypot
});

export async function subscribe(formData) {
    const raw = {
        email: formData.get('email'),
        hp: formData.get('company'),
    };

    const parsed = EmailSchema.safeParse(raw);
    if (!parsed.success) {
        return { ok: false, message: 'Enter a valid email.' };
    }

    // honeypot check
    if (parsed.data.hp) {
        return { ok: true, message: 'Thanks!' };
    }

    const { MAILERLITE_API_KEY, MAILERLITE_GROUP_ID } = process.env;

    const res = await fetch(`https://connect.mailerlite.com/api/subscribers`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${MAILERLITE_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: parsed.data.email,
            groups: [MAILERLITE_GROUP_ID],
        }),
    });

    if (res.ok) {
        return { ok: true, message: 'Check your inbox to confirm subscription.' };
    }

    const json = await res.json().catch(() => ({}));
    console.error('MailerLite error:', json);
    return { ok: false, message: 'Could not subscribe right now. Please try later.' };
}
