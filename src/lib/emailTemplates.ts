/* -------------------------------------------------
   CENTRAL EMAIL TEMPLATES FILE
   All email designs live here
-------------------------------------------------- */

type EmailTemplate = {
  subject: string;
  html: string;
};

/* ---------- BASE LAYOUT (Professional) ---------- */
function baseLayout(title: string, body: string): string {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>${title}</title>
  </head>
  <body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
    
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:30px 0;">
          
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:6px;overflow:hidden;">
            
            <!-- Header -->
            <tr>
              <td style="background:#3ba1da;padding:20px;text-align:center;color:#ffffff;">
                <h1 style="margin:0;font-size:22px;">Ingrammicro-surface</h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:30px;color:#333333;font-size:14px;line-height:1.6;">
                ${body}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f0f0f0;padding:15px;text-align:center;font-size:12px;color:#777;">
                © ${new Date().getFullYear()} Your App Name. All rights reserved.
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
}

/* ---------- EMAIL FACTORY ---------- */
export function getEmailTemplate(
  type: string,
  data: any
): EmailTemplate {
  switch (type) {


    /* -------- ADMIN: NEW USER REGISTRATION -------- */
case "NEW_USER_REGISTRATION":
  return {
    subject: "New User Registration",
    html: baseLayout(
      "New Registration Received",
      `
      <p>A new user has registered and is awaiting approval.</p>

      <table style="margin-top:15px;font-size:14px;">
        <tr>
          <td><strong>Name:</strong></td>
          <td>${data.name}</td>
        </tr>
        <tr>
          <td><strong>Email:</strong></td>
          <td>${data.email}</td>
        </tr>
        <tr>
          <td><strong>Reseller:</strong></td>
          <td>${data.reseller}</td>
        </tr>
      </table>

      <p style="margin-top:20px;">
        Please login to the admin panel to review this account.
      </p>
      `
    ),
  };


    /* -------- USER REGISTERED -------- */
    case "USER_REGISTERED":
      return {
        subject: "Registration Received",
        html: baseLayout(
          "Registration Received",
          `
          <p>Hello <strong>${data.name}</strong>,</p>

          <p>Thank you for registering with us.</p>

          <p>Your account is currently under review.  
          You will receive another email once it is approved by the admin.</p>

          <p style="margin-top:25px;">
            Regards,<br/>
            <strong>Your App Team</strong>
          </p>
          `
        ),
      };

    /* -------- USER APPROVED -------- */
    case "USER_APPROVED":
      return {
        subject: "User Approved | Ingrammicro Surface",
        html: baseLayout(
          "Account Approved",
          `
          <p>Hello <strong>${data.name}</strong>,</p>

          <p>Your account has been approved. You can now login.</p>

          <p style="margin:25px 0;">
            <a href="${data.loginUrl}"
               style="background:#3ba1da;color:#ffffff;
                      padding:10px 18px;text-decoration:none;
                      border-radius:4px;display:inline-block;">
              Login Now
            </a>
          </p>

          <p>We’re happy to have you with us.</p>

          <p>
            Regards,<br/>
            <strong>Your App Team</strong>
          </p>
          `
        ),
      };


 /* -------- USER rejected -------- */
    case "USER_REJECTED":
      return {
        subject: "Your Account Has Been Rejected",
        html: baseLayout(
          "Account Rejected",
          `
          <p>Hello <strong>${data.name}</strong>,</p>

          <p>Your account has been reject. You cannot login.</p>

          

          <p>We’re happy to have you with us.</p>

          <p>
            Regards,<br/>
            <strong>Your App Team</strong>
          </p>
          `
        ),
      };


    /* -------- ORDER APPROVED -------- */
    case "ORDER_APPROVED":
      return {
        subject: "Order Approved",
        html: baseLayout(
          "Order Approved",
          `
          <p>Hello <strong>${data.name}</strong>,</p>

          <p>Your order <strong>#${data.orderId}</strong> has been approved.</p>

          <p>We will process it shortly.</p>

          <p>
            Regards,<br/>
            <strong>Your App Team</strong>
          </p>
          `
        ),
      };

    /* -------- SAFETY -------- */
    default:
      throw new Error("Invalid email template type");
  }
}
