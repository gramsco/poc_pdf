require("dotenv").config();
const Koa = require("koa");
const app = new Koa();

const Printer = require("pdfmake");

const port = process.env.PORT;
const id = process.env.ID;

const makePages = (...arr) => {
  return arr.map(({ baseURL, text }) => {
    return [
      {
        text,
        margin: [0, 10, 10, 10],
        color: "#42C6AE",
      },
      {
        image: "image.jpg",
        width: 50,
        height: 50,
        alignment: "left",
      },
      {
        qr: baseURL + "/" + id,
        alignment: "center",
        margin: sameMargins(5),
        fit: "100",
      },
    ];
  });
};

const padd = 10;

const baseURL = process.env.API_PATH;

const text = process.env.TEXT;

const sameMargins = (n) => new Array(n).fill(padd);

const docDefinition = {
  defaultStyle: {
    fontStyle: "12",
    font: "Montserrat",
  },
  pageSize: "A6",
  pageOrientation: "landscape",
  header: [
    {
      text: "Le Qoqo",
      alignment: "right",
      color: "#42C6AE",
      margin: sameMargins(4),
    },
  ],
  content: makePages({ baseURL, text }),
};

var fontDescriptors = {
  Montserrat: {
    normal: "Montserrat/Montserrat-Light.ttf",
  },
};

app.use(async (ctx) => {
  const printer = new Printer(fontDescriptors);
  const doc = printer.createPdfKitDocument(docDefinition);
  doc.pipe(ctx.res);
  doc.end();
  return new Promise((resolve) => ctx.res.on("finish", resolve));
});

app.listen(
  port,
  () =>
    process.env.NODE_ENV === "development" &&
    console.log(`http://localhost:${port}`)
);
