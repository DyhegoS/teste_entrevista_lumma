require("dotenv").config();
const ExcelJS = require("exceljs");
const { getWithRetry, sleep } = require("./utils/httpClient");

const API_KEY = process.env.NYT_API_KEY;
const BASE_URL = "https://api.nytimes.com/svc/search/v2/articlesearch.json";

async function colectNews(topic) {
  let page = 0;
  const news = [];

  await sleep(1200);

  while (news.length < 50) {
    const response = await getWithRetry(BASE_URL, {
      params: {
        q: topic,
        sort: "newest",
        "api-key": API_KEY,
        page: page
      }
    });

    const docs = response?.data?.response?.docs;

    if (!Array.isArray(docs) || docs.length === 0) {
      break;
    }

    console.log("Docs retornados:", docs.length);
    for (const doc of docs) {
      const title = doc.headline?.main?.toLowerCase() || "";
      const type = doc.type_of_material || "";
      const newsDesk = doc.news_desk || "";

      if (title.includes("wordle")) continue;
      //if (type === "Review") continue;
      if (newsDesk === "Games") continue;
      news.push({
        title: doc.headline.main,
        publishDate: doc.pub_date,
        description: doc.abstract || doc.lead_paragraph || "Sem descrição"
      });

      if (news.length >= 50) break;
    }

    await sleep(1800);
    page++;
  }

  return news;
}

async function exportToExcel(news, topic) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Notícias");

  sheet.columns = [
    { header: "Título", key: "title", width: 50 },
    { header: "Data de Publicação", key: "publishDate", width: 25 },
    { header: "Descrição", key: "description", width: 80 }
  ];

  news.forEach(news => {
    sheet.addRow(news);
  });

  await workbook.xlsx.writeFile(`noticias-${topic}.xlsx`);
}

(async () => {
  const topic = process.argv[2];

  if (!topic) {
    console.log("Uso: node index.js <topic>");
    process.exit(1);
  }

  console.log(`Coletando notícias sobre: ${topic}...`);

  const news = await colectNews(topic);
  await exportToExcel(news, topic);

  console.log(`✔ ${news.length} notícias exportadas!`);
})();
