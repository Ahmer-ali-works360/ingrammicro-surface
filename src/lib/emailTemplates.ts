/* -------------------------------------------------
   src/lib/emailTemplates.ts
   CENTRAL EMAIL TEMPLATES FILE
   All email designs live here
-------------------------------------------------- */

type EmailTemplate = {
  subject: string;
  html: string;
};

/* ---------- BASE LAYOUT (User Registration process) ---------- */
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
          font-size:16px;
          font-weight:bold;
          color:#ffffff;
          text-align:center;
        "
      >
        ${title}
      </td>
    </tr>
    <!-- Logo Section -->
    <tr>
      <td style="padding:30px 20px;text-align:center;background:#ffffff;">
        <img 
          src="https://hcxexaouqvbvaycgpmfs.supabase.co/storage/v1/object/public/images/Ingram_micro_logo.png" 
          alt="Company Logo" 
          style="max-width:200px;height:auto;display:block;margin:0 auto;"
        />
      </td>
    </tr>
    <!-- Body -->
    <tr>
      <td style="padding:30px;font-size:14px;color:#333333;line-height:1.6;">
        ${body}
      </td>
    </tr>
    <!-- Footer -->
    <tr>
      <td
        style="
          background:#3ba1da;
          padding:12px 15px;
          font-size:16px;
          color:#ffffff;
          text-align:center;
        "
      >
        <a href="https://www.ingrammicro-surface.com/" style="color:white;text-decoration:none;">www.ingrammicro-surface.com</a> | <a href="mailto:ahmer.ali@worls360.com" style="color:white;text-decoration:none;">support@Ingrammicro-surface.com</a> 
      </td>
    </tr>
  </table>
  <p>&nbsp;</p>
