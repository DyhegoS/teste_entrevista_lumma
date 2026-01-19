require("dotenv").config();
const axios = require("axios");
const ExcelJS = require("exceljs");

const API_KEY = process.env.NYT_API_KEY;
const BASE_URL = "https://api.nytimes.com/svc/search/v2/articlesearch.json";

async function colectNews(topic) {
  let page = 0;
  const news = [];

  while (news.length < 50) {
    const response = await axios.get(BASE_URL, {
      params: {
        q: topic,
        "api-key": API_KEY,
        page: page
      }
    });

    const docs = response.data.response.docs;

    if (!docs.length) break;

    for (const doc of docs) {
      news.push({
        titulo: doc.headline.main,
        dataPublicacao: doc.pub_date,
        descricao: doc.abstract || doc.lead_paragraph || "Sem descrição"
      });

      if (news.length >= 50) break;
    }

    page++;
  }

  return news;
}

async function exportToExcel(news) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Notícias");

  sheet.columns = [
    { header: "Título", key: "titulo", width: 50 },
    { header: "Data de Publicação", key: "dataPublicacao", width: 25 },
    { header: "Descrição", key: "descricao", width: 80 }
  ];

  news.forEach(news => {
    sheet.addRow(news);
  });

  await workbook.xlsx.writeFile("noticias.xlsx");
}

(async () => {
  const topic = process.argv[2];

  if (!topic) {
    console.log("Uso: node index.js <topic>");
    process.exit(1);
  }

  console.log(`Coletando notícias sobre: ${topic}...`);

  const news = await colectNews(topic);
  await exportToExcel(news);

  console.log(`✔ ${news.length} notícias exportadas para noticias.xlsx`);
})();
