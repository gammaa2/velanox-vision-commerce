import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { Resend } from 'npm:resend@4.0.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.1';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactEmailRequest {
  name: string;
  email: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, message }: ContactEmailRequest = await req.json();

    console.log('Received contact form submission:', { name, email });

    // Send notification email to Velanox admin
    const adminEmailResponse = await resend.emails.send({
      from: 'Velanox Apparel <onboarding@resend.dev>',
      to: ['velanox1@gmail.com'],
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a1a;">New Contact Form Submission</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <p style="color: #666; font-size: 12px;">This email was sent from the Velanox Apparel contact form.</p>
        </div>
      `,
    });

    console.log('Admin notification sent:', adminEmailResponse);

    // Send confirmation email to customer
    const customerEmailResponse = await resend.emails.send({
      from: 'Velanox Apparel <onboarding@resend.dev>',
      to: [email],
      subject: 'We received your message!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a;">Thank you for contacting us, ${name}!</h1>
          <p style="font-size: 16px; color: #333;">We have received your message and will get back to you as soon as possible.</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Your message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <p style="font-size: 16px; color: #333;">Best regards,<br><strong>The Velanox Apparel Team</strong></p>
          <p style="font-style: italic; color: #666;">Style Reimagined — We build confidence through clothing.</p>
        </div>
      `,
    });

    console.log('Customer confirmation sent:', customerEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true,
        adminEmail: adminEmailResponse,
        customerEmail: customerEmailResponse 
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error('Error in send-contact-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
