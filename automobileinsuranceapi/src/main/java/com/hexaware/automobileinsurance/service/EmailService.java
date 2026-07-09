package com.hexaware.automobileinsurance.service;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.MimeMessageHelper;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

/**
 * Central place for all outbound email (quotes, policy documents, expiry
 * reminders, password resets). Every send is wrapped so a mail failure
 * (bad SMTP credentials, network issue, etc.) is logged but never crashes
 * the request that triggered it - emailing is a side effect, not something
 * that should block a proposal approval, payment, or quote generation.
 */
@Slf4j
@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.mail.enabled:true}")
    private boolean mailEnabled;

    @Value("${app.mail.from:no-reply@automobileinsurance.com}")
    private String fromAddress;

    public void sendEmail(String to, String subject, String body) {

        if (!mailEnabled) {
            log.info("Email sending is disabled (app.mail.enabled=false). Skipped email to {} - subject: {}", to, subject);
            return;
        }

        if (to == null || to.isBlank()) {
            log.warn("Skipped sending email - no recipient address provided. Subject: {}", subject);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromAddress);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            log.info("Email sent successfully to {} - subject: {}", to, subject);
        } catch (Exception ex) {
            // Deliberately caught broadly: a mail server outage or bad
            // credentials must never fail the business operation that
            // triggered this email (approval, payment, quote generation).
            log.error("Failed to send email to {} - subject: {}. Reason: {}", to, subject, ex.getMessage());
        }
    }

    public void sendQuoteEmail(String to, String userName, String vehicleModel, double premiumAmount, String addOns) {
        String subject = "Your Insurance Quote is Ready";
        String body = "Hello " + userName + ",\n\n"
                + "A quote has been generated for your vehicle (" + vehicleModel + ").\n\n"
                + "Premium Amount: Rs. " + premiumAmount + "\n"
                + "Add-ons: " + (addOns == null || addOns.isBlank() ? "None" : addOns) + "\n\n"
                + "Please log in to the portal to review and complete your payment.\n\n"
                + "Regards,\nAutomobile Insurance Team";
        sendEmail(to, subject, body);
    }

    public void sendPolicyActivatedEmail(String to, String userName, String policyName,
                                          String vehicleNumber, String activationDate, String expiryDate) {
        String subject = "Your Policy is Now Active";
        String body = "Hello " + userName + ",\n\n"
                + "Your payment has been confirmed and your policy is now ACTIVE.\n\n"
                + "Policy: " + policyName + "\n"
                + "Vehicle Number: " + vehicleNumber + "\n"
                + "Active From: " + activationDate + "\n"
                + "Valid Until: " + expiryDate + "\n\n"
                + "You can download your policy document any time from the portal.\n\n"
                + "Regards,\nAutomobile Insurance Team";
        sendEmail(to, subject, body);
    }
    public void sendPolicyActivatedEmailWithAttachment(String to, String userName, String policyName,
            String vehicleNumber, String activationDate, String expiryDate,
            byte[] policyDocument, String attachmentName) {

if (!mailEnabled) {
log.info("Email sending is disabled (app.mail.enabled=false). Skipped policy activation email to {}", to);
return;
}

if (to == null || to.isBlank()) {
log.warn("Skipped sending policy activation email - no recipient address provided.");
return;
}

String subject = "Your Policy is Now Active";
String body = "Hello " + userName + ",\n\n"
+ "Your payment has been confirmed and your policy is now ACTIVE.\n\n"
+ "Policy: " + policyName + "\n"
+ "Vehicle Number: " + vehicleNumber + "\n"
+ "Active From: " + activationDate + "\n"
+ "Valid Until: " + expiryDate + "\n\n"
+ "Your policy document is attached to this email as a PDF, and can also be "
+ "downloaded any time from the portal.\n\n"
+ "Regards,\nAutomobile Insurance Team";

try {
MimeMessage mimeMessage = mailSender.createMimeMessage();
MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
helper.setFrom(fromAddress);
helper.setTo(to);
helper.setSubject(subject);
helper.setText(body);

if (policyDocument != null && policyDocument.length > 0) {
helper.addAttachment(attachmentName, new ByteArrayResource(policyDocument));
}

mailSender.send(mimeMessage);
log.info("Policy activation email with document attached sent successfully to {}", to);
} catch (MessagingException ex) {
// Same rule as sendEmail(): a mail failure must never fail
// the payment approval that triggered it.
log.error("Failed to send policy activation email with attachment to {}. Reason: {}", to, ex.getMessage());
}
}

    public void sendExpiryReminderEmail(String to, String userName, String policyName,
                                         String vehicleNumber, String expiryDate) {
        String subject = "Your Policy Expires Soon";
        String body = "Hello " + userName + ",\n\n"
                + "This is a reminder that your policy is expiring soon.\n\n"
                + "Policy: " + policyName + "\n"
                + "Vehicle Number: " + vehicleNumber + "\n"
                + "Expiry Date: " + expiryDate + "\n\n"
                + "Please renew your policy before it expires to stay covered.\n\n"
                + "Regards,\nAutomobile Insurance Team";
        sendEmail(to, subject, body);
    }

    public void sendPasswordResetEmail(String to, String userName, String temporaryPassword) {
        String subject = "Your Password Has Been Reset";
        String body = "Hello " + userName + ",\n\n"
                + "Your password has been reset. Your temporary password is:\n\n"
                + temporaryPassword + "\n\n"
                + "Please log in with this temporary password and change it immediately "
                + "from your profile.\n\n"
                + "If you did not request this, please contact support immediately.\n\n"
                + "Regards,\nAutomobile Insurance Team";
        sendEmail(to, subject, body);
    }
    
}
