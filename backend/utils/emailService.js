const transporter = require("../config/mailer");
const env = require("../config/env");
const sendEmail = async ({ to, subject, html }) => {
    return transporter.sendMail({
        from: `"MERN Shop" <${env.mail.user}>`,
        to,
        subject,
        html
    });
};

const sendWelcomeEmail = async (user) => {
    return sendEmail({
        to: user.email,
        subject: "Welcome to MERN Shop",
        html: `
            <div style="font-family: Arial; padding: 20px;">
                <h2>Welcome ${user.name}!</h2>
                <p>Your account has been created successfully.</p>
                <p>Thank you for registering with MERN Shop.</p>
                <a href="${env.frontendUrl}/login">
                    Login to your account
                </a>
            </div>
        `
    });
};

const sendVerificationEmail = async (user, verificationToken) => {
    const verificationUrl =
        `${env.frontendUrl}/verify-account/${verificationToken}`;

    return sendEmail({
        to: user.email,
        subject: "Verify Your Account",
        html: `
            <div style="font-family: Arial; padding: 20px;">
                <h2>Verify Your Account</h2>

                <p>Hello ${user.name},</p>

                <p>Please click the button below to verify your account.</p>

                <a
                    href="${verificationUrl}"
                    style="
                        display:inline-block;
                        padding:12px 20px;
                        background:#0d6efd;
                        color:white;
                        text-decoration:none;
                        border-radius:5px;
                    "
                >
                    Verify Account
                </a>

                <p>This link is for account verification.</p>
            </div>
        `
    });
};

