import fs from 'fs';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

const CATEGORIES_TO_SCRAPE = [
  { name: 'PC Portables', url: 'https://www.coolblue.be/fr/ordinateurs-portables' },
  { name: 'Smartphones', url: 'https://www.coolblue.be/fr/smartphones' }
];

async function runScraper() {
  console.log("🚀 Lancement du Scrapper Nexora V6 (Mode Mobile Indétectable)...");
  
  const browser = await puppeteer.launch({ 
    headless: false, // Laisse ouvert pour que tu puisses voir
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  
  const page = await browser.newPage();
  
  // ON SE DÉGUISE EN IPHONE 15 📱 (Pas de gros menus d'aide bloquants sur mobile)
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  const allProducts = [];

  for (const category of CATEGORIES_TO_SCRAPE) {
    console.log(`\n📂 Chargement mobile de : ${category.name}...`);
    try {
      await page.goto(category.url, { waitUntil: 'networkidle2' });
      
      console.log("⏱️ Attente de 5 secondes... Accepte les cookies si la bannière apparaît sur le téléphone.");
      await new Promise(r => setTimeout(r, 5000));

      console.log("📜 Défilement léger...");
      await page.evaluate(() => {
        window.scrollBy(0, 800);
      });
      await new Promise(r => setTimeout(r, 2000));

      console.log("📸 Récolte des produits...");
      const productsInPage = await page.evaluate((categoryName) => {
        // Sur mobile, les titres et structures sont plus simples
        const cards = document.querySelectorAll('.product-card, [class*="product-card"], [class*="card"]');
        const list = [];
        const seen = new Set();

        cards.forEach((card, index) => {
          const titleEl = card.querySelector('h3, [class*="title"], a');
          if (!titleEl) return;
          const name = titleEl.innerText.trim();

          if (!name || name.length < 8 || seen.has(name)) return;

          const priceEl = card.querySelector('[class*="price"], .sales-price__current');
          let price = 0;
          if (priceEl) {
            const cleanPrice = priceEl.innerText.replace(/[^0-9]/g, '');
            price = parseFloat(cleanPrice) || 0;
          }

          if (name && price > 20) {
            seen.add(name);
            list.push({
              id: `cb-${Date.now()}-${index}`,
              name,
              description: `Achetez votre ${name} au meilleur prix chez Nexora.`,
              price,
              image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12", // Image par défaut ultra-propre
              category: categoryName.toLowerCase(),
              brand: name.split(' ')[0],
              rating: 4.5,
              isPromo: Math.random() > 0.5
            });
          }
        });
        return list;
      }, category.name);

      console.log(`🎯 ${productsInPage.length} produits trouvés !`);
      allProducts.push(...productsInPage);

    } catch (err) {
      console.error(`❌ Erreur :`, err.message);
    }
  }

  fs.writeFileSync('./coolblue-all-products.json', JSON.stringify(allProducts, null, 2));
  console.log(`\n✅ Terminé ! Fichier créé avec ${allProducts.length} produits.`);
  await browser.close();
}

runScraper();