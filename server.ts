import express, { Request, Response } from 'express';
import axios from 'axios';
import { body, validationResult } from 'express-validator';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
// Serve static files from current directory
app.use(express.static(__dirname));

// TypeScript Interfaces
interface ContactFormData {
    name: string;
    email: string;
    phone: string | null;
    message: string;
}

interface TelegramMessage {
    chat_id: string;
    text: string;
    parse_mode?: string;
}

interface ApiResponse {
    success: boolean;
    message: string;
    data?: any;
}

// Input Sanitization Function
function sanitizeInput(input: string): string {
    if (!input) return '';
    
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+=/gi, '') // Remove event handlers
        .replace(/script/gi, '') // Remove script tags
        .substring(0, 10000); // Limit length
}

// Validation Rules
const contactValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters')
        .matches(/^[a-zA-Z\s'-]+$/)
        .withMessage('Name contains invalid characters'),
    
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    
    body('phone')
        .optional()
        .trim()
        .matches(/^[\d\s\-\+\(\)]+$/)
        .withMessage('Phone number contains invalid characters')
        .isLength({ min: 10, max: 20 })
        .withMessage('Phone number must be between 10 and 20 characters'),
    
    body('message')
        .trim()
        .notEmpty()
        .withMessage('Message is required')
        .isLength({ min: 10, max: 2000 })
        .withMessage('Message must be between 10 and 2000 characters')
];

// Contact Form Endpoint
app.post('/api/contact', contactValidation, async (req: Request, res: Response) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            } as ApiResponse);
        }

        // Sanitize input
        const formData: ContactFormData = {
            name: sanitizeInput(req.body.name),
            email: sanitizeInput(req.body.email),
            phone: req.body.phone ? sanitizeInput(req.body.phone) : null,
            message: sanitizeInput(req.body.message)
        };

        // Validate required fields again after sanitization
        if (!formData.name || !formData.email || !formData.message) {
            return res.status(400).json({
                success: false,
                message: 'Required fields are missing'
            } as ApiResponse);
        }

        // Format message for Telegram
        const telegramMessage = formatTelegramMessage(formData);

        // Send to Telegram
        const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
        const telegramChatId = process.env.TELEGRAM_CHAT_ID;

        if (!telegramBotToken || !telegramChatId) {
            console.error('Telegram credentials not configured');
            return res.status(500).json({
                success: false,
                message: 'Server configuration error. Please contact support.'
            } as ApiResponse);
        }

        try {
            const telegramResponse = await axios.post(
                `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
                {
                    chat_id: telegramChatId,
                    text: telegramMessage,
                    parse_mode: 'HTML'
                } as TelegramMessage,
                {
                    timeout: 10000 // 10 second timeout
                }
            );

            if (telegramResponse.data.ok) {
                return res.status(200).json({
                    success: true,
                    message: 'Your message has been sent successfully!'
                } as ApiResponse);
            } else {
                throw new Error('Telegram API returned error');
            }
        } catch (telegramError: any) {
            console.error('Telegram API Error:', telegramError.response?.data || telegramError.message);
            
            // Don't expose internal errors to client
            return res.status(500).json({
                success: false,
                message: 'Failed to send message. Please try again later or contact us directly.'
            } as ApiResponse);
        }

    } catch (error: any) {
        console.error('Server Error:', error);
        return res.status(500).json({
            success: false,
            message: 'An unexpected error occurred. Please try again later.'
        } as ApiResponse);
    }
});

// Format message for Telegram
function formatTelegramMessage(data: ContactFormData): string {
    const phoneDisplay = data.phone ? `\n📞 <b>Phone:</b> ${data.phone}` : '';
    
    return `
🔥 <b>New Contact Form Submission - Kezi Fire Chilli</b>

👤 <b>Name:</b> ${data.name}
📧 <b>Email:</b> ${data.email}${phoneDisplay}

💬 <b>Message:</b>
${data.message}

---
<i>Received at: ${new Date().toLocaleString()}</i>
    `.trim();
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: Function) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    } as ApiResponse);
});

// Start server
app.listen(PORT, () => {
    console.log(`🔥 Kezi Fire Chilli server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    
    if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
        console.warn('⚠️  Warning: Telegram credentials not configured!');
    }
});

