/* -------------------------------------------------
   CENTRAL EMAIL TEMPLATES FILE
   All email designs live here
-------------------------------------------------- */

type EmailTemplate = {
  subject: string;
  html: string;
};

/* ---------- BASE LAYOUT (Classic / Centered) ---------- */
function baseLayout(title: string, body: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
</head>

<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
  <p>&nbsp;</p>

  <table
    width="600"
    align="center"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #dddddd;"
  >

    <!-- Header -->
    <tr>
      <td
        style="
          background:#3ba1da;
          padding:14px 20px;
          font-size:18px;
          font-weight:bold;
          color:#ffffff;
          text-align:center;
        "
      >
        ${title}
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding:30px;font-size:15px;color:#333333;line-height:1.6;">
        ${body}
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td
        style="
          background:#3ba1da;
          padding:12px 15px;
          font-size:13px;
          color:#ffffff;
          text-align:center;
        "
      >
        © 2026 Ingrammicro-Surface
      </td>
    </tr>

  </table>

  <p>&nbsp;</p>
</body>
</html>
`;
}

/* ---------- EMAIL FACTORY ---------- */
export function getEmailTemplate(type: string, data: any): EmailTemplate {
  switch (type) {

    /* -------- ADMIN: NEW USER REGISTRATION -------- */
    case "NEW_USER_REGISTRATION":
      return {
        subject: "New User Registration",
        html: baseLayout(
          "New Registration | Ingrammicro Surface",
          `
          <p>Dear PM,</p>

          <p>
            You have received a new user registration on
            <strong>Ingrammicro Surface</strong>.
            Please review to approve or reject this user.
          </p>

          <p style="margin:25px 0;text-align:center;">
            <a
              href="http://localhost:3000/users"
              style="
                background:#3ba1da;
                color:#ffffff;
                padding:10px 24px;
                text-decoration:none;
                border-radius:4px;
                font-size:14px;
                display:inline-block;
              "
            >
              View Account
            </a>
          </p>

          <p style="margin-top:25px;">
            <strong>User Details:</strong>
          </p>

          <table style="margin-top:10px;font-size:14px;">
            <tr>
              <td style="padding:6px 10px 6px 0;"><strong>Name:</strong></td>
              <td>${data.name}</td>
            </tr>
            <tr>
              <td style="padding:6px 10px 6px 0;"><strong>Email:</strong></td>
              <td>${data.email}</td>
            </tr>
            <tr>
              <td style="padding:6px 10px 6px 0;"><strong>Reseller:</strong></td>
              <td>${data.reseller}</td>
            </tr>
          </table>
          `
        ),
      };

    /* -------- USER REGISTERED -------- */
    case "USER_REGISTERED":
      return {
        subject: "Registration Received",
        html: baseLayout(
          "Registration Received | Ingrammicro Surface",
          `
          <p>Hello <strong>${data.name}</strong>,</p>

          <p>
            Thank you for registering on the
            <strong>Ingrammicro Surface portal</strong>.
            Your request has been received and is currently under review.
          </p>

          <p>
            You will receive a confirmation email once your account has been approved.
          </p>

          <p style="margin-top:25px;">
            If you have any questions, feel free to contact our support team.
          </p>

          <p>
            Best regards,<br/>
            <strong>Ingrammicro Surface Team</strong>
          </p>
          `
        ),
      };

    /* -------- USER APPROVED -------- */
    case "USER_APPROVED":
      return {
        subject: "Your Account Is Now Active",
        html: baseLayout(
          "New User Registration | Ingrammicro Surface",
          `
          <p>Dear <strong>${data.name}</strong>,</p>

          <p>
            Thank you for signing up! Your account is now active and ready to use.
          </p>

          <p style="margin:30px 0;text-align:center;">
            <a
              href="${data.loginUrl}"
              style="
                background:#3ba1da;
                color:#ffffff;
                padding:12px 30px;
                text-decoration:none;
                border-radius:4px;
                font-size:14px;
                display:inline-block;
              "
            >
              Login Now
            </a>
          </p>

          <p>
            Regards,<br/>
            <strong>Ingrammicro Surface Team</strong>
          </p>
          `
        ),
      };

    /* -------- USER REJECTED -------- */
    case "USER_REJECTED":
      return {
        subject: "Your Account Has Been Rejected",
        html: baseLayout(
          "Account Rejected | Ingrammicro Surface",
          `
          <p>Hello <strong>${data.name}</strong>,</p>

          <p>
            Unfortunately, your account has been rejected and you cannot login.
          </p>

          <p>
            Regards,<br/>
            <strong>Ingrammicro Surface Team</strong>
          </p>
          `
        ),
      };

    /* -------- ORDER APPROVED -------- */
    case "ORDER_APPROVED":
      return {
        subject: "Order Approved",
        html: baseLayout(
          "Order Approved | Ingrammicro Surface",
          `
          <p>Hello <strong>${data.name}</strong>,</p>

          <p>
            Your order <strong>#${data.orderId}</strong> has been approved.
          </p>

          <p>We will process it shortly.</p>

          <p>
            Regards,<br/>
            <strong>Ingrammicro Surface Team</strong>
          </p>
          `
        ),
      };

    /* -------- ORDER APPROVED -------- */
      case "ORDER_PLACED_ADMIN":
  return {
    subject: "New Order Placed",
    html: baseLayout(
      "New Order Received",
      `
      <p>A new order has been placed.</p>
      <p><strong>Order ID:</strong> ${data.orderId}</p>
      <p><strong>Seller:</strong> ${data.email}</p>
      `
    ),
  };

case "ORDER_PLACED_USER":
  return {
    subject: "Order Placed Successfully",
    html: baseLayout(
      "Order Placed",
      `
      <p>Hello <strong>${data.name}</strong>,</p>
      <p>Your order <strong>#${data.orderId}</strong> has been placed successfully.</p>
      <p>We’ll notify you once it’s approved.</p>
      `
    ),
  };


    /* -------- SAFETY -------- */
    default:
      throw new Error("Invalid email template type");
  }
}