const sendPasswordResetEmail = async (user, resetToken) => {
    const resetUrl =
        `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    return sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        html: `
            <div style="font-family: Arial; padding: 20px;">
                <h2>Password Reset</h2>

                <p>Hello ${user.name},</p>

                <p>We received a request to reset your password.</p>

                <a
                    href="${resetUrl}"
                    style="
                        display:inline-block;
                        padding:12px 20px;
                        background:#dc3545;
                        color:white;
                        text-decoration:none;
                        border-radius:5px;
                    "
                >
                    Reset Password
                </a>

                <p>If you did not request this, you can ignore this email.</p>
            </div>
        `
    });
};

// const sendOrderConfirmationEmail = async (user, order) => {
//     const itemsHtml = order.items
//         .map(
//             item => `
//                 <tr>
//                     <td style="padding:8px;">${item.productName}</td>
//                     <td style="padding:8px;">${item.quantity}</td>
//                     <td style="padding:8px;">₹${item.price}</td>
//                 </tr>
//             `
//         )
//         .join("");

//     return sendEmail({
//         to: user.email,
//         subject: `Order Confirmation #${order.id}`,
//         html: `
//             <div style="font-family: Arial; padding:20px;">
//                 <h2>Order Confirmed 🎉</h2>

//                 <p>Hello ${user.name},</p>

//                 <p>
//                     Your order
//                     <strong>#${order.id}</strong>
//                     has been placed successfully.
//                 </p>

//                 <table
//                     border="1"
//                     cellspacing="0"
//                     cellpadding="0"
//                     style="border-collapse:collapse; width:100%;"
//                 >
//                     <thead>
//                         <tr>
//                             <th style="padding:8px;">Product</th>
//                             <th style="padding:8px;">Quantity</th>
//                             <th style="padding:8px;">Price</th>
//                         </tr>
//                     </thead>

//                     <tbody>
//                         ${itemsHtml}
//                     </tbody>
//                 </table>

//                 <h3>Total: ₹${order.total}</h3>

//                 <p>Thank you for shopping with us.</p>
//             </div>
//         `
//     });
// };
const sendOrderConfirmationEmail = async (user, order) => {
    console.log("========== ORDER EMAIL START ==========");
    console.log("User email:", user?.email);
    console.log("Order ID:", order?.id);
    const itemsHtml = order.items
        .map((item) => {
            const imageUrl = item.productImage
                ? `${process.env.BACKEND_URL}${item.productImage}`
                : "";

            return `
                <tr>
                    <td
                        style="
                            padding: 12px;
                            border-bottom: 1px solid #ddd;
                        "
                    >
                        ${
                            imageUrl
                                ? `
                                    <img
                                        src="${imageUrl}"
                                        alt="${item.productName}"
                                        width="70"
                                        height="70"
                                        style="
                                            width: 70px;
                                            height: 70px;
                                            object-fit: cover;
                                            border-radius: 8px;
                                            display: block;
                                            margin-bottom: 8px;
                                        "
                                    />
                                `
                                : ""
                        }

                        <strong>${item.productName}</strong>
                    </td>

                    <td
                        style="
                            padding: 12px;
                            text-align: center;
                            border-bottom: 1px solid #ddd;
                        "
                    >
                        ${item.quantity}
                    </td>

                    <td
                        style="
                            padding: 12px;
                            text-align: right;
                            border-bottom: 1px solid #ddd;
                        "
                    >
                        ₹${Number(item.price).toFixed(2)}
                    </td>

                    <td
                        style="
                            padding: 12px;
                            text-align: right;
                            border-bottom: 1px solid #ddd;
                        "
                    >
                        ₹${(
                            Number(item.price) * Number(item.quantity)
                        ).toFixed(2)}
                    </td>
                </tr>
            `;
        })
        .join("");

    await transporter.sendMail({
        from: `"MERN Shop" <${env.mail.user}>`,
        to: env.mail.user,
        subject: `Order Confirmation #${order.id}`,

        html: `
            <div
                style="
                    font-family: Arial, sans-serif;
                    background-color: #f5f5f5;
                    padding: 30px 15px;
                "
            >
                <div
                    style="
                        max-width: 700px;
                        margin: 0 auto;
                        background: #ffffff;
                        border-radius: 10px;
                        overflow: hidden;
                    "
                >

                    <!-- Header -->
                    <div
                        style="
                            background: #198754;
                            color: #ffffff;
                            padding: 25px;
                            text-align: center;
                        "
                    >
                        <h1 style="margin: 0;">
                            Order Confirmed!
                        </h1>

                        <p style="margin: 10px 0 0;">
                            Thank you for your order.
                        </p>
                    </div>

                    <!-- Content -->
                    <div style="padding: 30px;">

                        <h2>
                            Hello ${user.name},
                        </h2>

                        <p>
                            Your order has been successfully placed.
                        </p>

                        <!-- Order Information -->
                        <div
                            style="
                                background: #f8f9fa;
                                padding: 15px;
                                border-radius: 6px;
                                margin: 20px 0;
                            "
                        >
                            <p style="margin: 5px 0;">
                                <strong>Order ID:</strong>
                                #${order.id}
                            </p>

                            <p style="margin: 5px 0;">
                                <strong>Order Date:</strong>
                                ${new Date().toLocaleDateString("en-IN")}
                            </p>

                            <p style="margin: 5px 0;">
                                <strong>Status:</strong>
                                ${order.status || "Pending"}
                            </p>
                        </div>

                        <!-- Order Details -->
                        <h3>
                            Order Details
                        </h3>

                        <table
                            style="
                                width: 100%;
                                border-collapse: collapse;
                                margin-top: 15px;
                            "
                        >
                            <thead>
                                <tr style="background: #f8f9fa;">
                                    <th
                                        style="
                                            padding: 12px;
                                            text-align: left;
                                        "
                                    >
                                        Product
                                    </th>

                                    <th
                                        style="
                                            padding: 12px;
                                            text-align: center;
                                        "
                                    >
                                        Quantity
                                    </th>

                                    <th
                                        style="
                                            padding: 12px;
                                            text-align: right;
                                        "
                                    >
                                        Price
                                    </th>

                                    <th
                                        style="
                                            padding: 12px;
                                            text-align: right;
                                        "
                                    >
                                        Total
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                ${itemsHtml}
                            </tbody>
                        </table>

                        <!-- Total -->
                        <div
                            style="
                                text-align: right;
                                margin-top: 20px;
                                padding-top: 15px;
                                border-top: 2px solid #ddd;
                            "
                        >
                            <h2
                                style="
                                    margin: 0;
                                    color: #198754;
                                "
                            >
                                Total:
                                ₹${Number(order.total).toFixed(2)}
                            </h2>
                        </div>

                        <!-- Order Status Message -->
                        <div
                            style="
                                margin-top: 30px;
                                padding: 15px;
                                background: #e9f7ef;
                                border-radius: 6px;
                            "
                        >
                            <p style="margin: 0;">
                                We will process your order shortly.
                                You will receive updates about your
                                order status.
                            </p>
                        </div>

                        <p style="margin-top: 30px;">
                            Thank you for shopping with us.
                        </p>

                        <p>
                            Regards,<br />
                            <strong>MERN Shop Team</strong>
                        </p>
                    </div>

                    <!-- Footer -->
                    <div
                        style="
                            background: #f8f9fa;
                            text-align: center;
                            padding: 15px;
                            color: #777;
                            font-size: 13px;
                        "
                    >
                        This is an automated email.
                        Please do not reply.
                    </div>

                </div>
            </div>
        `,
    });
};
module.exports = {
    sendEmail,
    sendWelcomeEmail,
    sendVerificationEmail,
    sendPasswordResetEmail,
    sendOrderConfirmationEmail
};