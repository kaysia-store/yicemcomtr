const fs = require('fs');

// all.json'u oku
const allJson = JSON.parse(fs.readFileSync('all.json', 'utf8'));

// ana.txt'yi oku ve parse et
function parseAnaTxt(content) {
    const prices = {};
    const lines = content.split('\n');
    
    for (const line of lines) {
        // Yorum satırlarını atla
        if (line.trim().startsWith('#') || !line.trim()) continue;
        
        // Format: ÜRÜN_ID | ÜRÜN_ADI | FİYAT
        const parts = line.split('|').map(p => p.trim());
        if (parts.length >= 3) {
            const productId = parts[0];
            const price = parseInt(parts[2]);
            if (!isNaN(price)) {
                prices[productId] = price;
            }
        }
    }
    
    return prices;
}

// ekstra.txt'yi oku ve parse et
function parseEkstraTxt(content) {
    const extras = {};
    const lines = content.split('\n');
    
    for (const line of lines) {
        // Yorum satırlarını atla
        if (line.trim().startsWith('#') || !line.trim()) continue;
        
        // Format: ÜRÜN_ID | EKSTRA_TİPİ | EKSTRA_ID | EKSTRA_ADI | FİYAT
        const parts = line.split('|').map(p => p.trim());
        if (parts.length >= 5) {
            const productId = parts[0];
            const extraType = parts[1];
            const extraId = parts[2];
            const price = parseInt(parts[4]);
            
            if (!isNaN(price)) {
                if (!extras[productId]) {
                    extras[productId] = {};
                }
                if (!extras[productId][extraType]) {
                    extras[productId][extraType] = {};
                }
                extras[productId][extraType][extraId] = price;
            }
        }
    }
    
    return extras;
}

// ana.txt'yi oku
if (!fs.existsSync('ana.txt')) {
    console.error('❌ ana.txt dosyası bulunamadı!');
    process.exit(1);
}

const anaContent = fs.readFileSync('ana.txt', 'utf8');
const anaPrices = parseAnaTxt(anaContent);

// ekstra.txt'yi oku
if (!fs.existsSync('ekstra.txt')) {
    console.error('❌ ekstra.txt dosyası bulunamadı!');
    process.exit(1);
}

const ekstraContent = fs.readFileSync('ekstra.txt', 'utf8');
const ekstraPrices = parseEkstraTxt(ekstraContent);

// all.json'u güncelle
let updatedProducts = 0;
let updatedExtras = 0;

allJson.categories.forEach(category => {
    category.products.forEach(product => {
        // Ana ürün fiyatını güncelle
        if (anaPrices[product.id] !== undefined) {
            if (product.price !== anaPrices[product.id]) {
                product.price = anaPrices[product.id];
                updatedProducts++;
            }
        }
        
        // Options fiyatlarını güncelle
        if (product.options && Array.isArray(product.options)) {
            product.options.forEach(option => {
                if (ekstraPrices[product.id]?.option?.[option.id] !== undefined) {
                    const newPrice = ekstraPrices[product.id].option[option.id];
                    if (option.price !== newPrice) {
                        option.price = newPrice;
                        updatedExtras++;
                    }
                }
            });
        }
        
        // Extras fiyatlarını güncelle
        if (product.extras) {
            // Main Products
            if (product.extras.mainProducts && Array.isArray(product.extras.mainProducts)) {
                product.extras.mainProducts.forEach(extra => {
                    if (ekstraPrices[product.id]?.mainProduct?.[extra.id] !== undefined) {
                        const newPrice = ekstraPrices[product.id].mainProduct[extra.id];
                        if (extra.price !== newPrice) {
                            extra.price = newPrice;
                            updatedExtras++;
                        }
                    }
                });
            }
            
            // Side Products
            if (product.extras.sideProducts && Array.isArray(product.extras.sideProducts)) {
                product.extras.sideProducts.forEach(extra => {
                    if (ekstraPrices[product.id]?.sideProduct?.[extra.id] !== undefined) {
                        const newPrice = ekstraPrices[product.id].sideProduct[extra.id];
                        if (extra.price !== newPrice) {
                            extra.price = newPrice;
                            updatedExtras++;
                        }
                    }
                });
            }
            
            // Menu Options
            if (product.extras.menuOptions && Array.isArray(product.extras.menuOptions)) {
                product.extras.menuOptions.forEach(extra => {
                    if (ekstraPrices[product.id]?.menuOption?.[extra.id] !== undefined) {
                        const newPrice = ekstraPrices[product.id].menuOption[extra.id];
                        if (extra.price !== newPrice) {
                            extra.price = newPrice;
                            updatedExtras++;
                        }
                    }
                });
            }
            
            // Potato Options
            if (product.extras.potatoOptions && Array.isArray(product.extras.potatoOptions)) {
                product.extras.potatoOptions.forEach(extra => {
                    if (ekstraPrices[product.id]?.potatoOption?.[extra.id] !== undefined) {
                        const newPrice = ekstraPrices[product.id].potatoOption[extra.id];
                        if (extra.price !== newPrice) {
                            extra.price = newPrice;
                            updatedExtras++;
                        }
                    }
                });
            }
            
            // Drink Options
            if (product.extras.drinkOptions && Array.isArray(product.extras.drinkOptions)) {
                product.extras.drinkOptions.forEach(extra => {
                    if (ekstraPrices[product.id]?.drinkOption?.[extra.id] !== undefined) {
                        const newPrice = ekstraPrices[product.id].drinkOption[extra.id];
                        if (extra.price !== newPrice) {
                            extra.price = newPrice;
                            updatedExtras++;
                        }
                    }
                });
            }
        }
    });
});

// all.json'u kaydet
fs.writeFileSync('all.json', JSON.stringify(allJson, null, 2), 'utf8');

console.log('✅ all.json güncellendi!');
console.log(`📊 ${updatedProducts} ana ürün fiyatı güncellendi`);
console.log(`📊 ${updatedExtras} ekstra fiyat güncellendi`);