</body>
</html>
`;
}
/* ---------- ORDER LAYOUT (Detailed order emails) ---------- */
function orderLayout(title: string, body: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700&display=swap" rel="stylesheet">
    </head>
    <body style="margin:0;padding:30px 0;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0"
              style="background:#ffffff;
                     font-family:'Open Sans',Helvetica Neue,Helvetica,Arial,sans-serif;
                     font-size:15px;
                     border:1px solid #d1d1e0;
                     border-collapse:collapse;">
              
              <!-- HEADER -->
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
              <!-- Logo Section -->
    <tr>
      <td style="padding:30px 20px;text-align:center;background:#ffffff;">
        <img 
          src="https://hcxexaouqvbvaycgpmfs.supabase.co/storage/v1/object/public/images/Ingram_micro_logo.png" 
          alt="Company Logo" 
          style="max-width:200px;height:auto;display:block;margin:0 auto;"
        />
      </td>
    </tr>

              <!-- BODY CONTENT -->
              <tr>
                <td style="padding:15px;">
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
        <a href="https://www.ingrammicro-surface.com/" style="color:white;text-decoration:none;">www.ingrammicro-surface.com</a> | <a href="mailto:ahmer.ali@worls360.com" style="color:white;text-decoration:none;">ahmer.ali@worls360.com</a> 
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
export function getEmailTemplate(type: string, data: any): EmailTemplate {
  switch (type) {

    /* -------- ADMIN: NEW USER REGISTRATION -------- */
    case "NEW_USER_REGISTRATION":
      return {
        subject: "New user Registration | Ingrammicro Surface (Awaiting Approval)",
        html: baseLayout(
          "New user Registration | Ingrammicro Surface (Awaiting Approval)",
          `
          <p>Dear PM,</p>

          <p>
            You have received a new user registration on
            <strong>Ingrammicro Surface</strong>.
            Please review to approve or reject this user.
          </p>

          <p style="margin:25px 0;text-align:center;">
            <a
              href="http://https://ingrammicro-surface.vercel.app/users"
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
        subject: "New user Registration | Ingrammicro Surface (Awaiting Approval)",
        html: baseLayout(
          "New user Registration | Ingrammicro Surface (Awaiting Approval)",
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
        subject: "New user Registration | Ingrammicro Surface (Approved)",
        html: baseLayout(
          "New user Registration | Ingrammicro Surface (Approved)",
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

      /* -------- ADMIN: USER APPROVED NOTIFICATION -------- */
    case "ADMIN_USER_APPROVED":
      return {
        subject: "New user Registration | Ingrammicro Surface (Approved)",
        html: baseLayout(
          "New user Registration | Ingrammicro Surface (Approved)",
          `
          <p>Dear PM,</p>

          <p>
            The following user has been <strong>approved</strong> on
            <strong>Ingrammicro Surface</strong>.
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
            <tr>
              <td style="padding:6px 10px 6px 0;"><strong>Status:</strong></td>
              <td><span style="color:#28a745;font-weight:bold;">Approved</span></td>
            </tr>
          </table>

          <p style="margin-top:25px;">
            Regards,<br/>
            <strong>Ingrammicro Surface Team</strong>
          </p>
          `
        ),
      };

    /* -------- USER REJECTED -------- */
    case "USER_REJECTED":
      return {
        subject: "New user Registration | Ingrammicro Surface (Rejected)",
        html: baseLayout(
          " New user Registration | Ingrammicro Surface (Rejected)",
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

      /* -------- ADMIN: USER REJECTED NOTIFICATION -------- */
    case "ADMIN_USER_REJECTED":
      return {
        subject: "New user Registration | Ingrammicro Surface (Rejected)",
        html: baseLayout(
          "New user Registration | Ingrammicro Surface (Rejected)",
          `
          <p>Dear PM,</p>

          <p>
            The following user has been <strong>rejected</strong> on
            <strong>Ingrammicro Surface</strong>.
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
            <tr>
              <td style="padding:6px 10px 6px 0;"><strong>Status:</strong></td>
              <td><span style="color:#dc3545;font-weight:bold;">Rejected</span></td>
            </tr>
          </table>

          <p style="margin-top:25px;">
            Regards,<br/>
            <strong>Ingrammicro Surface Team</strong>
          </p>
          `
        ),
      };


    /* -------- ORDER_APPROVED_USER (UPDATED) -------- */
    case "ORDER_APPROVED_USER":
      return {
        subject: `Order Approved (#${data.order_number}) | Ingrammicro Surface`,
        html: orderLayout(
          `Approved Order (#${data.order_number})  | Ingrammicro Surface`,
          `
            <!-- TITLE -->
            <h3 style="margin:0;font-size:18px;font-weight:bold;color:#000;">
              Approved Order (#${data.order_number})<br>
              <span style="font-size:14px;font-weight:normal;color:#848484;">
                Placed on ${data.created_at ? new Date(data.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "N/A"}
              </span>
            </h3>

            <div style="text-align:center; margin:24px 0;">
              <img src="https://hcxexaouqvbvaycgpmfs.supabase.co/storage/v1/object/public/order-files/order%20email/order%20approved.png" width="550" style="width:100%; max-width:550px; height:auto;">
            </div>
            
            <!-- INTRO -->
            <div style="padding:15px 0;color:#000;">
              <p style="font-size:15px;line-height:1.5;margin:10px 0;font-weight:100;">
                Your order on <a style="color:#0d62c2;text-decoration:none" href="#" target="_blank">ingrammicro-surface.com/</a> has been approved. Once your package ships, you will receive a shipping email with tracking information and a prepaid Return Label for your order.
              </p>
              <p style="font-size:15px;line-height:1.5;margin:10px 0;">
                If you have any questions please contact us at <a style="color:#0d62c2;text-decoration:none" href="mailto:ahmer.ali@works360.com">ahmer.ali@works360.com</a>
              </p>
            </div>

            <!-- PRODUCTS TABLE -->
            <table width="100%" cellpadding="8" cellspacing="0" style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
              <tr style="background:#E3E3E3;">
                <th width="75%" style="border:1px solid #213747;text-align:left;padding:8px;">Product</th>
                <th width="25%" style="border:1px solid #213747;text-align:left;padding:8px;">Quantity</th>
              </tr>
              ${data.orderItems?.map((item: any) => `
                <tr>
                  <td style="border:1px solid #ccc;padding:8px;">
                    ${item.productName || "N/A"}<br>
                    <span style="font-size:12px;color:#666;">${item.sku || ""}</span>
                  </td>
                  <td style="border:1px solid #ccc;padding:8px;">${item.quantity}</td>
                </tr>
              `).join("") || '<tr><td colspan="2" style="border:1px solid #ccc;padding:8px;">No items</td></tr>'}
            </table>

            <!-- SHIPPING DETAILS -->
            <table width="100%" cellpadding="8" cellspacing="0" style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
              <tr>
                <th colspan="2" style="background:#E3E3E3;border:1px solid #213747;text-align:left;padding:8px;font-size:15px;">
                  Shipping Details
                </th>
              </tr>  
              <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Company Name</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.companyName || 'N/A'}</td></tr>
              <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Contact Name</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.contactName || 'N/A'}</td></tr>
              <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Contact Email</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.contact_email || 'N/A'}</td></tr>
              <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Shipping Address</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.shippingAddress || 'N/A'}</td></tr>
              <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">State</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.state || 'N/A'}</td></tr>
              <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">City</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.city || 'N/A'}</td></tr>
              <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">ZIP code</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.zip || 'N/A'}</td></tr>
              <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Delivery Date</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.deliveryDate || 'N/A'}</td></tr>
            </table>

            <!-- OPPORTUNITY DETAILS -->
            <table width="100%" cellpadding="8" cellspacing="0" style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
              <tr>
                <th colspan="2" style="background:#E3E3E3;border:1px solid #213747;text-align:left;padding:8px;font-size:15px;">
                  Opportunity Details
                </th>
              </tr>
              <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Device Opportunity Size (Units)</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.units ?? "N/A"}</td></tr>
              <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Budget Per Device ($)</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.budget ? `$${data.budget.toLocaleString()}` : "N/A"}</td></tr>
              <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Revenue Opportunity Size ($ Device Rev)</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.revenue ? `$${data.revenue.toLocaleString()}` : "N/A"}</td></tr>
              <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Ingram Account #</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.ingramAccount ?? "N/A"}</td></tr>
              <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Quote #</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.quote ?? "N/A"}</td></tr>
              <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Segment</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.segment ?? "N/A"}</td></tr>
              <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Existing Manufacturer</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.manufacturer ?? "N/A"}</td></tr>
            </table>

            ${data.notes ? `
            <table width="100%" cellpadding="8" cellspacing="0" style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
              <tr>
                <th style="background:#E3E3E3;border:1px solid #213747;text-align:left;padding:8px;font-size:15px;">
                  Order Notes
                </th>
              </tr>
              <tr>
                <td style="border:1px solid #ccc;padding:8px;color:#4b5563;">${data.notes}</td>
              </tr>
            </table>
            ` : ''}
          `
        ),
      };

  
      /* -------- ORDER_APPROVED_ADMIN (UPDATED) -------- */
case "ORDER_APPROVED_ADMIN":
  return {
    subject: `Order Approved (#${data.order_number}) | Ingrammicro Surface`,
    html: orderLayout(
      `Order Approved (#${data.order_number})  | Ingrammicro Surface`,
      `
        <!-- TITLE -->
        <h3 style="margin:0;font-size:18px;font-weight:bold;color:#000;">
          Approved Order (#${data.order_number})<br>
          <span style="font-size:14px;font-weight:normal;color:#848484;">
            Placed on ${data.created_at ? new Date(data.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "N/A"}
          </span>
        </h3>

        <div style="text-align:center; margin:24px 0;">
          <img src="https://hcxexaouqvbvaycgpmfs.supabase.co/storage/v1/object/public/order-files/order%20email/order%20approved.png" width="550" style="width:100%; max-width:550px; height:auto;">
        </div>
        
        <!-- ADMIN INTRO -->
        <div style="padding:20px 0;color:#000;text-align:center;">
          <p style="font-size:16px;line-height:1.5;margin:10px 0;font-weight:bold;color:#000;">
            Order Approved Successfully
          </p>
          <p style="font-size:15px;line-height:1.5;margin:10px 0;">
            The following order has been approved on <a style="color:#0d62c2;text-decoration:none" href="#" target="_blank">ingrammicro-surface.com/</a>.<br>
            Please review the order details below.
          </p>
          
          <a href="${data.ordersPageUrl || 'https://ingrammicro-surface.vercel.app/orders'}" 
             style="display:inline-block;
                    margin:20px 0;
                    padding:12px 30px;
                    background-color:#0d62c2;
                    color:#ffffff;
                    text-decoration:none;
                    border-radius:5px;
                    font-weight:bold;
                    font-size:16px;">
            View Order
          </a>
        </div>

        <!-- PRODUCTS TABLE -->
        <table width="100%" cellpadding="8" cellspacing="0" style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
          <tr style="background:#E3E3E3;">
            <th width="75%" style="border:1px solid #213747;text-align:left;padding:8px;">Product</th>
            <th width="25%" style="border:1px solid #213747;text-align:left;padding:8px;">Quantity</th>
          </tr>
          ${data.orderItems?.map((item: any) => `
            <tr>
              <td style="border:1px solid #ccc;padding:8px;">
                ${item.productName || "N/A"}<br>
                <span style="font-size:12px;color:#666;">${item.sku || ""}</span>
              </td>
              <td style="border:1px solid #ccc;padding:8px;">${item.quantity}</td>
            </tr>
          `).join("") || '<tr><td colspan="2" style="border:1px solid #ccc;padding:8px;">No items</td></tr>'}
        </table>

        <!-- SHIPPING DETAILS -->
        <table width="100%" cellpadding="8" cellspacing="0" style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
          <tr>
            <th colspan="2" style="background:#E3E3E3;border:1px solid #213747;text-align:left;padding:8px;font-size:15px;">
              Shipping Details
            </th>
          </tr>  
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Company Name</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.companyName || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Contact Name</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.contactName || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Contact Email</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.contact_email || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Shipping Address</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.shippingAddress || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">State</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.state || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">City</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.city || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">ZIP code</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.zip || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Delivery Date</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.deliveryDate || 'N/A'}</td></tr>
        </table>

        <!-- OPPORTUNITY DETAILS -->
        <table width="100%" cellpadding="8" cellspacing="0" style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
          <tr>
            <th colspan="2" style="background:#E3E3E3;border:1px solid #213747;text-align:left;padding:8px;font-size:15px;">
              Opportunity Details
            </th>
          </tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Device Opportunity Size (Units)</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.units ?? "N/A"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Budget Per Device ($)</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.budget ? `$${data.budget.toLocaleString()}` : "N/A"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Revenue Opportunity Size ($ Device Rev)</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.revenue ? `$${data.revenue.toLocaleString()}` : "N/A"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Ingram Account #</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.ingramAccount ?? "N/A"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Quote #</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.quote ?? "N/A"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Segment</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.segment ?? "N/A"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Existing Manufacturer</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.manufacturer ?? "N/A"}</td></tr>
        </table>

        ${data.notes ? `
        <table width="100%" cellpadding="8" cellspacing="0" style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
          <tr>
            <th style="background:#E3E3E3;border:1px solid #213747;text-align:left;padding:8px;font-size:15px;">
              Order Notes
            </th>
          </tr>
          <tr>
            <td style="border:1px solid #ccc;padding:8px;color:#4b5563;">${data.notes}</td>
          </tr>
        </table>
        ` : ''}
      `
    ),
  };

  


    /* -------- ORDER_PLACED_USER-------- */
      case "ORDER_PLACED_USER":
        return {
          subject: `New Order (#${data.order_number}) | Ingram Micro Surface`,
          html: orderLayout(
            `New Order (#${data.order_number})| Ingram Micro Surface`,
            `
              <!-- TITLE -->
              <h3 style="margin:0;font-size:18px;font-weight:bold;color:#000;">
                Order Placed Successfully (#${data.order_number})<br>
                <span style="font-size:14px;font-weight:normal;color:#848484;">
                  Placed on ${data.createdAt ? new Date(data.createdAt).toLocaleDateString() : "N/A"}
                </span>
              </h3>

              <div style="text-align:center; margin:24px 0;">
                <img src="https://hcxexaouqvbvaycgpmfs.supabase.co/storage/v1/object/public/order-files/order%20email/order%20placed.png" width="550" style="width:100%; max-width:550px; height:auto;">
              </div>
              
              <!-- INTRO -->
              <div style="padding:15px 0;color:#000;">
                <p style="font-size:15px;line-height:1.5;margin:10px 0;font-weight:100;">
                  Thank you for your order from ingrammicro-surface.com. Once your order is approved, you will receive a confirmation email after which it will be shipped to your customer.
                </p>
                <p>
                  If you have any questions please contact us at  <a style="color:#0d62c2;text-decoration:none" href="mailto:ahmer.ali@works360.com">ahmer.ali@worls360.com</a>
                </p>
              </div>

              <!-- PRODUCTS TABLE -->
              <table width="100%" cellpadding="8" cellspacing="0" style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
                <tr style="background:#E3E3E3;">
                  <th width="75%" style="border:1px solid #213747;text-align:left;padding:8px;">Product</th>
                  <th width="25%" style="border:1px solid #213747;text-align:left;padding:8px;">Quantity</th>
                </tr>
                ${data.orderItems?.map((item: any) => {
                  const inv = Array.isArray(item.inventory) ? item.inventory[0] : item.inventory;
                  return `
                    <tr>
                      <td style="border:1px solid #ccc;padding:8px;">
                        ${inv?.product_names || "N/A"}<br>
                        <span style="font-size:12px;color:#666;">${inv?.skus || ""}</span>
                      </td>
                      <td style="border:1px solid #ccc;padding:8px;">${item.quantity}</td>
                    </tr>
                  `;
                }).join("") || '<tr><td colspan="2" style="border:1px solid #ccc;padding:8px;">No items</td></tr>'}
              </table>

              <!-- SHIPPING DETAILS -->
              <table width="100%" cellpadding="8" cellspacing="0" style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
                <tr>
                  <th colspan="2" style="background:#E3E3E3;border:1px solid #213747;text-align:left;padding:8px;font-size:15px;">
                    Shipping Details
                  </th>
                </tr>  
                <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Company Name</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.companyName || 'N/A'}</td></tr>
                <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Contact Name</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.contactName || 'N/A'}</td></tr>
                <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Contact Email</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.contactEmail || 'N/A'}</td></tr>
                <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Shipping Address</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.shippingAddress || 'N/A'}</td></tr>
                <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">State</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.state || 'N/A'}</td></tr>
                <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">City</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.city || 'N/A'}</td></tr>
                <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">ZIP code</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.zip || 'N/A'}</td></tr>
                <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Delivery Date</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.deliveryDate || 'N/A'}</td></tr>
              </table>

              <!-- OPPORTUNITY DETAILS -->
              <table width="100%" cellpadding="8" cellspacing="0" style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
                <tr>
                  <th colspan="2" style="background:#E3E3E3;border:1px solid #213747;text-align:left;padding:8px;font-size:15px;">
                    Opportunity Details
                  </th>
                </tr>
                <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Device Opportunity Size(units)</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.units ?? "N/A"}</td></tr>
                <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Budget Per Device ($)</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.budget ?? "N/A"}</td></tr>
                <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Revenue Opportunity Size($ Device Rev)</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.revenue ?? "N/A"}</td></tr>
                <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">ingram_account #</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.ingramAccount ?? "N/A"}</td></tr>
                <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Quote #</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.quote ?? "N/A"}</td></tr>
                <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Segment</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.segment ?? "N/A"}</td></tr>
                <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Existing Manufacturer</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.manufacturer ?? "N/A"}</td></tr>
              </table>

              ${data.notes ? `
              <table width="100%" cellpadding="8" cellspacing="0" style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
                <tr>
                  <th style="background:#E3E3E3;border:1px solid #213747;text-align:left;padding:8px;font-size:15px;">
                    Order Notes
                  </th>
                </tr>
                <tr>
                  <td style="border:1px solid #ccc;padding:8px;color:#4b5563;">${data.notes}</td>
                </tr>
              </table>
              ` : ''}
            `
          ),
        };


    /* -------- ORDER_PLACED_Admin-------- */
case "ORDER_PLACED_ADMIN":
  return {
    subject: `New Order (#${data.order_number}) | Ingram Micro Surface`,
    html: orderLayout(
      `New Order (#${data.order_number}) | Ingram Micro Surface`,
      `
        <!-- TITLE -->
        <h3 style="margin:0;font-size:18px;font-weight:bold;color:#000;">
          New Order Received (#${data.order_number})<br>
          <span style="font-size:14px;font-weight:normal;color:#848484;">
            Placed on ${data.createdAt ? new Date(data.createdAt).toLocaleDateString() : "N/A"}
          </span>
        </h3>

        <div style="text-align:center; margin:24px 0;">
          <img src="https://hcxexaouqvbvaycgpmfs.supabase.co/storage/v1/object/public/order-files/order%20email/order%20placed.png" width="550" style="width:100%; max-width:550px; height:auto;">
        </div>
        
        <!-- ACTION REQUIRED -->
        <div style="padding:20px 0;color:#000;text-align:center;">
          <p style="font-size:16px;line-height:1.5;margin:10px 0;font-weight:bold;color:#000;">
            Action Required
          </p>
          <p style="font-size:15px;line-height:1.5;margin:10px 0;">
            A new order has been placed and requires review.<br>
            Click below to review and process the order.
          </p>
          <a href="${data.ordersPageUrl || 'https://ingrammicro-surface.vercel.app/orders'}" 
             style="display:inline-block;
                    margin:20px 0;
                    padding:12px 30px;
                    background-color:#0d62c2;
                    color:#ffffff;
                    text-decoration:none;
                    border-radius:5px;
                    font-weight:bold;
                    font-size:16px;">
            Review Order
          </a>
        </div>

        <!-- PRODUCTS TABLE -->
        <table width="100%" cellpadding="8" cellspacing="0" style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
          <tr style="background:#E3E3E3;">
            <th width="75%" style="border:1px solid #213747;text-align:left;padding:8px;">Product</th>
            <th width="25%" style="border:1px solid #213747;text-align:left;padding:8px;">Quantity</th>
          </tr>
          ${data.orderItems?.map((item: any) => {
            const inv = item.inventory ? (Array.isArray(item.inventory) ? item.inventory[0] : item.inventory) : null;
            return `
              <tr>
                <td style="border:1px solid #ccc;padding:8px;">
                  ${inv?.product_names || "N/A"}<br>
                  <span style="font-size:12px;color:#666;">${inv?.skus || ""}</span>
                </td>
                <td style="border:1px solid #ccc;padding:8px;">${item.quantity}</td>
              </tr>
            `;
          }).join("") || '<tr><td colspan="2" style="border:1px solid #ccc;padding:8px;">No items</td></tr>'}
        </table>

        <!-- CUSTOMER INFO -->
        <table width="100%" cellpadding="8" cellspacing="0" style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
          <tr>
            <th colspan="2" style="background:#E3E3E3;border:1px solid #213747;text-align:left;padding:8px;font-size:15px;">
              Customer Information
            </th>
          </tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Company</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.companyName || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Contact</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.contactName || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Email</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.sellerEmail || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Seller</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.sellerName || 'N/A'}</td></tr>
        </table>

        <!-- SHIPPING DETAILS -->
        <table width="100%" cellpadding="8" cellspacing="0" style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
          <tr>
            <th colspan="2" style="background:#E3E3E3;border:1px solid #213747;text-align:left;padding:8px;font-size:15px;">
              Shipping Details
            </th>
          </tr>  
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Company Name</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.companyName || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Contact Name</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.contactName || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Contact Email</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.contactEmail || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Shipping Address</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.shippingAddress || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">State</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.state || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">City</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.city || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">ZIP code</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.zip || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Delivery Date</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.deliveryDate || 'N/A'}</td></tr>
        </table>

        <!-- OPPORTUNITY DETAILS -->
        <table width="100%" cellpadding="8" cellspacing="0" style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
          <tr>
            <th colspan="2" style="background:#E3E3E3;border:1px solid #213747;text-align:left;padding:8px;font-size:15px;">
              Opportunity Details
            </th>
          </tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Device Opportunity Size(units)</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.units ?? "N/A"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Budget Per Device ($)</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.budget ?? "N/A"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Revenue Opportunity Size($ Device Rev)</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.revenue ?? "N/A"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">ingram_account #</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.ingramAccount ?? "N/A"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Quote #</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.quote ?? "N/A"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Segment</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.segment ?? "N/A"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Existing Manufacturer</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.manufacturer ?? "N/A"}</td></tr>
        </table>

        ${data.notes ? `
        <table width="100%" cellpadding="8" cellspacing="0" style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
          <tr>
            <th style="background:#E3E3E3;border:1px solid #213747;text-align:left;padding:8px;font-size:15px;">
              Order Notes
            </th>
          </tr>
          <tr>
            <td style="border:1px solid #ccc;padding:8px;color:#4b5563;">${data.notes}</td>
          </tr>
        </table>
        ` : ''}
      `
    ),
  };

/* -------- ORDER_SHIPPED_USER (UPDATED) -------- */
case "ORDER_SHIPPED_USER":
  return {
    subject: `Order Shipped (#${data.order_number}) | Ingram Micro Surface`,
    html: orderLayout(
      `Order Shipped (#${data.order_number}) | Ingram Micro Surface`,
      `
        <!-- TITLE -->
        <h3 style="margin:0;font-size:18px;font-weight:bold;color:#000;">
          Shipped Order (#${data.order_number})<br>
          <span style="font-size:14px;font-weight:normal;color:#848484;">
            Placed On ${data.created_at ? new Date(data.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "N/A"}
          </span>
        </h3>

        <div style="text-align:center; margin:24px 0;">
          <img src="https://hcxexaouqvbvaycgpmfs.supabase.co/storage/v1/object/public/order-files/order%20email/order%20shipped.png" width="550" style="width:100%; max-width:550px; height:auto;">
        </div>

        <!-- PERSONALIZED INTRO -->
        <div style="padding:15px 0;color:#000;">
          <p style="font-size:15px;line-height:1.5;margin:10px 0;font-weight:bold;">
            Hello, ${data.contactName || 'Customer'}
          </p>
          <p style="font-size:15px;line-height:1.5;margin:10px 0;font-weight:100;">
            Your order on Ingrammicro Surface has been shipped. You can find below Tracking information and Return Label for your order.
          </p>
        </div>

        <!-- TRACKING INFORMATION BOX -->
        <table width="100%" cellpadding="12" cellspacing="0" style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;background:#f9fafb;">
          <tr>
            <th colspan="2" style="background:#E3E3E3;border:1px solid #213747;text-align:left;padding:8px;font-size:15px;">
              Tracking Information
            </th>
          </tr>
          <tr>
            <td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Order Tracking #:</td>
            <td width="60%" style="border:1px solid #ccc;padding:8px;"><a href="#">${data.trackingNumber || 'N/A'}</a></td>
          </tr>
          <tr>
            <td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Return Tracking #:</td>
            <td width="60%" style="border:1px solid #ccc;padding:8px;"><a href="#">${data.returnTrackingNumber || 'N/A'}</a></td>
          </tr>
          <tr>
            <td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Case Type:</td>
            <td width="60%" style="border:1px solid #ccc;padding:8px;">${data.caseType || 'N/A'}</td>
          </tr>
        </table>

       
        <div style="text-align:center; margin:15px 0;">
         <a href="${data.trackingLink}" target="_blank" style="display:inline-block; margin:10px; padding:8px 16px; text-decoration:none; ">
        Download Return Label
        </a>
        </div>


        <!-- PRODUCTS TABLE -->
        <table width="100%" cellpadding="8" cellspacing="0" style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
          <tr style="background:#E3E3E3;">
            <th width="75%" style="border:1px solid #213747;text-align:left;padding:8px;">Product</th>
            <th width="25%" style="border:1px solid #213747;text-align:left;padding:8px;">Quantity</th>
          </tr>
          ${data.orderItems?.map((item: any) => `
            <tr>
              <td style="border:1px solid #ccc;padding:8px;">
                ${item.productName || "N/A"}<br>
                <span style="font-size:12px;color:#666;">(#${item.sku || ""})</span>
              </td>
              <td style="border:1px solid #ccc;padding:8px;">${item.quantity}</td>
            </tr>
          `).join("") || '<tr><td colspan="2" style="border:1px solid #ccc;padding:8px;">No items</td></tr>'}
        </table>

        <!-- TEAM DETAILS -->
        <table width="100%" cellpadding="8" cellspacing="0" style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
          <tr>
            <th colspan="2" style="background:#E3E3E3;border:1px solid #213747;text-align:left;padding:8px;font-size:15px;">
              Team Details
            </th>
          </tr>
          <tr>
            <td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Seller Contact Name</td>
            <td width="60%" style="border:1px solid #ccc;padding:8px;">${data.sellerName || 'N/A'}</td>
          </tr>
          <tr>
            <td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Seller Contact Email</td>
            <td width="60%" style="border:1px solid #ccc;padding:8px;">${data.sellerEmail || 'N/A'}</td>
          </tr>
        </table>

        <!-- SHIPPING DETAILS -->
        <table width="100%" cellpadding="8" cellspacing="0" style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
          <tr>
            <th colspan="2" style="background:#E3E3E3;border:1px solid #213747;text-align:left;padding:8px;font-size:15px;">
              Shipping Details
            </th>
          </tr>  
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Customer Company Name</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.companyName || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Customer Contact Name</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.contactName || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Customer Contact Email Address</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.contact_email || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Customer Shipping Address</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.shippingAddress || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">City</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.city || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">State</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.state || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Zip</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.zip || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Desired Delivery Date</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.deliveryDate || 'N/A'}</td></tr>
        </table>

        <!-- OPPORTUNITY DETAILS -->
        <table width="100%" cellpadding="8" cellspacing="0" style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
          <tr>
            <th colspan="2" style="background:#E3E3E3;border:1px solid #213747;text-align:left;padding:8px;font-size:15px;">
              Opportunity Details
            </th>
          </tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Device Opportunity Size (Units)</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.units ?? "N/A"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Budget Per Device ($)</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.budget ? `$${data.budget.toLocaleString()}` : "N/A"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Revenue Opportunity Size ($ Device Rev)</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.revenue ? `$${data.revenue.toLocaleString()}` : "N/A"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Ingram Account #</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.ingramAccount ?? "N/A"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Quote #</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.quote ?? "N/A"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Segment</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.segment ?? "N/A"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Is this a competitive opportunity?</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.isReseller ? "Yes" : "No"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Current Manufacturer</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.manufacturer ?? "N/A"}</td></tr>
        </table>

        ${data.notes ? `
        <table width="100%" cellpadding="8" cellspacing="0" style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
          <tr>
            <th style="background:#E3E3E3;border:1px solid #213747;text-align:left;padding:8px;font-size:15px;">
              Note
            </th>
          </tr>
          <tr>
            <td style="border:1px solid #ccc;padding:8px;color:#4b5563;">${data.notes}</td>
          </tr>
        </table>
        ` : ''}
      `
    ),
  };
/* -------- ORDER_SHIPPED_ADMIN (UPDATED) -------- */
case "ORDER_SHIPPED_ADMIN":
  return {
    subject: `Order Shipped (#${data.order_number}) | Ingram Micro Surface`,
    html: orderLayout(
      `Order Shipped (#${data.order_number}) | Ingram Micro Surface`,
      `
        <!-- TITLE -->
        <h3 style="margin:0;font-size:18px;font-weight:bold;color:#000;">
          Shipped Order (#${data.order_number})<br>
          <span style="font-size:14px;font-weight:normal;color:#848484;">
            Placed On ${data.created_at ? new Date(data.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "N/A"}
          </span>
        </h3>

        <div style="text-align:center; margin:24px 0;">
          <img src="https://hcxexaouqvbvaycgpmfs.supabase.co/storage/v1/object/public/order-files/order%20email/order%20shipped.png" width="550" style="width:100%; max-width:550px; height:auto;">
        </div>

        <!-- ADMIN INTRO -->
        <div style="padding:20px 0;color:#000;text-align:center;">
          <p style="font-size:16px;line-height:1.5;margin:10px 0;font-weight:bold;color:#000;">
            Order Shipped Successfully
          </p>
          <p style="font-size:15px;line-height:1.5;margin:10px 0;">
            The order has been shipped to ${data.contactName || 'the customer'}.<br>
            Click below to view order details.
          </p>
          <a href="${data.ordersPageUrl || 'https://ingrammicro-surface.vercel.app/orders'}" 
             style="display:inline-block;
                    margin:20px 0;
                    padding:12px 30px;
                    background-color:#0d62c2;
                    color:#ffffff;
                    text-decoration:none;
                    border-radius:5px;
                    font-weight:bold;
                    font-size:16px;">
            View Order
          </a>
        </div>

        <!-- TRACKING INFORMATION BOX -->
        <table width="100%" cellpadding="12" cellspacing="0" style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;background:#f9fafb;">
          <tr>
            <th colspan="2" style="background:#E3E3E3;border:1px solid #213747;text-align:left;padding:8px;font-size:15px;">
              Tracking Information
            </th>
          </tr>
          <tr>
            <td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Order Tracking #:</td>
            <td width="60%" style="border:1px solid #ccc;padding:8px;"><a href="#">${data.trackingNumber || 'N/A'}</a></td>
          </tr>
          <tr>
            <td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Return Tracking #:</td>
            <td width="60%" style="border:1px solid #ccc;padding:8px;"> <a href="#">${data.returnTrackingNumber || 'N/A'}</a></td>
          </tr>
          <tr>
            <td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Case Type:</td>
            <td width="60%" style="border:1px solid #ccc;padding:8px;">${data.caseType || 'N/A'}</td>
          </tr>
        </table>
        
         <div style="text-align:center; margin:15px 0;">
         <a href="${data.trackingLink}" target="_blank" style="display:inline-block; margin:10px; padding:8px 16px; text-decoration:none; ">
        Download Return Label
        </a>
        </div>

        <!-- PRODUCTS TABLE -->
        <table width="100%" cellpadding="8" cellspacing="0" style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
          <tr style="background:#E3E3E3;">
            <th width="75%" style="border:1px solid #213747;text-align:left;padding:8px;">Product</th>
            <th width="25%" style="border:1px solid #213747;text-align:left;padding:8px;">Quantity</th>
          </tr>
          ${data.orderItems?.map((item: any) => `
            <tr>
              <td style="border:1px solid #ccc;padding:8px;">
                ${item.productName || "N/A"}<br>
                <span style="font-size:12px;color:#666;">(#${item.sku || ""})</span>
              </td>
              <td style="border:1px solid #ccc;padding:8px;">${item.quantity}</td>
            </tr>
          `).join("") || '<tr><td colspan="2" style="border:1px solid #ccc;padding:8px;">No items</td></tr>'}
        </table>

        <!-- TEAM DETAILS -->
        <table width="100%" cellpadding="8" cellspacing="0" style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
          <tr>
            <th colspan="2" style="background:#E3E3E3;border:1px solid #213747;text-align:left;padding:8px;font-size:15px;">
              Team Details
            </th>
          </tr>
          <tr>
            <td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Seller Contact Name</td>
            <td width="60%" style="border:1px solid #ccc;padding:8px;">${data.sellerName || 'N/A'}</td>
          </tr>
          <tr>
            <td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Seller Contact Email</td>
            <td width="60%" style="border:1px solid #ccc;padding:8px;">${data.sellerEmail || 'N/A'}</td>
          </tr>
        </table>

        <!-- SHIPPING DETAILS -->
        <table width="100%" cellpadding="8" cellspacing="0" style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
          <tr>
            <th colspan="2" style="background:#E3E3E3;border:1px solid #213747;text-align:left;padding:8px;font-size:15px;">
              Shipping Details
            </th>
          </tr>  
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Customer Company Name</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.companyName || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Customer Contact Name</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.contactName || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Customer Contact Email Address</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.contact_email || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Customer Shipping Address</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.shippingAddress || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">City</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.city || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">State</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.state || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Zip</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.zip || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Desired Delivery Date</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.deliveryDate || 'N/A'}</td></tr>
        </table>

        <!-- OPPORTUNITY DETAILS -->
        <table width="100%" cellpadding="8" cellspacing="0" style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
          <tr>
            <th colspan="2" style="background:#E3E3E3;border:1px solid #213747;text-align:left;padding:8px;font-size:15px;">
              Opportunity Details
            </th>
          </tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Device Opportunity Size (Units)</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.units ?? "N/A"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Budget Per Device ($)</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.budget ? `$${data.budget.toLocaleString()}` : "N/A"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Revenue Opportunity Size ($ Device Rev)</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.revenue ? `$${data.revenue.toLocaleString()}` : "N/A"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Ingram Account #</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.ingramAccount ?? "N/A"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Quote #</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.quote ?? "N/A"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Segment</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.segment ?? "N/A"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Is this a competitive opportunity?</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.isReseller ? "Yes" : "No"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Current Manufacturer</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.manufacturer ?? "N/A"}</td></tr>
        </table>

        ${data.notes ? `
        <table width="100%" cellpadding="8" cellspacing="0" style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
          <tr>
            <th style="background:#E3E3E3;border:1px solid #213747;text-align:left;padding:8px;font-size:15px;">
              Note
            </th>
          </tr>
          <tr>
            <td style="border:1px solid #ccc;padding:8px;color:#4b5563;">${data.notes}</td>
          </tr>
        </table>
        ` : ''}
      `
    ),
  };
    /* -------- ORDER_RETURN-------- */
case "ORDER_RETURN_USER":
  return {
    subject: `Order Returned (#${data.order_number})) | Ingram Micro Surface`,
    html: orderLayout(
      `Order Returned (#${data.order_number}) | Ingram Micro Surface`,
      `
        <!-- TITLE -->
        <h3 style="margin:0;font-size:18px;font-weight:bold;color:#000;">
          Order Returned (#${data.order_number}))<br>
          <span style="font-size:14px;font-weight:normal;color:#848484;">
            Returned on ${data.returnedAt ? new Date(data.returnedAt).toLocaleDateString() : "N/A"}
          </span>
        </h3>

        <div style="text-align:center; margin:24px 0;">
          <img src="https://hcxexaouqvbvaycgpmfs.supabase.co/storage/v1/object/public/order-files/order%20email/order%20return.png" width="550" style="width:100%; max-width:550px; height:auto;">
        </div>
        
        <!-- INTRO -->
        <div style="padding:15px 0;color:#000;">
          <p style="font-size:15px;line-height:1.5;margin:10px 0;font-weight:100;">
            Your order has been successfully returned and received by our warehouse.
          </p>
          <p>
            If you have any questions please contact us at <a style="color:#0d62c2;text-decoration:none" href="mailto:ahmer.ali@worls360.com">ahmer.ali@worls360.com</a>
          </p>
        </div>

       
        <!-- PRODUCTS TABLE -->
        <table width="100%" cellpadding="8" cellspacing="0" style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
          <tr style="background:#E3E3E3;">
            <th width="75%" style="border:1px solid #213747;text-align:left;padding:8px;">Product</th>
            <th width="25%" style="border:1px solid #213747;text-align:left;padding:8px;">Quantity</th>
          </tr>
          ${data.orderItems?.map((item: any) => `
            <tr>
              <td style="border:1px solid #ccc;padding:8px;">
                ${item.productName || "N/A"}<br>
                <span style="font-size:12px;color:#666;">(#${item.sku || ""})</span>
              </td>
              <td style="border:1px solid #ccc;padding:8px;">${item.quantity}</td>
            </tr>
          `).join("") || '<tr><td colspan="2" style="border:1px solid #ccc;padding:8px;">No items</td></tr>'}
        </table>

        <!-- SHIPPING DETAILS -->
        <table width="100%" cellpadding="8" cellspacing="0" style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
          <tr>
            <th colspan="2" style="background:#E3E3E3;border:1px solid #213747;text-align:left;padding:8px;font-size:15px;">
              Shipping Details
            </th>
          </tr>  
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Company Name</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.companyName || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Contact Name</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.contactName || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Contact Email</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.contact_email || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Shipping Address</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.shippingAddress || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">State</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.state || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">City</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.city || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">ZIP code</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.zip || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Delivery Date</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.deliveryDate || 'N/A'}</td></tr>
        </table>

        <!-- OPPORTUNITY DETAILS -->
        <table width="100%" cellpadding="8" cellspacing="0" style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
          <tr>
            <th colspan="2" style="background:#E3E3E3;border:1px solid #213747;text-align:left;padding:8px;font-size:15px;">
              Opportunity Details
            </th>
          </tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Device Opportunity Size(units)</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.units ?? "N/A"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Budget Per Device ($)</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.budget ?? "N/A"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Revenue Opportunity Size($ Device Rev)</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.revenue ?? "N/A"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">ingram_account #</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.ingramAccount ?? "N/A"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Quote #</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.quote ?? "N/A"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Segment</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.segment ?? "N/A"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Existing Manufacturer</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.manufacturer ?? "N/A"}</td></tr>
        </table>

        ${data.notes ? `
        <table width="100%" cellpadding="8" cellspacing="0" style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
          <tr>
            <th style="background:#E3E3E3;border:1px solid #213747;text-align:left;padding:8px;font-size:15px;">
              Order Notes
            </th>
          </tr>
          <tr>
            <td style="border:1px solid #ccc;padding:8px;color:#4b5563;">${data.notes}</td>
          </tr>
        </table>
        ` : ''}
      `
    ),
  };

  
    /* -------- ORDER_RETURN_ADMIN-------- */
case "ORDER_RETURN_ADMIN":
  return {
    subject: `Order Returned (#${data.order_number}) | Ingram Micro Surface`,
    html: orderLayout(
      `Order Returned (#${data.order_number}) | Ingram Micro Surface`,
      `
        <!-- TITLE -->
        <h3 style="margin:0;font-size:18px;font-weight:bold;color:#000;">
          Order Returned (#${data.order_number})<br>
          <span style="font-size:14px;font-weight:normal;color:#848484;">
            Returned on ${data.returnedAt ? new Date(data.returnedAt).toLocaleDateString() : "N/A"}
          </span>
        </h3>

        <div style="text-align:center; margin:24px 0;">
          <img src="https://hcxexaouqvbvaycgpmfs.supabase.co/storage/v1/object/public/order-files/order%20email/order%20return.png" width="550" style="width:100%; max-width:550px; height:auto;">
        </div>

        <!-- ADMIN INTRO -->
        <div style="padding:20px 0;color:#000;text-align:center;">
          <p style="font-size:16px;line-height:1.5;margin:10px 0;font-weight:bold;color:#000;">
            Order Return Notification
          </p>
          <p style="font-size:15px;line-height:1.5;margin:10px 0;">
            An order has been returned and received by the warehouse.<br>
            Click below to review return details.
          </p>
          <a href="${data.ordersPageUrl || 'https://ingrammicro-surface.vercel.app/orders'}" 
             style="display:inline-block;
                    margin:20px 0;
                    padding:12px 30px;
                    background-color:#0d62c2;
                    color:#ffffff;
                    text-decoration:none;
                    border-radius:5px;
                    font-weight:bold;
                    font-size:16px;">
            View Order
          </a>
        </div>

        <!-- PRODUCTS TABLE -->
        <table width="100%" cellpadding="8" cellspacing="0" style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
          <tr style="background:#E3E3E3;">
            <th width="75%" style="border:1px solid #213747;text-align:left;padding:8px;">Product</th>
            <th width="25%" style="border:1px solid #213747;text-align:left;padding:8px;">Quantity</th>
          </tr>
          ${data.orderItems?.map((item: any) => `
            <tr>
              <td style="border:1px solid #ccc;padding:8px;">
                ${item.productName || "N/A"}<br>
                <span style="font-size:12px;color:#666;">(#${item.sku || ""})</span>
              </td>
              <td style="border:1px solid #ccc;padding:8px;">${item.quantity}</td>
            </tr>
          `).join("") || '<tr><td colspan="2" style="border:1px solid #ccc;padding:8px;">No items</td></tr>'}
        </table>

        <!-- CUSTOMER INFO -->
        <table width="100%" cellpadding="8" cellspacing="0" style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
          <tr>
            <th colspan="2" style="background:#E3E3E3;border:1px solid #213747;text-align:left;padding:8px;font-size:15px;">
              Customer Information
            </th>
          </tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Company</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.companyName || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Contact</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.contactName || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Email</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.sellerEmail || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Seller</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.sellerName || 'N/A'}</td></tr>
        </table>

        <!-- SHIPPING DETAILS -->
        <table width="100%" cellpadding="8" cellspacing="0" style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
          <tr>
            <th colspan="2" style="background:#E3E3E3;border:1px solid #213747;text-align:left;padding:8px;font-size:15px;">
              Shipping Details
            </th>
          </tr>  
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Company Name</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.companyName || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Contact Name</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.contactName || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Contact Email</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.contact_email || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Shipping Address</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.shippingAddress || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">State</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.state || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">City</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.city || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">ZIP code</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.zip || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Delivery Date</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.deliveryDate || 'N/A'}</td></tr>
        </table>

        <!-- OPPORTUNITY DETAILS -->
        <table width="100%" cellpadding="8" cellspacing="0" style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
          <tr>
            <th colspan="2" style="background:#E3E3E3;border:1px solid #213747;text-align:left;padding:8px;font-size:15px;">
              Opportunity Details
            </th>
          </tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Device Opportunity Size(units)</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.units ?? "N/A"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Budget Per Device ($)</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.budget ?? "N/A"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Revenue Opportunity Size($ Device Rev)</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.revenue ?? "N/A"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">ingram_account #</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.ingramAccount ?? "N/A"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Quote #</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.quote ?? "N/A"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Segment</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.segment ?? "N/A"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Existing Manufacturer</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.manufacturer ?? "N/A"}</td></tr>
        </table>

        ${data.notes ? `
        <table width="100%" cellpadding="8" cellspacing="0" style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
          <tr>
            <th style="background:#E3E3E3;border:1px solid #213747;text-align:left;padding:8px;font-size:15px;">
              Order Notes
            </th>
          </tr>
          <tr>
            <td style="border:1px solid #ccc;padding:8px;color:#4b5563;">${data.notes}</td>
          </tr>
        </table>
        ` : ''}
      `
    ),
  };


/* -------- ORDER_REJECTED-------- */
 case "ORDER_REJECTED_USER":
  return {
    subject: `Order Rejected (#${data.order_number}) | Ingram Micro Surface`,
    html: orderLayout(
      `Order Rejected (#${data.order_number})  | Ingram Micro Surface`,
      `
        <!-- TITLE -->
        <h3 style="margin:0;font-size:18px;font-weight:bold;color:#000;">
          Order Rejected (#${data.order_number})<br>
          <span style="font-size:14px;font-weight:normal;color:#848484;">
            Rejected on ${data.rejectedAt ? new Date(data.rejectedAt).toLocaleDateString() : "N/A"}
          </span>
        </h3>

        <div style="text-align:center; margin:24px 0;">
          <img src="https://hcxexaouqvbvaycgpmfs.supabase.co/storage/v1/object/public/order-files/order%20email/order%20rejected.png" width="550" style="width:100%; max-width:550px; height:auto;">
        </div>
        
        <!-- INTRO -->
        <div style="padding:15px 0;color:#000;">
          <p style="font-size:15px;line-height:1.5;margin:10px 0;font-weight:100;">
            We regret to inform you that your order has been rejected.
          </p>
          <p style="font-size:15px;line-height:1.5;margin:10px 0;font-weight:100;">
            If you have any questions or would like to discuss this further, please contact us at <a style="color:#0d62c2;text-decoration:none" href="mailto:ahmer.ali@worls360.com">ahmer.ali@worls360.com</a>
          </p>
        </div>

        <!-- PRODUCTS TABLE -->
        <table width="100%" cellpadding="8" cellspacing="0" style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
          <tr style="background:#E3E3E3;">
            <th width="75%" style="border:1px solid #213747;text-align:left;padding:8px;">Product</th>
            <th width="25%" style="border:1px solid #213747;text-align:left;padding:8px;">Quantity</th>
          </tr>
          ${data.orderItems?.map((item: any) => `
  <tr>
    <td style="border:1px solid #ccc;padding:8px;">
      ${item.productName || "N/A"}<br>
      <span style="font-size:12px;color:#666;">${item.sku || ""}</span>
    </td>
    <td style="border:1px solid #ccc;padding:8px;">${item.quantity}</td>
  </tr>
`).join("") || '<tr><td colspan="2" style="border:1px solid #ccc;padding:8px;">No items</td></tr>'}
        </table>

        <!-- SHIPPING DETAILS -->
        <table width="100%" cellpadding="8" cellspacing="0" style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
          <tr>
            <th colspan="2" style="background:#E3E3E3;border:1px solid #213747;text-align:left;padding:8px;font-size:15px;">
              Shipping Details
            </th>
          </tr>  
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Company Name</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.companyName || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Contact Name</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.contactName || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Contact Email</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.contact_email || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Shipping Address</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.shippingAddress || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">State</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.state || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">City</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.city || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">ZIP code</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.zip || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Delivery Date</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.deliveryDate || 'N/A'}</td></tr>
        </table>

        <!-- OPPORTUNITY DETAILS -->
        <table width="100%" cellpadding="8" cellspacing="0" style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
          <tr>
            <th colspan="2" style="background:#E3E3E3;border:1px solid #213747;text-align:left;padding:8px;font-size:15px;">
              Opportunity Details
            </th>
          </tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Device Opportunity Size(units)</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.units ?? "N/A"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Budget Per Device ($)</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.budget ?? "N/A"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Revenue Opportunity Size($ Device Rev)</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.revenue ?? "N/A"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">ingram_account #</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.ingramAccount ?? "N/A"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Quote #</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.quote ?? "N/A"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Segment</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.segment ?? "N/A"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Existing Manufacturer</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.manufacturer ?? "N/A"}</td></tr>
        </table>

        ${data.notes ? `
        <table width="100%" cellpadding="8" cellspacing="0" style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
          <tr>
            <th style="background:#E3E3E3;border:1px solid #213747;text-align:left;padding:8px;font-size:15px;">
              Order Notes
            </th>
          </tr>
          <tr>
            <td style="border:1px solid #ccc;padding:8px;color:#4b5563;">${data.notes}</td>
          </tr>
        </table>
        ` : ''}
      `
    ),
  };

/* -------- ORDER_REJECTED_ADMIN-------- */
  case "ORDER_REJECTED_ADMIN":
  return {
    subject: `Order Rejected (#${data.order_number})  | Ingram Micro Surface`,
    html: orderLayout(
      `Order Rejected (#${data.order_number})  | Ingram Micro Surface`,
      `
        <!-- TITLE -->
        <h3 style="margin:0;font-size:18px;font-weight:bold;color:#000;">
          Order Rejected (#${data.order_number})<br>
          <span style="font-size:14px;font-weight:normal;color:#848484;">
            Rejected on ${data.rejectedAt ? new Date(data.rejectedAt).toLocaleDateString() : "N/A"}
          </span>
        </h3>

        <div style="text-align:center; margin:24px 0;">
          <img src="https://hcxexaouqvbvaycgpmfs.supabase.co/storage/v1/object/public/order-files/order%20email/order%20rejected.png" width="550" style="width:100%; max-width:550px; height:auto;">
        </div>

        <!-- ADMIN INTRO -->
        <div style="padding:20px 0;color:#000;text-align:center;">
          <p style="font-size:16px;line-height:1.5;margin:10px 0;font-weight:bold;color:#000;">
            Order Rejection Notification
          </p>
          <p style="font-size:15px;line-height:1.5;margin:10px 0;">
            An order has been rejected.<br>
            Click below to view order details.
          </p>
          <a href="${data.ordersPageUrl || 'https://ingrammicro-surface.vercel.app/orders'}" 
             style="display:inline-block;
                    margin:20px 0;
                    padding:12px 30px;
                    background-color:#0d62c2;
                    color:#ffffff;
                    text-decoration:none;
                    border-radius:5px;
                    font-weight:bold;
                    font-size:16px;">
            View Order
          </a>
        </div>

        <!-- PRODUCTS TABLE -->
        <table width="100%" cellpadding="8" cellspacing="0" style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
          <tr style="background:#E3E3E3;">
            <th width="75%" style="border:1px solid #213747;text-align:left;padding:8px;">Product</th>
            <th width="25%" style="border:1px solid #213747;text-align:left;padding:8px;">Quantity</th>
          </tr>
          ${data.orderItems?.map((item: any) => `
  <tr>
    <td style="border:1px solid #ccc;padding:8px;">
      ${item.productName || "N/A"}<br>
      <span style="font-size:12px;color:#666;">${item.sku || ""}</span>
    </td>
    <td style="border:1px solid #ccc;padding:8px;">${item.quantity}</td>
  </tr>
`).join("") || '<tr><td colspan="2" style="border:1px solid #ccc;padding:8px;">No items</td></tr>'}
        </table>

        <!-- CUSTOMER INFO -->
        <table width="100%" cellpadding="8" cellspacing="0" style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
          <tr>
            <th colspan="2" style="background:#E3E3E3;border:1px solid #213747;text-align:left;padding:8px;font-size:15px;">
              Customer Information
            </th>
          </tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Company</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.companyName || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Contact</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.contactName || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Email</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.sellerEmail || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Seller</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.sellerName || 'N/A'}</td></tr>
        </table>

        <!-- SHIPPING DETAILS -->
        <table width="100%" cellpadding="8" cellspacing="0" style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
          <tr>
            <th colspan="2" style="background:#E3E3E3;border:1px solid #213747;text-align:left;padding:8px;font-size:15px;">
              Shipping Details
            </th>
          </tr>  
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Company Name</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.companyName || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Contact Name</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.contactName || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Contact Email</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.contact_email || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Shipping Address</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.shippingAddress || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">State</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.state || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">City</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.city || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">ZIP code</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.zip || 'N/A'}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Delivery Date</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.deliveryDate || 'N/A'}</td></tr>
        </table>

        <!-- OPPORTUNITY DETAILS -->
        <table width="100%" cellpadding="8" cellspacing="0" style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
          <tr>
            <th colspan="2" style="background:#E3E3E3;border:1px solid #213747;text-align:left;padding:8px;font-size:15px;">
              Opportunity Details
            </th>
          </tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Device Opportunity Size(units)</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.units ?? "N/A"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Budget Per Device ($)</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.budget ?? "N/A"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Revenue Opportunity Size($ Device Rev)</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.revenue ?? "N/A"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">ingram_account #</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.ingramAccount ?? "N/A"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Quote #</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.quote ?? "N/A"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Segment</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.segment ?? "N/A"}</td></tr>
          <tr><td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">Existing Manufacturer</td><td width="60%" style="border:1px solid #ccc;padding:8px;">${data.manufacturer ?? "N/A"}</td></tr>
        </table>

        ${data.notes ? `
        <table width="100%" cellpadding="8" cellspacing="0" style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
          <tr>
            <th style="background:#E3E3E3;border:1px solid #213747;text-align:left;padding:8px;font-size:15px;">
              Order Notes
            </th>
          </tr>
          <tr>
            <td style="border:1px solid #ccc;padding:8px;color:#4b5563;">${data.notes}</td>
          </tr>
        </table>
        ` : ''}
      `
    ),
  };

/* -------- Win report user-------- */
case "REPORT_A_WIN_USER":
  return {
    subject: `Report a Win #${data.orderNumber ?? "N/A"} | Ingram Micro Surface`,
    html: orderLayout(
      `Win Report Submitted #${data.orderNumber ?? "N/A"} | Ingram Micro Surface`,
      `
        <h3 style="margin:0;font-size:18px;font-weight:bold;color:#000;">
          Win Report Submitted
          <br>
          <span style="font-size:14px;font-weight:normal;color:#848484;">
            ${new Date().toLocaleDateString()}
          </span>
        </h3>

        <!-- HERO IMAGE (KEEPING SAME) -->
        <div style="text-align:center; margin:24px 0;">
          <img src="https://hcxexaouqvbvaycgpmfs.supabase.co/storage/v1/object/public/order-files/order%20email/report%20a%20win.png"
               width="550"
               style="width:100%; max-width:550px; height:auto;">
        </div>

        <!-- HEADER INFO -->
        <p><strong>Submitted by:</strong> ${data.submittedBy ?? "N/A"}</p>
        <p><strong>Win Reported Order#</strong> (${data.orderNumber ?? "N/A"})</p>

        <!-- PRODUCT TABLE -->
        <table width="100%" cellpadding="8" cellspacing="0"
          style="border-collapse:collapse;margin:15px 0;">
          <tr style="background:#3C8DBC;color:#fff;font-weight:bold;">
            <td style="border:1px solid #ccc;">Product</td>
            <td style="border:1px solid #ccc;" width="120">Quantity</td>
          </tr>
          <tr>
            <td style="border:1px solid #ccc;">${data.product ?? "N/A"}</td>
            <td style="border:1px solid #ccc;">${data.units ?? "N/A"}</td>
          </tr>
        </table>

        <!-- DETAILS TABLE -->
        <table width="100%" cellpadding="8" cellspacing="0"
          style="border-collapse:collapse;margin:15px 0;">

          <tr>
            <td style="font-weight:bold;border:1px solid #ccc;">Ingram #</td>
            <td style="border:1px solid #ccc;">${data.resellerAccount ?? "N/A"}</td>
          </tr>

          <tr>
            <td style="font-weight:bold;border:1px solid #ccc;">Customer Name</td>
            <td style="border:1px solid #ccc;">${data.customerName ?? "N/A"}</td>
          </tr>

          <tr>
            <td style="font-weight:bold;border:1px solid #ccc;">Number of Units</td>
            <td style="border:1px solid #ccc;">${data.units ?? "N/A"}</td>
          </tr>

          <tr>
            <td style="font-weight:bold;border:1px solid #ccc;">Is this a one-time purchase or roll-out?</td>
            <td style="border:1px solid #ccc;">${data.purchaseType ?? "N/A"}</td>
          </tr>

          <tr>
            <td style="font-weight:bold;border:1px solid #ccc;">Total Deal Revenue ($)</td>
            <td style="border:1px solid #ccc;">${data.revenue ?? "N/A"}</td>
          </tr>

          <tr>
            <td style="font-weight:bold;border:1px solid #ccc;">Date of Purchase</td>
            <td style="border:1px solid #ccc;">${data.purchaseDate ?? "N/A"}</td>
          </tr>

          <tr>
            <td style="font-weight:bold;border:1px solid #ccc;">How did Ingram Surface help you close this deal?</td>
            <td style="border:1px solid #ccc;">${data.notes ?? "N/A"}</td>
          </tr>

        </table>
      `
    ),
  };

/* -------- Win report admin-------- */

case "REPORT_A_WIN_ADMIN":
  return {
    subject: `New Win Report Submitted #${data.orderNumber ?? "N/A"} | Ingram Micro Surface`,
    html: orderLayout(
      `New Win Report Submitted #${data.orderNumber ?? "N/A"} | Ingram Micro Surface`,
      `
        <h3 style="margin:0;font-size:18px;font-weight:bold;color:#000;">
          Win Report Notification
          <br>
          <span style="font-size:14px;font-weight:normal;color:#848484;">
            ${new Date().toLocaleDateString()}
          </span>
        </h3>

        <!-- HERO IMAGE -->
        <div style="text-align:center; margin:24px 0;">
          <img src="https://hcxexaouqvbvaycgpmfs.supabase.co/storage/v1/object/public/order-files/order%20email/report%20a%20win.png"
               width="550"
               style="width:100%; max-width:550px; height:auto;">
        </div>

        <p><strong>Submitted by:</strong> ${data.submittedBy ?? "N/A"}</p>
        <p><strong>Win Reported Order#</strong> (${data.orderNumber ?? "N/A"})</p>

        <!-- PRODUCT TABLE -->
        <table width="100%" cellpadding="8" cellspacing="0"
          style="border-collapse:collapse;margin:15px 0;">
          <tr style="background:#3C8DBC;color:#fff;font-weight:bold;">
            <td style="border:1px solid #ccc;">Product</td>
            <td style="border:1px solid #ccc;" width="120">Quantity</td>
          </tr>
          <tr>
            <td style="border:1px solid #ccc;">${data.product ?? "N/A"}</td>
            <td style="border:1px solid #ccc;">${data.units ?? "N/A"}</td>
          </tr>
        </table>

        <!-- DETAILS TABLE -->
        <table width="100%" cellpadding="8" cellspacing="0"
          style="border-collapse:collapse;margin:15px 0;">

          <tr>
            <td style="font-weight:bold;border:1px solid #ccc;">Ingram #</td>
            <td style="border:1px solid #ccc;">${data.resellerAccount ?? "N/A"}</td>
          </tr>

          <tr>
            <td style="font-weight:bold;border:1px solid #ccc;">Customer Name</td>
            <td style="border:1px solid #ccc;">${data.customerName ?? "N/A"}</td>
          </tr>

          <tr>
            <td style="font-weight:bold;border:1px solid #ccc;">Number of Units</td>
            <td style="border:1px solid #ccc;">${data.units ?? "N/A"}</td>
          </tr>

          <tr>
            <td style="font-weight:bold;border:1px solid #ccc;">Purchase Type</td>
            <td style="border:1px solid #ccc;">${data.purchaseType ?? "N/A"}</td>
          </tr>

          <tr>
            <td style="font-weight:bold;border:1px solid #ccc;">Revenue ($)</td>
            <td style="border:1px solid #ccc;">${data.revenue ?? "N/A"}</td>
          </tr>

          <tr>
            <td style="font-weight:bold;border:1px solid #ccc;">Purchase Date</td>
            <td style="border:1px solid #ccc;">${data.purchaseDate ?? "N/A"}</td>
          </tr>

          ${
            data.isOther
              ? `
          <tr>
            <td style="font-weight:bold;border:1px solid #ccc;">Custom SKU</td>
            <td style="border:1px solid #ccc;">${data.otherDesc ?? "N/A"}</td>
          </tr>
          `
              : ""
          }

          <tr>
            <td style="font-weight:bold;border:1px solid #ccc;">Deal Notes</td>
            <td style="border:1px solid #ccc;">${data.notes ?? "N/A"}</td>
          </tr>

        </table>
      `
    ),
  };


/* -------- eol-device-------- */
case "EOL_DEVICE_SUBMITTED":
  return {
    subject: "EOL Device Request Submitted | Ingrammicro Surface",
    html: baseLayout(
      "EOL Device Request Submitted",
      `
        <p><strong>Submitted By:</strong> ${data.submitted_by}</p>

        ${
          data.notes
            ? `<p><strong>Notes:</strong> ${data.notes}</p>`
            : ""
        }

        <table width="100%" cellpadding="8" cellspacing="0" 
          style="border:1px solid #ccc;border-collapse:collapse;margin-top:20px;">
          
          <tr style="background:#E3E3E3;">
            <th style="border:1px solid #ccc;text-align:left;">Product</th>
            <th style="border:1px solid #ccc;text-align:left;">SKU</th>
            <th style="border:1px solid #ccc;text-align:left;">Qty</th>
            <th style="border:1px solid #ccc;text-align:left;">Address</th>
          </tr>

          ${
            data.products?.length
              ? data.products.map((item: any) => `
                  <tr>
                    <td style="border:1px solid #ccc;">${item.product_name}</td>
                    <td style="border:1px solid #ccc;">${item.sku}</td>
                    <td style="border:1px solid #ccc;">${item.quantity}</td>
                    <td style="border:1px solid #ccc;">${item.address}</td>
                  </tr>
                `).join("")
              : `<tr>
                   <td colspan="4" style="border:1px solid #ccc;">
                     No products
                   </td>
                 </tr>`
          }
        </table>
      `
    ),
  };

/* -------- dispatch-device-------- */
case "DISPATCH_DEVICE_SUBMITTED":
  return {
    subject: "Dispatch Submitted | Ingrammicro Surface",
    html: baseLayout(
      "Device Dispatch Submitted",
      `
        <p><strong>Submitted By:</strong> ${data.submitted_by}</p>
        <p><strong>Tracking Number:</strong> ${data.tracking_number}</p>
        <p><strong>Date of Shipment:</strong> ${data.shipment_date}</p>

        <table width="100%" cellpadding="8" cellspacing="0" 
          style="border:1px solid #ccc;border-collapse:collapse;margin-top:20px;">
          
          <tr style="background:#E3E3E3;">
            <th style="border:1px solid #ccc;text-align:left;">Product</th>
            <th style="border:1px solid #ccc;text-align:left;">SKU</th>
            <th style="border:1px solid #ccc;text-align:left;">Qty</th>
            <th style="border:1px solid #ccc;text-align:left;">Inventory Owner</th>
          </tr>

          ${
            data.products?.length
              ? data.products.map((item: any) => `
                  <tr>
                    <td style="border:1px solid #ccc;">${item.product_name}</td>
                    <td style="border:1px solid #ccc;">${item.sku}</td>
                    <td style="border:1px solid #ccc;">${item.quantity}</td>
                    <td style="border:1px solid #ccc;">${item.inventory_owner}</td>
                  </tr>
                `).join("")
              : `<tr>
                   <td colspan="4" style="border:1px solid #ccc;">
                     No products
                   </td>
                 </tr>`
          }
        </table>
      `
    ),
  };

  /* -------- WAITLIST_USER -------- */
case "WAITLIST_USER":
  return {
    subject: `You have subscribed to ${data.productName} | Ingrammicro Surface`,
    html: baseLayout(
      "Product Waitlist Subscription | Ingrammicro Surface",
      `
      <p>Dear ${data.email},</p>

      <p>
        You have subscribed to <strong>${data.productName}</strong> on 
        <strong>Ingrammicro Surface</strong>. An email notification will be 
        sent once the product is back in stock.
      </p>

      <p style="margin-top:20px;">
        Thank you for using <strong>Ingrammicro Surface</strong>.
      </p>
      `
    ),
  };


  /* -------- WAITLIST_ADMIN -------- */
case "WAITLIST_ADMIN":
  return {
    subject: `New Waitlist Subscription | Ingrammicro Surface`,
    html: baseLayout(
      "New Waitlist Subscription | Ingrammicro Surface",
      `
      <p>Dear PM,</p>

      <p>
        A new user has subscribed to a product on 
        <strong>Ingrammicro Surface</strong>.
      </p>

      <table style="margin-top:15px;font-size:14px;border:1px solid #ccc;border-collapse:collapse;width:100%;">
        <tr>
          <td style="padding:8px;font-weight:bold;border:1px solid #ccc;background:#E3E3E3;">Product Name</td>
          <td style="padding:8px;border:1px solid #ccc;">${data.productName}</td>
        </tr>
        <tr>
          <td style="padding:8px;font-weight:bold;border:1px solid #ccc;background:#E3E3E3;">User Email</td>
          <td style="padding:8px;border:1px solid #ccc;">${data.email}</td>
        </tr>
        <tr>
          <td style="padding:8px;font-weight:bold;border:1px solid #ccc;background:#E3E3E3;">Company Name</td>
          <td style="padding:8px;border:1px solid #ccc;">${data.companyName || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding:8px;font-weight:bold;border:1px solid #ccc;background:#E3E3E3;">Date</td>
          <td style="padding:8px;border:1px solid #ccc;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
        </tr>
      </table>

      <p style="margin-top:20px;">
        Regards,<br/>
        <strong>Ingrammicro Surface Team</strong>
      </p>
      `
    ),
  };


  /* -------- PRODUCT_BACK_IN_STOCK -------- */
case "PRODUCT_BACK_IN_STOCK":
  return {
    subject: `Your Subscribed Product is Back in Stock | Ingrammicro Surface`,
    html: baseLayout(
      "Product Back in Stock | Ingrammicro Surface",
      `
      <p>Hello ${data.email},</p>

      <p>
        Your Subscribed Product <strong>${data.productName}</strong> is now back in stock!
      </p>

      <p style="margin:25px 0;text-align:center;">
        
          href="${data.productUrl}"
          style="
            background:#3ba1da;
            color:#ffffff;
            padding:12px 30px;
            text-decoration:none;
            border-radius:4px;
            font-size:14px;
            display:inline-block;
            font-weight:bold;
          "
        >
          Order Now
        </a>
      </p>

      <p>
        Thank you for using <strong>Ingrammicro Surface</strong>.
      </p>
      `
    ),
  };
  /* -------- reminder email-------- */
  case "DEMO_REMINDER_25":
  return {
    subject: `Demo Return Reminder (#${data.order_number}) | Ingram Micro Surface`,
    html: orderLayout(
      `Demo Return Reminder (#${data.order_number})`,
      `
        <!-- TITLE -->
        <h3 style="margin:0;font-size:18px;font-weight:bold;color:#000;">
          Demo Return Reminder (#${data.order_number})<br>
          <span style="font-size:14px;font-weight:normal;color:#848484;">
            Demo expires on ${data.demo_expiry_date || "N/A"}
          </span>
        </h3>

        <!-- INTRO -->
        <div style="padding:15px 0;color:#000;">
          <p style="font-size:15px;line-height:1.5;margin:10px 0;">
           Thank you for using Ingrammicro Surface! We hope your experience was very positive.<br>
            Your order for <strong>${data.companyName || "N/A"}</strong> is now due for return.  
          </p>
          <p>You can use the provided return label to ship back the products or click on the button to view order details and download label again.</p>
        

         ${data.return_label ? `
    <div style="text-align:center; margin:15px 0;">
      <a href="${data.return_label}" target="_blank" style="display:inline-block; margin:10px; padding:8px 16px; text-decoration:none;">
        Download Return Label
      </a>
    </div>
  ` : `
    <p style="color:#c0392b;font-weight:bold;">No Return Label uploaded</p>
  `}
</div>
        

        <!-- PRODUCTS TABLE -->
        <table width="100%" cellpadding="8" cellspacing="0" 
          style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
          <tr style="background:#E3E3E3;">
            <th width="75%" style="border:1px solid #ccc;text-align:left;padding:8px;">
              Product
            </th>
            <th width="25%" style="border:1px solid #ccc;text-align:left;padding:8px;">
              Quantity
            </th>
          </tr>
          ${data.orderItems?.map((item: any) => `
            <tr>
              <td style="border:1px solid #ccc;padding:8px;">
                ${item.productName || "N/A"}
              </td>
              <td style="border:1px solid #ccc;padding:8px;">
                ${item.quantity}
              </td>
            </tr>
          `).join("") || `
            <tr>
              <td colspan="2" style="border:1px solid #ccc;padding:8px;">
                No items
              </td>
            </tr>
          `}
        </table>

        <!-- ORDER DETAILS TABLE -->
        <table width="100%" cellpadding="8" cellspacing="0"
          style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
          
          <tr>
            <th colspan="2" style="background:#E3E3E3;border:1px solid #ccc;
              text-align:left;padding:8px;font-size:15px;">
              Order Details
            </th>
          </tr>

          <tr>
            <td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">
              Sales Executive Name
            </td>
            <td width="60%" style="border:1px solid #ccc;padding:8px;">
              ${data.sellerName || "N/A"}
            </td>
          </tr>

          <tr>
            <td style="font-weight:bold;border:1px solid #ccc;padding:8px;">
              Sales Executive Email
            </td>
            <td style="border:1px solid #ccc;padding:8px;">
              ${data.sellerEmail || "N/A"}
            </td>
          </tr>

          <tr>
            <td style="font-weight:bold;border:1px solid #ccc;padding:8px;">
              Customer Company Name
            </td>
            <td style="border:1px solid #ccc;padding:8px;">
              ${data.companyName || "N/A"}
            </td>
          </tr>

          <tr>
            <td style="font-weight:bold;border:1px solid #ccc;padding:8px;">
              Contact Name
            </td>
            <td style="border:1px solid #ccc;padding:8px;">
              ${data.contactName || "N/A"}
            </td>
          </tr>

          <tr>
            <td style="font-weight:bold;border:1px solid #ccc;padding:8px;">
              Contact Email
            </td>
            <td style="border:1px solid #ccc;padding:8px;">
              ${data.contact_email || "N/A"}
            </td>
          </tr>
          <tr>
  <td style="font-weight:bold;border:1px solid #ccc;padding:8px;">
    Shipped At
  </td>
  <td style="border:1px solid #ccc;padding:8px;">
    ${data.shippedAt || "N/A"}
  </td>
</tr>

        </table>

        <p>
          If the return has already been initiated, please ignore this message.
        </p>
      `
    ),
  };
/* -------- over due email-------- */
  case "DEMO_OVERDUE":
  return {
    subject: `Overdue Demo Return – ${data.days_overdue} Days Past Due (#${data.order_number}) | Ingram Micro Surface`,
    html: orderLayout(
      `Overdue Demo Return (#${data.order_number})`,
      `
        <!-- TITLE -->
        <h3 style="margin:0;font-size:18px;font-weight:bold;color:#000;">
          Overdue Demo Return (#${data.order_number})<br>
          <span style="font-size:14px;font-weight:normal;color:#c0392b;">
            ${data.days_overdue || 0} Days Overdue
          </span>
        </h3>

        <!-- INTRO -->
<div style="padding:15px 0;color:#000;">
  <p style="font-size:15px;line-height:1.5;margin:10px 0;">
    This is a message from Ingram Surface Demo to remind you that Order 
    <strong>#${data.order_number}</strong> (<strong>${data.companyName || "N/A"}</strong>) 
    is due for return and has been shipped for 
    <strong>${data.days_overdue || 0} days</strong> out of its 30-day trial period.
  </p>
  <p style="font-size:15px;line-height:1.5;margin:10px 0;">
    Please remind your customer to use the provided return label and ship back this order with all devices & accessories.
  </p>
  ${data.return_label ? `
    <div style="text-align:center; margin:15px 0;">
      <a href="${data.return_label}" target="_blank" style="display:inline-block; margin:10px; padding:8px 16px; text-decoration:none;">
        Download Return Label
      </a>
    </div>
  ` : `
    <p style="color:#c0392b;font-weight:bold;">No Return Label uploaded</p>
  `}
</div>

        <!-- PRODUCTS TABLE -->
        <table width="100%" cellpadding="8" cellspacing="0" 
          style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
          <tr style="background:#E3E3E3;">
            <th width="75%" style="border:1px solid #ccc;text-align:left;padding:8px;">
              Product
            </th>
            <th width="25%" style="border:1px solid #ccc;text-align:left;padding:8px;">
              Quantity
            </th>
          </tr>
          ${data.orderItems?.map((item: any) => `
            <tr>
              <td style="border:1px solid #ccc;padding:8px;">
                ${item.productName || "N/A"}
              </td>
              <td style="border:1px solid #ccc;padding:8px;">
                ${item.quantity}
              </td>
            </tr>
          `).join("") || `
            <tr>
              <td colspan="2" style="border:1px solid #ccc;padding:8px;">
                No items
              </td>
            </tr>
          `}
        </table>

        <!-- ORDER DETAILS TABLE -->
        <table width="100%" cellpadding="8" cellspacing="0"
          style="border:1px solid #ccc;border-collapse:collapse;margin:15px 0;">
          
          <tr>
            <th colspan="2" style="background:#E3E3E3;border:1px solid #ccc;
              text-align:left;padding:8px;font-size:15px;">
              Order Details
            </th>
          </tr>

          <tr>
            <td width="40%" style="font-weight:bold;border:1px solid #ccc;padding:8px;">
              Sales Executive Name
            </td>
            <td width="60%" style="border:1px solid #ccc;padding:8px;">
              ${data.sellerName || "N/A"}
            </td>
          </tr>

          <tr>
            <td style="font-weight:bold;border:1px solid #ccc;padding:8px;">
              Sales Executive Email
            </td>
            <td style="border:1px solid #ccc;padding:8px;">
              ${data.sellerEmail || "N/A"}
            </td>
          </tr>

          <tr>
            <td style="font-weight:bold;border:1px solid #ccc;padding:8px;">
              Customer Company Name
            </td>
            <td style="border:1px solid #ccc;padding:8px;">
              ${data.companyName || "N/A"}
            </td>
          </tr>

          <tr>
            <td style="font-weight:bold;border:1px solid #ccc;padding:8px;">
              Contact Name
            </td>
            <td style="border:1px solid #ccc;padding:8px;">
              ${data.contactName || "N/A"}
            </td>
          </tr>

          <tr>
            <td style="font-weight:bold;border:1px solid #ccc;padding:8px;">
              Contact Email
            </td>
            <td style="border:1px solid #ccc;padding:8px;">
              ${data.contact_email || "N/A"}
            </td>
          </tr>
          <tr>
  <td style="font-weight:bold;border:1px solid #ccc;padding:8px;">
    Shipped At
  </td>
  <td style="border:1px solid #ccc;padding:8px;">
    ${data.shippedAt || "N/A"}
  </td>
</tr>

        </table>

        <p>
          If the return has already been initiated, please share the tracking details to avoid further reminders.
        </p>
      `
    ),
  };

    /* -------- SAFETY -------- */
    default:
      throw new Error("Invalid email template type");
  }
}

