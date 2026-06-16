import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import nodemailer from 'nodemailer';
import Parser from 'rss-parser';

let transporter = null;
function getTransporter() {
  if (!transporter) {
    const hasService = !!process.env.SMTP_SERVICE;
    const hasHost = !!process.env.SMTP_HOST;
    const hasUser = !!process.env.SMTP_USER;
    const hasPass = !!process.env.SMTP_PASS;

    if (!(hasService || hasHost) || !hasUser || !hasPass) {
      console.warn('SMTP credentials missing. Emails will not be sent to your inbox. Check .env');
      return null;
    }
    
    if (process.env.SMTP_SERVICE) {
      transporter = nodemailer.createTransport({
        service: process.env.SMTP_SERVICE,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        connectionTimeout: 5000,
        greetingTimeout: 5000,
        socketTimeout: 5000,
      });
    } else {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        connectionTimeout: 5000,
        greetingTimeout: 5000,
        socketTimeout: 5000,
        tls: {
          rejectUnauthorized: false
        }
      });
    }
  }
  return transporter;
}

// Universal Email Dispatcher (supporting HTTP APIs to bypass Cloud Run/sandbox SMTP port blocks)
async function dispatchNotificationEmail({ subject, text }: { subject: string; text: string }) {
  const targetEmail = 'hello@sannvara.com';
  
  // 1. Try Resend API (HTTP REST API on Port 443 - 100% reliable in firewalled/sandbox environments)
  if (process.env.RESEND_API_KEY) {
    try {
      let fromEmail = 'onboarding@resend.dev';
      
      // Override onboarding if SMTP_USER is specified and is NOT a public domain like gmail, outlook etc.,
      // or if RESEND_FROM_EMAIL is explicitly specified.
      if (process.env.RESEND_FROM_EMAIL) {
        fromEmail = process.env.RESEND_FROM_EMAIL;
      } else if (process.env.SMTP_USER) {
        const lowerUser = process.env.SMTP_USER.toLowerCase();
        const isPublic = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'aol.com', 'icloud.com', 'mail.com', 'proton.me', 'protonmail.com'].some(d => lowerUser.endsWith(d));
        if (!isPublic) {
          fromEmail = process.env.SMTP_USER;
        }
      }
      
      const senderIdentity = `Sannvara Website <${fromEmail}>`;
      
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: senderIdentity,
          to: [targetEmail],
          subject: subject,
          text: text,
        }),
      });
      if (response.ok) {
        console.log('✦ Processed via Resend REST API!');
        return { success: true, provider: 'Resend' };
      } else {
        const bodyTxt = await response.text();
        console.warn(`Resend HTTP API failed status ${response.status}: ${bodyTxt}`);
        throw new Error(`Resend API Error (Status ${response.status}): ${bodyTxt}`);
      }
    } catch (e: any) {
      console.error('Error dispatching via Resend API:', e);
      // If we also had SendGrid, we fall through. Otherwise, if only Resend was configured:
      if (!process.env.SENDGRID_API_KEY && !getTransporter()) {
        throw e;
      }
    }
  }

  // 2. Try SendGrid Web API (HTTP REST API on Port 443 - 100% reliable in firewalled/sandbox environments)
  if (process.env.SENDGRID_API_KEY) {
    try {
      let fromEmail = 'no-reply@sannvara.com';
      if (process.env.SENDGRID_FROM_EMAIL) {
        fromEmail = process.env.SENDGRID_FROM_EMAIL;
      } else if (process.env.SMTP_USER) {
        const lowerUser = process.env.SMTP_USER.toLowerCase();
        const isPublic = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'aol.com', 'icloud.com', 'mail.com', 'proton.me', 'protonmail.com'].some(d => lowerUser.endsWith(d));
        if (!isPublic) {
          fromEmail = process.env.SMTP_USER;
        }
      }
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: targetEmail }] }],
          from: { email: fromEmail, name: 'Sannvara Website' },
          subject: subject,
          content: [{ type: 'text/plain', value: text }]
        })
      });
      if (response.ok) {
        console.log('✦ Processed via SendGrid REST API!');
        return { success: true, provider: 'SendGrid' };
      } else {
        const bodyTxt = await response.text();
        console.warn(`SendGrid HTTP API failed status ${response.status}: ${bodyTxt}`);
        throw new Error(`SendGrid API Error (Status ${response.status}): ${bodyTxt}`);
      }
    } catch (e: any) {
      console.error('Error dispatching via SendGrid API:', e);
      if (!getTransporter()) {
        throw e;
      }
    }
  }

  // 3. Fallback to standard SMTP NodeMailer (SMTP Port 587/465 - may timeout if outgoing ports are blocked by Cloud Run hosting)
  const mailTransporter = getTransporter();
  if (mailTransporter) {
    await mailTransporter.sendMail({
      from: `"Sannvara Website" <${process.env.SMTP_USER || 'no-reply@sannvara.com'}>`,
      to: targetEmail,
      subject: subject,
      text: text,
    });
    console.log('✦ Processed via SMTP NodeMailer.');
    return { success: true, provider: 'SMTP NodeMailer' };
  }

  throw new Error('No working email dispatcher or SMTP transporter credentials configured.');
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post('/api/contact', async (req, res) => {
    try {
      const { name, email, company, message } = req.body;
      const dataPath = path.join(process.cwd(), 'data/inquiries.json');
      
      let inquiries = [];
      if (fs.existsSync(dataPath)) {
        inquiries = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      }
      
      const newInquiry = {
        id: Date.now().toString(),
        name,
        email,
        company,
        message,
        date: new Date().toISOString()
      };
      
      inquiries.push(newInquiry);
      fs.writeFileSync(dataPath, JSON.stringify(inquiries, null, 2));
      
      try {
        await dispatchNotificationEmail({
          subject: `New Inquiry from ${name} (${company || 'No Company'})`,
          text: `You have a new inquiry:
  
Name: ${name}
Email: ${email}
Company: ${company}
Date: ${newInquiry.date}

Message:
${message}`
        });
      } catch (mailError) {
        console.error('Email notification failed, but inquiry was saved locally:', mailError);
      }
  
      res.json({ success: true, message: 'Inquiry saved successfully.' });
    } catch (error) {
      console.error('Error saving inquiry:', error);
      res.status(500).json({ success: false, error: 'Failed to save inquiry' });
    }
  });

  app.post('/api/subscribe', async (req, res) => {
    try {
      const { email } = req.body;
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: 'Email is required' });
      }
      
      const dataDir = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      
      const dataPath = path.join(dataDir, 'subscriptions.json');
      
      let subscriptions = [];
      if (fs.existsSync(dataPath)) {
        subscriptions = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      }
      
      // Check if email already subscribed
      if (subscriptions.some((sub: any) => sub.email.toLowerCase() === email.toLowerCase())) {
        return res.json({ success: true, message: 'Already subscribed.' });
      }
      
      const newSubscription = {
        id: Date.now().toString(),
        email,
        date: new Date().toISOString()
      };
      
      subscriptions.push(newSubscription);
      fs.writeFileSync(dataPath, JSON.stringify(subscriptions, null, 2));
      
      try {
        await dispatchNotificationEmail({
          subject: `New Newsletter Subscriber: ${email}`,
          text: `You have a new newsletter subscriber!
            
Email: ${email}
Joined: ${newSubscription.date}`
        });
      } catch (mailError) {
        console.error('Email notification failed, but subscription was saved locally:', mailError);
      }
      
      res.json({ success: true, message: 'Subscribed successfully.' });
    } catch (error) {
      console.error('Error saving subscription:', error);
      res.status(500).json({ success: false, error: 'Failed to subscribe' });
    }
  });

  app.get('/api/admin/inquiries', async (req, res) => {
    try {
      const dataPath = path.join(process.cwd(), 'data/inquiries.json');
      let inquiries = [];
      if (fs.existsSync(dataPath)) {
        inquiries = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      }
      res.json({ success: true, inquiries });
    } catch (error) {
      res.status(500).json({ error: 'Failed to load inquiries' });
    }
  });

  app.delete('/api/admin/inquiries/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const dataPath = path.join(process.cwd(), 'data/inquiries.json');
      if (fs.existsSync(dataPath)) {
        let inquiries = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        inquiries = inquiries.filter((item: any) => item.id !== id);
        fs.writeFileSync(dataPath, JSON.stringify(inquiries, null, 2));
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete inquiry' });
    }
  });

  app.get('/api/admin/subscriptions', async (req, res) => {
    try {
      const dataPath = path.join(process.cwd(), 'data/subscriptions.json');
      let subscriptions = [];
      if (fs.existsSync(dataPath)) {
        subscriptions = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      }
      res.json({ success: true, subscriptions });
    } catch (error) {
      res.status(500).json({ error: 'Failed to load subscriptions' });
    }
  });

  app.delete('/api/admin/subscriptions/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const dataPath = path.join(process.cwd(), 'data/subscriptions.json');
      if (fs.existsSync(dataPath)) {
        let subscriptions = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        subscriptions = subscriptions.filter((item: any) => item.id !== id);
        fs.writeFileSync(dataPath, JSON.stringify(subscriptions, null, 2));
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete subscription' });
    }
  });

  app.get('/api/admin/smtp-status', async (req, res) => {
    const hasService = !!process.env.SMTP_SERVICE;
    const hasHost = !!process.env.SMTP_HOST;
    const hasUser = !!process.env.SMTP_USER;
    const hasPass = !!process.env.SMTP_PASS;

    const hasResend = !!process.env.RESEND_API_KEY;
    const hasSendGrid = !!process.env.SENDGRID_API_KEY;

    const isConfigured = (hasService || hasHost) && hasUser && hasPass;
    const hasHttpApi = hasResend || hasSendGrid;

    let userMasked = null;
    if (hasUser) {
      const u = process.env.SMTP_USER || '';
      userMasked = u.length > 5 ? u.substring(0, 3) + '...' + u.substring(u.indexOf('@') - 2) : '***';
    }

    res.json({
      configured: isConfigured || hasHttpApi,
      hasSmtp: isConfigured,
      hasResend,
      hasSendGrid,
      service: process.env.SMTP_SERVICE || null,
      host: process.env.SMTP_HOST || null,
      port: process.env.SMTP_PORT || '587 (Default)',
      secure: process.env.SMTP_SECURE || 'false',
      user: userMasked
    });
  });

  app.post('/api/admin/test-smtp', async (req, res) => {
    try {
      const targetUser = 'hello@sannvara.com';
      const result = await dispatchNotificationEmail({
        subject: `Sannvara Email Diagnostic Success ✦`,
        text: `Your Website Email Dispatcher is working perfectly!
         
This test email verifies that your contact/inquiry forms and newsletter submissions will correctly deliver notification alerts to ${targetUser}.

Active Configuration Details:
- Resend API configured: ${process.env.RESEND_API_KEY ? 'Yes' : 'No'}
- SendGrid API configured: ${process.env.SENDGRID_API_KEY ? 'Yes' : 'No'}
- Fallback SMTP Configured: ${(process.env.SMTP_HOST || process.env.SMTP_SERVICE) ? 'Yes' : 'No'}
- Sender: ${process.env.SMTP_USER || 'onboarding@resend.dev'}
- Delivery Port: ${process.env.RESEND_API_KEY || process.env.SENDGRID_API_KEY ? '443 (Secure HTTP REST API)' : '587/465 (SMTP)'}`
      });

      res.json({ 
        success: true, 
        message: `Connection holds! Diagnostic email dispatched successfully via ${result.provider} to hello@sannvara.com.` 
      });
    } catch (error: any) {
      console.error('Email test failed:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message || 'SMTP Handshake or Connection timeout.',
        code: error.code || 'UNKNOWN'
      });
    }
  });

  app.get('/api/medium', async (req, res) => {
    try {
      const rawUsername = req.query.username || process.env.MEDIUM_USERNAME; 
      if (!rawUsername || typeof rawUsername !== 'string') {
        return res.status(400).json({ error: 'Medium username is required and must be a string' });
      }
      const username = rawUsername;
      
      const parser = new Parser({
        customFields: {
          item: ['content:encoded']
        }
      });
      // Ensure username starts with @
      const formattedUsername = username.startsWith('@') ? username : `@${username}`;
      const feed = await parser.parseURL(`https://medium.com/feed/${formattedUsername}`);
      
      const articles = feed.items.map((item, index) => {
        // Attempt to extract an image from the content
        const imgMatch = item['content:encoded']?.match(/<img[^>]+src="([^">]+)"/);
        const image = imgMatch ? imgMatch[1] : 'https://images.unsplash.com/photo-1493219686142-5a8641badc78?auto=format&fit=crop&q=80&w=600';
        
        // Strip HTML from content for a short description
        const rawText = item['content:encoded']?.replace(/<[^>]+>/g, '') || '';
        const description = rawText.substring(0, 200) + '...';

        return {
          id: `medium-${index}`,
          category: 'ESSAY', // map to existing categories
          date: new Date(item.pubDate || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          title: item.title,
          description: description,
          readTime: '5 MIN', // Medium doesn't expose read time in generic RSS easily, standardizing for now
          image: image,
          link: item.link
        };
      });

      res.json({ articles });
    } catch (error) {
      console.error('Error fetching Medium feed:', error);
      res.status(500).json({ error: 'Failed to fetch Medium articles. Make sure the username is correct.' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log('Server running on port 3000');
  });
}

startServer();
