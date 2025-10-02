'use client';

import { useState, useTransition } from 'react';
import { subscribe } from '@/app/actions/subscribe';

export default function NewsletterForm() {
    const [msg, setMsg] = useState('');
    const [pending, startTransition] = useTransition();

    function onSubmit(e) {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(async () => {
            const res = await subscribe(fd);
            setMsg(res.message);
            if (res.ok) e.currentTarget.reset();
        });
    }

    return (
        <form onSubmit={onSubmit}>
            <label htmlFor="email"></label>
            <input 
                id="email" 
                name="email" 
                type="email" 
                required 
                placeholder="tu@email.com"
            />

            {/* honeypot */}
            <div style={{ display: 'none' }}>
                <input type="text" name="company" tabIndex="-1" autoComplete="off" />
            </div>

            <button type="submit" disabled={pending}>
                {pending ? 'Enviando...' : 'Suscribirse'}
            </button>

            {msg && (
                <p className={msg.includes('success') || msg.includes('confirm') ? 'success' : 'error'}>
                    {msg}
                </p>
            )}
        </form>
    );
}
