import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { email, name, itemTitle } = await request.json();

        const { data, error } = await resend.emails.send({
            from: 'Lost & Found <onboarding@resend.dev>',
            to: email,
            subject: 'Thank You for Reporting a Found Item!',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #3b82f6;">Thank You, ${name}! 🎉</h2>
          <p>We appreciate you taking the time to report <strong>${itemTitle}</strong> to our Lost & Found system.</p>
          <p>Your contribution helps reunite lost items with their owners and strengthens our community.</p>
          <p>An admin will review your submission shortly. Once approved, it will be visible to students looking for their lost items.</p>
          <br>
          <p style="color: #6b7280;">Best regards,<br>Lost & Found Team</p>
        </div>
      `,
        });

        if (error) {
            console.error('Resend error:', error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Email error:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}
