require("dotenv").config();
const ExcelJS = require("exceljs");
const { getWithRetry, sleep } = require("./utils/httpClient");
const { formatDate } = require("./utils/formatDate");
const { askTopic } = require("./utils/askTopic")
const path = require("path");
const fs = require("fs/promises");

const API_KEY = process.env.NYT_API_KEY;
const BASE_URL = "https://api.nytimes.com/svc/search/v2/articlesearch.json";

async function colectNews(topic) {
  let page = 0;
  const news = [];

  await sleep(1200);
  const MAX_PAGES = 5;
  while (news.length < 50 && page < MAX_PAGES) {

    console.log(`Buscando página ${page + 1}...`);

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

    for (const doc of docs) {
      const title = doc.headline?.main?.toLowerCase() || "";
      const type = doc.type_of_material || "";
      const newsDesk = doc.news_desk || "";

      if (title.includes("wordle")) continue;
      if (newsDesk === "Games") continue;

      news.push({
        title: doc.headline.main,
        publishDate: formatDate(doc.pub_date),
        description: doc.abstract || doc.lead_paragraph || "Sem descrição"
      });

      if (news.length >= 50) break;
    }

    await sleep(600);
    page++;
  }

  if (news.length < 50) {
    console.log(
      `Não foi possível encontrar 50 notícias para o tema "${topic}". Encontrado apenas ${news.length}.`
    );
  } else {
    console.log(`50 notícias encontradas para o tema "${topic}".`);
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

  sheet.addRows(news);

  const outDir = path.join(__dirname, "..", "Noticias");
  await fs.mkdir(outDir, { recursive: true });

  const safeTopic = topic
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  const fileName = `noticias-${safeTopic}.xlsx`;
  const filePath = path.join(outDir, fileName);

  await workbook.xlsx.writeFile(filePath);

  console.log(`Excel salvo em: ${filePath}`);
}

(async () => {
  let topic = process.argv.slice(2).join(" ").trim();

  if (!topic) {
    topic = await askTopic();
  }

  if (!topic) {
    console.log("Nenhum tema informado. Não há resultados para buscar.");
    process.exit(0);
  }

  console.log(`Tema selecionado: "${topic}"`);

  console.log(`Coletando notícias sobre: ${topic}...`);

  const news = await colectNews(topic);
  await exportToExcel(news, topic);

  console.log(`${news.length} notícias exportadas!`);
})();
