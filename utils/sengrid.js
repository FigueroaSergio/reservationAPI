const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
let document = function (reservations, token) {
  let colums = "";
  reservations.forEach((ele) => {
    let colum = ` <tr>
    <td>${ele.product}</td>
    <td>${ele.date}</td>
    </tr>`;
    colums += colum;
  });
  let date = new Date();
  let html = `
  <html>
    <head>
     </style>
      <link href="https://fonts.googleapis.com/css?family=Poppins&display=swap" rel="stylesheet"><style>
        body {font-family: 'Poppins', sans-serif;
        }
        div{
            display: grid;
            place-items: center;
            }
        section.title{
            background: orangered;
            width:100%;
            height:100px;
            text-align: center;
            padding-top:15px
           
        }
        p.header{
            margin-bottom:2px;
            color:white;
            }
        p.info{
            margin-top:2px;
            font-size:14px;
            
            }
        p.date{color:GhostWhite}
        section.details{
            background: GhostWhite;
            
            
            width:100%;
            align-content:center;
            
            
            padding-bottom:12px;
            margin-bottom:20px;
            margin-top:20px;
        }
        section.details .table{
            margin:auto;
            text-align:center;
            border-collapse:collapse;
            }
         table th {
           border-style: solid;
            border-width: 2px 0px 2px 0px;
            
          }
        section.details .table tr th{
            min-width:150px;
            text-align:center;
            
        }
        section.details .table tr:last-child {
            border-style: solid;
            border-width: 0px 0px 2px 0px;
        }
        section.footer{
            width:100%;
            align-content:center;
            text-align:center;
            margin-bottom:35px;
            
        }
        section.footer p.info{
            margin-bottom:18px;
            }
        section a.button{
            text-decoration:none;
            font-size:14px;
            background:orangered;
            padding:8px;
            color:white;
            border-radius:3px;
        }
        section a.button:hover{
            background:orange;
        }
        
    </style>
      <title></title>
    </head>
    <body>
    <div>
    <section class="title">
        <p class="header">Gracias por reservar con nosotros</p>
        <p class="info date">${date}</p>
    </section>
    <section class=details>
        <table class="table">
            <tr>
                <th>Reserva</th>
                <th>Fecha</th>
            </tr>
            ${colums}
        </table>
    </section>
    <section class="footer">
        <p class="info">El siguienente correo es enviado para confirmar su reserva</p>
        <a href="http://localhost:3000/api/reservations/confirmar/${token}" class="button">Clic para confirmar</a>
    </section>
    </div>
      
    </body>
  </html>`;
  return html;
};

module.exports = function (
  reservations,
  token,
  send = false,
  mail = "darien.kris83@ethereal.email"
) {
  let html = document(reservations, token);
  msg = {
    to: mail, // Change to your recipient
    from: mail, // Change to your verified sender
    subject: "Sending with SendGrid is Fun",
    html: html,
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
