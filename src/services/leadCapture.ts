// Lead capture service — Formspree integration (zero backend)
// Replace FORM_ID with actual Formspree form ID after setup

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/PLACEHOLDER';

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company: string;
  message?: string;
}

export async function submitContactForm(data: ContactFormData): Promise<boolean> {
  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        ...data,
        phone: data.phone || 'Not provided',
        message: data.message || 'No message',
        source: 'contact_form',
        page_url: window.location.href,
        _subject: `New Lead: ${data.name} from ${data.company}`,
        _replyto: data.email,
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
}
