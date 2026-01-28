import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_lc9296s";
const TEMPLATE_CONFIRM = "template_uu5frvo";
const PUBLIC_KEY = "iftr-ehC59U4zE4yg";

export const sendBookingConfirmation = async (bookingData) => {
  try {
    if (!bookingData.email) return;

    const formattedDate = bookingData.date
      ? new Date(bookingData.date).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        })
      : "N/A";

    const params = {
      to_email: bookingData.email,
      to_name: bookingData.name,
      passenger_name: bookingData.name,
      bus_route: bookingData.busRoute,
      bus_no: bookingData.busNo,
      travel_date: formattedDate,
      departure_time: bookingData.time,
      seat_numbers: bookingData.seats.join(", "),
      total_amount: `Rs ${bookingData.totalAmount}`,
      booking_id: bookingData.bookingId,
      status: bookingData.status
    };

    console.log("📧 Email params:", params);

    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_CONFIRM,
      params,
      PUBLIC_KEY
    );

    console.log("✅ Email sent successfully");
  } catch (error) {
    console.error("❌ EmailJS Error:", error);
  }
};
