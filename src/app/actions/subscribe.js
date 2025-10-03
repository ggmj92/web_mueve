'use server';

import { z } from 'zod';
import fs from 'fs';
import path from 'path';

const EmailSchema = z.object({
    email: z.string().email(),
    hp: z.string().optional(), // honeypot
});

// Local email storage for testing
function saveEmailLocally(email) {
    try {
        const emailsDir = path.join(process.cwd(), 'data');
        const emailsFile = path.join(emailsDir, 'subscribers.json');
        
        // Create data directory if it doesn't exist
        if (!fs.existsSync(emailsDir)) {
            fs.mkdirSync(emailsDir, { recursive: true });
        }
        
        // Read existing emails
        let emails = [];
        if (fs.existsSync(emailsFile)) {
            const data = fs.readFileSync(emailsFile, 'utf8');
            emails = JSON.parse(data);
        }
        
        // Add new email if not already exists
        if (!emails.includes(email)) {
            emails.push({
                email,
                subscribedAt: new Date().toISOString(),
                source: 'website'
            });
            
            fs.writeFileSync(emailsFile, JSON.stringify(emails, null, 2));
            console.log(`Email saved locally: ${email}`);
        }
        
        return true;
    } catch (error) {
        console.error('Error saving email locally:', error);
        return false;
    }
}

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

    const { MAILERLITE_API_KEY, MAILERLITE_GROUP_ID, ENABLE_LOCAL_EMAIL_STORAGE } = process.env;

    // Debug logging
    console.log('Environment variables:', {
        MAILERLITE_API_KEY: MAILERLITE_API_KEY ? 'Set' : 'Not set',
        MAILERLITE_GROUP_ID: MAILERLITE_GROUP_ID ? 'Set' : 'Not set',
        ENABLE_LOCAL_EMAIL_STORAGE: ENABLE_LOCAL_EMAIL_STORAGE
    });

    // Try MailerLite first if configured
    if (MAILERLITE_API_KEY && MAILERLITE_GROUP_ID) {
        try {
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
                // Also save locally for backup
                if (ENABLE_LOCAL_EMAIL_STORAGE === 'true') {
                    saveEmailLocally(parsed.data.email);
                }
                return { ok: true, message: 'Check your inbox to confirm subscription.' };
            }

            const json = await res.json().catch(() => ({}));
            console.error('MailerLite error:', json);
            
            // Fall back to local storage if MailerLite fails
            if (ENABLE_LOCAL_EMAIL_STORAGE === 'true') {
                const saved = saveEmailLocally(parsed.data.email);
                if (saved) {
                    return { ok: true, message: 'Thanks! We\'ll keep you updated.' };
                }
            }
            
            return { ok: false, message: 'Could not subscribe right now. Please try later.' };
        } catch (error) {
            console.error('MailerLite connection error:', error);
            
            // Fall back to local storage
            if (ENABLE_LOCAL_EMAIL_STORAGE === 'true') {
                const saved = saveEmailLocally(parsed.data.email);
                if (saved) {
                    return { ok: true, message: 'Thanks! We\'ll keep you updated.' };
                }
            }
            
            return { ok: false, message: 'Could not subscribe right now. Please try later.' };
        }
    }

    // If no MailerLite config, use local storage
    console.log('MailerLite not configured, trying local storage...');
    if (ENABLE_LOCAL_EMAIL_STORAGE === 'true') {
        console.log('Local storage enabled, saving email...');
        const saved = saveEmailLocally(parsed.data.email);
        if (saved) {
            return { ok: true, message: 'Thanks! We\'ll keep you updated.' };
        }
        return { ok: false, message: 'Could not save your email. Please try later.' };
    }

    console.log('No configuration found, returning error...');
    return { ok: false, message: 'Newsletter service not configured. Please contact us directly.' };
}
