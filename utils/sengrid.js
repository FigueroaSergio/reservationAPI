const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
module.exports = function (
  reservations,
  token,
  send = false,
  mail = "darien.kris83@ethereal.email"
) {
  info = "";
  reservations.forEach((ele) => {
    info += `<p>${ele.product}   ${ele.date}</p>`;
  });
  msg = {
    to: `${mail}`, // Change to your recipient
    from: "darien.kris83@ethereal.email", // Change to your verified sender
    subject: "Confirmacion reserva",

    html: `Acontinuacion la informazion de su compra ${info}<strong>El siguienente correo es enviado para confirmar su reserva</strong> <a href="http://localhost:3000/api/reservations/confirmar/${token}" >Clic aqui para confirmar</a>`,
  };
  if (send) {
    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });
  }
  console.log(msg);
};
