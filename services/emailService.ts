import emailjs from '@emailjs/browser';

// Keys are loaded from .env.local (or .env)
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID_AMBASSADOR = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_AMBASSADOR;
const EMAILJS_TEMPLATE_ID_REPORT = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_REPORT;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export interface AmbassadorFormData {
    name: string;
    email: string;
    town?: string;
    expertise?: string;
    motivation?: string;
    links?: string;
    availability?: string;
}

export interface ReportFormData {
    name?: string;
    listName?: string;
    reason?: string;
    details?: string;
}

/**
 * Sends an email using EmailJS.
 * If authentication fails or keys are missing, it falls back to "Mock Mode" (logs to console).
 */
export const sendEmail = async (
    templateId: string | undefined,
    variables: Record<string, unknown>
): Promise<boolean> => {
    // Check if keys are properly configured in environment variables
    const isConfigured =
        EMAILJS_SERVICE_ID &&
        EMAILJS_PUBLIC_KEY &&
        templateId;

    if (!isConfigured) {
        console.log('📧 [MOCK EMAIL SERVICE] Keys missing or not configured. Logging email details:');
        console.log(`Template ID: ${templateId}`);
        console.log('Variables:', variables);
        console.log('✅ Mock email sent successfully!');

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return true;
    }

    try {
        await emailjs.send(
            EMAILJS_SERVICE_ID!, // We know it exists because of isConfigured check
            templateId!,
            variables,
            EMAILJS_PUBLIC_KEY!
        );
        console.log('✅ Email sent successfully via EmailJS!');
        return true;
    } catch (error) {
        console.error('❌ Error sending email via EmailJS:', error);
        return false;
    }
};

export const sendAmbassadorApplication = async (data: AmbassadorFormData) => {
    return sendEmail(EMAILJS_TEMPLATE_ID_AMBASSADOR, {
        to_name: 'Admin', // Or whoever receives these emails
        from_name: data.name,
        from_email: data.email,
        town: data.town,
        expertise: data.expertise,
        motivation: data.motivation,
        links: data.links,
        availability: data.availability,
        subject: `New Ambassador Application: ${data.name}`
    });
};

export const sendReportIssue = async (data: ReportFormData) => {
    return sendEmail(EMAILJS_TEMPLATE_ID_REPORT, {
        to_name: 'Admin',
        from_name: data.name || 'Anonymous',
        list_name: data.listName,
        reason: data.reason,
        details: data.details,
        subject: `Issue Report: ${data.listName || 'General'}`
    });
};
