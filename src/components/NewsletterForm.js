'use client';

import { useState, useTransition } from 'react';
import { subscribe } from '@/app/actions/subscribe';

export default function NewsletterForm() {
    const [msg, setMsg] = useState('');
    const [pending, startTransition] = useTransition();
    const [email, setEmail] = useState('');

    function onSubmit(e) {
        e.preventDefault();
        const form = e.currentTarget;
        const fd = new FormData(form);
        
        // Clear previous messages
        setMsg('');
        
        startTransition(async () => {
            const res = await subscribe(fd);
            setMsg(res.message);
            if (res.ok) {
                form.reset();
                setEmail('');
            }
        });
    }

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isEmailValid = email && isValidEmail(email);

    return (
        <form onSubmit={onSubmit}>
            <label htmlFor="email"></label>
            <input 
                id="email" 
                name="email" 
                type="email" 
                required 
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            {/* honeypot */}
            <div style={{ display: 'none' }}>
                <input type="text" name="company" tabIndex="-1" autoComplete="off" />
            </div>

            <button type="submit" disabled={pending || !isEmailValid}>
                {pending ? 'Enviando...' : 'Suscribirse'}
            </button>

            {msg && (
                <p className={msg.includes('success') || msg.includes('confirm') || msg.includes('Thanks') ? 'success' : 'error'}>
                    {msg}
                </p>
            )}
        </form>
    );
}
