const fs = require('fs');

// all.json'u oku
const allJson = JSON.parse(fs.readFileSync('all.json', 'utf8'));

// ana.txt için ana ürün fiyatları
let anaContent = '# ANA ÜRÜN FİYATLARI\n';
anaContent += '# Format: ÜRÜN_ID | ÜRÜN_ADI (TR) | FİYAT\n';
anaContent += '# Fiyatı değiştirmek için sadece sayıyı değiştirin\n';
anaContent += '# Örnek: p1 | Margarita Yicem | 220\n\n';

// ekstra.txt için ekstra fiyatlar
let ekstraContent = '# EKSTRA FİYATLAR\n';
ekstraContent += '# Format: ÜRÜN_ID | EKSTRA_TİPİ | EKSTRA_ID | EKSTRA_ADI | FİYAT\n';
ekstraContent += '# EKSTRA_TİPİ: option, mainProduct, sideProduct, menuOption, potatoOption, drinkOption\n';
ekstraContent += '# Fiyatı değiştirmek için sadece sayıyı değiştirin\n\n';

// Tüm kategorileri dolaş
allJson.categories.forEach(category => {
    anaContent += `\n# === ${category.name.tr} (${category.id}) ===\n`;
    
    category.products.forEach(product => {
        const productName = product.name.tr || product.name.en || '';
        const productId = product.id;
        const price = product.price || 0;
        
        // Ana ürün fiyatı
        anaContent += `${productId} | ${productName} | ${price}\n`;
        
        // Options (boyut seçenekleri)
        if (product.options && Array.isArray(product.options)) {
            product.options.forEach(option => {
                const optionName = option.label?.tr || option.label?.en || '';
                const optionId = option.id;
                const optionPrice = option.price || 0;
                ekstraContent += `${productId} | option | ${optionId} | ${optionName} | ${optionPrice}\n`;
            });
        }
        
        // Extras
        if (product.extras) {
            // Main Products
            if (product.extras.mainProducts && Array.isArray(product.extras.mainProducts)) {
                product.extras.mainProducts.forEach(extra => {
                    const extraName = extra.name?.tr || extra.name?.en || '';
                    const extraId = extra.id;
                    const extraPrice = extra.price || 0;
                    ekstraContent += `${productId} | mainProduct | ${extraId} | ${extraName} | ${extraPrice}\n`;
                });
            }
            
            // Side Products
            if (product.extras.sideProducts && Array.isArray(product.extras.sideProducts)) {
                product.extras.sideProducts.forEach(extra => {
                    const extraName = extra.name?.tr || extra.name?.en || '';
                    const extraId = extra.id;
                    const extraPrice = extra.price || 0;
                    ekstraContent += `${productId} | sideProduct | ${extraId} | ${extraName} | ${extraPrice}\n`;
                });
            }
            
            // Menu Options
            if (product.extras.menuOptions && Array.isArray(product.extras.menuOptions)) {
                product.extras.menuOptions.forEach(extra => {
                    const extraName = extra.name?.tr || extra.name?.en || '';
                    const extraId = extra.id;
                    const extraPrice = extra.price || 0;
                    ekstraContent += `${productId} | menuOption | ${extraId} | ${extraName} | ${extraPrice}\n`;
                });
            }
            
            // Potato Options
            if (product.extras.potatoOptions && Array.isArray(product.extras.potatoOptions)) {
                product.extras.potatoOptions.forEach(extra => {
                    const extraName = extra.name?.tr || extra.name?.en || '';
                    const extraId = extra.id;
                    const extraPrice = extra.price || 0;
                    ekstraContent += `${productId} | potatoOption | ${extraId} | ${extraName} | ${extraPrice}\n`;
                });
            }
            
            // Drink Options
            if (product.extras.drinkOptions && Array.isArray(product.extras.drinkOptions)) {
                product.extras.drinkOptions.forEach(extra => {
                    const extraName = extra.name?.tr || extra.name?.en || '';
                    const extraId = extra.id;
                    const extraPrice = extra.price || 0;
                    ekstraContent += `${productId} | drinkOption | ${extraId} | ${extraName} | ${extraPrice}\n`;
                });
            }
        }
    });
});

// Dosyaları yaz
fs.writeFileSync('ana.txt', anaContent, 'utf8');
fs.writeFileSync('ekstra.txt', ekstraContent, 'utf8');

console.log('✅ ana.txt ve ekstra.txt dosyaları oluşturuldu!');
console.log(`📊 ${allJson.categories.reduce((sum, cat) => sum + cat.products.length, 0)} ürün işlendi.`);

