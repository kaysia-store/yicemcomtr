// Restaurant Menu Website - JavaScript

// Ürün ID -> kesin resim yolu (embedded - artık dış dosya yok)
const PRODUCT_IMAGE_MAP = {
	's1': './pic/Salata/diyet-tavuk-salata.jpg',
    's3': './pic/Salata/sezar.jpg',
    'b5': './pic/Bistro/tavuk-wrap.jpg',
    'pa7': './pic/Makarnalar/turkusulu.jpg',
    'bd9': './pic/Ayvalik-Tostu/yicem-donerli.jpg',
    'bd3': './pic/Et-Doner/et-doner-porsiyon.jpg',
    'cd2': './pic/Tavuk-Doner/tavuk-doner.jpg',
    'p1': './pic/Pizzalar/margarita.jpg',
    'p2': './pic/Pizzalar/mix-yicem-pizza.jpg',
    'p3': './pic/Pizzalar/kavurmali-yicem.jpg',
    'p4': './pic/Pizzalar/tavuklu-yicem.jpg',
    'p5': './pic/Pizzalar/donerli-yicem.jpg',
    'p6': './pic/Pizzalar/tonno-yicem.jpg',
    'p7': './pic/Pizzalar/sosisli-yicem.jpg',
    'p8': './pic/Pizzalar/sucuklu-yicem.jpg',
    'p9': './pic/Pizzalar/diavola-yicem.jpg',
    'p10': './pic/Pizzalar/margarita.jpg',
    'p11': './pic/Pizzalar/4-peynirli-yicem.jpg',
    'p12': './pic/Pizzalar/ıspanak-tulum-yicem.jpg',
    'p13': './pic/Pizzalar/brokoli-yicem.jpg',
    't1': './pic/Ayvalik-Tostu/yicem-yengen.jpg',
    't2': './pic/Ayvalik-Tostu/yicem-karisik.jpg',
    't3': './pic/Ayvalik-Tostu/yicem-mega-karisik.jpg',
    't4': './pic/Ayvalik-Tostu/yicem-super-karisik.jpg',
    't5': './pic/Ayvalik-Tostu/yicem-kavurma.jpg',
    't6': './pic/Ayvalik-Tostu/yicem-donerli.jpg',
    't7': './pic/Ayvalik-Tostu/yicem-sucuklu.jpg',
    't8': './pic/Ayvalik-Tostu/yicem-schnitzel.jpg',
    't9': './pic/Ayvalik-Tostu/yicem-salam.jpg',
    't10': './pic/Ayvalik-Tostu/yicem-kasarli-jambon.jpg',
    't11': './pic/Ayvalik-Tostu/yicem-kasarli.jpg',
    't12': './pic/Ayvalik-Tostu/yicem-evkofteli.jpg',
    't13': './pic/Ayvalik-Tostu/sanayi-tostu.jpg',
    't14': './pic/Ayvalik-Tostu/Yicem Kaşar veya Beyaz Peynir.jpg',
    'cd1': './pic/Tavuk-Doner/tavuk-doner.jpg',
    'cd2': './pic/Tavuk-Doner/tavuk-doner.jpg',
    'cd3': './pic/Tavuk-Doner/tavuk-iskender.jpg',
    'cd4': './pic/Tavuk-Doner/tavuk-doner-beyti.jpg',
    'cd5': './pic/Tavuk-Doner/tavuk-doner-porsiyon.jpg',
    'cd6': './pic/Tavuk-Doner/pilav-ustu-tavuk-doner.jpg',
    'cd7': './pic/Tavuk-Doner/3lu-tavuk-doner.jpg',
    'cd8': './pic/Tavuk-Doner/5lı-tavuk-doner.jpg',
    'bd1': './pic/Et-Doner/et-doner.jpg',
    'bd2': './pic/Et-Doner/et-doner.jpg',
    'pa1': './pic/Makarnalar/alfredo.jpg',
    'pa2': './pic/Makarnalar/Napoliten.jpg',
    'ma1': './pic/Makarnalar/manti.jpg',
    'h1': './pic/Hamburger/hamburger.jpg',
    'h2': './pic/Hamburger/cheeseburger.jpg',
    'h3': './pic/Hamburger/tavukburger.jpg',
    'k1': './pic/Kofte-Spesiyel/sefin-izgarasi.jpg',
    'k2': './pic/Kofte-Spesiyel/ekmekarasi.jpg',
    'k3': './pic/Kofte-Spesiyel/kasarli-kofte.jpg',
    'a1': './pic/Aperatifler/elmadilim.jpg',
    'a2': './pic/Aperatifler/parmakpatates.jpg',
    'a3': './pic/Aperatifler/citir.jpg',
    'b1': './pic/Bistro/chicken-stroganoff.jpg',
    's2': './pic/Salata/baharsalata.jpg',
    's4': './pic/Salata/citir-tavuk-salata.jpg',
    's5': './pic/Salata/hellim-salata.jpg',
    's6': './pic/Salata/tonnosalata.jpg',
    'd2': './pic/Icecek/cocacola.jpg',
    'd3': './pic/Icecek/pepsi.jpg',
    'd4': './pic/Icecek/fanta.jpg',
    'd5': './pic/Icecek/sprite.jpg',
    'd6': './pic/Icecek/icetea.jpg',
    'd7': './pic/Icecek/litrelikicecek.jpg',
    'd8': './pic/Icecek/ayran.jpg',
    'd9': './pic/Icecek/su.jpg',
    'd10': './pic/Icecek/soda.jpg',
    'd11': './pic/Icecek/salgam.jpg',
    'd12': './pic/Icecek/cay.jpg',
    'd13': './pic/Icecek/turk-kahvesi.jpg',
    'd14': './pic/Icecek/4lucamicecek.jpg',
    // image_mappings.txt'den eklenen eksik eşleştirmeler
    'bd4': './pic/Et-Doner/soslu-doner.jpg',
    'bd5': './pic/Et-Doner/et-iskender.jpg',
    'bd7': './pic/Et-Doner/soslu-doner.jpg',
    'bd8': './pic/Et-Doner/soslu-doner.jpg',
    'pa3': './pic/Makarnalar/bolonez.jpg',
    'pa4': './pic/Makarnalar/pesto.jpg',
    'pa5': './pic/Makarnalar/arabiata.jpg',
    'pa6': './pic/Makarnalar/ton-balikli.jpg',
    'b2': './pic/Tavuk-Doner/tavuk-doner-beyti.jpg',
    'b4': './pic/Bistro/viyana.jpg',
    'b12': './pic/Bistro/tavukmenu.jpg',
    'b13': './pic/Bistro/Tavuk Menü Diyet.jpg'
};

// Klasörlere göre mevcut görsel dosyaları (pic/ altı)
const AVAILABLE_IMAGES = {
    'Pizzalar': [
        '4-peynirli-yicem.jpg','brokoli-yicem.jpg','diavola-yicem.jpg','donerli-yicem.jpg','ıspanak-tulum-yicem.jpg','kavurmali-yicem.jpg','klasik-yicem.jpg','margarita.jpg','mix-yicem-pizza.jpg','sosisli-yicem.jpg','sucuklu-yicem.jpg','tavuklu-yicem.jpg','tonno-yicem.jpg'
    ],
    'Ayvalik-Tostu': [
        'sanayi-tostu.jpg','soguk-sandvic.jpg','yicem-donerli.jpg','yicem-evkofteli.jpg','yicem-karisik.jpg','yicem-kasarli-jambon.jpg','yicem-kasarli.jpg','yicem-kavurma.jpg','yicem-mega-karisik.jpg','yicem-salam.jpg','yicem-schnitzel.jpg','yicem-sucuklu.jpg','yicem-super-karisik.jpg','yicem-yengen.jpg','yicem-yengenn.jpg'
    ],
    'Tavuk-Doner': [
        '3lu-tavuk-doner.jpg','5lı-tavuk-doner.jpg','pilav-ustu-tavuk-doner.jpg','tavuk-doner-beyti.jpg','tavuk-doner-porsiyon.jpg','tavuk-doner.jpg','tavuk-iskender.jpg'
    ],
    'Et-Doner': [
        '3lu-etdoner.jpg','5li-etdoner.jpg','ayvalik-etdoner.jpg','et-doner-porsiyon.jpg','et-doner.jpg','et-iskender.jpg','kasarli-etdoner.jpg','pilavustu-etdoner.jpg','soslu-doner.jpg'
    ],
    'Makarnalar': [
        'alfredo.jpg','arabiata.jpg','bolonez.jpg','manti.jpg','Napoliten.jpg','pesto.jpg','ton-balikli.jpg','turkusulu.jpg'
    ],
    'Hamburger': [
        'cheeseburger.jpg','hamburger.jpg','tavukburger.jpg'
    ],
    'Kofte-Spesiyel': [
        'ekmekarasi.jpg','kasarli-kofte.jpg','sefin-izgarasi.jpg'
    ],
    'Aperatifler': [
        'citir.jpg','elmadilim.jpg','parmakpatates.jpg'
    ],
    'Bistro': [
        'barbekusoslutavuk.jpg','cafedeparis.jpg','chicken-quesadilla.jpg','chicken-stroganoff.jpg','dagkekigi-kremali.jpg','kasarli-mantarli-quesadilla.jpg','mantarli-kori-tavuk.jpg','mexicanososlutavuk.jpg','tatliacisoslutavuk.jpg','tavuk-wrap.jpg','viyana.jpg'
    ],
    'Salata': [
        'baharsalata.jpg','citir-tavuk-salata.jpg','diyet-tavuk-salata.jpg','hellim-salata.jpg','sezar.jpg','tonnosalata.jpg'
    ],
    'Icecek': [
        '4lucamicecek.jpg','ayran.jpg','cay.jpg','cocacola.jpg','fanta.jpg','icetea.jpg','litrelikicecek.jpg','pepsi.jpg','redbull.jpg','salgam.jpg','soda.jpg','sprite.jpg','su.jpg','turk-kahvesi.jpg'
    ]
};

// Embedded menu data - Tüm ürünler, açıklamalar, diller, ekstralar ve resim yolları
const EMBEDDED_MENU_DATA={"restaurant":{"name":{"tr":"Yi\u0027Cem Restoran","en":"Yi\u0027Cem Restaurant","de":"Yi\u0027Cem Restaurant","ru":"Ресторан Йи\u0027Цем","fr":"Restaurant Yi\u0027Cem","ar":"مطعم يجم"},"description":{"tr":"Antalya Muratpaşa\u0027da taze malzemelerle hazırlanan lezzetli pizzalar ve ayvalık tostları","en":"Delicious pizzas and Ayvalık toasts prepared with fresh ingredients in Antalya Muratpaşa","de":"Leckere Pizzas und Ayvalık-Toasts mit frischen Zutaten in Antalya Muratpaşa zubereitet","ru":"Вкусные пиццы и тосты Айвалык, приготовленные из свежих ингредиентов в Анталье Муратпаша","fr":"Délicieuses pizzas et toasts Ayvalık préparés avec des ingrédients frais à Antalya Muratpaşa","ar":"بيتزا لذيذة وخبز محمص أيفاليك محضر بمكونات طازجة في أنطاليا مراتباشا"},"categories":[{"id":"pizza","name":{"tr":"Pizzalar","en":"Pizzas","de":"Pizzas","ru":"Пиццы","fr":"Pizzas","ar":"بيتزا"},"products":[{"id":"p1","name":{"tr":"Margarita Yicem","en":"Margarita Yicem","de":"Margarita Yicem","ru":"Маргарита Йицем","fr":"Margarita Yicem","ar":"مارغريتا يجم"},"price":180,"description":{"tr":"Mozarella Peyniri, Pizza Sosu, Fesleğen, Cherry Domates","en":"Mozzarella Cheese, Pizza Sauce, Basil, Cherry Tomatoes","de":"Mozzarella-Käse, Pizza-Sauce, Basilikum, Kirschtomaten","ru":"Сыр Моцарелла, Соус для пиццы, Базилик, Черри помидоры","fr":"Fromage Mozzarella, Sauce Pizza, Basilic, Tomates Cerises","ar":"جبن موزاريلا، صلصة البيتزا، ريحان، طماطم كرزية"},"contents":{"tr":["Pizza Sosu","Fesleğen","Cherry Domates"],"en":["Pizza Sauce","Basil","Cherry Tomatoes"],"de":["Pizza-Sauce","Basilikum","Kirschtomaten"],"ru":["Соус для пиццы","Базилик","Черри помидоры"],"fr":["Sauce Pizza","Basilic","Tomates Cerises"],"ar":["صلصة البيتزا","ريحان","طماطم كرزية"]},"options":[{"id":"o1","label":{"tr":"Small (1 Kişilik)","en":"Small (1 Person)","de":"Klein (1 Person)","ru":"Маленькая (1 человек)","fr":"Petit (1 personne)","ar":"صغير (شخص واحد)"},"price":0},{"id":"o2","label":{"tr":"Medium (1-2 Kişilik)","en":"Medium (1-2 People)","de":"Mittel (1-2 Personen)","ru":"Средняя (1-2 человека)","fr":"Moyen (1-2 personnes)","ar":"متوسط (1-2 أشخاص)"},"price":60},{"id":"o3","label":{"tr":"Large (2-3 Kişilik)","en":"Large (2-3 People)","de":"Groß (2-3 Personen)","ru":"Большая (2-3 человека)","fr":"Grand (2-3 personnes)","ar":"كبير (2-3 أشخاص)"},"price":120},{"id":"o4","label":{"tr":"XLarge (3-4 Kişilik)","en":"XLarge (3-4 People)","de":"Extra Groß (3-4 Personen)","ru":"Очень большая (3-4 человека)","fr":"Très grand (3-4 personnes)","ar":"كبير جداً (3-4 أشخاص)"},"price":180}]},{"id":"p2","name":{"tr":"Mix Yicem","en":"Mix Yicem","de":"Mix Yicem","ru":"Микс Йицем","fr":"Mix Yicem","ar":"ميكس يجم"},"price":240,"description":{"tr":"Mozarella Peyniri, Pizza Sosu, Sucuk, Sosis, Salam, Zeytin, Mısır, Mantar","en":"Mozzarella Cheese, Pizza Sauce, Sucuk, Sausage, Salami, Olives, Corn, Mushrooms","de":"Mozzarella-Käse, Pizza-Sauce, Sucuk, Wurst, Salami, Oliven, Mais, Pilze","ru":"Сыр Моцарелла, Соус для пиццы, Суджук, Колбаса, Салами, Оливки, Кукуруза, Грибы","fr":"Fromage Mozzarella, Sauce Pizza, Sucuk, Saucisse, Salami, Olives, Maïs, Champignons","ar":"جبن موزاريلا، صلصة البيتزا، سوجق، سجق، سلامي، زيتون، ذرة، فطر"},"contents":{"tr":["Pizza Sosu","Sucuk","Sosis","Salam","Zeytin","Mısır","Mantar"],"en":["Pizza Sauce","Sucuk","Sausage","Salami","Olives","Corn","Mushrooms"],"de":["Pizza-Sauce","Sucuk","Wurst","Salami","Oliven","Mais","Pilze"],"ru":["Соус для пиццы","Суджук","Колбаса","Салами","Оливки","Кукуруза","Грибы"],"fr":["Sauce Pizza","Sucuk","Saucisse","Salami","Olives","Maïs","Champignons"],"ar":["صلصة البيتزا","سوجق","سجق","سلامي","زيتون","ذرة","فطر"]},"options":[{"id":"o5","label":{"tr":"Small (1 Kişilik)","en":"Small (1 Person)","de":"Klein (1 Person)","ru":"Маленькая (1 человек)","fr":"Petit (1 personne)","ar":"صغير (شخص واحد)"},"price":0},{"id":"o6","label":{"tr":"Medium (1-2 Kişilik)","en":"Medium (1-2 People)","de":"Mittel (1-2 Personen)","ru":"Средняя (1-2 человека)","fr":"Moyen (1-2 personnes)","ar":"متوسط (1-2 أشخاص)"},"price":60},{"id":"o7","label":{"tr":"Large (2-3 Kişilik)","en":"Large (2-3 People)","de":"Groß (2-3 Personen)","ru":"Большая (2-3 человека)","fr":"Grand (2-3 personnes)","ar":"كبير (2-3 أشخاص)"},"price":120},{"id":"o8","label":{"tr":"XLarge (3-4 Kişilik)","en":"XLarge (3-4 People)","de":"Extra Groß (3-4 Personen)","ru":"Очень большая (3-4 человека)","fr":"Très grand (3-4 personnes)","ar":"كبير جداً (3-4 أشخاص)"},"price":180}]},{"id":"p3","name":{"tr":"Kavurmalı Yicem","en":"Beef Stew Yicem","de":"Rindfleisch-Eintopf Yicem","ru":"Йицем с тушеной говядиной","fr":"Yicem au Ragoût de Bœuf","ar":"يجم باللحم المطبوخ"},"price":300,"description":{"tr":"Mozarella, Pizza Sosu, Dana Kavurma, Soğan, Biber, Kekik","en":"Mozzarella, Pizza Sauce, Beef Stew, Onion, Pepper, Thyme","de":"Mozzarella, Pizza-Sauce, Rindfleisch-Eintopf, Zwiebel, Paprika, Thymian","ru":"Моцарелла, Соус для пиццы, Тушеная говядина, Лук, Перец, Тимьян","fr":"Mozzarella, Sauce Pizza, Ragoût de Bœuf, Oignon, Poivron, Thym","ar":"موزاريلا، صلصة البيتزا، لحم مطبوخ، بصل، فلفل، زعتر"},"contents":{"tr":["Pizza Sosu","Dana Kavurma","Soğan","Biber","Kekik"],"en":["Pizza Sauce","Beef Stew","Onion","Pepper","Thyme"],"de":["Pizza-Sauce","Rindfleisch-Eintopf","Zwiebel","Paprika","Thymian"],"ru":["Соус для пиццы","Тушеная говядина","Лук","Перец","Тимьян"],"fr":["Sauce Pizza","Ragoût de Bœuf","Oignon","Poivron","Thym"],"ar":["صلصة البيتزا","لحم مطبوخ","بصل","فلفل","زعتر"]},"options":[{"id":"o9","label":{"tr":"Small (1 Kişilik)","en":"Small (1 Person)","de":"Klein (1 Person)","ru":"Маленькая (1 человек)","fr":"Petit (1 personne)","ar":"صغير (شخص واحد)"},"price":0},{"id":"o10","label":{"tr":"Medium (1-2 Kişilik)","en":"Medium (1-2 People)","de":"Mittel (1-2 Personen)","ru":"Средняя (1-2 человека)","fr":"Moyen (1-2 personnes)","ar":"متوسط (1-2 أشخاص)"},"price":60},{"id":"o11","label":{"tr":"Large (2-3 Kişilik)","en":"Large (2-3 People)","de":"Groß (2-3 Personen)","ru":"Большая (2-3 человека)","fr":"Grand (2-3 personnes)","ar":"كبير (2-3 أشخاص)"},"price":120},{"id":"o12","label":{"tr":"XLarge (3-4 Kişilik)","en":"XLarge (3-4 People)","de":"Extra Groß (3-4 Personen)","ru":"Очень большая (3-4 человека)","fr":"Très grand (3-4 personnes)","ar":"كبير جداً (3-4 أشخاص)"},"price":180}]},{"id":"p4","name":{"tr":"Tavuklu Yicem","en":"Chicken Yicem","de":"Hähnchen Yicem","ru":"Йицем с курицей","fr":"Yicem au Poulet","ar":"يجم بالدجاج"},"price":240,"description":{"tr":"Mozarella, Pizza Sosu, Tavuk Göğsü, Mantar, Mısır, Jalapeno Biber, Kekik","en":"Mozzarella, Pizza Sauce, Chicken Breast, Mushrooms, Corn, Jalapeño Pepper, Thyme","de":"Mozzarella, Pizza-Sauce, Hähnchenbrust, Pilze, Mais, Jalapeño-Paprika, Thymian","ru":"Моцарелла, Соус для пиццы, Куриная грудка, Грибы, Кукуруза, Перец халапеньо, Тимьян","fr":"Mozzarella, Sauce Pizza, Blanc de Poulet, Champignons, Maïs, Poivron Jalapeño, Thym","ar":"موزاريلا، صلصة البيتزا، صدر دجاج، فطر، ذرة، فلفل هالبينو، زعتر"},"contents":{"tr":["Pizza Sosu","Tavuk Göğsü","Mantar","Mısır","Jalapeno Biber","Kekik"],"en":["Pizza Sauce","Chicken Breast","Mushrooms","Corn","Jalapeño Pepper","Thyme"],"de":["Pizza-Sauce","Hähnchenbrust","Pilze","Mais","Jalapeño-Paprika","Thymian"],"ru":["Соус для пиццы","Куриная грудка","Грибы","Кукуруза","Перец халапеньо","Тимьян"],"fr":["Sauce Pizza","Blanc de Poulet","Champignons","Maïs","Poivron Jalapeño","Thym"],"ar":["صلصة البيتزا","صدر دجاج","فطر","ذرة","فلفل هالبينو","زعتر"]},"options":[{"id":"o13","label":{"tr":"Small (1 Kişilik)","en":"Small (1 Person)","de":"Klein (1 Person)","ru":"Маленькая (1 человек)","fr":"Petit (1 personne)","ar":"صغير (شخص واحد)"},"price":0},{"id":"o14","label":{"tr":"Medium (1-2 Kişilik)","en":"Medium (1-2 People)","de":"Mittel (1-2 Personen)","ru":"Средняя (1-2 человека)","fr":"Moyen (1-2 personnes)","ar":"متوسط (1-2 أشخاص)"},"price":60},{"id":"o15","label":{"tr":"Large (2-3 Kişilik)","en":"Large (2-3 People)","de":"Groß (2-3 Personen)","ru":"Большая (2-3 человека)","fr":"Grand (2-3 personnes)","ar":"كبير (2-3 أشخاص)"},"price":120},{"id":"o16","label":{"tr":"XLarge (3-4 Kişilik)","en":"XLarge (3-4 People)","de":"Extra Groß (3-4 Personen)","ru":"Очень большая (3-4 человека)","fr":"Très grand (3-4 personnes)","ar":"كبير جداً (3-4 أشخاص)"},"price":180}]},{"id":"p5","name":{"tr":"Dönerli Yicem","en":"Doner Yicem","de":"Döner Yicem","ru":"Йицем с донером","fr":"Yicem au Döner","ar":"يجم بالدونر"},"price":300,"description":{"tr":"Mozarella, Pizza Sosu, Et Döner, Mantar, Soğan, Biber, Kekik","en":"Mozzarella, Pizza Sauce, Beef Doner, Mushrooms, Onion, Pepper, Thyme","de":"Mozzarella, Pizza-Sauce, Rindfleisch-Döner, Pilze, Zwiebel, Paprika, Thymian","ru":"Моцарелла, Соус для пиццы, Говяжий донер, Грибы, Лук, Перец, Тимьян","fr":"Mozzarella, Sauce Pizza, Döner Bœuf, Champignons, Oignon, Poivron, Thym","ar":"موزاريلا، صلصة البيتزا، دونر لحم، فطر، بصل، فلفل، زعتر"},"contents":{"tr":["Pizza Sosu","Et Döner","Mantar","Soğan","Biber","Kekik"],"en":["Pizza Sauce","Beef Doner","Mushrooms","Onion","Pepper","Thyme"],"de":["Pizza-Sauce","Rindfleisch-Döner","Pilze","Zwiebel","Paprika","Thymian"],"ru":["Соус для пиццы","Говяжий донер","Грибы","Лук","Перец","Тимьян"],"fr":["Sauce Pizza","Döner Bœuf","Champignons","Oignon","Poivron","Thym"],"ar":["صلصة البيتزا","دونر لحم","فطر","بصل","فلفل","زعتر"]},"options":[{"id":"o17","label":{"tr":"Small (1 Kişilik)","en":"Small (1 Person)","de":"Klein (1 Person)","ru":"Маленькая (1 человек)","fr":"Petit (1 personne)","ar":"صغير (شخص واحد)"},"price":0},{"id":"o18","label":{"tr":"Medium (1-2 Kişilik)","en":"Medium (1-2 People)","de":"Mittel (1-2 Personen)","ru":"Средняя (1-2 человека)","fr":"Moyen (1-2 personnes)","ar":"متوسط (1-2 أشخاص)"},"price":60},{"id":"o19","label":{"tr":"Large (2-3 Kişilik)","en":"Large (2-3 People)","de":"Groß (2-3 Personen)","ru":"Большая (2-3 человека)","fr":"Grand (2-3 personnes)","ar":"كبير (2-3 أشخاص)"},"price":120},{"id":"o20","label":{"tr":"XLarge (3-4 Kişilik)","en":"XLarge (3-4 People)","de":"Extra Groß (3-4 Personen)","ru":"Очень большая (3-4 человека)","fr":"Très grand (3-4 personnes)","ar":"كبير جداً (3-4 أشخاص)"},"price":180}]},{"id":"p6","name":{"tr":"Tonno Yicem","en":"Tuna Yicem","de":"Thunfisch Yicem","ru":"Йицем с тунцом","fr":"Yicem au Thon","ar":"يجم بالتونة"},"price":260,"description":{"tr":"Mozarella, Pizza Sosu, Ton Balığı, Domates, Soğan, Mısır","en":"Mozzarella, Pizza Sauce, Tuna Fish, Tomatoes, Onion, Corn","de":"Mozzarella, Pizza-Sauce, Thunfisch, Tomaten, Zwiebel, Mais","ru":"Моцарелла, Соус для пиццы, Тунец, Помидоры, Лук, Кукуруза","fr":"Mozzarella, Sauce Pizza, Thon, Tomates, Oignon, Maïs","ar":"موزاريلا، صلصة البيتزا، تونة، طماطم، بصل، ذرة"},"contents":{"tr":["Pizza Sosu","Ton Balığı","Domates","Soğan","Mısır"],"en":["Pizza Sauce","Tuna Fish","Tomatoes","Onion","Corn"],"de":["Pizza-Sauce","Thunfisch","Tomaten","Zwiebel","Mais"],"ru":["Соус для пиццы","Тунец","Помидоры","Лук","Кукуруза"],"fr":["Sauce Pizza","Thon","Tomates","Oignon","Maïs"],"ar":["صلصة البيتزا","تونة","طماطم","بصل","ذرة"]},"options":[{"id":"o21","label":{"tr":"Small (1 Kişilik)","en":"Small (1 Person)","de":"Klein (1 Person)","ru":"Маленькая (1 человек)","fr":"Petit (1 personne)","ar":"صغير (شخص واحد)"},"price":0},{"id":"o22","label":{"tr":"Medium (1-2 Kişilik)","en":"Medium (1-2 People)","de":"Mittel (1-2 Personen)","ru":"Средняя (1-2 человека)","fr":"Moyen (1-2 personnes)","ar":"متوسط (1-2 أشخاص)"},"price":60},{"id":"o23","label":{"tr":"Large (2-3 Kişilik)","en":"Large (2-3 People)","de":"Groß (2-3 Personen)","ru":"Большая (2-3 человека)","fr":"Grand (2-3 personnes)","ar":"كبير (2-3 أشخاص)"},"price":120},{"id":"o24","label":{"tr":"XLarge (3-4 Kişilik)","en":"XLarge (3-4 People)","de":"Extra Groß (3-4 Personen)","ru":"Очень большая (3-4 человека)","fr":"Très grand (3-4 personnes)","ar":"كبير جداً (3-4 أشخاص)"},"price":180}]},{"id":"p7","name":{"tr":"Sosisli Yicem","en":"Sausage Yicem","de":"Wurst Yicem","ru":"Йицем с колбасой","fr":"Yicem aux Saucisses","ar":"يجم بالسجق"},"price":240,"description":{"tr":"Mozarella, Pizza Sosu, Sosis, Mantar, Zeytin, Biber, Mısır, Kekik","en":"Mozzarella, Pizza Sauce, Sausage, Mushrooms, Olives, Pepper, Corn, Thyme","de":"Mozzarella, Pizza-Sauce, Wurst, Pilze, Oliven, Paprika, Mais, Thymian","ru":"Моцарелла, Соус для пиццы, Колбаса, Грибы, Оливки, Перец, Кукуруза, Тимьян","fr":"Mozzarella, Sauce Pizza, Saucisse, Champignons, Olives, Poivron, Maïs, Thym","ar":"موزاريلا، صلصة البيتزا، سجق، فطر، زيتون، فلفل، ذرة، زعتر"},"contents":{"tr":["Pizza Sosu","Sosis","Mantar","Zeytin","Biber","Mısır","Kekik"],"en":["Pizza Sauce","Sausage","Mushrooms","Olives","Pepper","Corn","Thyme"],"de":["Pizza-Sauce","Wurst","Pilze","Oliven","Paprika","Mais","Thymian"],"ru":["Соус для пиццы","Колбаса","Грибы","Оливки","Перец","Кукуруза","Тимьян"],"fr":["Sauce Pizza","Saucisse","Champignons","Olives","Poivron","Maïs","Thym"],"ar":["صلصة البيتزا","سجق","فطر","زيتون","فلفل","ذرة","زعتر"]},"options":[{"id":"o25","label":{"tr":"Small (1 Kişilik)","en":"Small (1 Person)","de":"Klein (1 Person)","ru":"Маленькая (1 человек)","fr":"Petit (1 personne)","ar":"صغير (شخص واحد)"},"price":0},{"id":"o26","label":{"tr":"Medium (1-2 Kişilik)","en":"Medium (1-2 People)","de":"Mittel (1-2 Personen)","ru":"Средняя (1-2 человека)","fr":"Moyen (1-2 personnes)","ar":"متوسط (1-2 أشخاص)"},"price":60},{"id":"o27","label":{"tr":"Large (2-3 Kişilik)","en":"Large (2-3 People)","de":"Groß (2-3 Personen)","ru":"Большая (2-3 человека)","fr":"Grand (2-3 personnes)","ar":"كبير (2-3 أشخاص)"},"price":120},{"id":"o28","label":{"tr":"XLarge (3-4 Kişilik)","en":"XLarge (3-4 People)","de":"Extra Groß (3-4 Personen)","ru":"Очень большая (3-4 человека)","fr":"Très grand (3-4 personnes)","ar":"كبير جداً (3-4 أشخاص)"},"price":180}]},{"id":"p8","name":{"tr":"Sucuklu Yicem","en":"Sucuk Yicem","de":"Sucuk Yicem","ru":"Йицем с суджуком","fr":"Yicem au Sucuk","ar":"يجم بالسوجق"},"price":240,"description":{"tr":"Mozarella, Pizza Sosu, Sucuk, Mantar, Zeytin, Biber, Mısır, Kekik","en":"Mozzarella, Pizza Sauce, Sucuk, Mushrooms, Olives, Pepper, Corn, Thyme","de":"Mozzarella, Pizza-Sauce, Sucuk, Pilze, Oliven, Paprika, Mais, Thymian","ru":"Моцарелла, Соус для пиццы, Суджук, Грибы, Оливки, Перец, Кукуруза, Тимьян","fr":"Mozzarella, Sauce Pizza, Sucuk, Champignons, Olives, Poivron, Maïs, Thym","ar":"موزاريلا، صلصة البيتزا، سوجق، فطر، زيتون، فلفل، ذرة، زعتر"},"contents":{"tr":["Pizza Sosu","Sucuk","Mantar","Zeytin","Biber","Mısır","Kekik"],"en":["Pizza Sauce","Sucuk","Mushrooms","Olives","Pepper","Corn","Thyme"],"de":["Pizza-Sauce","Sucuk","Pilze","Oliven","Paprika","Mais","Thymian"],"ru":["Соус для пиццы","Суджук","Грибы","Оливки","Перец","Кукуруза","Тимьян"],"fr":["Sauce Pizza","Sucuk","Champignons","Olives","Poivron","Maïs","Thym"],"ar":["صلصة البيتزا","سوجق","فطر","زيتون","فلفل","ذرة","زعتر"]},"options":[{"id":"o29","label":{"tr":"Small (1 Kişilik)","en":"Small (1 Person)","de":"Klein (1 Person)","ru":"Маленькая (1 человек)","fr":"Petit (1 personne)","ar":"صغير (شخص واحد)"},"price":0},{"id":"o30","label":{"tr":"Medium (1-2 Kişilik)","en":"Medium (1-2 People)","de":"Mittel (1-2 Personen)","ru":"Средняя (1-2 человека)","fr":"Moyen (1-2 personnes)","ar":"متوسط (1-2 أشخاص)"},"price":60},{"id":"o31","label":{"tr":"Large (2-3 Kişilik)","en":"Large (2-3 People)","de":"Groß (2-3 Personen)","ru":"Большая (2-3 человека)","fr":"Grand (2-3 personnes)","ar":"كبير (2-3 أشخاص)"},"price":120},{"id":"o32","label":{"tr":"XLarge (3-4 Kişilik)","en":"XLarge (3-4 People)","de":"Extra Groß (3-4 Personen)","ru":"Очень большая (3-4 человека)","fr":"Très grand (3-4 personnes)","ar":"كبير جداً (3-4 أشخاص)"},"price":180}]},{"id":"p9","name":{"tr":"Diavola Yicem","en":"Diavola Yicem","de":"Diavola Yicem","ru":"Диавола Йицем","fr":"Diavola Yicem","ar":"ديافولا يجم"},"price":240,"description":{"tr":"Mozarella, Pizza Sosu, Salam, Acı Sos, Mantar, Domates, Kekik","en":"Mozzarella, Pizza Sauce, Salami, Hot Sauce, Mushrooms, Tomatoes, Thyme","de":"Mozzarella, Pizza-Sauce, Salami, Scharfe Sauce, Pilze, Tomaten, Thymian","ru":"Моцарелла, Соус для пиццы, Салами, Острый соус, Грибы, Помидоры, Тимьян","fr":"Mozzarella, Sauce Pizza, Salami, Sauce Piquante, Champignons, Tomates, Thym","ar":"موزاريلا، صلصة البيتزا، سلامي، صلصة حارة، فطر، طماطم، زعتر"},"contents":{"tr":["Pizza Sosu","Salam","Acı Sos","Mantar","Domates","Kekik"],"en":["Pizza Sauce","Salami","Hot Sauce","Mushrooms","Tomatoes","Thyme"],"de":["Pizza-Sauce","Salami","Scharfe Sauce","Pilze","Tomaten","Thymian"],"ru":["Соус для пиццы","Салами","Острый соус","Грибы","Помидоры","Тимьян"],"fr":["Sauce Pizza","Salami","Sauce Piquante","Champignons","Tomates","Thym"],"ar":["صلصة البيتزا","سلامي","صلصة حارة","فطر","طماطم","زعتر"]},"options":[{"id":"o33","label":{"tr":"Small (1 Kişilik)","en":"Small (1 Person)","de":"Klein (1 Person)","ru":"Маленькая (1 человек)","fr":"Petit (1 personne)","ar":"صغير (شخص واحد)"},"price":0},{"id":"o34","label":{"tr":"Medium (1-2 Kişilik)","en":"Medium (1-2 People)","de":"Mittel (1-2 Personen)","ru":"Средняя (1-2 человека)","fr":"Moyen (1-2 personnes)","ar":"متوسط (1-2 أشخاص)"},"price":60},{"id":"o35","label":{"tr":"Large (2-3 Kişilik)","en":"Large (2-3 People)","de":"Groß (2-3 Personen)","ru":"Большая (2-3 человека)","fr":"Grand (2-3 personnes)","ar":"كبير (2-3 أشخاص)"},"price":120},{"id":"o36","label":{"tr":"XLarge (3-4 Kişilik)","en":"XLarge (3-4 People)","de":"Extra Groß (3-4 Personen)","ru":"Очень большая (3-4 человека)","fr":"Très grand (3-4 personnes)","ar":"كبير جداً (3-4 أشخاص)"},"price":180}]},{"id":"p10","name":{"tr":"Klasik Vejeteryan","en":"Classic Vegetarian","de":"Klassisch Vegetarisch","ru":"Классический Вегетарианский","fr":"Végétarien Classique","ar":"نباتي كلاسيكي"},"price":240,"description":{"tr":"Mozarella, Pizza Sosu, Mantar, Mısır, Biber, Zeytin, Cherry Domates","en":"Mozzarella, Pizza Sauce, Mushrooms, Corn, Pepper, Olives, Cherry Tomatoes","de":"Mozzarella, Pizza-Sauce, Pilze, Mais, Paprika, Oliven, Kirschtomaten","ru":"Моцарелла, Соус для пиццы, Грибы, Кукуруза, Перец, Оливки, Черри помидоры","fr":"Mozzarella, Sauce Pizza, Champignons, Maïs, Poivron, Olives, Tomates Cerises","ar":"موزاريلا، صلصة البيتزا، فطر، ذرة، فلفل، زيتون، طماطم كرزية"},"contents":{"tr":["Pizza Sosu","Mantar","Mısır","Biber","Zeytin","Cherry Domates"],"en":["Pizza Sauce","Mushrooms","Corn","Pepper","Olives","Cherry Tomatoes"],"de":["Pizza-Sauce","Pilze","Mais","Paprika","Oliven","Kirschtomaten"],"ru":["Соус для пиццы","Грибы","Кукуруза","Перец","Оливки","Черри помидоры"],"fr":["Sauce Pizza","Champignons","Maïs","Poivron","Olives","Tomates Cerises"],"ar":["صلصة البيتزا","فطر","ذرة","فلفل","زيتون","طماطم كرزية"]},"options":[{"id":"o37","label":{"tr":"Small (1 Kişilik)","en":"Small (1 Person)","de":"Klein (1 Person)","ru":"Маленькая (1 человек)","fr":"Petit (1 personne)","ar":"صغير (شخص واحد)"},"price":0},{"id":"o38","label":{"tr":"Medium (1-2 Kişilik)","en":"Medium (1-2 People)","de":"Mittel (1-2 Personen)","ru":"Средняя (1-2 человека)","fr":"Moyen (1-2 personnes)","ar":"متوسط (1-2 أشخاص)"},"price":60},{"id":"o39","label":{"tr":"Large (2-3 Kişilik)","en":"Large (2-3 People)","de":"Groß (2-3 Personen)","ru":"Большая (2-3 человека)","fr":"Grand (2-3 personnes)","ar":"كبير (2-3 أشخاص)"},"price":120},{"id":"o40","label":{"tr":"XLarge (3-4 Kişilik)","en":"XLarge (3-4 People)","de":"Extra Groß (3-4 Personen)","ru":"Очень большая (3-4 человека)","fr":"Très grand (3-4 personnes)","ar":"كبير جداً (3-4 أشخاص)"},"price":180}]},{"id":"p11","name":{"tr":"4 Peynirli Yicem","en":"4 Cheese Yicem","de":"4-Käse Yicem","ru":"Йицем с 4 сырами","fr":"Yicem aux 4 Fromages","ar":"يجم بـ4 أجبان"},"price":300,"description":{"tr":"Mozarella, Pizza Sosu, Ezine, Taze Kaşar, Bergama Tulumu, Fesleğen, Cherry Domates","en":"Mozzarella, Pizza Sauce, Ezine, Fresh Cheddar, Bergama Tulum, Basil, Cherry Tomatoes","de":"Mozzarella, Pizza-Sauce, Ezine, Frischer Cheddar, Bergama Tulum, Basilikum, Kirschtomaten","ru":"Моцарелла, Соус для пиццы, Эзине, Свежий Чеддер, Бергама Туллум, Базилик, Черри помидоры","fr":"Mozzarella, Sauce Pizza, Ezine, Cheddar Frais, Bergama Tulum, Basilic, Tomates Cerises","ar":"موزاريلا، صلصة البيتزا، إزينه، شيدر طازج، برغاما تولوم، ريحان، طماطم كرزية"},"contents":{"tr":["Pizza Sosu","Ezine","Taze Kaşar","Bergama Tulumu","Fesleğen","Cherry Domates"],"en":["Pizza Sauce","Ezine","Fresh Cheddar","Bergama Tulum","Basil","Cherry Tomatoes"],"de":["Pizza-Sauce","Ezine","Frischer Cheddar","Bergama Tulum","Basilikum","Kirschtomaten"],"ru":["Соус для пиццы","Эзине","Свежий Чеддер","Бергама Туллум","Базилик","Черри помидоры"],"fr":["Sauce Pizza","Ezine","Cheddar Frais","Bergama Tulum","Basilic","Tomates Cerises"],"ar":["صلصة البيتزا","إزينه","شيدر طازج","برغاما تولوم","ريحان","طماطم كرزية"]},"options":[{"id":"o41","label":{"tr":"Small (1 Kişilik)","en":"Small (1 Person)","de":"Klein (1 Person)","ru":"Маленькая (1 человек)","fr":"Petit (1 personne)","ar":"صغير (شخص واحد)"},"price":0},{"id":"o42","label":{"tr":"Medium (1-2 Kişilik)","en":"Medium (1-2 People)","de":"Mittel (1-2 Personen)","ru":"Средняя (1-2 человека)","fr":"Moyen (1-2 personnes)","ar":"متوسط (1-2 أشخاص)"},"price":60},{"id":"o43","label":{"tr":"Large (2-3 Kişilik)","en":"Large (2-3 People)","de":"Groß (2-3 Personen)","ru":"Большая (2-3 человека)","fr":"Grand (2-3 personnes)","ar":"كبير (2-3 أشخاص)"},"price":120},{"id":"o44","label":{"tr":"XLarge (3-4 Kişilik)","en":"XLarge (3-4 People)","de":"Extra Groß (3-4 Personen)","ru":"Очень большая (3-4 человека)","fr":"Très grand (3-4 personnes)","ar":"كبير جداً (3-4 أشخاص)"},"price":180}]},{"id":"p12","name":{"tr":"Ispanak + Tulum Yicem","en":"Spinach + Tulum Yicem","de":"Spinat + Tulum Yicem","ru":"Йицем со шпинатом и тулумом","fr":"Yicem aux Épinards + Tulum","ar":"يجم بالسبانخ وتولوم"},"price":250,"description":{"tr":"Mozarella, Pizza Sosu, Bergama Tulumu, Taze Ispanak, Ceviz, Zeytin, Cherry Domates","en":"Mozzarella, Pizza Sauce, Bergama Tulum, Fresh Spinach, Walnuts, Olives, Cherry Tomatoes","de":"Mozzarella, Pizza-Sauce, Bergama Tulum, Frischer Spinat, Walnüsse, Oliven, Kirschtomaten","ru":"Моцарелла, Соус для пиццы, Бергама Туллум, Свежий шпинат, Грецкие орехи, Оливки, Черри помидоры","fr":"Mozzarella, Sauce Pizza, Bergama Tulum, Épinards Frais, Noix, Olives, Tomates Cerises","ar":"موزاريلا، صلصة البيتزا، برغاما تولوم، سبانخ طازج، جوز، زيتون، طماطم كرزية"},"contents":{"tr":["Pizza Sosu","Bergama Tulumu","Taze Ispanak","Ceviz","Zeytin","Cherry Domates"],"en":["Pizza Sauce","Bergama Tulum","Fresh Spinach","Walnuts","Olives","Cherry Tomatoes"],"de":["Pizza-Sauce","Bergama Tulum","Frischer Spinat","Walnüsse","Oliven","Kirschtomaten"],"ru":["Соус для пиццы","Бергама Туллум","Свежий шпинат","Грецкие орехи","Оливки","Черри помидоры"],"fr":["Sauce Pizza","Bergama Tulum","Épinards Frais","Noix","Olives","Tomates Cerises"],"ar":["صلصة البيتزا","برغاما تولوم","سبانخ طازج","جوز","زيتون","طماطم كرزية"]},"options":[{"id":"o45","label":{"tr":"Small (1 Kişilik)","en":"Small (1 Person)","de":"Klein (1 Person)","ru":"Маленькая (1 человек)","fr":"Petit (1 personne)","ar":"صغير (شخص واحد)"},"price":0},{"id":"o46","label":{"tr":"Medium (1-2 Kişilik)","en":"Medium (1-2 People)","de":"Mittel (1-2 Personen)","ru":"Средняя (1-2 человека)","fr":"Moyen (1-2 personnes)","ar":"متوسط (1-2 أشخاص)"},"price":60},{"id":"o47","label":{"tr":"Large (2-3 Kişilik)","en":"Large (2-3 People)","de":"Groß (2-3 Personen)","ru":"Большая (2-3 человека)","fr":"Grand (2-3 personnes)","ar":"كبير (2-3 أشخاص)"},"price":120},{"id":"o48","label":{"tr":"XLarge (3-4 Kişilik)","en":"XLarge (3-4 People)","de":"Extra Groß (3-4 Personen)","ru":"Очень большая (3-4 человека)","fr":"Très grand (3-4 personnes)","ar":"كبير جداً (3-4 أشخاص)"},"price":180}]},{"id":"p13","name":{"tr":"Brokoli Peynir Yicem","en":"Broccoli Cheese Yicem","de":"Brokkoli-Käse Yicem","ru":"Йицем с брокколи и сыром","fr":"Yicem au Brocoli et Fromage","ar":"يجم بالبروكلي والجبن"},"price":250,"description":{"tr":"Mozarella, Pizza Sosu, Beyaz Peynir, Brokoli, Zeytin, Domates","en":"Mozzarella, Pizza Sauce, White Cheese, Broccoli, Olives, Tomatoes","de":"Mozzarella, Pizza-Sauce, Weißer Käse, Brokkoli, Oliven, Tomaten","ru":"Моцарелла, Соус для пиццы, Белый сыр, Брокколи, Оливки, Помидоры","fr":"Mozzarella, Sauce Pizza, Fromage Blanc, Brocoli, Olives, Tomates","ar":"موزاريلا، صلصة البيتزا، جبن أبيض، بروكلي، زيتون، طماطم"},"contents":{"tr":["Pizza Sosu","Beyaz Peynir","Brokoli","Zeytin","Domates"],"en":["Pizza Sauce","White Cheese","Broccoli","Olives","Tomatoes"],"de":["Pizza-Sauce","Weißer Käse","Brokkoli","Oliven","Tomaten"],"ru":["Соус для пиццы","Белый сыр","Брокколи","Оливки","Помидоры"],"fr":["Sauce Pizza","Fromage Blanc","Brocoli","Olives","Tomates"],"ar":["صلصة البيتزا","جبن أبيض","بروكلي","زيتون","طماطم"]},"options":[{"id":"o49","label":{"tr":"Small (1 Kişilik)","en":"Small (1 Person)","de":"Klein (1 Person)","ru":"Маленькая (1 человек)","fr":"Petit (1 personne)","ar":"صغير (شخص واحد)"},"price":0},{"id":"o50","label":{"tr":"Medium (1-2 Kişilik)","en":"Medium (1-2 People)","de":"Mittel (1-2 Personen)","ru":"Средняя (1-2 человека)","fr":"Moyen (1-2 personnes)","ar":"متوسط (1-2 أشخاص)"},"price":60},{"id":"o51","label":{"tr":"Large (2-3 Kişilik)","en":"Large (2-3 People)","de":"Groß (2-3 Personen)","ru":"Большая (2-3 человека)","fr":"Grand (2-3 personnes)","ar":"كبير (2-3 أشخاص)"},"price":120},{"id":"o52","label":{"tr":"XLarge (3-4 Kişilik)","en":"XLarge (3-4 People)","de":"Extra Groß (3-4 Personen)","ru":"Очень большая (3-4 человека)","fr":"Très grand (3-4 personnes)","ar":"كبير جداً (3-4 أشخاص)"},"price":180}]}]},{"id":"toast","name":{"tr":"Ayvalık Tostu","en":"Ayvalık Toast","de":"Ayvalık-Toast","ru":"Тост Айвалык","fr":"Toast Ayvalık","ar":"خبز محمص أيفاليك"},"products":[{"id":"t1","name":{"tr":"Yicem Yengen","en":"Yicem Yengen","de":"Yicem Yengen","ru":"Йицем Йенген","fr":"Yicem Yengen","ar":"يجم ينغن"},"price":170,"description":{"tr":"Sosis, Sucuk, Kaşar, Turşu, Ketçap, Mayonez","en":"Sausage, Sucuk, Cheddar, Pickles, Ketchup, Mayonnaise","de":"Wurst, Sucuk, Cheddar, Essiggurken, Ketchup, Mayonnaise","ru":"Колбаса, Суджук, Чеддер, Маринованные огурцы, Кетчуп, Майонез","fr":"Saucisse, Sucuk, Cheddar, Cornichons, Ketchup, Mayonnaise","ar":"سجق، سوجق، شيدر، مخلل، كاتشب، مايونيز"},"contents":{"tr":["Sosis","Sucuk","Kaşar","Turşu","Ketçap","Mayonez"],"en":["Sausage","Sucuk","Cheddar","Pickles","Ketchup","Mayonnaise"],"de":["Wurst","Sucuk","Cheddar","Essiggurken","Ketchup","Mayonnaise"],"ru":["Колбаса","Суджук","Чеддер","Маринованные огурцы","Кетчуп","Майонез"],"fr":["Saucisse","Sucuk","Cheddar","Cornichons","Ketchup","Mayonnaise"],"ar":["سجق","سوجق","شيدر","مخلل","كاتشب","مايونيز"]},"options":[{"id":"t1_o1","label":{"tr":"Sade Tost","en":"Plain Toast","de":"Einfacher Toast","ru":"Обычный тост","fr":"Toast Simple","ar":"خبز محمص عادي"},"price":0},{"id":"t1_o2","label":{"tr":"Menü (Cips + İçecek)","en":"Menu (Chips + Drink)","de":"Menü (Chips + Getränk)","ru":"Меню (Чипсы + Напиток)","fr":"Menu (Chips + Boisson)","ar":"قائمة (رقائق + مشروب)"},"price":80}]},{"id":"t2","name":{"tr":"Yicem Karışık","en":"Yicem Mixed","de":"Yicem Gemischt","ru":"Йицем Смешанный","fr":"Yicem Mélangé","ar":"يجم مختلط"},"price":170,"description":{"tr":"Kaşar, Sucuk, Salam, Sosis, Turşu, Domates, Rus Salatası, Ketçap, Mayonez","en":"Cheddar, Sucuk, Salami, Sausage, Pickles, Tomatoes, Russian Salad, Ketchup, Mayonnaise","de":"Cheddar, Sucuk, Salami, Wurst, Essiggurken, Tomaten, Russischer Salat, Ketchup, Mayonnaise","ru":"Чеддер, Суджук, Салами, Колбаса, Маринованные огурцы, Помидоры, Русский салат, Кетчуп, Майонез","fr":"Cheddar, Sucuk, Salami, Saucisse, Cornichons, Tomates, Salade Russe, Ketchup, Mayonnaise","ar":"شيدر، سوجق، سلامي، سجق، مخلل، طماطم، سلطة روسية، كاتشب، مايونيز"},"contents":{"tr":["Kaşar","Sucuk","Salam","Sosis","Turşu","Domates","Rus Salatası","Ketçap","Mayonez"],"en":["Cheddar","Sucuk","Salami","Sausage","Pickles","Tomatoes","Russian Salad","Ketchup","Mayonnaise"],"de":["Cheddar","Sucuk","Salami","Wurst","Essiggurken","Tomaten","Russischer Salat","Ketchup","Mayonnaise"],"ru":["Чеддер","Суджук","Салами","Колбаса","Маринованные огурцы","Помидоры","Русский салат","Кетчуп","Майонез"],"fr":["Cheddar","Sucuk","Salami","Saucisse","Cornichons","Tomates","Salade Russe","Ketchup","Mayonnaise"],"ar":["شيدر","سوجق","سلامي","سجق","مخلل","طماطم","سلطة روسية","كاتشب","مايونيز"]},"options":[{"id":"t2_o1","label":{"tr":"Sade Tost","en":"Plain Toast","de":"Einfacher Toast","ru":"Обычный тост","fr":"Toast Simple","ar":"خبز محمص عادي"},"price":0},{"id":"t2_o2","label":{"tr":"Menü (Cips + İçecek)","en":"Menu (Chips + Drink)","de":"Menü (Chips + Getränk)","ru":"Меню (Чипсы + Напиток)","fr":"Menu (Chips + Boisson)","ar":"قائمة (رقائق + مشروب)"},"price":80}]},{"id":"t3","name":{"tr":"Yicem Mega Karışık","en":"Yicem Mega Mixed","de":"Yicem Mega Gemischt","ru":"Йицем Мега Смешанный","fr":"Yicem Mega Mélangé","ar":"يجم ميجا مختلط"},"price":190,"description":{"tr":"Kaşar, Sucuk, Salam, Sosis, Jambon, Turşu, Domates, Rus Salatası, Ketçap, Mayonez","en":"Cheddar, Sucuk, Salami, Sausage, Ham, Pickles, Tomatoes, Russian Salad, Ketchup, Mayonnaise","de":"Cheddar, Sucuk, Salami, Wurst, Schinken, Essiggurken, Tomaten, Russischer Salat, Ketchup, Mayonnaise","ru":"Чеддер, Суджук, Салами, Колбаса, Ветчина, Маринованные огурцы, Помидоры, Русский салат, Кетчуп, Майонез","fr":"Cheddar, Sucuk, Salami, Saucisse, Jambon, Cornichons, Tomates, Salade Russe, Ketchup, Mayonnaise","ar":"شيدر، سوجق، سلامي، سجق، لحم خنزير، مخلل، طماطم، سلطة روسية، كاتشب، مايونيز"},"contents":{"tr":["Kaşar","Sucuk","Salam","Sosis","Jambon","Turşu","Domates","Rus Salatası","Ketçap","Mayonez"],"en":["Cheddar","Sucuk","Salami","Sausage","Ham","Pickles","Tomatoes","Russian Salad","Ketchup","Mayonnaise"],"de":["Cheddar","Sucuk","Salami","Wurst","Schinken","Essiggurken","Tomaten","Russischer Salat","Ketchup","Mayonnaise"],"ru":["Чеддер","Суджук","Салами","Колбаса","Ветчина","Маринованные огурцы","Помидоры","Русский салат","Кетчуп","Майонез"],"fr":["Cheddar","Sucuk","Salami","Saucisse","Jambon","Cornichons","Tomates","Salade Russe","Ketchup","Mayonnaise"],"ar":["شيدر","سوجق","سلامي","سجق","لحم خنزير","مخلل","طماطم","سلطة روسية","كاتشب","مايونيز"]},"options":[{"id":"t3_o1","label":{"tr":"Sade Tost","en":"Plain Toast","de":"Einfacher Toast","ru":"Обычный тост","fr":"Toast Simple","ar":"خبز محمص عادي"},"price":0},{"id":"t3_o2","label":{"tr":"Menü (Cips + İçecek)","en":"Menu (Chips + Drink)","de":"Menü (Chips + Getränk)","ru":"Меню (Чипсы + Напиток)","fr":"Menu (Chips + Boisson)","ar":"قائمة (رقائق + مشروب)"},"price":80}]},{"id":"t4","name":{"tr":"Yicem Süper Karışık","en":"Yicem Super Mixed","de":"Yicem Super Gemischt","ru":"Йицем Супер Смешанный","fr":"Yicem Super Mélangé","ar":"يجم سوبر مختلط"},"price":220,"description":{"tr":"Çift Katlı Ekmek, Kaşar, Sucuk, Salam, Sosis, Turşu, Domates, Rus Salatası, Ketçap, Mayonez","en":"Double Layer Bread, Cheddar, Sucuk, Salami, Sausage, Pickles, Tomatoes, Russian Salad, Ketchup, Mayonnaise","de":"Doppelschichtiges Brot, Cheddar, Sucuk, Salami, Wurst, Essiggurken, Tomaten, Russischer Salat, Ketchup, Mayonnaise","ru":"Двухслойный хлеб, Чеддер, Суджук, Салами, Колбаса, Маринованные огурцы, Помидоры, Русский салат, Кетчуп, Майонез","fr":"Pain Double Couche, Cheddar, Sucuk, Salami, Saucisse, Cornichons, Tomates, Salade Russe, Ketchup, Mayonnaise","ar":"خبز مزدوج الطبقات، شيدر، سوجق، سلامي، سجق، مخلل، طماطم، سلطة روسية، كاتشب، مايونيز"},"contents":{"tr":["Çift Katlı Ekmek","Kaşar","Sucuk","Salam","Sosis","Turşu","Domates","Rus Salatası","Ketçap","Mayonez"],"en":["Double Layer Bread","Cheddar","Sucuk","Salami","Sausage","Pickles","Tomatoes","Russian Salad","Ketchup","Mayonnaise"],"de":["Doppelschichtiges Brot","Cheddar","Sucuk","Salami","Wurst","Essiggurken","Tomaten","Russischer Salat","Ketchup","Mayonnaise"],"ru":["Двухслойный хлеб","Чеддер","Суджук","Салами","Колбаса","Маринованные огурцы","Помидоры","Русский салат","Кетчуп","Майонез"],"fr":["Pain Double Couche","Cheddar","Sucuk","Salami","Saucisse","Cornichons","Tomates","Salade Russe","Ketchup","Mayonnaise"],"ar":["خبز مزدوج الطبقات","شيدر","سوجق","سلامي","سجق","مخلل","طماطم","سلطة روسية","كاتشب","مايونيز"]},"options":[{"id":"t4_o1","label":{"tr":"Sade Tost","en":"Plain Toast","de":"Einfacher Toast","ru":"Обычный тост","fr":"Toast Simple","ar":"خبز محمص عادي"},"price":0},{"id":"t4_o2","label":{"tr":"Menü (Cips + İçecek)","en":"Menu (Chips + Drink)","de":"Menü (Chips + Getränk)","ru":"Меню (Чипсы + Напиток)","fr":"Menu (Chips + Boisson)","ar":"قائمة (رقائق + مشروب)"},"price":80}]},{"id":"t5","name":{"tr":"Yicem Kavurma Kaşarlı","en":"Yicem Beef Stew with Cheese","de":"Yicem Rindfleischeintopf mit Käse","ru":"Йицем Тушеная говядина с сыром","fr":"Yicem Ragoût de Bœuf au Fromage","ar":"يجم لحم مطبوخ بالجبن"},"price":210,"description":{"tr":"Kaşar, Kavurma (70gr), Turşu, Domates","en":"Cheddar, Beef Stew (70gr), Pickles, Tomatoes","de":"Cheddar, Rindfleisch-Eintopf (70gr), Essiggurken, Tomaten","ru":"Чеддер, Тушеная говядина (70гр), Маринованные огурцы, Помидоры","fr":"Cheddar, Ragoût de Bœuf (70g), Cornichons, Tomates","ar":"شيدر, لحم مطبوخ (70غ), مخلل, طماطم"},"contents":{"tr":["Kaşar","Kavurma (70gr)","Turşu","Domates"],"en":["Cheddar","Beef Stew (70gr)","Pickles","Tomatoes"],"de":["Cheddar","Rindfleisch-Eintopf (70gr)","Essiggurken","Tomaten"],"ru":["Чеддер","Тушеная говядина (70гр)","Маринованные огурцы","Помидоры"],"fr":["Cheddar","Ragoût de Bœuf (70g)","Cornichons","Tomates"],"ar":["شيدر","لحم مطبوخ (70غ)","مخلل","طماطم"]},"options":[{"id":"t5_o1","label":{"tr":"Sade Tost","en":"Plain Toast","de":"Einfacher Toast","ru":"Обычный тост","fr":"Toast Simple","ar":"خبز محمص عادي"},"price":0},{"id":"t5_o2","label":{"tr":"Menü (Cips + İçecek)","en":"Menu (Chips + Drink)","de":"Menü (Chips + Getränk)","ru":"Меню (Чипсы + Напиток)","fr":"Menu (Chips + Boisson)","ar":"قائمة (رقائق + مشروب)"},"price":80}]},{"id":"t6","name":{"tr":"Yicem Dönerli","en":"Yicem with Doner","de":"Döner Yicem","ru":"Йицем с донером","fr":"Yicem au Döner","ar":"يجم بالدونر"},"price":300,"description":{"tr":"Kaşar, Et Döner (100gr), Marul, Turşu, Domates (İsteğe Bağlı Ketçap Mayonez)","en":"Cheddar, Beef Doner (100gr), Lettuce, Pickles, Tomatoes (Optional Ketchup Mayonnaise)","de":"Cheddar, Rindfleisch-Döner  (100g), Lettuce, Essiggurken, Tomaten  (Optional Ketchup Mayonnaise)","ru":"Чеддер, Донер из говядины  (100gr), Lettuce, Маринованные огурцы, Помидоры  (Optional Ketchup Mayonnaise)","fr":"Cheddar, Döner Bœuf  (100g), Lettuce, Cornichons, Tomates  (Optional Ketchup Mayonnaise)","ar":"شيدر, دونر لحم  (100غr), Lettuce, مخلل, طماطم  (Optional Ketchup Mayonnaise)"},"contents":{"tr":["Kaşar","Et Döner (100gr)","Marul","Turşu","Domates"],"en":["Cheddar","Beef Doner (100gr)","Lettuce","Pickles","Tomatoes"],"de":["Cheddar","Rindfleisch-Döner  (100g)","Lettuce","Essiggurken","Tomaten"],"ru":["Чеддер","Донер из говядины  (100gr)","Lettuce","Маринованные огурцы","Помидоры"],"fr":["Cheddar","Döner Bœuf  (100g)","Lettuce","Cornichons","Tomates"],"ar":["شيدر","دونر لحم  (100غr)","Lettuce","مخلل","طماطم"]},"options":[{"id":"t6_o1","label":{"tr":"Sade Tost","en":"Plain Toast","de":"Einfacher Toast","ru":"Обычный тост","fr":"Toast Simple","ar":"خبز محمص عادي"},"price":0},{"id":"t6_o2","label":{"tr":"Menü (Cips + İçecek)","en":"Menu (Chips + Drink)","de":"Menü (Chips + Getränk)","ru":"Меню (Чипсы + Напиток)","fr":"Menu (Chips + Boisson)","ar":"قائمة (رقائق + مشروب)"},"price":80}]},{"id":"t7","name":{"tr":"Yicem Sucuk Kaşarlı","en":"Yicem Sucuk with Cheese","de":"Yicem Sucuk mit Käse","ru":"Йицем Суджук с сыром","fr":"Yicem Sucuk au Fromage","ar":"يجم سوجق بالجبن"},"price":130,"description":{"tr":"Kaşar, Sucuk, Turşu, Domates (İsteğe Bağlı Ketçap Mayonez)","en":"Cheddar, Sucuk, Pickles, Tomatoes (Optional Ketchup Mayonnaise)","de":"Cheddar, Sucuk, Essiggurken, Tomaten  (Optional Ketchup Mayonnaise)","ru":"Чеддер, Суджук, Маринованные огурцы, Помидоры  (Optional Ketchup Mayonnaise)","fr":"Cheddar, Sucuk, Cornichons, Tomates  (Optional Ketchup Mayonnaise)","ar":"شيدر, سوجق, مخلل, طماطم  (Optional Ketchup Mayonnaise)"},"contents":{"tr":["Kaşar","Sucuk","Turşu","Domates"],"en":["Cheddar","Sucuk","Pickles","Tomatoes"],"de":["Cheddar","Sucuk","Essiggurken","Tomaten"],"ru":["Чеддер","Суджук","Маринованные огурцы","Помидоры"],"fr":["Cheddar","Sucuk","Cornichons","Tomates"],"ar":["شيدر","سوجق","مخلل","طماطم"]},"options":[{"id":"t7_o1","label":{"tr":"Sade Tost","en":"Plain Toast","de":"Einfacher Toast","ru":"Обычный тост","fr":"Toast Simple","ar":"خبز محمص عادي"},"price":0},{"id":"t7_o2","label":{"tr":"Menü (Cips + İçecek)","en":"Menu (Chips + Drink)","de":"Menü (Chips + Getränk)","ru":"Меню (Чипсы + Напиток)","fr":"Menu (Chips + Boisson)","ar":"قائمة (رقائق + مشروب)"},"price":80}]},{"id":"t8","name":{"tr":"Yicem Schnitzel","en":"Yicem Schnitzel","de":"Yicem Schnitzel","ru":"Yicem Schnitzel","fr":"Yicem Schnitzel","ar":"Yicem Schnitzel"},"price":130,"description":{"tr":"Schnitzel, Marul, Turşu, Domates (İsteğe Bağlı Ketçap Mayonez)","en":"Schnitzel, Lettuce, Pickles, Tomatoes (Optional Ketchup Mayonnaise)","de":"Schnitzel, Lettuce, Essiggurken, Tomaten  (Optional Ketchup Mayonnaise)","ru":"Schnitzel, Lettuce, Маринованные огурцы, Помидоры  (Optional Ketchup Mayonnaise)","fr":"Schnitzel, Lettuce, Cornichons, Tomates  (Optional Ketchup Mayonnaise)","ar":"Schnitzel, Lettuce, مخلل, طماطم  (Optional Ketchup Mayonnaise)"},"contents":{"tr":["Schnitzel","Marul","Turşu","Domates"],"en":["Schnitzel","Lettuce","Pickles","Tomatoes"],"de":["Schnitzel","Lettuce","Essiggurken","Tomaten"],"ru":["Schnitzel","Lettuce","Маринованные огурцы","Помидоры"],"fr":["Schnitzel","Lettuce","Cornichons","Tomates"],"ar":["Schnitzel","Lettuce","مخلل","طماطم"]},"options":[{"id":"t8_o1","label":{"tr":"Sade Tost","en":"Plain Toast","de":"Einfacher Toast","ru":"Обычный тост","fr":"Toast Simple","ar":"خبز محمص عادي"},"price":0},{"id":"t8_o2","label":{"tr":"Menü (Cips + İçecek)","en":"Menu (Chips + Drink)","de":"Menü (Chips + Getränk)","ru":"Меню (Чипсы + Напиток)","fr":"Menu (Chips + Boisson)","ar":"قائمة (رقائق + مشروب)"},"price":80}]},{"id":"t9","name":{"tr":"Yicem Salam Kaşarlı","en":"Yicem Salami with Cheese","de":"Yicem Salami mit Käse","ru":"Йицем Салами с сыром","fr":"Yicem Salami au Fromage","ar":"يجم سلامي بالجبن"},"price":130,"description":{"tr":"Salam, Kaşar, Turşu, Domates (İsteğe Bağlı Ketçap Mayonez)","en":"Salami, Cheddar, Pickles, Tomatoes (Optional Ketchup Mayonnaise)","de":"Salami, Cheddar, Essiggurken, Tomaten  (Optional Ketchup Mayonnaise)","ru":"Салами, Чеддер, Маринованные огурцы, Помидоры  (Optional Ketchup Mayonnaise)","fr":"Salami, Cheddar, Cornichons, Tomates  (Optional Ketchup Mayonnaise)","ar":"سلامي, شيدر, مخلل, طماطم  (Optional Ketchup Mayonnaise)"},"contents":{"tr":["Salam","Kaşar","Turşu","Domates"],"en":["Salami","Cheddar","Pickles","Tomatoes"],"de":["Salami","Cheddar","Essiggurken","Tomaten"],"ru":["Салами","Чеддер","Маринованные огурцы","Помидоры"],"fr":["Salami","Cheddar","Cornichons","Tomates"],"ar":["سلامي","شيدر","مخلل","طماطم"]},"options":[{"id":"t9_o1","label":{"tr":"Sade Tost","en":"Plain Toast","de":"Einfacher Toast","ru":"Обычный тост","fr":"Toast Simple","ar":"خبز محمص عادي"},"price":0},{"id":"t9_o2","label":{"tr":"Menü (Cips + İçecek)","en":"Menu (Chips + Drink)","de":"Menü (Chips + Getränk)","ru":"Меню (Чипсы + Напиток)","fr":"Menu (Chips + Boisson)","ar":"قائمة (رقائق + مشروب)"},"price":80}]},{"id":"t10","name":{"tr":"Yicem Jambon Kaşarlı","en":"Yicem Cheddar Ham","de":"Yicem Cheddar Ham","ru":"Yicem Cheddar Ham","fr":"Yicem Cheddar Ham","ar":"Yicem Cheddar Ham"},"price":130,"description":{"tr":"Kaşar, Jambon, Turşu, Domates (İsteğe Bağlı Ketçap Mayonez)","en":"Cheddar, Ham, Pickles, Tomatoes (Optional Ketchup Mayonnaise)","de":"Cheddar, Schinken, Essiggurken, Tomaten  (Optional Ketchup Mayonnaise)","ru":"Чеддер, Ветчина, Маринованные огурцы, Помидоры  (Optional Ketchup Mayonnaise)","fr":"Cheddar, Jambon, Cornichons, Tomates  (Optional Ketchup Mayonnaise)","ar":"شيدر, لحم خنزير, مخلل, طماطم  (Optional Ketchup Mayonnaise)"},"contents":{"tr":["Kaşar","Jambon","Turşu","Domates"],"en":["Cheddar","Ham","Pickles","Tomatoes"],"de":["Cheddar","Schinken","Essiggurken","Tomaten"],"ru":["Чеддер","Ветчина","Маринованные огурцы","Помидоры"],"fr":["Cheddar","Jambon","Cornichons","Tomates"],"ar":["شيدر","لحم خنزير","مخلل","طماطم"]},"options":[{"id":"t10_o1","label":{"tr":"Sade Tost","en":"Plain Toast","de":"Einfacher Toast","ru":"Обычный тост","fr":"Toast Simple","ar":"خبز محمص عادي"},"price":0},{"id":"t10_o2","label":{"tr":"Menü (Cips + İçecek)","en":"Menu (Chips + Drink)","de":"Menü (Chips + Getränk)","ru":"Меню (Чипсы + Напиток)","fr":"Menu (Chips + Boisson)","ar":"قائمة (رقائق + مشروب)"},"price":80}]},{"id":"t11","name":{"tr":"Yicem Tulum veya Ezine Peynir","en":"Yicem Tulum or Ezine Cheese","de":"Yicem Tulum oder Ezine Käse","ru":"Йицем Тулум или Сыр Эзине","fr":"Yicem Tulum ou Fromage Ezine","ar":"يجم تولوم أو جبن إزينه"},"price":150,"description":{"tr":"İsteğe Bağlı; Tulum veya Ezine Peyniri, Siyah Zeytin, Ceviz, Domates, Yeşil Biber, Kekik","en":"Optional; Cheddar or White Cheese, Black Olives, Walnuts, Tomatoes, Green Pepper, Thyme","de":"Optional; Cheddar or White Cheese, Black Olives, Walnüsse, Tomaten, Green Pepper, Thymian","ru":"Optional; Cheddar or White Cheese, Black Olives, Грецкие орехи, Помидоры, Green Pepper, Тимьян","fr":"Optional; Cheddar or White Cheese, Black Olives, Noix, Tomates, Green Pepper, Thym","ar":"Optional; Cheddar or White Cheese, Black Olives, جوز, طماطم, Green Pepper, زعتر"},"contents":{"tr":["Tulum veya Ezine Peyniri","Siyah Zeytin","Ceviz","Domates","Yeşil Biber","Kekik"],"en":["Cheddar or White Cheese","Black Olives","Walnuts","Tomatoes","Green Pepper","Thyme"],"de":["Cheddar or White Cheese","Black Olives","Walnüsse","Tomaten","Green Pepper","Thymian"],"ru":["Cheddar or White Cheese","Black Olives","Грецкие орехи","Помидоры","Green Pepper","Тимьян"],"fr":["Cheddar or White Cheese","Black Olives","Noix","Tomates","Green Pepper","Thym"],"ar":["Cheddar or White Cheese","Black Olives","جوز","طماطم","Green Pepper","زعتر"]},"options":[{"id":"t11_o1","label":{"tr":"Sade Tost","en":"Plain Toast","de":"Einfacher Toast","ru":"Обычный тост","fr":"Toast Simple","ar":"خبز محمص عادي"},"price":0},{"id":"t11_o2","label":{"tr":"Menü (Cips + İçecek)","en":"Menu (Chips + Drink)","de":"Menü (Chips + Getränk)","ru":"Меню (Чипсы + Напиток)","fr":"Menu (Chips + Boisson)","ar":"قائمة (رقائق + مشروب)"},"price":80}]},{"id":"t12","name":{"tr":"Yicem Ev Köfteli","en":"Yicem Homemade Meatball","de":"Yicem Homemade Meatball","ru":"Yicem Homemade Meatball","fr":"Yicem Homemade Meatball","ar":"Yicem Homemade Meatball"},"price":200,"description":{"tr":"Ev Köftesi (120gr), Marul, Turşu, Domates (İsteğe Bağlı Ketçap Mayonez Rus Salatası)","en":"Homemade Meatball (120gr), Lettuce, Pickles, Tomatoes (Optional Ketchup Mayonnaise Russian Salad)","de":"Homemade Meatball  (120g), Lettuce, Essiggurken, Tomaten  (Optional Ketchup Mayonnaise Russian Salad)","ru":"Homemade Meatball  (120gr), Lettuce, Маринованные огурцы, Помидоры  (Optional Ketchup Mayonnaise Russian Salad)","fr":"Homemade Meatball  (120g), Lettuce, Cornichons, Tomates  (Optional Ketchup Mayonnaise Russian Salad)","ar":"Homemade Meatball  (120غr), Lettuce, مخلل, طماطم  (Optional Ketchup Mayonnaise Russian Salad)"},"contents":{"tr":["Ev Köftesi (120gr)","Marul","Turşu","Domates"],"en":["Homemade Meatball (120gr)","Lettuce","Pickles","Tomatoes"],"de":["Homemade Meatball  (120g)","Lettuce","Essiggurken","Tomaten"],"ru":["Homemade Meatball  (120gr)","Lettuce","Маринованные огурцы","Помидоры"],"fr":["Homemade Meatball  (120g)","Lettuce","Cornichons","Tomates"],"ar":["Homemade Meatball  (120غr)","Lettuce","مخلل","طماطم"]},"options":[{"id":"t12_o1","label":{"tr":"Sade Tost","en":"Plain Toast","de":"Einfacher Toast","ru":"Обычный тост","fr":"Toast Simple","ar":"خبز محمص عادي"},"price":0},{"id":"t12_o2","label":{"tr":"Menü (Cips + İçecek)","en":"Menu (Chips + Drink)","de":"Menü (Chips + Getränk)","ru":"Меню (Чипсы + Напиток)","fr":"Menu (Chips + Boisson)","ar":"قائمة (رقائق + مشروب)"},"price":80}]},{"id":"t13","name":{"tr":"Yicem Sanayi Tostu","en":"Yicem Industrial Toast","de":"Yicem Industrial Toast","ru":"Yicem Industrial Toast","fr":"Yicem Industrial Toast","ar":"Yicem Industrial Toast"},"price":130,"description":{"tr":"Taş Fırın Ekmeği, Sucuk, Kaşar, Salça","en":"Stone Oven Bread, Sucuk, Cheddar, Tomato Paste","de":"Stone Oven Bread, Sucuk, Cheddar, Tomato Paste","ru":"Stone Oven Bread, Суджук, Чеддер, Tomato Paste","fr":"Stone Oven Bread, Sucuk, Cheddar, Tomato Paste","ar":"Stone Oven Bread, سوجق, شيدر, Tomato Paste"},"contents":{"tr":["Taş Fırın Ekmeği","Sucuk","Kaşar","Salça"],"en":["Stone Oven Bread","Sucuk","Cheddar","Tomato Paste"],"de":["Stone Oven Bread","Sucuk","Cheddar","Tomato Paste"],"ru":["Stone Oven Bread","Суджук","Чеддер","Tomato Paste"],"fr":["Stone Oven Bread","Sucuk","Cheddar","Tomato Paste"],"ar":["Stone Oven Bread","سوجق","شيدر","Tomato Paste"]},"options":[{"id":"t13_o1","label":{"tr":"Sade Tost","en":"Plain Toast","de":"Einfacher Toast","ru":"Обычный тост","fr":"Toast Simple","ar":"خبز محمص عادي"},"price":0},{"id":"t13_o2","label":{"tr":"Menü (Cips + İçecek)","en":"Menu (Chips + Drink)","de":"Menü (Chips + Getränk)","ru":"Меню (Чипсы + Напиток)","fr":"Menu (Chips + Boisson)","ar":"قائمة (رقائق + مشروب)"},"price":80}]},{"id":"t14","name":{"tr":"Yicem Kaşar veya Beyaz Peynir","en":"Yicem Cheddar or White Cheese","de":"Yicem Cheddar oder Weißkäse","ru":"Йицем Чеддер или Белый Сыр","fr":"Yicem Cheddar ou Fromage Blanc","ar":"يجم شيدر أو جبن أبيض"},"price":100,"description":{"tr":"Kaşar veya Beyaz Peynir, Turşu, Domates","en":"Cheddar or White Cheese, Pickles, Tomatoes","de":"Cheddar oder Weißkäse, Essiggurken, Tomaten","ru":"Чеддер или Белый Сыр, Маринованные огурцы, Помидоры","fr":"Cheddar ou Fromage Blanc, Cornichons, Tomates","ar":"شيدر أو جبن أبيض، مخلل، طماطم"},"contents":{"tr":["Kaşar veya Beyaz Peynir","Turşu","Domates"],"en":["Cheddar or White Cheese","Pickles","Tomatoes"],"de":["Cheddar oder Weißkäse","Essiggurken","Tomaten"],"ru":["Чеддер или Белый Сыр","Маринованные огурцы","Помидоры"],"fr":["Cheddar ou Fromage Blanc","Cornichons","Tomates"],"ar":["شيدر أو جبن أبيض","مخلل","طماطم"]},"options":[{"id":"t14_o1","label":{"tr":"Sade Tost","en":"Plain Toast","de":"Einfacher Toast","ru":"Обычный тост","fr":"Toast Simple","ar":"خبز محمص عادي"},"price":0},{"id":"t14_o2","label":{"tr":"Menü (Cips + İçecek)","en":"Menu (Chips + Drink)","de":"Menü (Chips + Getränk)","ru":"Меню (Чипсы + Напиток)","fr":"Menu (Chips + Boisson)","ar":"قائمة (رقائق + مشروب)"},"price":80}]}]},{"id":"sandwich","name":{"tr":"Soğuk Sandviç","en":"Cold Sandwich","de":"Cold Sandwich","ru":"Cold Sandwich","fr":"Cold Sandwich","ar":"Cold Sandwich"},"products":[{"id":"s1","name":{"tr":"Yicem Soğuk Sandviç","en":"Yicem Cold Sandwich","de":"Yicem Cold Sandwich","ru":"Yicem Cold Sandwich","fr":"Yicem Cold Sandwich","ar":"Yicem Cold Sandwich"},"price":220,"description":{"tr":"2 Ana ürün + 4 Yan ürün seçenekleri ile","en":"Choose 2 main products + 4 side products","de":"Wählen Sie 2 Hauptprodukte + 4 Beilagen","ru":"Выберите 2 основных продукта + 4 гарнира","fr":"Choisissez 2 produits principaux + 4 accompagnements","ar":"اختر منتجين رئيسيين + 4 منتجات جانبية"},"contents":{"tr":[],"en":[],"de":[],"ru":[],"fr":[],"ar":[]},"options":[{"id":"s1_o1","label":{"tr":"Menü (Cips + İçecek)","en":"Menu (Chips + Drink)","de":"Menü (Chips + Getränk)","ru":"Меню (Чипсы + Напиток)","fr":"Menu (Chips + Boisson)","ar":"قائمة (رقائق + مشروب)"},"price":80}],"extras":{"mainProducts":[{"id":"main1","name":{"tr":"Ton Balığı","en":"Tuna Fish","de":"Thunfisch","ru":"Тунец","fr":"Thon","ar":"تونة"}},{"id":"main2","name":{"tr":"Beyaz Peynir","en":"White Cheese","de":"Weißer Käse","ru":"Белый сыр","fr":"Fromage Blanc","ar":"جبن أبيض"}},{"id":"main3","name":{"tr":"Ezine","en":"Ezine Cheese","de":"Ezine Cheese","ru":"Ezine Cheese","fr":"Ezine Cheese","ar":"Ezine Cheese"}},{"id":"main4","name":{"tr":"Salam","en":"Salami","de":"Salami","ru":"Салами","fr":"Salami","ar":"سلامي"}},{"id":"main5","name":{"tr":"Jambon","en":"Ham","de":"Schinken","ru":"Ветчина","fr":"Jambon","ar":"لحم خنزير"}}],"sideProducts":[{"id":"side1","name":{"tr":"Siyah Zeytin","en":"Black Olives","de":"Black Olives","ru":"Black Olives","fr":"Black Olives","ar":"Black Olives"}},{"id":"side2","name":{"tr":"Mısır","en":"Corn","de":"Mais","ru":"Кукуруза","fr":"Maïs","ar":"ذرة"}},{"id":"side3","name":{"tr":"Domates","en":"Tomatoes","de":"Tomaten","ru":"Помидоры","fr":"Tomates","ar":"طماطم"}},{"id":"side4","name":{"tr":"Turşu","en":"Pickles","de":"Essiggurken","ru":"Маринованные огурцы","fr":"Cornichons","ar":"مخلل"}},{"id":"side5","name":{"tr":"Jalepeno Biber","en":"Jalapeño Pepper","de":"Jalapeño-Paprika","ru":"Перец халапеньо","fr":"Poivron Jalapeño","ar":"فلفل هالبينو"}},{"id":"side6","name":{"tr":"Yeşil Biber","en":"Green Pepper","de":"Green Pepper","ru":"Green Pepper","fr":"Green Pepper","ar":"Green Pepper"}},{"id":"side7","name":{"tr":"Rus Salatası","en":"Russian Salad","de":"Russischer Salat","ru":"Русский салат","fr":"Salade Russe","ar":"سلطة روسية"}}]}}]},{"id":"chicken-doner","name":{"tr":"Tavuk Döner","en":"Chicken Doner","de":"Chicken Doner","ru":"Chicken Doner","fr":"Chicken Doner","ar":"Chicken Doner"},"products":[{"id":"cd1","name":{"tr":"Tavuk Döner","en":"Chicken Doner","de":"Chicken Doner","ru":"Chicken Doner","fr":"Chicken Doner","ar":"Chicken Doner"},"price":160,"description":{"tr":"Tavuk Döner (100gr) - Ekmek seçeneği ile","en":"Chicken Doner (100gr) - With bread option","de":"Chicken Doner (100gr) - With bread option","ru":"Chicken Doner (100gr) - With bread option","fr":"Chicken Doner (100gr) - With bread option","ar":"Chicken Doner (100gr) - With bread option"},"contents":{"tr":["Tavuk Döner (100gr)","Marul","Domates","Turşu"],"en":["Chicken Doner (100gr)","Lettuce","Tomatoes","Pickles"],"de":["Chicken Doner  (100g)","Lettuce","Tomaten","Essiggurken"],"ru":["Chicken Doner  (100gr)","Lettuce","Помидоры","Маринованные огурцы"],"fr":["Chicken Doner  (100g)","Lettuce","Tomates","Cornichons"],"ar":["Chicken Doner  (100غr)","Lettuce","طماطم","مخلل"]},"options":[{"id":"cd1_o1","label":{"tr":"Dürüm","en":"Wrap","de":"Wrap","ru":"Wrap","fr":"Wrap","ar":"Wrap"},"price":0},{"id":"cd1_o2","label":{"tr":"Gobit Ekmeği","en":"Gobit Bread","de":"Gobit Bread","ru":"Gobit Bread","fr":"Gobit Bread","ar":"Gobit Bread"},"price":0},{"id":"cd1_o3","label":{"tr":"Taş Fırın Ekmeği","en":"Stone Oven Bread","de":"Stone Oven Bread","ru":"Stone Oven Bread","fr":"Stone Oven Bread","ar":"Stone Oven Bread"},"price":0},{"id":"cd1_o4","label":{"tr":"Ayvalık Tost Ekmeği","en":"Ayvalık Toast Bread","de":"Ayvalık Toast Bread","ru":"Ayvalık Toast Bread","fr":"Ayvalık Toast Bread","ar":"Ayvalık Toast Bread"},"price":0}],"extras":{"menuOptions":[{"id":"menu1","name":{"tr":"Menü (Cips + Ayran)","en":"Menu (Chips + Ayran)","de":"Menu (Chips + Ayran)","ru":"Menu (Chips + Ayran)","fr":"Menu (Chips + Ayran)","ar":"Menu (Chips + Ayran)"},"price":60},{"id":"kola1","name":{"tr":"Kutu Kola Farkı","en":"Can Cola Difference","de":"Can Cola Difference","ru":"Can Cola Difference","fr":"Can Cola Difference","ar":"Can Cola Difference"},"price":20}]}},{"id":"cd2","name":{"tr":"Kaşarlı Tavuk Dürüm","en":"Cheddar Chicken Wrap","de":"Cheddar Chicken Wrap","ru":"Cheddar Chicken Wrap","fr":"Cheddar Chicken Wrap","ar":"Cheddar Chicken Wrap"},"price":180,"description":{"tr":"Kaşarlı Tavuk Dürüm (100gr)","en":"Cheddar Chicken Wrap (100gr)","de":"Cheddar Chicken Wrap (100gr)","ru":"Cheddar Chicken Wrap (100gr)","fr":"Cheddar Chicken Wrap (100gr)","ar":"Cheddar Chicken Wrap (100gr)"},"contents":{"tr":["Tavuk Döner (100gr)","Kaşar","Marul","Domates","Turşu"],"en":["Chicken Doner (100gr)","Cheddar","Lettuce","Tomatoes","Pickles"],"de":["Chicken Doner  (100g)","Cheddar","Lettuce","Tomaten","Essiggurken"],"ru":["Chicken Doner  (100gr)","Чеддер","Lettuce","Помидоры","Маринованные огурцы"],"fr":["Chicken Doner  (100g)","Cheddar","Lettuce","Tomates","Cornichons"],"ar":["Chicken Doner  (100غr)","شيدر","Lettuce","طماطم","مخلل"]},"options":[{"id":"cd2_o1","label":{"tr":"Ayran Menü (Cips + Ayran)","en":"Ayran Menu (Chips + Ayran)","de":"Ayran Menu (Chips + Ayran)","ru":"Ayran Menu (Chips + Ayran)","fr":"Ayran Menu (Chips + Ayran)","ar":"Ayran Menu (Chips + Ayran)"},"price":60},{"id":"cd2_o2","label":{"tr":"Kola Menü (Cips + Kola)","en":"Cola Menu (Chips + Cola)","de":"Cola Menu (Chips + Cola)","ru":"Cola Menu (Chips + Cola)","fr":"Cola Menu (Chips + Cola)","ar":"Cola Menu (Chips + Cola)"},"price":80}]},{"id":"cd3","name":{"tr":"Tavuk İskender","en":"Chicken Iskender","de":"Chicken Iskender","ru":"Chicken Iskender","fr":"Chicken Iskender","ar":"Chicken Iskender"},"price":230,"description":{"tr":"","en":"","de":"","ru":"","fr":"","ar":""},"contents":{"tr":["Tavuk Döner (100gr)","Yoğurt","Domates Sosu","Marul","Domates","Turşu"],"en":["Chicken Doner (100gr)","Yogurt","Tomato Sauce","Lettuce","Tomatoes","Pickles"],"de":["Chicken Doner  (100g)","Yogurt","Tomato Sauce","Lettuce","Tomaten","Essiggurken"],"ru":["Chicken Doner  (100gr)","Yogurt","Tomato Sauce","Lettuce","Помидоры","Маринованные огурцы"],"fr":["Chicken Doner  (100g)","Yogurt","Tomato Sauce","Lettuce","Tomates","Cornichons"],"ar":["Chicken Doner  (100غr)","Yogurt","Tomato Sauce","Lettuce","طماطم","مخلل"]},"options":[{"id":"cd3_o1","label":{"tr":"Ayran Menü (Cips + Ayran)","en":"Ayran Menu (Chips + Ayran)","de":"Ayran Menu (Chips + Ayran)","ru":"Ayran Menu (Chips + Ayran)","fr":"Ayran Menu (Chips + Ayran)","ar":"Ayran Menu (Chips + Ayran)"},"price":60},{"id":"cd3_o2","label":{"tr":"Kola Menü (Cips + Kola)","en":"Cola Menu (Chips + Cola)","de":"Cola Menu (Chips + Cola)","ru":"Cola Menu (Chips + Cola)","fr":"Cola Menu (Chips + Cola)","ar":"Cola Menu (Chips + Cola)"},"price":80}]},{"id":"cd4","name":{"tr":"Tavuk Döner Beyti","en":"Chicken Doner Beyti","de":"Chicken Doner Beyti","ru":"Chicken Doner Beyti","fr":"Chicken Doner Beyti","ar":"Chicken Doner Beyti"},"price":250,"description":{"tr":"","en":"","de":"","ru":"","fr":"","ar":""},"contents":{"tr":["Tavuk Döner (100gr)","Özel Beyti Sosu","Tereyağı","Marul","Domates","Turşu"],"en":["Chicken Doner (100gr)","Special Beyti Sauce","Butter","Lettuce","Tomatoes","Pickles"],"de":["Chicken Doner  (100g)","Special Beyti Sauce","Butter","Lettuce","Tomaten","Essiggurken"],"ru":["Chicken Doner  (100gr)","Special Beyti Sauce","Butter","Lettuce","Помидоры","Маринованные огурцы"],"fr":["Chicken Doner  (100g)","Special Beyti Sauce","Butter","Lettuce","Tomates","Cornichons"],"ar":["Chicken Doner  (100غr)","Special Beyti Sauce","Butter","Lettuce","طماطم","مخلل"]},"options":[{"id":"cd4_o1","label":{"tr":"Ayran Menü (Cips + Ayran)","en":"Ayran Menu (Chips + Ayran)","de":"Ayran Menu (Chips + Ayran)","ru":"Ayran Menu (Chips + Ayran)","fr":"Ayran Menu (Chips + Ayran)","ar":"Ayran Menu (Chips + Ayran)"},"price":60},{"id":"cd4_o2","label":{"tr":"Kola Menü (Cips + Kola)","en":"Cola Menu (Chips + Cola)","de":"Cola Menu (Chips + Cola)","ru":"Cola Menu (Chips + Cola)","fr":"Cola Menu (Chips + Cola)","ar":"Cola Menu (Chips + Cola)"},"price":80}]},{"id":"cd5","name":{"tr":"Tavuk Döner Porsiyon","en":"Chicken Doner Portion","de":"Chicken Doner Portion","ru":"Chicken Doner Portion","fr":"Chicken Doner Portion","ar":"Chicken Doner Portion"},"price":180,"description":{"tr":"","en":"","de":"","ru":"","fr":"","ar":""},"contents":{"tr":["Tavuk Döner (100gr)","Marul","Domates","Turşu"],"en":["Chicken Doner (100gr)","Lettuce","Tomatoes","Pickles"],"de":["Chicken Doner  (100g)","Lettuce","Tomaten","Essiggurken"],"ru":["Chicken Doner  (100gr)","Lettuce","Помидоры","Маринованные огурцы"],"fr":["Chicken Doner  (100g)","Lettuce","Tomates","Cornichons"],"ar":["Chicken Doner  (100غr)","Lettuce","طماطم","مخلل"]},"options":[{"id":"cd5_o1","label":{"tr":"Ayran Menü (Cips + Ayran)","en":"Ayran Menu (Chips + Ayran)","de":"Ayran Menu (Chips + Ayran)","ru":"Ayran Menu (Chips + Ayran)","fr":"Ayran Menu (Chips + Ayran)","ar":"Ayran Menu (Chips + Ayran)"},"price":60},{"id":"cd5_o2","label":{"tr":"Kola Menü (Cips + Kola)","en":"Cola Menu (Chips + Cola)","de":"Cola Menu (Chips + Cola)","ru":"Cola Menu (Chips + Cola)","fr":"Cola Menu (Chips + Cola)","ar":"Cola Menu (Chips + Cola)"},"price":80}]},{"id":"cd6","name":{"tr":"Pilavüstü Tavuk Döner","en":"Chicken Doner on Rice","de":"Chicken Doner on Rice","ru":"Chicken Doner on Rice","fr":"Chicken Doner on Rice","ar":"Chicken Doner on Rice"},"price":230,"description":{"tr":"","en":"","de":"","ru":"","fr":"","ar":""},"contents":{"tr":["Tavuk Döner (100gr)","Pilav","Marul","Domates","Turşu"],"en":["Chicken Doner (100gr)","Rice","Lettuce","Tomatoes","Pickles"],"de":["Chicken Doner  (100g)","Rice","Lettuce","Tomaten","Essiggurken"],"ru":["Chicken Doner  (100gr)","Rice","Lettuce","Помидоры","Маринованные огурцы"],"fr":["Chicken Doner  (100g)","Rice","Lettuce","Tomates","Cornichons"],"ar":["Chicken Doner  (100غr)","Rice","Lettuce","طماطم","مخلل"]},"options":[{"id":"cd6_o1","label":{"tr":"Ayran Menü (Cips + Ayran)","en":"Ayran Menu (Chips + Ayran)","de":"Ayran Menu (Chips + Ayran)","ru":"Ayran Menu (Chips + Ayran)","fr":"Ayran Menu (Chips + Ayran)","ar":"Ayran Menu (Chips + Ayran)"},"price":60},{"id":"cd6_o2","label":{"tr":"Kola Menü (Cips + Kola)","en":"Cola Menu (Chips + Cola)","de":"Cola Menu (Chips + Cola)","ru":"Cola Menu (Chips + Cola)","fr":"Cola Menu (Chips + Cola)","ar":"Cola Menu (Chips + Cola)"},"price":80}]},{"id":"cd7","name":{"tr":"3 Adet Tavuk Döner","en":"3 Pieces Chicken Doner","de":"3 Pieces Chicken Doner","ru":"3 Pieces Chicken Doner","fr":"3 Pieces Chicken Doner","ar":"3 Pieces Chicken Doner"},"price":630,"description":{"tr":"3 Adet Tavuk Döner (100gr) + Büyük Boy Cips + Litrelik İçecek","en":"3 Pieces Chicken Doner (100gr) + Large Chips + Liter Drink","de":"3 Pieces Chicken Doner (100gr) + Large Chips + Liter Drink","ru":"3 Pieces Chicken Doner (100gr) + Large Chips + Liter Drink","fr":"3 Pieces Chicken Doner (100gr) + Large Chips + Liter Drink","ar":"3 Pieces Chicken Doner (100gr) + Large Chips + Liter Drink"},"contents":{"tr":["3x Tavuk Döner (100gr)","Büyük Boy Cips","Litrelik İçecek"],"en":["3x Chicken Doner (100gr)","Large Chips","Liter Drink"],"de":["3x Chicken Doner  (100g)","Large Chips","Litergetränk"],"ru":["3x Chicken Doner  (100gr)","Large Chips","Литровый напиток"],"fr":["3x Chicken Doner  (100g)","Large Chips","Boisson d\u0027un Litre"],"ar":["3x Chicken Doner  (100غr)","Large Chips","مشروب لتر"]},"options":[]},{"id":"cd8","name":{"tr":"5 Adet Tavuk Döner","en":"5 Pieces Chicken Doner","de":"5 Pieces Chicken Doner","ru":"5 Pieces Chicken Doner","fr":"5 Pieces Chicken Doner","ar":"5 Pieces Chicken Doner"},"price":990,"description":{"tr":"5 Adet Tavuk Döner + 2x Büyük Cips + Litrelik İçecek","en":"5 Pieces Chicken Doner + 2x Large Chips + Liter Drink","de":"5 Pieces Chicken Doner + 2x Large Chips + Liter Drink","ru":"5 Pieces Chicken Doner + 2x Large Chips + Liter Drink","fr":"5 Pieces Chicken Doner + 2x Large Chips + Liter Drink","ar":"5 Pieces Chicken Doner + 2x Large Chips + Liter Drink"},"contents":{"tr":["5x Tavuk Döner (100gr)","2x Büyük Boy Cips","Litrelik İçecek"],"en":["5x Chicken Doner (100gr)","2x Large Chips","Liter Drink"],"de":["5x Chicken Doner  (100g)","2x Large Chips","Litergetränk"],"ru":["5x Chicken Doner  (100gr)","2x Large Chips","Литровый напиток"],"fr":["5x Chicken Doner  (100g)","2x Large Chips","Boisson d\u0027un Litre"],"ar":["5x Chicken Doner  (100غr)","2x Large Chips","مشروب لتر"]},"options":[]}]},{"id":"beef-doner","name":{"tr":"Et Döner","en":"Beef Doner","de":"Rindfleisch-Döner","ru":"Донер из говядины","fr":"Döner Bœuf","ar":"دونر لحم"},"products":[{"id":"bd1","name":{"tr":"Et Döner (70gr)","en":"Beef Doner (70gr)","de":"Beef Doner (70gr)","ru":"Beef Doner (70gr)","fr":"Beef Doner (70gr)","ar":"Beef Doner (70gr)"},"price":210,"description":{"tr":"Et Döner (70gr) - Ekmek seçeneği ile","en":"Beef Doner (70gr) - With bread option","de":"Beef Doner (70gr) - With bread option","ru":"Beef Doner (70gr) - With bread option","fr":"Beef Doner (70gr) - With bread option","ar":"Beef Doner (70gr) - With bread option"},"contents":{"tr":["Et Döner (70gr)","Marul","Domates","Turşu"],"en":["Beef Doner (70gr)","Lettuce","Tomatoes","Pickles"],"de":["Rindfleisch-Döner  (70g)","Lettuce","Tomaten","Essiggurken"],"ru":["Донер из говядины  (70gr)","Lettuce","Помидоры","Маринованные огурцы"],"fr":["Döner Bœuf  (70g)","Lettuce","Tomates","Cornichons"],"ar":["دونر لحم  (70غr)","Lettuce","طماطم","مخلل"]},"options":[{"id":"bd1_o1","label":{"tr":"Dürüm","en":"Wrap","de":"Wrap","ru":"Wrap","fr":"Wrap","ar":"Wrap"},"price":0},{"id":"bd1_o2","label":{"tr":"Gobit Ekmeği","en":"Gobit Bread","de":"Gobit Bread","ru":"Gobit Bread","fr":"Gobit Bread","ar":"Gobit Bread"},"price":0},{"id":"bd1_o3","label":{"tr":"Taş Fırın Ekmeği","en":"Stone Oven Bread","de":"Stone Oven Bread","ru":"Stone Oven Bread","fr":"Stone Oven Bread","ar":"Stone Oven Bread"},"price":0},{"id":"bd1_o4","label":{"tr":"Ayvalık Tost Ekmeği","en":"Ayvalık Toast Bread","de":"Ayvalık Toast Bread","ru":"Ayvalık Toast Bread","fr":"Ayvalık Toast Bread","ar":"Ayvalık Toast Bread"},"price":0}],"extras":{"menuOptions":[{"id":"bd1_menu1","name":{"tr":"Cips + Ayran Menü","en":"Chips + Ayran Menu","de":"Chips + Ayran Menu","ru":"Chips + Ayran Menu","fr":"Chips + Ayran Menu","ar":"Chips + Ayran Menu"},"price":60},{"id":"bd1_menu2","name":{"tr":"Cips + Kola Menü","en":"Chips + Cola Menu","de":"Chips + Cola Menu","ru":"Chips + Cola Menu","fr":"Chips + Cola Menu","ar":"Chips + Cola Menu"},"price":80},{"id":"bd1_patates1","name":{"tr":"Patates İlave","en":"Extra Potatoes","de":"Extra Potatoes","ru":"Extra Potatoes","fr":"Extra Potatoes","ar":"Extra Potatoes"},"price":10},{"id":"bd1_patates2","name":{"tr":"Menü Patatesi","en":"Menu Potatoes","de":"Menu Potatoes","ru":"Menu Potatoes","fr":"Menu Potatoes","ar":"Menu Potatoes"},"price":30}]}},{"id":"bd2","name":{"tr":"Et Döner (100gr)","en":"Beef Doner (100gr)","de":"Beef Doner (100gr)","ru":"Beef Doner (100gr)","fr":"Beef Doner (100gr)","ar":"Beef Doner (100gr)"},"price":290,"description":{"tr":"Et Döner (100gr) - Ekmek seçeneği ile","en":"Beef Doner (100gr) - With bread option","de":"Beef Doner (100gr) - With bread option","ru":"Beef Doner (100gr) - With bread option","fr":"Beef Doner (100gr) - With bread option","ar":"Beef Doner (100gr) - With bread option"},"contents":{"tr":["Et Döner (100gr)","Marul","Domates","Turşu"],"en":["Beef Doner (100gr)","Lettuce","Tomatoes","Pickles"],"de":["Rindfleisch-Döner  (100g)","Lettuce","Tomaten","Essiggurken"],"ru":["Донер из говядины  (100gr)","Lettuce","Помидоры","Маринованные огурцы"],"fr":["Döner Bœuf  (100g)","Lettuce","Tomates","Cornichons"],"ar":["دونر لحم  (100غr)","Lettuce","طماطم","مخلل"]},"options":[{"id":"bd2_o1","label":{"tr":"Dürüm","en":"Wrap","de":"Wrap","ru":"Wrap","fr":"Wrap","ar":"Wrap"},"price":0},{"id":"bd2_o2","label":{"tr":"Gobit Ekmeği","en":"Gobit Bread","de":"Gobit Bread","ru":"Gobit Bread","fr":"Gobit Bread","ar":"Gobit Bread"},"price":0},{"id":"bd2_o3","label":{"tr":"Taş Fırın Ekmeği","en":"Stone Oven Bread","de":"Stone Oven Bread","ru":"Stone Oven Bread","fr":"Stone Oven Bread","ar":"Stone Oven Bread"},"price":0},{"id":"bd2_o4","label":{"tr":"Ayvalık Tost Ekmeği","en":"Ayvalık Toast Bread","de":"Ayvalık Toast Bread","ru":"Ayvalık Toast Bread","fr":"Ayvalık Toast Bread","ar":"Ayvalık Toast Bread"},"price":0}],"extras":{"menuOptions":[{"id":"bd2_menu1","name":{"tr":"Cips + Ayran Menü","en":"Chips + Ayran Menu","de":"Chips + Ayran Menu","ru":"Chips + Ayran Menu","fr":"Chips + Ayran Menu","ar":"Chips + Ayran Menu"},"price":60},{"id":"bd2_menu2","name":{"tr":"Cips + Kola Menü","en":"Chips + Cola Menu","de":"Chips + Cola Menu","ru":"Chips + Cola Menu","fr":"Chips + Cola Menu","ar":"Chips + Cola Menu"},"price":80},{"id":"bd2_patates1","name":{"tr":"Patates İlave","en":"Extra Potatoes","de":"Extra Potatoes","ru":"Extra Potatoes","fr":"Extra Potatoes","ar":"Extra Potatoes"},"price":10},{"id":"bd2_patates2","name":{"tr":"Menü Patatesi","en":"Menu Potatoes","de":"Menu Potatoes","ru":"Menu Potatoes","fr":"Menu Potatoes","ar":"Menu Potatoes"},"price":30}]}},{"id":"bd3","name":{"tr":"Porsiyon Et Döner","en":"Beef Doner Portion","de":"Rindfleisch-Döner Portion","ru":"Порция говядины Донер","fr":"Portion de Döner Bœuf","ar":"وجبة دونر لحم"},"price":310,"description":{"tr":"","en":"","de":"","ru":"","fr":"","ar":""},"contents":{"tr":["Et Döner (100gr)","Marul","Domates","Turşu"],"en":["Beef Doner (100gr)","Lettuce","Tomatoes","Pickles"],"de":["Rindfleisch-Döner (100g)","Lettuce","Tomaten","Essiggurken"],"ru":["Донер из говядины (100гр)","Lettuce","Помидоры","Маринованные огурцы"],"fr":["Döner Bœuf (100g)","Laitue","Tomates","Cornichons"],"ar":["دونر لحم (100غ)","Lettuce","طماطم","مخلل"]},"options":[{"id":"bd3_o1","label":{"tr":"Tek","en":"Single","de":"Einzeln","ru":"Одиночный","fr":"Seul","ar":"فرادى"},"price":0},{"id":"bd3_o2","label":{"tr":"Menü (Cips + Ayran)","en":"Menu (Chips + Ayran)","de":"Menü (Chips + Ayran)","ru":"Меню (Картофель фри + Айран)","fr":"Menu (Chips + Ayran)","ar":"قائمة (شيبس + عيران)"},"price":60},{"id":"bd3_o3","label":{"tr":"Menü (Cips + Kola)","en":"Menu (Chips + Cola)","de":"Menü (Chips + Cola)","ru":"Меню (Картофель фри + Кола)","fr":"Menu (Chips + Cola)","ar":"قائمة (شيبس + كولا)"},"price":80}],"extras":{"potatoOptions":[{"id":"bd3_patates1","name":{"tr":"Patates (+10₺)","en":"Potatoes (+10₺)","de":"Kartoffeln (+10₺)","ru":"Картофель (+10₺)","fr":"Pommes de terre (+10₺)","ar":"بطاطس (+10₺)"},"price":10}]}},{"id":"bd4","name":{"tr":"Soslu Et Döner Porsiyon","en":"Sauced Beef Doner Portion","de":"Gewürzter Rindfleisch-Döner Portion","ru":"Порция донер из говядины с соусом","fr":"Portion de Döner Bœuf Sauced","ar":"وجبة دونر لحم بالصلصة"},"price":310,"description":{"tr":"Et Döner (100gr), Özel Sos, Marul, Domates, Turşu","en":"Beef Doner (100gr), Special Sauce, Lettuce, Tomatoes, Pickles","de":"Rindfleisch-Döner (100g), Spezielle Sauce, Salat, Tomaten, Essiggurken","ru":"Донер из говядины (100гр), Специальный соус, Салат, Помидоры, Маринованные огурцы","fr":"Döner Bœuf (100g), Sauce Spéciale, Laitue, Tomates, Cornichons","ar":"دونر لحم (100غ), صلصة خاصة, خس, طماطم, مخلل"},"contents":{"tr":["Et Döner (100gr)","Özel Sos","Marul","Domates","Turşu"],"en":["Beef Doner (100gr)","Special Sauce","Lettuce","Tomatoes","Pickles"],"de":["Rindfleisch-Döner (100g)","Spezielle Sauce","Lettuce","Tomaten","Essiggurken"],"ru":["Донер из говядины (100гр)","Специальный соус","Lettuce","Помидоры","Маринованные огурцы"],"fr":["Döner Bœuf (100g)","Sauce Spéciale","Laitue","Tomates","Cornichons"],"ar":["دونر لحم (100غ)","صلصة خاصة","Lettuce","طماطم","مخلل"]},"options":[{"id":"bd4_o1","label":{"tr":"Dürüm","en":"Wrap","de":"Wrap","ru":"Wrap","fr":"Wrap","ar":"Wrap"},"price":0},{"id":"bd4_o2","label":{"tr":"Gobit Ekmeği","en":"Gobit Bread","de":"Gobit Bread","ru":"Gobit Bread","fr":"Gobit Bread","ar":"Gobit Bread"},"price":0},{"id":"bd4_o3","label":{"tr":"Taş Fırın Ekmeği","en":"Stone Oven Bread","de":"Stone Oven Bread","ru":"Stone Oven Bread","fr":"Stone Oven Bread","ar":"Stone Oven Bread"},"price":0},{"id":"bd4_o4","label":{"tr":"Ayvalık Tost Ekmeği","en":"Ayvalık Toast Bread","de":"Ayvalık Toast Bread","ru":"Ayvalık Toast Bread","fr":"Ayvalık Toast Bread","ar":"Ayvalık Toast Bread"},"price":0}],"extras":{"menuOptions":[{"id":"bd4_menu1","name":{"tr":"Cips + Ayran Menü","en":"Chips + Ayran Menu","de":"Chips + Ayran Menu","ru":"Chips + Ayran Menu","fr":"Chips + Ayran Menu","ar":"Chips + Ayran Menu"},"price":60},{"id":"bd4_menu2","name":{"tr":"Cips + Kola Menü","en":"Chips + Cola Menu","de":"Chips + Cola Menu","ru":"Chips + Cola Menu","fr":"Chips + Cola Menu","ar":"Chips + Cola Menu"},"price":80},{"id":"bd4_patates1","name":{"tr":"Patates İlave","en":"Extra Potatoes","de":"Extra Potatoes","ru":"Extra Potatoes","fr":"Extra Potatoes","ar":"Extra Potatoes"},"price":10}]}},{"id":"bd6","name":{"tr":"Pilavüstü Et Döner","en":"Rice Top Beef Doner","de":"Reis-Top Rindfleisch-Döner","ru":"Донер из говядины на рисе","fr":"Döner Bœuf sur Riz","ar":"دونر لحم على الأرز"},"price":350,"description":{"tr":"","en":"","de":"","ru":"","fr":"","ar":""},"contents":{"tr":["Et Döner (100gr)","Pilav","Marul","Domates","Turşu"],"en":["Beef Doner (100gr)","Rice","Lettuce","Tomatoes","Pickles"],"de":["Rindfleisch-Döner (100g)","Reis","Lettuce","Tomaten","Essiggurken"],"ru":["Донер из говядины (100гр)","Рис","Lettuce","Помидоры","Маринованные огурцы"],"fr":["Döner Bœuf (100g)","Riz","Laitue","Tomates","Cornichons"],"ar":["دونر لحم (100غ)","أرز","Lettuce","طماطم","مخلل"]},"options":[{"id":"bd6_o1","label":{"tr":"Tek","en":"Single","de":"Einzeln","ru":"Одиночный","fr":"Seul","ar":"فرادى"},"price":0},{"id":"bd6_o2","label":{"tr":"Menü (Cips + Ayran)","en":"Menu (Chips + Ayran)","de":"Menü (Chips + Ayran)","ru":"Меню (Картофель фри + Айран)","fr":"Menu (Chips + Ayran)","ar":"قائمة (شيبس + عيران)"},"price":60},{"id":"bd6_o3","label":{"tr":"Menü (Cips + Kola)","en":"Menu (Chips + Cola)","de":"Menü (Chips + Cola)","ru":"Меню (Картофель фри + Кола)","fr":"Menu (Chips + Cola)","ar":"قائمة (شيبس + كولا)"},"price":80}],"extras":{"potatoOptions":[{"id":"bd6_patates1","name":{"tr":"Patates (+10₺)","en":"Potatoes (+10₺)","de":"Kartoffeln (+10₺)","ru":"Картофель (+10₺)","fr":"Pommes de terre (+10₺)","ar":"بطاطس (+10₺)"},"price":10}]}},{"id":"bd7","name":{"tr":"Soslu Kaşarlı Et Dürüm (70gr)","en":"Sauced Cheddar Beef Wrap (70gr)","de":"Gewürzte Cheddar-Rindfleisch-Wrap (70g)","ru":"Донер из говядины с сыром и соусом (70гр)","fr":"Wrap Döner Bœuf Cheddar Sauced (70g)","ar":"لفة دونر لحم بالجبن والصلصة (70غ)"},"price":230,"description":{"tr":"Et Döner (70gr), Kaşar, Özel Sos, Marul, Domates, Turşu","en":"Beef Doner (70gr), Cheddar, Special Sauce, Lettuce, Tomatoes, Pickles","de":"Rindfleisch-Döner (70g), Cheddar, Spezielle Sauce, Salat, Tomaten, Essiggurken","ru":"Донер из говядины (70гр), Чеддер, Специальный соус, Салат, Помидоры, Маринованные огурцы","fr":"Döner Bœuf (70g), Cheddar, Sauce Spéciale, Laitue, Tomates, Cornichons","ar":"دونر لحم (70غ), شيدر, صلصة خاصة, خس, طماطم, مخلل"},"contents":{"tr":["Et Döner (70gr)","Kaşar","Özel Sos","Marul","Domates","Turşu"],"en":["Beef Doner (70gr)","Cheddar","Special Sauce","Lettuce","Tomatoes","Pickles"],"de":["Rindfleisch-Döner (70g)","Cheddar","Spezielle Sauce","Lettuce","Tomaten","Essiggurken"],"ru":["Донер из говядины (70гр)","Чеддер","Специальный соус","Lettuce","Помидоры","Маринованные огурцы"],"fr":["Döner Bœuf (70g)","Cheddar","Sauce Spéciale","Laitue","Tomates","Cornichons"],"ar":["دونر لحم (70غ)","شيدر","صلصة خاصة","Lettuce","طماطم","مخلل"]},"options":[{"id":"bd7_o1","label":{"tr":"Tek","en":"Single","de":"Einzeln","ru":"Одиночный","fr":"Seul","ar":"فرادى"},"price":0},{"id":"bd7_o2","label":{"tr":"Menü (Cips + Ayran)","en":"Menu (Chips + Ayran)","de":"Menü (Chips + Ayran)","ru":"Меню (Картофель фри + Айран)","fr":"Menu (Chips + Ayran)","ar":"قائمة (شيبس + عيران)"},"price":60},{"id":"bd7_o3","label":{"tr":"Menü (Cips + Kola)","en":"Menu (Chips + Cola)","de":"Menü (Chips + Cola)","ru":"Меню (Картофель фри + Кола)","fr":"Menu (Chips + Cola)","ar":"قائمة (شيبس + كولا)"},"price":80}],"extras":{"potatoOptions":[{"id":"bd7_patates1","name":{"tr":"Patates (+10₺)","en":"Potatoes (+10₺)","de":"Kartoffeln (+10₺)","ru":"Картофель (+10₺)","fr":"Pommes de terre (+10₺)","ar":"بطاطس (+10₺)"},"price":10}]}},{"id":"bd8","name":{"tr":"Soslu Kaşarlı Et Dürüm (100gr)","en":"Sauced Cheddar Beef Wrap (100gr)","de":"Gewürzte Cheddar-Rindfleisch-Wrap (100g)","ru":"Донер из говядины с сыром и соусом (100гр)","fr":"Wrap Döner Bœuf Cheddar Sauced (100g)","ar":"لفة دونر لحم بالجبن والصلصة (100غ)"},"price":310,"description":{"tr":"Et Döner (100gr), Kaşar, Özel Sos, Marul, Domates, Turşu","en":"Beef Doner (100gr), Cheddar, Special Sauce, Lettuce, Tomatoes, Pickles","de":"Rindfleisch-Döner (100g), Cheddar, Spezielle Sauce, Salat, Tomaten, Essiggurken","ru":"Донер из говядины (100гр), Чеддер, Специальный соус, Салат, Помидоры, Маринованные огурцы","fr":"Döner Bœuf (100g), Cheddar, Sauce Spéciale, Laitue, Tomates, Cornichons","ar":"دونر لحم (100غ), شيدر, صلصة خاصة, خس, طماطم, مخلل"},"contents":{"tr":["Et Döner (100gr)","Kaşar","Özel Sos","Marul","Domates","Turşu"],"en":["Beef Doner (100gr)","Cheddar","Special Sauce","Lettuce","Tomatoes","Pickles"],"de":["Rindfleisch-Döner (100g)","Cheddar","Spezielle Sauce","Lettuce","Tomaten","Essiggurken"],"ru":["Донер из говядины (100гр)","Чеддер","Специальный соус","Lettuce","Помидоры","Маринованные огурцы"],"fr":["Döner Bœuf (100g)","Cheddar","Sauce Spéciale","Laitue","Tomates","Cornichons"],"ar":["دونر لحم (100غ)","شيدر","صلصة خاصة","Lettuce","طماطم","مخلل"]},"options":[{"id":"bd8_o1","label":{"tr":"Tek","en":"Single","de":"Einzeln","ru":"Одиночный","fr":"Seul","ar":"فرادى"},"price":0},{"id":"bd8_o2","label":{"tr":"Menü (Cips + Ayran)","en":"Menu (Chips + Ayran)","de":"Menü (Chips + Ayran)","ru":"Меню (Картофель фри + Айран)","fr":"Menu (Chips + Ayran)","ar":"قائمة (شيبس + عيران)"},"price":60},{"id":"bd8_o3","label":{"tr":"Menü (Cips + Kola)","en":"Menu (Chips + Cola)","de":"Menü (Chips + Cola)","ru":"Меню (Картофель фри + Кола)","fr":"Menu (Chips + Cola)","ar":"قائمة (شيبس + كولا)"},"price":80}],"extras":{"potatoOptions":[{"id":"bd8_patates1","name":{"tr":"Patates (+10₺)","en":"Potatoes (+10₺)","de":"Kartoffeln (+10₺)","ru":"Картофель (+10₺)","fr":"Pommes de terre (+10₺)","ar":"بطاطس (+10₺)"},"price":10}]}},{"id":"bd9","name":{"tr":"Ayvalık Et Döner (70gr)","en":"Ayvalık Beef Doner (70gr)","de":"Ayvalık Rindfleisch Döner (70gr)","ru":"Дёнер Айвалык (70г)","fr":"Döner d\u0027Ayvalık (70gr)","ar":"دونر أيفاليك (70غ)"},"price":210,"description":{"tr":"","en":"","de":"","ru":"","fr":"","ar":""},"contents":{"tr":["Et Döner (70gr)","Marul","Domates","Turşu"],"en":["Beef Doner (70gr)","Lettuce","Tomatoes","Pickles"],"de":["Rindfleisch-Döner (70g)","Lettuce","Tomaten","Essiggurken"],"ru":["Донер из говядины (70гр)","Lettuce","Помидоры","Маринованные огурцы"],"fr":["Döner Bœuf (70g)","Laitue","Tomates","Cornichons"],"ar":["دونر لحم (70غ)","Lettuce","طماطم","مخلل"]},"options":[{"id":"bd9_o1","label":{"tr":"Dürüm","en":"Wrap","de":"Wrap","ru":"Wrap","fr":"Wrap","ar":"Wrap"},"price":0},{"id":"bd9_o2","label":{"tr":"Gobit Ekmeği","en":"Gobit Bread","de":"Gobit Bread","ru":"Gobit Bread","fr":"Gobit Bread","ar":"Gobit Bread"},"price":0},{"id":"bd9_o3","label":{"tr":"Taş Fırın Ekmeği","en":"Stone Oven Bread","de":"Stone Oven Bread","ru":"Stone Oven Bread","fr":"Stone Oven Bread","ar":"Stone Oven Bread"},"price":0},{"id":"bd9_o4","label":{"tr":"Ayvalık Tost Ekmeği","en":"Ayvalık Toast Bread","de":"Ayvalık Toast Bread","ru":"Ayvalık Toast Bread","fr":"Ayvalık Toast Bread","ar":"Ayvalık Toast Bread"},"price":0}],"extras":{"menuOptions":[{"id":"bd9_menu1","name":{"tr":"Cips + Ayran Menü","en":"Chips + Ayran Menu","de":"Chips + Ayran Menu","ru":"Chips + Ayran Menu","fr":"Chips + Ayran Menu","ar":"Chips + Ayran Menu"},"price":60},{"id":"bd9_menu2","name":{"tr":"Cips + Kola Menü","en":"Chips + Cola Menu","de":"Chips + Cola Menu","ru":"Chips + Cola Menu","fr":"Chips + Cola Menu","ar":"Chips + Cola Menu"},"price":80},{"id":"bd9_patates1","name":{"tr":"Patates İlave","en":"Extra Potatoes","de":"Extra Potatoes","ru":"Extra Potatoes","fr":"Extra Potatoes","ar":"Extra Potatoes"},"price":10}]}},{"id":"bd10","name":{"tr":"Ayvalık Kaşarlı Et Döner (70gr)","en":"Ayvalık Cheddar Beef Doner (70gr)","de":"Ayvalık Cheddar-Rindfleisch-Döner (70g)","ru":"Айвалык донер из говядины с сыром (70гр)","fr":"Döner Bœuf Cheddar Ayvalık (70g)","ar":"دونر لحم بالجبن أيفاليك (70غ)"},"price":230,"description":{"tr":"Et Döner (70gr), Kaşar, Marul, Domates, Turşu","en":"Beef Doner (70gr), Cheddar, Lettuce, Tomatoes, Pickles","de":"Rindfleisch-Döner (70g), Cheddar, Salat, Tomaten, Essiggurken","ru":"Донер из говядины (70гр), Чеддер, Салат, Помидоры, Маринованные огурцы","fr":"Döner Bœuf (70g), Cheddar, Laitue, Tomates, Cornichons","ar":"دونر لحم (70غ), شيدر, خس, طماطم, مخلل"},"contents":{"tr":["Et Döner (70gr)","Kaşar","Marul","Domates","Turşu"],"en":["Beef Doner (70gr)","Cheddar","Lettuce","Tomatoes","Pickles"],"de":["Rindfleisch-Döner (70g)","Cheddar","Lettuce","Tomaten","Essiggurken"],"ru":["Донер из говядины (70гр)","Чеддер","Lettuce","Помидоры","Маринованные огурцы"],"fr":["Döner Bœuf (70g)","Cheddar","Laitue","Tomates","Cornichons"],"ar":["دونر لحم (70غ)","شيدر","Lettuce","طماطم","مخلل"]},"options":[{"id":"bd10_o1","label":{"tr":"Dürüm","en":"Wrap","de":"Wrap","ru":"Wrap","fr":"Wrap","ar":"Wrap"},"price":0},{"id":"bd10_o2","label":{"tr":"Gobit Ekmeği","en":"Gobit Bread","de":"Gobit Bread","ru":"Gobit Bread","fr":"Gobit Bread","ar":"Gobit Bread"},"price":0},{"id":"bd10_o3","label":{"tr":"Taş Fırın Ekmeği","en":"Stone Oven Bread","de":"Stone Oven Bread","ru":"Stone Oven Bread","fr":"Stone Oven Bread","ar":"Stone Oven Bread"},"price":0},{"id":"bd10_o4","label":{"tr":"Ayvalık Tost Ekmeği","en":"Ayvalık Toast Bread","de":"Ayvalık Toast Bread","ru":"Ayvalık Toast Bread","fr":"Ayvalık Toast Bread","ar":"Ayvalık Toast Bread"},"price":0}],"extras":{"menuOptions":[{"id":"bd10_menu1","name":{"tr":"Cips + Ayran Menü","en":"Chips + Ayran Menu","de":"Chips + Ayran Menu","ru":"Chips + Ayran Menu","fr":"Chips + Ayran Menu","ar":"Chips + Ayran Menu"},"price":60},{"id":"bd10_menu2","name":{"tr":"Cips + Kola Menü","en":"Chips + Cola Menu","de":"Chips + Cola Menu","ru":"Chips + Cola Menu","fr":"Chips + Cola Menu","ar":"Chips + Cola Menu"},"price":80},{"id":"bd10_patates1","name":{"tr":"Patates İlave","en":"Extra Potatoes","de":"Extra Potatoes","ru":"Extra Potatoes","fr":"Extra Potatoes","ar":"Extra Potatoes"},"price":10}]}},{"id":"bd11","name":{"tr":"3 Adet Et Döner (70gr)","en":"3 Beef Doner (70gr)","de":"3 Rindfleisch-Döner (70g)","ru":"3 Донер из говядины (70гр)","fr":"3 Döner Bœuf (70g)","ar":"3 دونر لحم (70غ)"},"price":780,"description":{"tr":"3x Et Döner (70gr), Büyük Boy Cips, Litrelik İçecek","en":"3x Beef Doner (70gr), Large Chips, Liter Drink","de":"3x Rindfleisch-Döner (70g), Große Chips, Liter Getränk","ru":"3x Донер из говядины (70гр), Большие чипсы, Литровый напиток","fr":"3x Döner Bœuf (70g), Grandes Chips, Boisson d\u0027un Litre","ar":"3x دونر لحم (70غ), شيبس كبير, مشروب لتر"},"contents":{"tr":["3x Et Döner (70gr)","Büyük Boy Cips","Litrelik İçecek"],"en":["3x Beef Doner (70gr)","Large Chips","Liter Drink"],"de":["3x Rindfleisch-Döner (70g)","Große Chips","Liter Getränk"],"ru":["3x Донер из говядины (70гр)","Большие чипсы","Литровый напиток"],"fr":["3x Döner Bœuf (70g)","Grandes Chips","Boisson d\u0027un Litre"],"ar":["3x دونر لحم (70غ)","شيبس كبير","مشروب لتر"]},"options":[],"extras":{"potatoOptions":[{"id":"bd11_patates1","name":{"tr":"Patates (+10₺)","en":"Potatoes (+10₺)","de":"Kartoffeln (+10₺)","ru":"Картофель (+10₺)","fr":"Pommes de terre (+10₺)","ar":"بطاطس (+10₺)"},"price":10}]}},{"id":"bd12","name":{"tr":"3 Adet Et Döner (100gr)","en":"3 Beef Doner (100gr)","de":"3 Rindfleisch-Döner (100g)","ru":"3 Донер из говядины (100гр)","fr":"3 Döner Bœuf (100g)","ar":"3 دونر لحم (100غ)"},"price":1020,"description":{"tr":"3x Et Döner (100gr), Büyük Boy Cips, Litrelik İçecek","en":"3x Beef Doner (100gr), Large Chips, Liter Drink","de":"3x Rindfleisch-Döner (100g), Große Chips, Liter Getränk","ru":"3x Донер из говядины (100гр), Большие чипсы, Литровый напиток","fr":"3x Döner Bœuf (100g), Grandes Chips, Boisson d\u0027un Litre","ar":"3x دونر لحم (100غ), شيبس كبير, مشروب لتر"},"contents":{"tr":["3x Et Döner (100gr)","Büyük Boy Cips","Litrelik İçecek"],"en":["3x Beef Doner (100gr)","Large Chips","Liter Drink"],"de":["3x Rindfleisch-Döner (100g)","Große Chips","Liter Getränk"],"ru":["3x Донер из говядины (100гр)","Большие чипсы","Литровый напиток"],"fr":["3x Döner Bœuf (100g)","Grandes Chips","Boisson d\u0027un Litre"],"ar":["3x دونر لحم (100غ)","شيبس كبير","مشروب لتر"]},"options":[],"extras":{"potatoOptions":[{"id":"bd12_patates1","name":{"tr":"Patates (+10₺)","en":"Potatoes (+10₺)","de":"Kartoffeln (+10₺)","ru":"Картофель (+10₺)","fr":"Pommes de terre (+10₺)","ar":"بطاطس (+10₺)"},"price":10}]}},{"id":"bd13","name":{"tr":"5 Adet Et Döner (70gr)","en":"5 Beef Doner (70gr)","de":"5 Rindfleisch-Döner (70g)","ru":"5 Донер из говядины (70гр)","fr":"5 Döner Bœuf (70g)","ar":"5 دونر لحم (70غ)"},"price":1240,"description":{"tr":"5x Et Döner (70gr), 2x Büyük Boy Cips, Litrelik İçecek","en":"5x Beef Doner (70gr), 2x Large Chips, Liter Drink","de":"5x Rindfleisch-Döner (70g), 2x Große Chips, Liter Getränk","ru":"5x Донер из говядины (70гр), 2x Большие чипсы, Литровый напиток","fr":"5x Döner Bœuf (70g), 2x Grandes Chips, Boisson d\u0027un Litre","ar":"5x دونر لحم (70غ), 2x شيبس كبير, مشروب لتر"},"contents":{"tr":["5x Et Döner (70gr)","2x Büyük Boy Cips","Litrelik İçecek"],"en":["5x Beef Doner (70gr)","2x Large Chips","Liter Drink"],"de":["5x Rindfleisch-Döner (70g)","2x Große Chips","Liter Getränk"],"ru":["5x Донер из говядины (70гр)","2x Большие чипсы","Литровый напиток"],"fr":["5x Döner Bœuf (70g)","2x Grandes Chips","Boisson d\u0027un Litre"],"ar":["5x دونر لحم (70غ)","2x شيبس كبير","مشروب لتر"]},"options":[],"extras":{"potatoOptions":[{"id":"bd13_patates1","name":{"tr":"Patates (+10₺)","en":"Potatoes (+10₺)","de":"Kartoffeln (+10₺)","ru":"Картофель (+10₺)","fr":"Pommes de terre (+10₺)","ar":"بطاطس (+10₺)"},"price":10}]}},{"id":"bd14","name":{"tr":"5 Adet Et Döner (100gr)","en":"5 Beef Doner (100gr)","de":"5 Rindfleisch-Döner (100g)","ru":"5 Донер из говядины (100гр)","fr":"5 Döner Bœuf (100g)","ar":"5 دونر لحم (100غ)"},"price":1640,"description":{"tr":"5x Et Döner (100gr), 2x Büyük Boy Cips, Litrelik İçecek","en":"5x Beef Doner (100gr), 2x Large Chips, Liter Drink","de":"5x Rindfleisch-Döner (100g), 2x Große Chips, Liter Getränk","ru":"5x Донер из говядины (100гр), 2x Большие чипсы, Литровый напиток","fr":"5x Döner Bœuf (100g), 2x Grandes Chips, Boisson d\u0027un Litre","ar":"5x دونر لحم (100غ), 2x شيبس كبير, مشروب لتر"},"contents":{"tr":["5x Et Döner (100gr)","2x Büyük Boy Cips","Litrelik İçecek"],"en":["5x Beef Doner (100gr)","2x Large Chips","Liter Drink"],"de":["5x Rindfleisch-Döner (100g)","2x Große Chips","Liter Getränk"],"ru":["5x Донер из говядины (100гр)","2x Большие чипсы","Литровый напиток"],"fr":["5x Döner Bœuf (100g)","2x Grandes Chips","Boisson d\u0027un Litre"],"ar":["5x دونر لحم (100غ)","2x شيبس كبير","مشروب لتر"]},"options":[],"extras":{"potatoOptions":[{"id":"bd14_patates1","name":{"tr":"Patates (+10₺)","en":"Potatoes (+10₺)","de":"Kartoffeln (+10₺)","ru":"Картофель (+10₺)","fr":"Pommes de terre (+10₺)","ar":"بطاطس (+10₺)"},"price":10}]}}]},{"id":"pasta","name":{"tr":"Makarnalar","en":"Pasta","de":"Pasta","ru":"Pasta","fr":"Pasta","ar":"Pasta"},"products":[{"id":"pa1","name":{"tr":"Alfredo","en":"Alfredo","de":"Alfredo","ru":"Alfredo","fr":"Alfredo","ar":"Alfredo"},"price":200,"description":{"tr":"Kremalı Alfredo makarnası - Yoğun kremalı sos, parmesan peyniri ve taze otlarla hazırlanan nefis İtalyan makarnası. Antalya\u0027da en lezzetli Alfredo makarnası.","en":"Creamy Alfredo Pasta - Delicious Italian pasta prepared with rich creamy sauce, parmesan cheese and fresh herbs. The most delicious Alfredo pasta in Antalya.","de":"Cremige Alfredo Pasta - Köstliche italienische Pasta mit cremiger Sauce, Parmesan und frischen Kräutern. Die leckerste Alfredo Pasta in Antalya.","ru":"Кремовая паста Альфредо - Вкусная итальянская паста с густым сливочным соусом, пармезаном и свежими травами. Самая вкусная паста Альфредо в Анталье.","fr":"Pâtes Alfredo Crémeuses - Délicieuses pâtes italiennes préparées avec une sauce crémeuse riche, parmesan et herbes fraîches. Les pâtes Alfredo les plus délicieuses à Antalya.","ar":"معكرونة ألفريدو كريمية - معكرونة إيطالية لذيذة محضرة بصلصة كريمية غنية وجبن البارميزان وأعشاب طازجة. ألذ معكرونة ألفريدو في أنطاليا."},"contents":{"tr":["Jülyen Tavuk Parçaları (100-120gr)","Dağ Mantarı","Krema","Fesleğen"],"en":["Julienne Chicken Pieces (100-120gr)","Forest Mushrooms","Cream","Basil"],"de":["Julienne Chicken Pieces  (100-120g)","Forest Mushrooms","Cream","Basilikum"],"ru":["Julienne Chicken Pieces  (100-120gr)","Forest Mushrooms","Cream","Базилик"],"fr":["Julienne Chicken Pieces  (100-120g)","Forest Mushrooms","Cream","Basilic"],"ar":["Julienne Chicken Pieces  (100-120غr)","Forest Mushrooms","Cream","ريحان"]},"options":[{"id":"pa1_o1","label":{"tr":"Penne","en":"Penne","de":"Penne","ru":"Penne","fr":"Penne","ar":"Penne"},"price":0},{"id":"pa1_o2","label":{"tr":"Spagetti","en":"Spaghetti","de":"Spaghetti","ru":"Spaghetti","fr":"Spaghetti","ar":"Spaghetti"},"price":0},{"id":"pa1_o3","label":{"tr":"Fettuccine","en":"Fettuccine","de":"Fettuccine","ru":"Fettuccine","fr":"Fettuccine","ar":"Fettuccine"},"price":0}],"extras":{"drinkOptions":[{"id":"pa1_drink1","name":{"tr":"Ayran","en":"Ayran","de":"Ayran","ru":"Айран","fr":"Ayran","ar":"عيران"},"price":40},{"id":"pa1_drink2","name":{"tr":"Kutu İçecek","en":"Can Drink","de":"Dosengetränk","ru":"Напиток в банке","fr":"Boisson en Canette","ar":"مشروب معلب"},"price":60},{"id":"pa1_drink3","name":{"tr":"Litrelik İçecek","en":"Liter Drink","de":"Litergetränk","ru":"Литровый напиток","fr":"Boisson d\u0027un Litre","ar":"مشروب لتر"},"price":90}]}},{"id":"pa2","name":{"tr":"Napoliten","en":"Napolitana","de":"Napolitana","ru":"Napolitana","fr":"Napolitana","ar":"Napolitana"},"price":200,"description":{"tr":"Napoliten makarnası - Klasik Napoli usulü domates sosu, mozzarella peyniri ve taze fesleğen ile hazırlanan otantik İtalyan makarnası. Antalya Muratpaşa\u0027da en lezzetli Napoliten makarnası.","en":"Neapolitan Pasta - Authentic Italian pasta prepared with classic Neapolitan tomato sauce, mozzarella cheese and fresh basil. The most delicious Neapolitan pasta in Antalya Muratpaşa.","de":"Neapolitanische Pasta - Authentische italienische Pasta mit klassischer neapolitanischer Tomatensauce, Mozzarella und frischem Basilikum. Die leckerste neapolitanische Pasta in Antalya Muratpaşa.","ru":"Неаполитанская паста - Аутентичная итальянская паста с классическим неаполитанским томатным соусом, моцареллой и свежим базиликом. Самая вкусная неаполитанская паста в Анталье Муратпаша.","fr":"Pâtes Néapolitaines - Pâtes italiennes authentiques préparées avec une sauce tomate néapolitaine classique, mozzarella et basilic frais. Les pâtes néapolitaines les plus délicieuses à Antalya Muratpaşa.","ar":"معكرونة نابولي - معكرونة إيطالية أصيلة محضرة بصلصة طماطم نابولية كلاسيكية وجبن موزاريلا وريحان طازج. ألذ معكرونة نابولية في أنطاليا مراتباشا."},"contents":{"tr":["Domates","Fesleğen","Baharat"],"en":["Tomatoes","Fresh Basil","Spices"],"de":["Tomaten","Fresh Basil","Spices"],"ru":["Помидоры","Fresh Basil","Spices"],"fr":["Tomates","Fresh Basil","Spices"],"ar":["طماطم","Fresh Basil","Spices"]},"options":[{"id":"pa2_o1","label":{"tr":"Spagetti","en":"Spaghetti","de":"Spaghetti","ru":"Spaghetti","fr":"Spaghetti","ar":"Spaghetti"},"price":0},{"id":"pa2_o2","label":{"tr":"Penne","en":"Penne","de":"Penne","ru":"Penne","fr":"Penne","ar":"Penne"},"price":0},{"id":"pa2_o3","label":{"tr":"Fettuccine","en":"Fettuccine","de":"Fettuccine","ru":"Fettuccine","fr":"Fettuccine","ar":"Fettuccine"},"price":0}],"extras":{"drinkOptions":[{"id":"pa2_drink1","name":{"tr":"Ayran","en":"Ayran","de":"Ayran","ru":"Айран","fr":"Ayran","ar":"عيران"},"price":40},{"id":"pa2_drink2","name":{"tr":"Kutu İçecek","en":"Can Drink","de":"Dosengetränk","ru":"Напиток в банке","fr":"Boisson en Canette","ar":"مشروب معلب"},"price":60},{"id":"pa2_drink3","name":{"tr":"Litrelik İçecek","en":"Liter Drink","de":"Litergetränk","ru":"Литровый напиток","fr":"Boisson d\u0027un Litre","ar":"مشروب لتر"},"price":90}]}},{"id":"pa3","name":{"tr":"Bolonez","en":"Bolognese","de":"Bolognese","ru":"Болоньезе","fr":"Bolognaise","ar":"بولونيز"},"price":200,"description":{"tr":"","en":"","de":"","ru":"","fr":"","ar":""},"contents":{"tr":["Dana Kıyma (100gr)","Sarımsak","Soğan","Baharat"],"en":["Beef Mince (100gr)","Garlic","Onion","Spices"],"de":["Rindfleischhackfleisch (100g)","Knoblauch","Zwiebel","Gewürze"],"ru":["Говяжий фарш (100гр)","Чеснок","Лук","Специи"],"fr":["Viande Hachée de Bœuf (100g)","Ail","Oignon","Épices"],"ar":["لحم بقري مفروم (100غ)","ثوم","بصل","توابل"]},"options":[{"id":"pa3_o1","label":{"tr":"Penne","en":"Penne","de":"Penne","ru":"Penne","fr":"Penne","ar":"Penne"},"price":0},{"id":"pa3_o2","label":{"tr":"Spagetti","en":"Spaghetti","de":"Spaghetti","ru":"Spaghetti","fr":"Spaghetti","ar":"Spaghetti"},"price":0},{"id":"pa3_o3","label":{"tr":"Fettuccine","en":"Fettuccine","de":"Fettuccine","ru":"Fettuccine","fr":"Fettuccine","ar":"Fettuccine"},"price":0}],"extras":{"drinkOptions":[{"id":"pa3_drink1","name":{"tr":"Ayran","en":"Ayran","de":"Ayran","ru":"Айран","fr":"Ayran","ar":"عيران"},"price":40},{"id":"pa3_drink2","name":{"tr":"Kutu İçecek","en":"Can Drink","de":"Dosengetränk","ru":"Напиток в банке","fr":"Boisson en Canette","ar":"مشروب معلب"},"price":60},{"id":"pa3_drink3","name":{"tr":"Litrelik İçecek","en":"Liter Drink","de":"Litergetränk","ru":"Литровый напиток","fr":"Boisson d\u0027un Litre","ar":"مشروب لتر"},"price":90}]}},{"id":"pa4","name":{"tr":"Pesto","en":"Pesto","de":"Pesto","ru":"Песто","fr":"Pesto","ar":"بيستو"},"price":200,"description":{"tr":"","en":"","de":"","ru":"","fr":"","ar":""},"contents":{"tr":["Fesleğen","Krema","Kekik","Baharat"],"en":["Basil","Thyme","Spices"],"de":["Basilikum","Thymian","Gewürze"],"ru":["Базилик","Тимьян","Специи"],"fr":["Basilic","Thym","Épices"],"ar":["ريحان","زعتر","توابل"]},"options":[{"id":"pa4_o1","label":{"tr":"Penne","en":"Penne","de":"Penne","ru":"Penne","fr":"Penne","ar":"Penne"},"price":0},{"id":"pa4_o2","label":{"tr":"Spagetti","en":"Spaghetti","de":"Spaghetti","ru":"Spaghetti","fr":"Spaghetti","ar":"Spaghetti"},"price":0},{"id":"pa4_o3","label":{"tr":"Fettuccine","en":"Fettuccine","de":"Fettuccine","ru":"Fettuccine","fr":"Fettuccine","ar":"Fettuccine"},"price":0}],"extras":{"drinkOptions":[{"id":"pa4_drink1","name":{"tr":"Ayran","en":"Ayran","de":"Ayran","ru":"Айран","fr":"Ayran","ar":"عيران"},"price":40},{"id":"pa4_drink2","name":{"tr":"Kutu İçecek","en":"Can Drink","de":"Dosengetränk","ru":"Напиток в банке","fr":"Boisson en Canette","ar":"مشروب معلب"},"price":60},{"id":"pa4_drink3","name":{"tr":"Litrelik İçecek","en":"Liter Drink","de":"Litergetränk","ru":"Литровый напиток","fr":"Boisson d\u0027un Litre","ar":"مشروب لتر"},"price":90}]}},{"id":"pa5","name":{"tr":"Arabiata","en":"Arrabbiata","de":"Arrabbiata","ru":"Аррабиата","fr":"Arrabbiata","ar":"أرابياتا"},"price":200,"description":{"tr":"","en":"","de":"","ru":"","fr":"","ar":""},"contents":{"tr":["Domates","Acı Sos","Dilim Siyah Zeytin"],"en":["Tomatoes","Hot Sauce","Sliced Black Olives"],"de":["Tomaten","Scharfe Sauce","Geschnittene Schwarze Oliven"],"ru":["Помидоры","Острый соус","Нарезанные черные оливки"],"fr":["Tomates","Sauce Piquante","Olives Noires Tranchées"],"ar":["طماطم","صلصة حارة","زيتون أسود مقطع"]},"options":[{"id":"pa5_o1","label":{"tr":"Penne","en":"Penne","de":"Penne","ru":"Penne","fr":"Penne","ar":"Penne"},"price":0},{"id":"pa5_o2","label":{"tr":"Spagetti","en":"Spaghetti","de":"Spaghetti","ru":"Spaghetti","fr":"Spaghetti","ar":"Spaghetti"},"price":0},{"id":"pa5_o3","label":{"tr":"Fettuccine","en":"Fettuccine","de":"Fettuccine","ru":"Fettuccine","fr":"Fettuccine","ar":"Fettuccine"},"price":0}],"extras":{"drinkOptions":[{"id":"pa5_drink1","name":{"tr":"Ayran","en":"Ayran","de":"Ayran","ru":"Айран","fr":"Ayran","ar":"عيران"},"price":40},{"id":"pa5_drink2","name":{"tr":"Kutu İçecek","en":"Can Drink","de":"Dosengetränk","ru":"Напиток в банке","fr":"Boisson en Canette","ar":"مشروب معلب"},"price":60},{"id":"pa5_drink3","name":{"tr":"Litrelik İçecek","en":"Liter Drink","de":"Litergetränk","ru":"Литровый напиток","fr":"Boisson d\u0027un Litre","ar":"مشروب لتر"},"price":90}]}},{"id":"pa6","name":{"tr":"Ton Balıklı","en":"Tuna","de":"Thunfisch","ru":"С тунцом","fr":"Thon","ar":"بالتونة"},"price":200,"description":{"tr":"","en":"","de":"","ru":"","fr":"","ar":""},"contents":{"tr":["Ton Balığı (100gr)","Krema","Zeytin","Mısır","Turşu"],"en":["Tuna Fish (100gr)","Cream","Olives","Corn","Pickles"],"de":["Thunfisch (100g)","Sahne","Oliven","Mais","Essiggurken"],"ru":["Тунец (100гр)","Сливки","Оливки","Кукуруза","Маринованные огурцы"],"fr":["Thon (100g)","Crème","Olives","Maïs","Cornichons"],"ar":["تونة (100غ)","كريمة","زيتون","ذرة","مخلل"]},"options":[{"id":"pa6_o1","label":{"tr":"Penne","en":"Penne","de":"Penne","ru":"Penne","fr":"Penne","ar":"Penne"},"price":0},{"id":"pa6_o2","label":{"tr":"Spagetti","en":"Spaghetti","de":"Spaghetti","ru":"Spaghetti","fr":"Spaghetti","ar":"Spaghetti"},"price":0},{"id":"pa6_o3","label":{"tr":"Fettuccine","en":"Fettuccine","de":"Fettuccine","ru":"Fettuccine","fr":"Fettuccine","ar":"Fettuccine"},"price":0}],"extras":{"drinkOptions":[{"id":"pa6_drink1","name":{"tr":"Ayran","en":"Ayran","de":"Ayran","ru":"Айран","fr":"Ayran","ar":"عيران"},"price":40},{"id":"pa6_drink2","name":{"tr":"Kutu İçecek","en":"Can Drink","de":"Dosengetränk","ru":"Напиток в банке","fr":"Boisson en Canette","ar":"مشروب معلب"},"price":60},{"id":"pa6_drink3","name":{"tr":"Litrelik İçecek","en":"Liter Drink","de":"Litergetränk","ru":"Литровый напиток","fr":"Boisson d\u0027un Litre","ar":"مشروب لتر"},"price":90}]}},{"id":"pa7","name":{"tr":"Türk Usulü 4 Peynirli","en":"Turkish 4 Cheese","de":"Türkischer 4-Käse","ru":"Турецкий 4 сыра","fr":"4 Fromages Turc","ar":"4 أجبان تركية"},"price":200,"description":{"tr":"","en":"","de":"","ru":"","fr":"","ar":""},"contents":{"tr":["Bergama Tulumu","Ezine Peyniri","Kaşar","Beyaz Peynir","Krema","Fesleğen"],"en":["Bergama Tulum","Ezine Cheese","Cheddar","White Cheese","Cream","Basil"],"de":["Bergama Tulum","Ezine Käse","Cheddar","Weißer Käse","Sahne","Basilikum"],"ru":["Бергама Туллум","Сыр Эзине","Чеддер","Белый сыр","Сливки","Базилик"],"fr":["Bergama Tulum","Fromage Ezine","Cheddar","Fromage Blanc","Crème","Basilic"],"ar":["برغاما تولوم","جبن إزينه","شيدر","جبن أبيض","كريمة","ريحان"]},"options":[{"id":"pa7_o1","label":{"tr":"Penne","en":"Penne","de":"Penne","ru":"Penne","fr":"Penne","ar":"Penne"},"price":0},{"id":"pa7_o2","label":{"tr":"Spagetti","en":"Spaghetti","de":"Spaghetti","ru":"Spaghetti","fr":"Spaghetti","ar":"Spaghetti"},"price":0},{"id":"pa7_o3","label":{"tr":"Fettuccine","en":"Fettuccine","de":"Fettuccine","ru":"Fettuccine","fr":"Fettuccine","ar":"Fettuccine"},"price":0}],"extras":{"drinkOptions":[{"id":"pa7_drink1","name":{"tr":"Ayran","en":"Ayran","de":"Ayran","ru":"Айран","fr":"Ayran","ar":"عيران"},"price":40},{"id":"pa7_drink2","name":{"tr":"Kutu İçecek","en":"Can Drink","de":"Dosengetränk","ru":"Напиток в банке","fr":"Boisson en Canette","ar":"مشروب معلب"},"price":60},{"id":"pa7_drink3","name":{"tr":"Litrelik İçecek","en":"Liter Drink","de":"Litergetränk","ru":"Литровый напиток","fr":"Boisson d\u0027un Litre","ar":"مشروب لتر"},"price":90}]}}]},{"id":"manti","name":{"tr":"Mantı","en":"Manti","de":"Manti","ru":"Манты","fr":"Manti","ar":"منتي"},"products":[{"id":"ma1","name":{"tr":"Ev Yapımı Mantı","en":"Homemade Manti","de":"Hausgemachte Manti","ru":"Домашние манты","fr":"Manti Maison","ar":"منتي منزلي"},"price":200,"description":{"tr":"","en":"","de":"","ru":"","fr":"","ar":""},"contents":{"tr":["Haşlanmış Mantı","%100 Dana Kıyma (250gr)","Tereyağında Kavrulmuş Pul Biber ve Nane Sosu"],"en":["Boiled Manti","100% Beef Mince (250gr)","Red Pepper Flakes and Mint Sauce Fried in Butter"],"de":["Gekochte Manti","100% Rindfleisch-Hackfleisch (250gr)","In Butter gebratene Paprikaflocken und Minzsauce"],"ru":["Вареные манты","100% говяжий фарш (250гр)","Обжаренные в масле хлопья перца и мятный соус"],"fr":["Manti Bouillis","100% Viande de Bœuf Hachée (250gr)","Flocons de Piment Frits au Beurre et Sauce à la Menthe"],"ar":["منتي مسلوق","100% لحم بقري مفروم (250غ)","رقائق فلفل محمرة بالزبدة وصلصة النعناع"]},"options":[{"id":"ma1_o1","label":{"tr":"Sade Yoğurt","en":"Plain Yogurt","de":"Naturjoghurt","ru":"Обычный йогурт","fr":"Yaourt Nature","ar":"زبادي عادي"},"price":0},{"id":"ma1_o2","label":{"tr":"Sarımsaklı Yoğurt","en":"Garlic Yogurt","de":"Knoblauchjoghurt","ru":"Йогурт с чесноком","fr":"Yaourt à l\u0027Ail","ar":"زبادي بالثوم"},"price":0}],"extras":{"drinkOptions":[{"id":"ma1_drink1","name":{"tr":"Ayran","en":"Ayran","de":"Ayran","ru":"Айран","fr":"Ayran","ar":"عيران"},"price":40},{"id":"ma1_drink2","name":{"tr":"Kutu İçecek","en":"Can Drink","de":"Dosengetränk","ru":"Напиток в банке","fr":"Boisson en Canette","ar":"مشروب معلب"},"price":60},{"id":"ma1_drink3","name":{"tr":"Litrelik İçecek","en":"Liter Drink","de":"Litergetränk","ru":"Литровый напиток","fr":"Boisson d\u0027un Litre","ar":"مشروب لتر"},"price":90}]}}]},{"id":"hamburger","name":{"tr":"Hamburger","en":"Hamburger","de":"Hamburger","ru":"Гамбургер","fr":"Hamburger","ar":"هامبورجر"},"products":[{"id":"h1","name":{"tr":"Hamburger","en":"Hamburger","de":"Hamburger","ru":"Гамбургер","fr":"Hamburger","ar":"هامبورجر"},"price":250,"description":{"tr":"","en":"","de":"","ru":"","fr":"","ar":""},"contents":{"tr":["10gr Ev Yapımı Köfte","Marul","Turşu","Domates"],"en":["120gr Homemade Patty","Lettuce","Pickles","Tomatoes"],"de":["120gr Hausgemachte Frikadelle","Salat","Essiggurken","Tomaten"],"ru":["120гр Домашняя котлета","Салат","Маринованные огурцы","Помидоры"],"fr":["120gr Galette Maison","Laitue","Cornichons","Tomates"],"ar":["120غ كفتة منزلية","خس","مخلل","طماطم"]},"options":[{"id":"h1_o1","label":{"tr":"Sade Hamburger","en":"Plain Hamburger","de":"Einfacher Hamburger","ru":"Обычный гамбургер","fr":"Hamburger Simple","ar":"هامبورجر عادي"},"price":0},{"id":"h1_o2","label":{"tr":"Menü (Cips + Kola)","en":"Menu (Chips + Cola)","de":"Menü (Chips + Cola)","ru":"Меню (Чипсы + Кола)","fr":"Menu (Chips + Cola)","ar":"قائمة (رقائق + كولا)"},"price":80}]},{"id":"h2","name":{"tr":"Cheeseburger","en":"Cheeseburger","de":"Cheeseburger","ru":"Чизбургер","fr":"Cheeseburger","ar":"تشيز برجر"},"price":270,"description":{"tr":"","en":"","de":"","ru":"","fr":"","ar":""},"contents":{"tr":["","Cheddar Peyniri","Marul","Turşu","Domates"],"en":["120gr Homemade Patty","Cheddar Cheese","Lettuce","Pickles","Tomatoes"],"de":["120gr Hausgemachte Frikadelle","Cheddar-Käse","Salat","Essiggurken","Tomaten"],"ru":["120гр Домашняя котлета","Сыр Чеддер","Салат","Маринованные огурцы","Помидоры"],"fr":["120gr Galette Maison","Fromage Cheddar","Laitue","Cornichons","Tomates"],"ar":["120غ كفتة منزلية","جبن شيدر","خس","مخلل","طماطم"]},"options":[{"id":"h2_o1","label":{"tr":"Sade Cheeseburger","en":"Plain Cheeseburger","de":"Einfacher Cheeseburger","ru":"Обычный чизбургер","fr":"Cheeseburger Simple","ar":"تشيز برجر عادي"},"price":0},{"id":"h2_o2","label":{"tr":"Menü (Cips + Kola)","en":"Menu (Chips + Cola)","de":"Menü (Chips + Cola)","ru":"Меню (Чипсы + Кола)","fr":"Menu (Chips + Cola)","ar":"قائمة (رقائق + كولا)"},"price":80}]},{"id":"h3","name":{"tr":"Tavuk Burger","en":"Chicken Burger","de":"Hähnchen-Burger","ru":"Куриный бургер","fr":"Burger au Poulet","ar":"برجر دجاج"},"price":170,"description":{"tr":"","en":"","de":"","ru":"","fr":"","ar":""},"contents":{"tr":["Tavuk Burger","Marul","Turşu","Domates","Özel Sos"],"en":["Chicken Burger","Lettuce","Pickles","Tomatoes","Special Sauce"],"de":["Hähnchen-Burger","Salat","Essiggurken","Tomaten","Spezielle Sauce"],"ru":["Куриный бургер","Салат","Маринованные огурцы","Помидоры","Специальный соус"],"fr":["Burger au Poulet","Laitue","Cornichons","Tomates","Sauce Spéciale"],"ar":["برجر دجاج","خس","مخلل","طماطم","صلصة خاصة"]},"options":[{"id":"h3_o1","label":{"tr":"Sade Tavuk Burger","en":"Plain Chicken Burger","de":"Einfacher Hähnchen-Burger","ru":"Обычный куриный бургер","fr":"Burger au Poulet Simple","ar":"برجر دجاج عادي"},"price":0},{"id":"h3_o2","label":{"tr":"Menü (Cips + Kola)","en":"Menu (Chips + Cola)","de":"Menü (Chips + Cola)","ru":"Меню (Чипсы + Кола)","fr":"Menu (Chips + Cola)","ar":"قائمة (رقائق + كولا)"},"price":80}]}]},{"id":"kofte","name":{"tr":"Köfte Spesiyel","en":"Meatball Special","de":"Meatball Special","ru":"Meatball Special","fr":"Meatball Special","ar":"Meatball Special"},"products":[{"id":"k1","name":{"tr":"Şefin Izgara Köftesi","en":"Chef\u0027s Grilled Meatballs","de":"Chef\u0027s Grilled Meatballs","ru":"Chef\u0027s Grilled Meatballs","fr":"Chef\u0027s Grilled Meatballs","ar":"Chef\u0027s Grilled Meatballs"},"price":300,"description":{"tr":"","en":"","de":"","ru":"","fr":"","ar":""},"contents":{"tr":["180gr Izgara Köfte","Pilav","Salata"],"en":["180gr Grilled Meatballs","Rice","Salad"],"de":["180gr Grilled Meatballs","Rice","Salad"],"ru":["180gr Grilled Meatballs","Rice","Salad"],"fr":["180gr Grilled Meatballs","Rice","Salad"],"ar":["180gr Grilled Meatballs","Rice","Salad"]},"options":[{"id":"k1_o1","label":{"tr":"Sade Köfte","en":"Plain Meatballs","de":"Plain Meatballs","ru":"Plain Meatballs","fr":"Plain Meatballs","ar":"Plain Meatballs"},"price":0},{"id":"k1_o2","label":{"tr":"Menü (Cips + Kola)","en":"Menu (Chips + Cola)","de":"Menu (Chips + Cola)","ru":"Menu (Chips + Cola)","fr":"Menu (Chips + Cola)","ar":"Menu (Chips + Cola)"},"price":80}]},{"id":"k2","name":{"tr":"Ekmek Arası Köfte","en":"Meatball Sandwich","de":"Meatball Sandwich","ru":"Meatball Sandwich","fr":"Meatball Sandwich","ar":"Meatball Sandwich"},"price":200,"description":{"tr":"","en":"","de":"","ru":"","fr":"","ar":""},"contents":{"tr":["120gr Ekmek Arası Köfte","Marul","Turşu","Domates"],"en":["120gr Meatball Sandwich","Lettuce","Pickles","Tomatoes"],"de":["120gr Meatball Sandwich","Lettuce","Pickles","Tomatoes"],"ru":["120gr Meatball Sandwich","Lettuce","Pickles","Tomatoes"],"fr":["120gr Meatball Sandwich","Lettuce","Pickles","Tomatoes"],"ar":["120gr Meatball Sandwich","Lettuce","Pickles","Tomatoes"]},"options":[{"id":"k2_o1","label":{"tr":"Sade Ekmek Arası","en":"Plain Sandwich","de":"Plain Sandwich","ru":"Plain Sandwich","fr":"Plain Sandwich","ar":"Plain Sandwich"},"price":0},{"id":"k2_o2","label":{"tr":"Menü (Cips + Kola)","en":"Menu (Chips + Cola)","de":"Menu (Chips + Cola)","ru":"Menu (Chips + Cola)","fr":"Menu (Chips + Cola)","ar":"Menu (Chips + Cola)"},"price":80}]},{"id":"k3","name":{"tr":"Ekmek Arası Kaşarlı Köfte","en":"Cheddar Meatball Sandwich","de":"Cheddar Meatball Sandwich","ru":"Cheddar Meatball Sandwich","fr":"Cheddar Meatball Sandwich","ar":"Cheddar Meatball Sandwich"},"price":220,"description":{"tr":"","en":"","de":"","ru":"","fr":"","ar":""},"contents":{"tr":["120gr Ekmek Arası Kaşarlı Köfte"],"en":["120gr Cheddar Meatball Sandwich"],"de":["120gr Cheddar Meatball Sandwich"],"ru":["120gr Cheddar Meatball Sandwich"],"fr":["120gr Cheddar Meatball Sandwich"],"ar":["120gr Cheddar Meatball Sandwich"]},"options":[{"id":"k3_o1","label":{"tr":"Sade Kaşarlı Köfte","en":"Plain Cheddar Meatballs","de":"Plain Cheddar Meatballs","ru":"Plain Cheddar Meatballs","fr":"Plain Cheddar Meatballs","ar":"Plain Cheddar Meatballs"},"price":0},{"id":"k3_o2","label":{"tr":"Menü (Cips + Kola)","en":"Menu (Chips + Cola)","de":"Menu (Chips + Cola)","ru":"Menu (Chips + Cola)","fr":"Menu (Chips + Cola)","ar":"Menu (Chips + Cola)"},"price":80}]}]},{"id":"aperatifler","name":{"tr":"Aperatifler","en":"Appetizers","de":"Appetizers","ru":"Appetizers","fr":"Appetizers","ar":"Appetizers"},"products":[{"id":"a1","name":{"tr":"Elma Dilim Patates","en":"Apple Slice Potatoes","de":"Apple Slice Potatoes","ru":"Apple Slice Potatoes","fr":"Apple Slice Potatoes","ar":"Apple Slice Potatoes"},"price":100,"description":{"tr":"Elma Dilim Patates","en":"Apple Slice Potatoes","de":"Apple Slice Potatoes","ru":"Apple Slice Potatoes","fr":"Apple Slice Potatoes","ar":"Apple Slice Potatoes"},"contents":{"tr":["Elma Dilim Patates"],"en":["Apple Slice Potatoes"],"de":["Apple Slice Potatoes"],"ru":["Apple Slice Potatoes"],"fr":["Apple Slice Potatoes"],"ar":["Apple Slice Potatoes"]},"options":[]},{"id":"a2","name":{"tr":"Parmak Patates","en":"Finger Potatoes","de":"Finger Potatoes","ru":"Finger Potatoes","fr":"Finger Potatoes","ar":"Finger Potatoes"},"price":100,"description":{"tr":"Parmak Patates","en":"Finger Potatoes","de":"Finger Potatoes","ru":"Finger Potatoes","fr":"Finger Potatoes","ar":"Finger Potatoes"},"contents":{"tr":["Parmak Patates"],"en":["Finger Potatoes"],"de":["Finger Potatoes"],"ru":["Finger Potatoes"],"fr":["Finger Potatoes"],"ar":["Finger Potatoes"]},"options":[]},{"id":"a3","name":{"tr":"Çıtır Tavuk Tabağı","en":"Crispy Chicken Plate","de":"Crispy Chicken Plate","ru":"Crispy Chicken Plate","fr":"Crispy Chicken Plate","ar":"Crispy Chicken Plate"},"price":200,"description":{"tr":"Çıtır Tavuk Taneleri ve Patates","en":"Crispy Chicken Pieces and Potatoes","de":"Crispy Chicken Pieces and Potatoes","ru":"Crispy Chicken Pieces and Potatoes","fr":"Crispy Chicken Pieces and Potatoes","ar":"Crispy Chicken Pieces and Potatoes"},"contents":{"tr":["Çıtır Tavuk Taneleri"],"en":["Crispy Chicken Pieces"],"de":["Crispy Chicken Pieces"],"ru":["Crispy Chicken Pieces"],"fr":["Crispy Chicken Pieces"],"ar":["Crispy Chicken Pieces"]},"options":[{"id":"a3_o1","label":{"tr":"Elma Dilim Patates","en":"Apple Slice Potatoes","de":"Apple Slice Potatoes","ru":"Apple Slice Potatoes","fr":"Apple Slice Potatoes","ar":"Apple Slice Potatoes"},"price":0},{"id":"a3_o2","label":{"tr":"Parmak Patates","en":"Finger Potatoes","de":"Finger Potatoes","ru":"Finger Potatoes","fr":"Finger Potatoes","ar":"Finger Potatoes"},"price":0}]}]},{"id":"bistro","name":{"tr":"Bistro","en":"Bistro","de":"Bistro","ru":"Bistro","fr":"Bistro","ar":"Bistro"},"products":[{"id":"b1","name":{"tr":"Chicken Stroganoff","en":"Chicken Stroganoff","de":"Chicken Stroganoff","ru":"Chicken Stroganoff","fr":"Chicken Stroganoff","ar":"Chicken Stroganoff"},"price":300,"description":{"tr":"","en":"","de":"","ru":"","fr":"","ar":""},"contents":{"tr":["Tavuk Bonfile (200-250gr)","Krema","Turşu","Mantar","Demiglass Sos","Patates Cipsi","Akdeniz Yeşillikleri"],"en":["Chicken Fillet (200-250gr)","Cream","Pickles","Mushrooms","Demiglace Sauce","Potato Chips","Mediterranean Greens"],"de":["Chicken Fillet  (200-250g)","Cream","Essiggurken","Pilze","Demiglace Sauce","Potato Chips","Mediterranean Greens"],"ru":["Chicken Fillet  (200-250gr)","Cream","Маринованные огурцы","Грибы","Demiglace Sauce","Potato Chips","Mediterranean Greens"],"fr":["Chicken Fillet  (200-250g)","Cream","Cornichons","Champignons","Demiglace Sauce","Potato Chips","Mediterranean Greens"],"ar":["Chicken Fillet  (200-250غr)","Cream","مخلل","فطر","Demiglace Sauce","Potato Chips","Mediterranean Greens"]},"options":[],"extras":{"drinkOptions":[{"id":"b1_drink1","name":{"tr":"Kutu İçecek","en":"Can Drink","de":"Dosengetränk","ru":"Напиток в банке","fr":"Boisson en Canette","ar":"مشروب معلب"},"price":60}],"extraOptions":[{"id":"b1_extra1","name":{"tr":"Ekstra Baget Ekmek","en":"Extra Baguette Bread","de":"Extra Baguette Bread","ru":"Extra Baguette Bread","fr":"Extra Baguette Bread","ar":"Extra Baguette Bread"},"price":5}]}},{"id":"b2","name":{"tr":"Tavuk Quesadilla","en":"Chicken Quesadilla","de":"Hähnchen Quesadilla","ru":"Куриная кесадилья","fr":"Quesadilla au Poulet","ar":"كيساديا دجاج"},"price":300,"description":{"tr":"","en":"","de":"","ru":"","fr":"","ar":""},"contents":{"tr":["Tavuk Parçaları (200gr)","Kaşar Peyniri","Biber","Mısır","Zeytin","Barbekü Sos"],"en":["Chicken Pieces (200gr)","Cheddar Cheese","Pepper","Corn","Olives","BBQ Sauce"],"de":["Hähnchenstücke (200g)","Cheddar-Käse","Paprika","Mais","Oliven","BBQ-Sauce"],"ru":["Кусочки курицы (200гр)","сыр Чеддер","перец","кукуруза","оливки","соус барбекю"],"fr":["Morceaux de Poulet (200g)","Fromage Cheddar","Poivron","Maïs","Olives","Sauce BBQ"],"ar":["قطع دجاج (200غ)","جبن شيدر","فلفل","ذرة","زيتون","صلصة باربيكيو"]},"options":[],"extras":{"drinkOptions":[{"id":"b2_drink1","name":{"tr":"Kutu İçecek","en":"Can Drink","de":"Dosengetränk","ru":"Напиток в банке","fr":"Boisson en Canette","ar":"مشروب معلب"},"price":60}]}},{"id":"b3","name":{"tr":"Kaşarlı Mantarlı Quesadilla","en":"Cheddar Mushroom Quesadilla","de":"Cheddar-Pilz Quesadilla","ru":"Кесадилья с сыром и грибами","fr":"Quesadilla Cheddar Champignons","ar":"كيساديا بالجبن والفطر"},"price":300,"description":{"tr":"","en":"","de":"","ru":"","fr":"","ar":""},"contents":{"tr":["Kaşar Peyniri","Mantar","Mısır","Zeytin"],"en":["Cheddar Cheese","Mushrooms","Corn","Olives"],"de":["Cheddar-Käse","Pilze","Mais","Oliven"],"ru":["сыр Чеддер","грибы","кукуруза","оливки"],"fr":["Fromage Cheddar","Champignons","Maïs","Olives"],"ar":["جبن شيدر","فطر","ذرة","زيتون"]},"options":[],"extras":{"drinkOptions":[{"id":"b3_drink1","name":{"tr":"Kutu İçecek","en":"Can Drink","de":"Dosengetränk","ru":"Напиток в банке","fr":"Boisson en Canette","ar":"مشروب معلب"},"price":60}]}},{"id":"b4","name":{"tr":"Viyana Piliç Şinitzel","en":"Vienna Chicken Schnitzel","de":"Wiener Hähnchenschnitzel","ru":"Венский куриный шницель","fr":"Escalope de Poulet Viennoise","ar":"شنتسل دجاج فيينا"},"price":300,"description":{"tr":"","en":"","de":"","ru":"","fr":"","ar":""},"contents":{"tr":["Panelenmiş Tavuk Göğsü (250-300gr)","Akdeniz Yeşillikleri","Napoliten/Sade Makarna veya Pilav"],"en":["Breaded Chicken Breast (200gr)","Mediterranean Greens"],"de":["Panierte Hähnchenbrust (200g)","Mittelmeergrün"],"ru":["Панированная куриная грудка (200гр)","средиземноморская зелень"],"fr":["Blanc de Poulet Pané (200g)","Verts Méditerranéens"],"ar":["صدر دجاج مقطع (200غ)","خضار البحر المتوسط"]},"options":[],"extras":{"drinkOptions":[{"id":"b4_drink1","name":{"tr":"Kutu İçecek","en":"Can Drink","de":"Dosengetränk","ru":"Напиток в банке","fr":"Boisson en Canette","ar":"مشروب معلب"},"price":60}]}},{"id":"b5","name":{"tr":"Tavuk Wrap","en":"Chicken Wrap","de":"Hähnchen Wrap","ru":"Куриный ролл","fr":"Wrap au Poulet","ar":"لفة دجاج"},"price":300,"description":{"tr":"","en":"","de":"","ru":"","fr":"","ar":""},"contents":{"tr":["Tavuk Bonfile (200gr)","Soğan","Sarımsak","Biber","Dağ Kekiği","Mantar","Kajun Baharatı","Patates Cipsi","Salata"],"en":["Chicken Fillet (200gr)","Onion","Garlic","Pepper","Mountain Thyme","Mushrooms","Cajun Spices","Potato Chips","Salad"],"de":["Hähnchenfilet (200g)","Zwiebel","Knoblauch","Paprika","Bergthymian","Pilze","Cajun-Gewürze","Kartoffelchips","Salat"],"ru":["Куриное филе (200гр)","лук","чеснок","перец","горный тимьян","грибы","каджунские специи","картофельные чипсы","салат"],"fr":["Filet de Poulet (200g)","Oignon","Ail","Poivron","Thym des Montagnes","Champignons","Épices Cajun","Chips de Pommes de Terre","Salade"],"ar":["فيليه دجاج (200غ)","بصل","ثوم","فلفل","زعتر جبلي","فطر","توابل كاجون","شيبس","سلطة"]},"options":[],"extras":{"drinkOptions":[{"id":"b5_drink1","name":{"tr":"Kutu İçecek","en":"Can Drink","de":"Dosengetränk","ru":"Напиток в банке","fr":"Boisson en Canette","ar":"مشروب معلب"},"price":60}]}},{"id":"b6","name":{"tr":"Dağ Kekikli Kremalı Tavuk","en":"Mountain Thyme Cream Chicken","de":"Bergthymian-Sahne-Hähnchen","ru":"Курица с кремом и горным тимьяном","fr":"Poulet à la Crème au Thym des Montagnes","ar":"دجاج بالكريمة والزعتر الجبلي"},"price":300,"description":{"tr":"","en":"","de":"","ru":"","fr":"","ar":""},"contents":{"tr":["Sade/Napoliten Makarna veya Pilav","Jülyen Tavuk (200gr)","Krema","Karabiber","Kekik","Sarımsak","Biber","Mantar","Akdeniz Yeşillikleri"],"en":["Julienne Chicken (200gr)","Cream","Black Pepper","Thyme","Garlic","Pepper","Mushrooms","Mediterranean Greens"],"de":["Julienne-Hähnchen (200g)","Sahne","Schwarzer Pfeffer","Thymian","Knoblauch","Paprika","Pilze","Mittelmeergrün"],"ru":["Жюльен курица (200гр)","сливки","черный перец","тимьян","чеснок","перец","грибы","средиземноморская зелень"],"fr":["Poulet Julienne (200g)","Crème","Poivre Noir","Thym","Ail","Poivron","Champignons","Verts Méditerranéens"],"ar":["دجاج جوليان (200غ)","كريمة","فلفل أسود","زعتر","ثوم","فلفل","فطر","خضار البحر المتوسط"]},"options":[],"extras":{"drinkOptions":[{"id":"b6_drink1","name":{"tr":"Kutu İçecek","en":"Can Drink","de":"Dosengetränk","ru":"Напиток в банке","fr":"Boisson en Canette","ar":"مشروب معلب"},"price":60}]}},{"id":"b7","name":{"tr":"Mantarlı Köri Soslu Tavuk","en":"Mushroom Curry Sauce Chicken","de":"Hähnchen mit Pilz-Curry-Sauce","ru":"Курица с грибным соусом карри","fr":"Poulet Sauce Curry aux Champignons","ar":"دجاج بصلصة الكاري والفطر"},"price":300,"description":{"tr":"","en":"","de":"","ru":"","fr":"","ar":""},"contents":{"tr":["Sade/Napoliten Makarna veya Pilav","Jülyen Tavuk (200gr)","Krema","Mantar","Köri","Akdeniz Yeşillikleri"],"en":["Julienne Chicken (200gr)","Cream","Mushrooms","Curry","Mediterranean Greens"],"de":["Julienne-Hähnchen (200g)","Sahne","Pilze","Curry","Mittelmeergrün"],"ru":["Жюльен курица (200гр)","сливки","грибы","карри","средиземноморская зелень"],"fr":["Poulet Julienne (200g)","Crème","Champignons","Curry","Verts Méditerranéens"],"ar":["دجاج جوليان (200غ)","كريمة","فطر","كاري","خضار البحر المتوسط"]},"options":[],"extras":{"drinkOptions":[{"id":"b7_drink1","name":{"tr":"Kutu İçecek","en":"Can Drink","de":"Dosengetränk","ru":"Напиток в банке","fr":"Boisson en Canette","ar":"مشروب معلب"},"price":60}]}},{"id":"b8","name":{"tr":"Cafe de Paris Soslu Tavuk","en":"Cafe de Paris Sauce Chicken","de":"Hähnchen mit Cafe de Paris-Sauce","ru":"Курица с соусом Cafe de Paris","fr":"Poulet Sauce Cafe de Paris","ar":"دجاج بصلصة كافيه دي باريس"},"price":300,"description":{"tr":"","en":"","de":"","ru":"","fr":"","ar":""},"contents":{"tr":["Sade/Napoliten Makarna veya Pilav","Jülyen Tavuk (200gr)","Krema","Cafe de Paris Sos","Karabiber","Sarımsak","Biber","Mantar","Akdeniz Yeşillikleri"],"en":["Julienne Chicken (200gr)","Cream","Cafe de Paris Sauce","Black Pepper","Garlic","Pepper","Mushrooms","Mediterranean Greens"],"de":["Julienne-Hähnchen (200g)","Sahne","Cafe de Paris-Sauce","Schwarzer Pfeffer","Knoblauch","Paprika","Pilze","Mittelmeergrün"],"ru":["Жюльен курица (200гр)","сливки","соус Cafe de Paris","черный перец","чеснок","перец","грибы","средиземноморская зелень"],"fr":["Poulet Julienne (200g)","Crème","Sauce Cafe de Paris","Poivre Noir","Ail","Poivron","Champignons","Verts Méditerranéens"],"ar":["دجاج جوليان (200غ)","كريمة","صلصة كافيه دي باريس","فلفل أسود","ثوم","فلفل","فطر","خضار البحر المتوسط"]},"options":[],"extras":{"drinkOptions":[{"id":"b8_drink1","name":{"tr":"Kutu İçecek","en":"Can Drink","de":"Dosengetränk","ru":"Напиток в банке","fr":"Boisson en Canette","ar":"مشروب معلب"},"price":60}]}},{"id":"b10","name":{"tr":"Tatlı Acı Soslu Tavuk","en":"Sweet Sour Sauce Chicken","de":"Hähnchen mit Süß-Sauer-Sauce","ru":"Курица с кисло-сладким соусом","fr":"Poulet Sauce Aigre-Douce","ar":"دجاج بصلصة حامضة حلوة"},"price":300,"description":{"tr":"","en":"","de":"","ru":"","fr":"","ar":""},"contents":{"tr":["Sade/Napoliten Makarna veya Pilav","Jülyen Tavuk (200gr)","Chilli Sos","Biber","Mantar","Akdeniz Yeşillikleri"],"en":["Julienne Chicken (200gr)","Chilli Sauce","Pepper","Mushrooms","Mediterranean Greens"],"de":["Julienne-Hähnchen (200g)","Chilli-Sauce","Paprika","Pilze","Mittelmeergrün"],"ru":["Жюльен курица (200гр)","соус чили","перец","грибы","средиземноморская зелень"],"fr":["Poulet Julienne (200g)","Sauce Piquante","Poivron","Champignons","Verts Méditerranéens"],"ar":["دجاج جوليان (200غ)","صلصة حارة","فلفل","فطر","خضار البحر المتوسط"]},"options":[],"extras":{"drinkOptions":[{"id":"b10_drink1","name":{"tr":"Kutu İçecek","en":"Can Drink","de":"Dosengetränk","ru":"Напиток в банке","fr":"Boisson en Canette","ar":"مشروب معلب"},"price":60}]}},{"id":"b11","name":{"tr":"Mexicano Soslu Tavuk","en":"Mexican Sauce Chicken","de":"Hähnchen mit Mexikanischer Sauce","ru":"Курица с мексиканским соусом","fr":"Poulet Sauce Mexicaine","ar":"دجاج بصلصة مكسيكية"},"price":300,"description":{"tr":"","en":"","de":"","ru":"","fr":"","ar":""},"contents":{"tr":["Sade/Napoliten Makarna veya Pilav","Jülyen Tavuk (200gr)","Mexicano Sos","Jalepeno","Biber","Mantar","Akdeniz Yeşillikleri"],"en":["Julienne Chicken (200gr)","Mexican Sauce","Jalapeño","Pepper","Mushrooms","Mediterranean Greens"],"de":["Julienne-Hähnchen (200g)","Mexikanische Sauce","Jalapeño","Paprika","Pilze","Mittelmeergrün"],"ru":["Жюльен курица (200гр)","мексиканский соус","халапеньо","перец","грибы","средиземноморская зелень"],"fr":["Poulet Julienne (200g)","Sauce Mexicaine","Jalapeño","Poivron","Champignons","Verts Méditerranéens"],"ar":["دجاج جوليان (200غ)","صلصة مكسيكية","هالبينو","فلفل","فطر","خضار البحر المتوسط"]},"options":[],"extras":{"drinkOptions":[{"id":"b11_drink1","name":{"tr":"Kutu İçecek","en":"Can Drink","de":"Dosengetränk","ru":"Напиток в банке","fr":"Boisson en Canette","ar":"مشروب معلب"},"price":60}]}},{"id":"b12","name":{"tr":"Tavuk Menü","en":"Chicken Menu","de":"Hähnchen-Menü","ru":"Куриное меню","fr":"Menu Poulet","ar":"قائمة دجاج"},"price":300,"description":{"tr":"","en":"","de":"","ru":"","fr":"","ar":""},"contents":{"tr":["Tavuk Izgara (250-300gr)","Pilav veya Makarna"],"en":["Grilled Chicken (250-300gr)","Rice or Pasta"],"de":["Gegrilltes Hähnchen (250-300g)","Reis oder Pasta"],"ru":["Жареная курица (250-300гр)","Рис или Паста"],"fr":["Poulet Grillé (250-300g)","Riz ou Pâtes"],"ar":["دجاج مشوي (250-300غ)","أرز أو معكرونة"]},"options":[],"extras":{"drinkOptions":[{"id":"b12_drink1","name":{"tr":"Kutu İçecek","en":"Can Drink","de":"Dosengetränk","ru":"Напиток в банке","fr":"Boisson en Canette","ar":"مشروب معلب"},"price":60}]}},{"id":"b13","name":{"tr":"Tavuk Menü Diyet","en":"Diet Chicken Menu","de":"Diät-Hähnchen-Menü","ru":"Диетическое куриное меню","fr":"Menu Poulet Diététique","ar":"قائمة دجاج دايت"},"price":300,"description":{"tr":"","en":"","de":"","ru":"","fr":"","ar":""},"contents":{"tr":["Tavuk Izgara (250-300gr)","Fırında Patates","Sebze Garnitür"],"en":["Grilled Chicken (250-300gr)","Baked Potatoes","Vegetable Garnish"],"de":["Gegrilltes Hähnchen (250-300g)","Ofenkartoffeln","Gemüsegarnitur"],"ru":["Жареная курица (250-300гр)","запеченный картофель","овощной гарнир"],"fr":["Poulet Grillé (250-300g)","Pommes de Terre au Four","Garniture Légumes"],"ar":["دجاج مشوي (250-300غ)","بطاطس مخبوزة","مقبلات خضار"]},"options":[],"extras":{"drinkOptions":[{"id":"b13_drink1","name":{"tr":"Kutu İçecek","en":"Can Drink","de":"Dosengetränk","ru":"Напиток в банке","fr":"Boisson en Canette","ar":"مشروب معلب"},"price":60}]}}]},{"id":"salad","name":{"tr":"Salata","en":"Salad","de":"Salad","ru":"Salad","fr":"Salad","ar":"Salad"},"products":[{"id":"s1","name":{"tr":"Diyet Tavuk Salata","en":"Diet Chicken Salad","de":"Diet Chicken Salad","ru":"Diet Chicken Salad","fr":"Diet Chicken Salad","ar":"Diet Chicken Salad"},"price":200,"description":{"tr":"2 Ana ürün + 4 Yan ürün seçenekleri ile","en":"Choose 2 main products + 4 side products","de":"Wählen Sie 2 Hauptprodukte + 4 Beilagen","ru":"Выберите 2 основных продукта + 4 гарнира","fr":"Choisissez 2 produits principaux + 4 accompagnements","ar":"اختر منتجين رئيسيين + 4 منتجات جانبية"},"contents":{"tr":["Akdeniz Yeşillikleri","Kızarmış Tavuk Göğsü (150gr)","Elma","Keten Tohumu","Cherry Domates","Tane Mısır","Biber"],"en":["Mediterranean Greens","Fried Chicken Breast (150gr)","Apple","Flax Seeds","Cherry Tomatoes","Corn Kernels","Pepper"],"de":["Mediterranean Greens","Fried Chicken Breast  (150g)","Apple","Flax Seeds","Kirschtomaten","Corn Kernels","Paprika"],"ru":["Mediterranean Greens","Fried Chicken Breast  (150gr)","Apple","Flax Seeds","Черри помидоры","Corn Kernels","Перец"],"fr":["Mediterranean Greens","Fried Chicken Breast  (150g)","Apple","Flax Seeds","Tomates Cerises","Corn Kernels","Poivron"],"ar":["Mediterranean Greens","Fried Chicken Breast  (150غr)","Apple","Flax Seeds","طماطم كرزية","Corn Kernels","فلفل"]},"options":[]},{"id":"s2","name":{"tr":"Bahar Salata","en":"Spring Salad","de":"Spring Salad","ru":"Spring Salad","fr":"Spring Salad","ar":"Spring Salad"},"price":200,"description":{"tr":"","en":"","de":"","ru":"","fr":"","ar":""},"contents":{"tr":["Akdeniz Yeşillikleri","Beyaz Peynir","Cherry Domates","Tane Mısır","Biber"],"en":["Mediterranean Greens","White Cheese","Cherry Tomatoes","Corn Kernels","Pepper","Special Yicem Sauce"],"de":["Mediterranean Greens","Weißer Käse","Kirschtomaten","Corn Kernels","Paprika","Special Yicem Sauce"],"ru":["Mediterranean Greens","Белый сыр","Черри помидоры","Corn Kernels","Перец","Special Yicem Sauce"],"fr":["Mediterranean Greens","Fromage Blanc","Tomates Cerises","Corn Kernels","Poivron","Special Yicem Sauce"],"ar":["Mediterranean Greens","جبن أبيض","طماطم كرزية","Corn Kernels","فلفل","Special Yicem Sauce"]},"options":[]},{"id":"s3","name":{"tr":"Sezar Salata","en":"Caesar Salad","de":"Caesar Salad","ru":"Caesar Salad","fr":"Caesar Salad","ar":"Caesar Salad"},"price":200,"description":{"tr":"","en":"","de":"","ru":"","fr":"","ar":""},"contents":{"tr":["Kızarmış Tavuk Göğsü (150gr)","Akdeniz Yeşillikleri","Cherry Domates","Mısır","Biber","Kruton Ekmek","Parmesan Peyniri"],"en":["Fried Chicken Breast (150gr)","Mediterranean Greens","Cherry Tomatoes","Corn","Pepper","Croutons","Parmesan Cheese"],"de":["Fried Chicken Breast  (150g)","Mediterranean Greens","Kirschtomaten","Mais","Paprika","Croutons","Parmesan Cheese"],"ru":["Fried Chicken Breast  (150gr)","Mediterranean Greens","Черри помидоры","Кукуруза","Перец","Croutons","Parmesan Cheese"],"fr":["Fried Chicken Breast  (150g)","Mediterranean Greens","Tomates Cerises","Maïs","Poivron","Croutons","Parmesan Cheese"],"ar":["Fried Chicken Breast  (150غr)","Mediterranean Greens","طماطم كرزية","ذرة","فلفل","Croutons","Parmesan Cheese"]},"options":[]},{"id":"s4","name":{"tr":"Çıtır Tavuk Salata","en":"Crispy Chicken Salad","de":"Crispy Chicken Salad","ru":"Crispy Chicken Salad","fr":"Crispy Chicken Salad","ar":"Crispy Chicken Salad"},"price":200,"description":{"tr":"","en":"","de":"","ru":"","fr":"","ar":""},"contents":{"tr":["Çıtır Tavuk Parçaları (150gr)","Akdeniz Yeşillikleri","Cherry Domates","Mısır","Biber"],"en":["Crispy Chicken Pieces (150gr)","Mediterranean Greens","Cherry Tomatoes","Corn","Pepper"],"de":["Crispy Chicken Pieces  (150g)","Mediterranean Greens","Kirschtomaten","Mais","Paprika"],"ru":["Crispy Chicken Pieces  (150gr)","Mediterranean Greens","Черри помидоры","Кукуруза","Перец"],"fr":["Crispy Chicken Pieces  (150g)","Mediterranean Greens","Tomates Cerises","Maïs","Poivron"],"ar":["Crispy Chicken Pieces  (150غr)","Mediterranean Greens","طماطم كرزية","ذرة","فلفل"]},"options":[]},{"id":"s5","name":{"tr":"Hellim Salata","en":"Halloumi Salad","de":"Halloumi Salad","ru":"Halloumi Salad","fr":"Halloumi Salad","ar":"Halloumi Salad"},"price":230,"description":{"tr":"","en":"","de":"","ru":"","fr":"","ar":""},"contents":{"tr":["Hellim Peyniri","Akdeniz Yeşillikleri","Cherry Domates","Mısır","Biber","Kruton Ekmek"],"en":["Halloumi Cheese","Mediterranean Greens","Cherry Tomatoes","Corn","Pepper","Croutons"],"de":["Halloumi Cheese","Mediterranean Greens","Kirschtomaten","Mais","Paprika","Croutons"],"ru":["Halloumi Cheese","Mediterranean Greens","Черри помидоры","Кукуруза","Перец","Croutons"],"fr":["Halloumi Cheese","Mediterranean Greens","Tomates Cerises","Maïs","Poivron","Croutons"],"ar":["Halloumi Cheese","Mediterranean Greens","طماطم كرزية","ذرة","فلفل","Croutons"]},"options":[]},{"id":"s6","name":{"tr":"Tonno Salata","en":"Tuna Salad","de":"Tuna Salad","ru":"Tuna Salad","fr":"Tuna Salad","ar":"Tuna Salad"},"price":230,"description":{"tr":"","en":"","de":"","ru":"","fr":"","ar":""},"contents":{"tr":["Ton Balığı (160gr)","Akdeniz Yeşillikleri","Cherry Domates","Mısır","Biber"],"en":["Tuna Fish (160gr)","Mediterranean Greens","Cherry Tomatoes","Corn","Pepper"],"de":["Thunfisch  (160g)","Mediterranean Greens","Kirschtomaten","Mais","Paprika"],"ru":["Тунец  (160gr)","Mediterranean Greens","Черри помидоры","Кукуруза","Перец"],"fr":["Thon  (160g)","Mediterranean Greens","Tomates Cerises","Maïs","Poivron"],"ar":["تونة  (160غr)","Mediterranean Greens","طماطم كرزية","ذرة","فلفل"]},"options":[]}]},{"id":"drinks","name":{"tr":"İçecekler","en":"Drinks","de":"Drinks","ru":"Drinks","fr":"Drinks","ar":"Drinks"},"products":[{"id":"d1","name":{"tr":"RedBull","en":"RedBull","de":"RedBull","ru":"RedBull","fr":"RedBull","ar":"RedBull"},"price":80,"description":{"tr":"RedBull Enerji İçeceği","en":"RedBull Energy Drink","de":"RedBull Energy Drink","ru":"RedBull Energy Drink","fr":"RedBull Energy Drink","ar":"RedBull Energy Drink"},"contents":{"tr":["RedBull Enerji İçeceği"],"en":["RedBull Energy Drink"],"de":["RedBull Energy Drink"],"ru":["RedBull Energy Drink"],"fr":["RedBull Energy Drink"],"ar":["RedBull Energy Drink"]},"options":[]},{"id":"d2","name":{"tr":"Coca Cola","en":"Coca Cola","de":"Coca Cola","ru":"Coca Cola","fr":"Coca Cola","ar":"Coca Cola"},"price":60,"description":{"tr":"Coca Cola","en":"Coca Cola","de":"Coca Cola","ru":"Coca Cola","fr":"Coca Cola","ar":"Coca Cola"},"contents":{"tr":["Coca Cola"],"en":["Coca Cola"],"de":["Coca Cola"],"ru":["Coca Cola"],"fr":["Coca Cola"],"ar":["Coca Cola"]},"options":[{"id":"d2_o1","label":{"tr":"Coca Cola","en":"Coca Cola","de":"Coca Cola","ru":"Coca Cola","fr":"Coca Cola","ar":"Coca Cola"},"price":0},{"id":"d2_o2","label":{"tr":"Coca Cola Zero","en":"Coca Cola Zero","de":"Coca Cola Zero","ru":"Coca Cola Zero","fr":"Coca Cola Zero","ar":"Coca Cola Zero"},"price":0}]},{"id":"d3","name":{"tr":"Pepsi","en":"Pepsi","de":"Pepsi","ru":"Pepsi","fr":"Pepsi","ar":"Pepsi"},"price":60,"description":{"tr":"Pepsi","en":"Pepsi","de":"Pepsi","ru":"Pepsi","fr":"Pepsi","ar":"Pepsi"},"contents":{"tr":["Pepsi"],"en":["Pepsi"],"de":["Pepsi"],"ru":["Pepsi"],"fr":["Pepsi"],"ar":["Pepsi"]},"options":[{"id":"d3_o1","label":{"tr":"Pepsi","en":"Pepsi","de":"Pepsi","ru":"Pepsi","fr":"Pepsi","ar":"Pepsi"},"price":0},{"id":"d3_o2","label":{"tr":"Pepsi Max","en":"Pepsi Max","de":"Pepsi Max","ru":"Pepsi Max","fr":"Pepsi Max","ar":"Pepsi Max"},"price":0}]},{"id":"d4","name":{"tr":"Fanta","en":"Fanta","de":"Fanta","ru":"Fanta","fr":"Fanta","ar":"Fanta"},"price":60,"description":{"tr":"Fanta","en":"Fanta","de":"Fanta","ru":"Fanta","fr":"Fanta","ar":"Fanta"},"contents":{"tr":["Fanta"],"en":["Fanta"],"de":["Fanta"],"ru":["Fanta"],"fr":["Fanta"],"ar":["Fanta"]},"options":[]},{"id":"d5","name":{"tr":"Sprite","en":"Sprite","de":"Sprite","ru":"Sprite","fr":"Sprite","ar":"Sprite"},"price":60,"description":{"tr":"Sprite","en":"Sprite","de":"Sprite","ru":"Sprite","fr":"Sprite","ar":"Sprite"},"contents":{"tr":["Sprite"],"en":["Sprite"],"de":["Sprite"],"ru":["Sprite"],"fr":["Sprite"],"ar":["Sprite"]},"options":[{"id":"d5_o1","label":{"tr":"Sprite","en":"Sprite","de":"Sprite","ru":"Sprite","fr":"Sprite","ar":"Sprite"},"price":0},{"id":"d5_o2","label":{"tr":"7UP","en":"7UP","de":"7UP","ru":"7UP","fr":"7UP","ar":"7UP"},"price":0}]},{"id":"d6","name":{"tr":"Ice Tea","en":"Ice Tea","de":"Ice Tea","ru":"Ice Tea","fr":"Ice Tea","ar":"Ice Tea"},"price":60,"description":{"tr":"Ice Tea","en":"Ice Tea","de":"Ice Tea","ru":"Ice Tea","fr":"Ice Tea","ar":"Ice Tea"},"contents":{"tr":["Ice Tea"],"en":["Ice Tea"],"de":["Ice Tea"],"ru":["Ice Tea"],"fr":["Ice Tea"],"ar":["Ice Tea"]},"options":[{"id":"d6_o1","label":{"tr":"Şeftali","en":"Peach","de":"Peach","ru":"Peach","fr":"Peach","ar":"Peach"},"price":0},{"id":"d6_o2","label":{"tr":"Limon","en":"Lemon","de":"Lemon","ru":"Lemon","fr":"Lemon","ar":"Lemon"},"price":0}]},{"id":"d7","name":{"tr":"Litrelik İçecek","en":"Liter Drink","de":"Litergetränk","ru":"Литровый напиток","fr":"Boisson d\u0027un Litre","ar":"مشروب لتر"},"price":90,"description":{"tr":"Litrelik İçecek","en":"Liter Drink","de":"Litergetränk","ru":"Литровый напиток","fr":"Boisson d\u0027un Litre","ar":"مشروب لتر"},"contents":{"tr":["Litrelik İçecek"],"en":["Liter Drink"],"de":["Litergetränk"],"ru":["Литровый напиток"],"fr":["Boisson d\u0027un Litre"],"ar":["مشروب لتر"]},"options":[{"id":"d7_o1","label":{"tr":"Coca Cola","en":"Coca Cola","de":"Coca Cola","ru":"Coca Cola","fr":"Coca Cola","ar":"Coca Cola"},"price":0},{"id":"d7_o2","label":{"tr":"Pepsi","en":"Pepsi","de":"Pepsi","ru":"Pepsi","fr":"Pepsi","ar":"Pepsi"},"price":0},{"id":"d7_o3","label":{"tr":"Fanta","en":"Fanta","de":"Fanta","ru":"Fanta","fr":"Fanta","ar":"Fanta"},"price":0}]},{"id":"d8","name":{"tr":"Sütaş Ayran","en":"Sütaş Ayran","de":"Sütaş Ayran","ru":"Sütaş Ayran","fr":"Sütaş Ayran","ar":"Sütaş Ayran"},"price":40,"description":{"tr":"Sütaş Ayran","en":"Sütaş Ayran","de":"Sütaş Ayran","ru":"Sütaş Ayran","fr":"Sütaş Ayran","ar":"Sütaş Ayran"},"contents":{"tr":[],"en":[],"de":[],"ru":[],"fr":[],"ar":[]},"options":[]},{"id":"d9","name":{"tr":"Su","en":"Water","de":"Water","ru":"Water","fr":"Water","ar":"Water"},"price":20,"description":{"tr":"Su","en":"Water","de":"Water","ru":"Water","fr":"Water","ar":"Water"},"contents":{"tr":["Su"],"en":["Water"],"de":["Water"],"ru":["Water"],"fr":["Water"],"ar":["Water"]},"options":[]},{"id":"d10","name":{"tr":"Soda","en":"Soda","de":"Soda","ru":"Soda","fr":"Soda","ar":"Soda"},"price":30,"description":{"tr":"Soda","en":"Soda","de":"Soda","ru":"Soda","fr":"Soda","ar":"Soda"},"contents":{"tr":["Soda"],"en":["Soda"],"de":["Soda"],"ru":["Soda"],"fr":["Soda"],"ar":["Soda"]},"options":[]},{"id":"d11","name":{"tr":"Şalgam","en":"Turnip Juice","de":"Turnip Juice","ru":"Turnip Juice","fr":"Turnip Juice","ar":"Turnip Juice"},"price":40,"description":{"tr":"Şalgam","en":"Turnip Juice","de":"Turnip Juice","ru":"Turnip Juice","fr":"Turnip Juice","ar":"Turnip Juice"},"contents":{"tr":["Şalgam"],"en":["Turnip Juice"],"de":["Turnip Juice"],"ru":["Turnip Juice"],"fr":["Turnip Juice"],"ar":["Turnip Juice"]},"options":[{"id":"d11_o1","label":{"tr":"Normal","en":"Normal","de":"Normal","ru":"Normal","fr":"Normal","ar":"Normal"},"price":0},{"id":"d11_o2","label":{"tr":"Acılı","en":"Spicy","de":"Spicy","ru":"Spicy","fr":"Spicy","ar":"Spicy"},"price":0}]},{"id":"d12","name":{"tr":"Çay","en":"Tea","de":"Tea","ru":"Tea","fr":"Tea","ar":"Tea"},"price":20,"description":{"tr":"Çay","en":"Tea","de":"Tea","ru":"Tea","fr":"Tea","ar":"Tea"},"contents":{"tr":["Çay"],"en":["Tea"],"de":["Tea"],"ru":["Tea"],"fr":["Tea"],"ar":["Tea"]},"options":[]},{"id":"d13","name":{"tr":"Türk Kahvesi","en":"Turkish Coffee","de":"Turkish Coffee","ru":"Turkish Coffee","fr":"Turkish Coffee","ar":"Turkish Coffee"},"price":70,"description":{"tr":"Türk Kahvesi","en":"Turkish Coffee","de":"Turkish Coffee","ru":"Turkish Coffee","fr":"Turkish Coffee","ar":"Turkish Coffee"},"contents":{"tr":["Türk Kahvesi"],"en":["Turkish Coffee"],"de":["Turkish Coffee"],"ru":["Turkish Coffee"],"fr":["Turkish Coffee"],"ar":["Turkish Coffee"]},"options":[]}]}]}}

class RestaurantApp {
    constructor() {
        this.currentLanguage = 'tr';
        this.currentCategory = 'all';
        this.products = [];
        this.currentProduct = null;
        this.currentSelections = { extras: {}, removedIngredients: new Set() };
        this.cart = [];
        this.currentTheme = 'light';
        this.cartItems = [];
        
        this.init();
        this.registerServiceWorker();
    }

    init() {
        this.loadLanguage();
        this.loadTheme();
        this.setupEventListeners();
        this.setupInstallPrompt();
        this.loadProducts();
        this.showLanguageModal();
    }

    // Language System
    loadLanguage() {
        const savedLang = localStorage.getItem('restaurant_language');
        if (savedLang && this.isValidLanguage(savedLang)) {
            this.currentLanguage = savedLang;
        }
        this.updateLanguage();
    }

    isValidLanguage(lang) {
        const validLanguages = ['tr', 'en', 'ru', 'de', 'fr', 'ar'];
        return validLanguages.includes(lang);
    }

    updateLanguage() {
        document.documentElement.lang = this.currentLanguage;
        document.documentElement.setAttribute('data-lang', this.currentLanguage);
        
        // Update flag
        const flagMap = {
            'tr': '🇹🇷',
            'en': '🇺🇸',
            'ru': '🇷🇺',
            'de': '🇩🇪',
            'fr': '🇫🇷',
            'ar': '🇸🇦'
        };
        
        const currentFlag = document.getElementById('currentFlag');
        if (currentFlag) {
            currentFlag.textContent = flagMap[this.currentLanguage];
        }

        // Update RTL
        if (this.currentLanguage === 'ar') {
            document.documentElement.dir = 'rtl';
        } else {
            document.documentElement.dir = 'ltr';
        }

        // Update all translatable elements
        this.updateTranslations();
    }

    updateTranslations() {
        const translations = this.getTranslations();
        const elements = document.querySelectorAll('[data-translate]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[this.currentLanguage] && translations[this.currentLanguage][key]) {
                element.textContent = translations[this.currentLanguage][key];
            }
        });
    }

    getTranslations() {
        return {
            tr: {
                select_language: 'Dil Seçiniz',
                hero_title: 'Ne Yi\'cem diye düşünme!',
                hero_subtitle: 'QR Menu Uygulmasını indir!',
                download: 'İndir',
                view_menu: 'Menüyü İncele',
                all_categories: 'Tümü',
                cat_pizzalar: 'Pizzalar',
                cat_ayvalik_tostu: 'Ayvalık Tostu',
                cat_soguk_sandvic: 'Soğuk Sandviç',
                cat_tavuk_doner: 'Tavuk Döner',
                cat_et_doner: 'Et Döner',
                cat_makarnalar: 'Makarnalar',
                cat_manti: 'Mantı',
                cat_hamburger: 'Hamburger',
                cat_kofte_spesiyel: 'Köfte Spesiyel',
                cat_aperatifler: 'Aperatifler',
                cat_bistro: 'Bistro',
                cat_salata: 'Salata',
                cat_icecekler: 'İçecekler',
                contact: 'İletişim',
                address: 'Fener Mah. 1968 Sk. No: 21/A Muratpaşa/ANTALYA',
                phone: '+90 242 323 1177',
                email: 'info@yicem.com',
                hours: 'Çalışma Saatleri',
                weekdays: 'Pazartesi - Cumartesi: 09:00 - 20:30',
                weekend: 'Pazar günü kapalı',
                follow_us: 'Bizi Takip Edin',
                all_rights: 'Tüm hakları saklıdır.',
                call_now: 'Ara',
                product_details: 'Sipariş Ver',
                order_now: 'Sipariş Ver',
                add_to_cart: 'Sepete Ekle',
                loading: 'Yükleniyor...',
                product_details: 'Ürün Detayları',
                extras: 'Ekstralar',
                ingredients: 'İçerikler',
                remove_ingredients: 'İçerik çıkar',
                total: 'Toplam',
                select_option: 'Bir seçenek seçiniz'
            },
            en: {
                select_language: 'Select Language',
                hero_title: 'Don\'t think about what to eat!',
                hero_subtitle: 'Download QR Menu App!',
                download: 'Download',
                view_menu: 'View Menu',
                all_categories: 'All',
                cat_pizzalar: 'Pizzas',
                cat_ayvalik_tostu: 'Ayvalık Toast',
                cat_soguk_sandvic: 'Cold Sandwich',
                cat_tavuk_doner: 'Chicken Döner',
                cat_et_doner: 'Beef Döner',
                cat_makarnalar: 'Pastas',
                cat_manti: 'Manti',
                cat_hamburger: 'Hamburger',
                cat_kofte_spesiyel: 'Meatball Special',
                cat_aperatifler: 'Appetizers',
                cat_bistro: 'Bistro',
                cat_salata: 'Salad',
                cat_icecekler: 'Drinks',
                contact: 'Contact',
                address: 'Fener Mah. 1968 Sk. No: 21/A Muratpaşa/ANTALYA',
                phone: '+90 242 323 1177',
                email: 'info@yicem.com',
                hours: 'Working Hours',
                weekdays: 'Monday - Saturday: 09:00 - 20:30',
                weekend: 'Closed on Sunday',
                follow_us: 'Follow Us',
                all_rights: 'All rights reserved.',
                call_now: 'Call',
                product_details: 'Order Now',
                order_now: 'Order Now',
                add_to_cart: 'Add to Cart',
                loading: 'Loading...',
                product_details: 'Product Details',
                extras: 'Extras',
                ingredients: 'Ingredients',
                remove_ingredients: 'Remove ingredients',
                total: 'Total',
                select_option: 'Please select an option'
            },
            ru: {
                select_language: 'Выберите язык',
                hero_title: 'Не думай, что поесть!',
                hero_subtitle: 'Скачай QR Меню Приложение!',
                download: 'Скачать',
                view_menu: 'Посмотреть меню',
                all_categories: 'Все',
                cat_pizzalar: 'Пиццы',
                cat_ayvalik_tostu: 'Тост Айвалык',
                cat_soguk_sandvic: 'Холодный сэндвич',
                cat_tavuk_doner: 'Куриный донер',
                cat_et_doner: 'Говяжий донер',
                cat_makarnalar: 'Паста',
                cat_manti: 'Манты',
                cat_hamburger: 'Гамбургер',
                cat_kofte_spesiyel: 'Кёфте Специаль',
                cat_aperatifler: 'Закуски',
                cat_bistro: 'Бистро',
                cat_salata: 'Салат',
                cat_icecekler: 'Напитки',
                contact: 'Контакты',
                address: 'Fener Mah. 1968 Sk. No: 21/A Muratpaşa/ANTALYA',
                phone: '+90 242 323 1177',
                email: 'info@yicem.com',
                hours: 'Часы работы',
                weekdays: 'Понедельник - Суббота: 09:00 - 20:30',
                weekend: 'Закрыто в воскресенье',
                follow_us: 'Подписывайтесь',
                all_rights: 'Все права защищены.',
                call_now: 'Позвонить',
                product_details: 'Заказать',
                order_now: 'Заказать',
                add_to_cart: 'В корзину',
                loading: 'Загрузка...',
                product_details: 'Детали продукта',
                extras: 'Дополнения',
                ingredients: 'Ингредиенты',
                remove_ingredients: 'Убрать ингредиенты',
                total: 'Итого',
                select_option: 'Выберите вариант'
            },
            de: {
                select_language: 'Sprache wählen',
                hero_title: 'Denk nicht darüber nach, was du essen sollst!',
                hero_subtitle: 'QR-Menü-App herunterladen!',
                download: 'Herunterladen',
                view_menu: 'Menü anzeigen',
                all_categories: 'Alle',
                cat_pizzalar: 'Pizzen',
                cat_ayvalik_tostu: 'Ayvalık-Toast',
                cat_soguk_sandvic: 'Kaltes Sandwich',
                cat_tavuk_doner: 'Hähnchen-Döner',
                cat_et_doner: 'Rind-Döner',
                cat_makarnalar: 'Pasta',
                cat_manti: 'Manti',
                cat_hamburger: 'Hamburger',
                cat_kofte_spesiyel: 'Köfte Spezial',
                cat_aperatifler: 'Vorspeisen',
                cat_bistro: 'Bistro',
                cat_salata: 'Salat',
                cat_icecekler: 'Getränke',
                contact: 'Kontakt',
                address: 'Fener Mah. 1968 Sk. No: 21/A Muratpaşa/ANTALYA',
                phone: '+90 242 323 1177',
                email: 'info@yicem.com',
                hours: 'Öffnungszeiten',
                weekdays: 'Montag - Samstag: 09:00 - 20:30',
                weekend: 'Sonntags geschlossen',
                follow_us: 'Folgen Sie uns',
                all_rights: 'Alle Rechte vorbehalten.',
                call_now: 'Anrufen',
                product_details: 'Jetzt bestellen',
                order_now: 'Jetzt bestellen',
                add_to_cart: 'In den Warenkorb',
                loading: 'Wird geladen...',
                product_details: 'Produktdetails',
                extras: 'Extras',
                ingredients: 'Zutaten',
                remove_ingredients: 'Zutaten entfernen',
                total: 'Gesamt',
                select_option: 'Bitte wählen Sie eine Option'
            },
            fr: {
                select_language: 'Choisir la langue',
                hero_title: 'Ne pense pas à ce que tu vas manger !',
                hero_subtitle: 'Téléchargez l\'Application QR Menu!',
                download: 'Télécharger',
                view_menu: 'Voir le menu',
                all_categories: 'Tout',
                cat_pizzalar: 'Pizzas',
                cat_ayvalik_tostu: 'Toast Ayvalık',
                cat_soguk_sandvic: 'Sandwich froid',
                cat_tavuk_doner: 'Döner au poulet',
                cat_et_doner: 'Döner au boeuf',
                cat_makarnalar: 'Pâtes',
                cat_manti: 'Manti',
                cat_hamburger: 'Hamburger',
                cat_kofte_spesiyel: 'Köfte Spécial',
                cat_aperatifler: 'Apéritifs',
                cat_bistro: 'Bistrot',
                cat_salata: 'Salade',
                cat_icecekler: 'Boissons',
                contact: 'Contact',
                address: 'Fener Mah. 1968 Sk. No: 21/A Muratpaşa/ANTALYA',
                phone: '+90 242 323 1177',
                email: 'info@yicem.com',
                hours: 'Heures d\'ouverture',
                weekdays: 'Lundi - Samedi: 09:00 - 20:30',
                weekend: 'Fermé le dimanche',
                follow_us: 'Suivez-nous',
                all_rights: 'Tous droits réservés.',
                call_now: 'Appeler',
                product_details: 'Commander',
                order_now: 'Commander',
                add_to_cart: 'Ajouter au panier',
                loading: 'Chargement...',
                product_details: 'Détails du produit',
                extras: 'Suppléments',
                ingredients: 'Ingrédients',
                remove_ingredients: 'Retirer des ingrédients',
                total: 'Total',
                select_option: 'Veuillez sélectionner une option'
            },
            ar: {
                select_language: 'اختر اللغة',
                hero_title: 'لا تفكر في ماذا تأكل!',
                hero_subtitle: 'حمّل تطبيق QR Menu!',
                download: 'تحميل',
                view_menu: 'عرض القائمة',
                all_categories: 'الكل',
                cat_pizzalar: 'بيتزا',
                cat_ayvalik_tostu: 'توست أيفاليك',
                cat_soguk_sandvic: 'ساندويتش بارد',
                cat_tavuk_doner: 'شاورما دجاج',
                cat_et_doner: 'شاورما لحم',
                cat_makarnalar: 'باستا',
                cat_manti: 'مانتي',
                cat_hamburger: 'هامبورجر',
                cat_kofte_spesiyel: 'كفتة خاصة',
                cat_aperatifler: 'مقبلات',
                cat_bistro: 'بيسترو',
                cat_salata: 'سلطة',
                cat_icecekler: 'مشروبات',
                contact: 'اتصل بنا',
                address: 'Fener Mah. 1968 Sk. No: 21/A Muratpaşa/ANTALYA',
                phone: '+90 242 323 1177',
                email: 'info@yicem.com',
                hours: 'ساعات العمل',
                weekdays: 'الاثنين - السبت: 09:00 - 20:30',
                weekend: 'مغلق يوم الأحد',
                follow_us: 'تابعنا',
                all_rights: 'جميع الحقوق محفوظة.',
                call_now: 'اتصل',
                product_details: 'اطلب الآن',
                order_now: 'اطلب الآن',
                add_to_cart: 'أضف للسلة',
                loading: 'جاري التحميل...',
                product_details: 'تفاصيل المنتج',
                extras: 'إضافات',
                ingredients: 'المكونات',
                remove_ingredients: 'إزالة المكونات',
                total: 'الإجمالي',
                select_option: 'يرجى اختيار خيار'
            }
        };
    }

    // Helpers for localization from JSON with missing fields
    buildTranslations(nameObj = {}, descObj = {}) {
        const langs = ['tr','en','de','ru','fr','ar'];
        const result = {};
        langs.forEach(l => {
            const name = (nameObj && (nameObj[l] || nameObj.tr || nameObj.en)) || '';
            const description = (descObj && (descObj[l] || descObj.tr || descObj.en)) || '';
            result[l] = { name, description };
        });
        return result;
    }

    // Normalize any incoming label/value into a displayable string
    normalizeLabel(value) {
        if (value == null) return '';
        if (typeof value === 'string') return value;
        if (typeof value === 'number') return String(value);
        if (Array.isArray(value)) {
            return value.map(v => this.normalizeLabel(v)).filter(Boolean).join(' + ');
        }
        if (typeof value === 'object') {
            if (value.name && typeof value.name === 'string') return value.name;
            const lang = this.currentLanguage || 'tr';
            if (value[lang] && typeof value[lang] === 'string') return value[lang];
            if (value.tr && typeof value.tr === 'string') return value.tr;
            if (value.en && typeof value.en === 'string') return value.en;
        }
        try { return String(value); } catch (_) { return ''; }
    }

// (removed misplaced class terminator and constants block)

	// Build description for display: for pizzas always use language-specific description; others fallback to ingredients
	getDisplayDescription(product, translation) {
		try {
			// Force fixed multilingual description for doner categories
			if (product?.category === 'tavuk-doner' || product?.category === 'et-doner') {
				return translation?.description || '';
			}
			// Tüm ürünlerde: önce aktif dildeki ingredients
			const lang = this.currentLanguage || 'tr';
			if (product?.ingredients) {
				if (Array.isArray(product.ingredients)) {
					if (product.ingredients.length) return product.ingredients.join(', ');
				} else if (typeof product.ingredients === 'object') {
					const localized = product.ingredients[lang];
					if (Array.isArray(localized) && localized.length) return localized.join(', ');
					// Eğer o dilde yoksa ve çeviri açıklaması varsa, onu kullan (dil uyumu için)
					if (translation?.description) return translation.description;
					// Son çare TR ingredients
					const trList = product.ingredients.tr;
					if (Array.isArray(trList) && trList.length) return trList.join(', ');
				}
			}
			// Ingredients yoksa çeviri açıklamasına düş
			if (translation?.description) return translation.description;
		} catch (e) {}
		return translation?.description || '';
	}

    // Get local image based on product ID/name and available files
    getLocalImage(categoryFolder, productId, productName) {
        

        const folder = this.resolvePicFolder(categoryFolder);
        const key = String(categoryFolder || '').toLowerCase();

        // 2) Special single-file cases
        if (key === 'soguk-sandvic') {
            return `./pic/Ayvalik-Tostu/soguk-sandvic.jpg`;
        }
        if (key === 'manti') {
            return `./pic/Makarnalar/manti.jpg`;
        }
        // Special case for Diyet Tavuk Salata (s1 in salata category)
        if (key === 'salata' && productId === 's1') {
            return `./pic/Salata/diyet-tavuk-salata.jpg`;
        }

        // 3) No name → category default
        if (!productName) {
            return this.getDefaultImage(folder, productId);
        }

        // 4) Try mapping by cleaned name
        const cleanName = this.cleanProductName(productName);
        const mapped = this.findMatchingImage(cleanName);
        if (mapped) {
            return `./pic/${folder}/${mapped}`;
        }

        // 5) Try best match from AVAILABLE_IMAGES list
        const best = this.bestMatchFile(cleanName, folder);
        if (best) {
            return `./pic/${folder}/${best}`;
        }

        // 6) Slug-based fallback
        const fallbackFile = `${cleanName}.jpg`;
        return `./pic/${folder}/${fallbackFile}`;
    }

    // Clean product name for better matching
    cleanProductName(name) {
        if (!name) return '';
        // First transliterate Turkish characters to ASCII
        const turkishMap = {
            'ı': 'i', 'İ': 'i', 'ğ': 'g', 'Ğ': 'g',
            'ü': 'u', 'Ü': 'u', 'ş': 's', 'Ş': 's',
            'ö': 'o', 'Ö': 'o', 'ç': 'c', 'Ç': 'c'
        };
        let result = String(name).toLowerCase();
        // Simple character replacement without regex
        for (let i = 0; i < result.length; i++) {
            if (turkishMap[result[i]]) {
                result = result.substring(0, i) + turkishMap[result[i]] + result.substring(i + 1);
            }
        }
        return result
            .replace(/[^a-z0-9\s]/g, '') // Remove special chars
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/--+/g, '-') // Replace multiple hyphens
            .trim();
    }

    // Resolve category folder name for /pic path
    resolvePicFolder(categoryFolder) {
        const key = String(categoryFolder || '')
            .toLowerCase()
            .replace(/\s+/g, '-')
            .trim();
        const mapping = {
            'pizzalar': 'Pizzalar',
            'ayvalik-tostu': 'Ayvalik-Tostu',
            // Soğuk Sandviç resmi Ayvalik-Tostu klasöründe tek dosya olarak tutulacak
            'soguk-sandvic': 'Ayvalik-Tostu',
            'tavuk-doner': 'Tavuk-Doner',
            'et-doner': 'Et-Doner',
            'makarnalar': 'Makarnalar',
            // Mantı resmi Makarnalar klasöründe tek dosya
            'manti': 'Makarnalar',
            'hamburger': 'Hamburger',
            'kofte-spesiyel': 'Kofte-Spesiyel',
            'aperatifler': 'Aperatifler',
            'bistro': 'Bistro',
            'salata': 'Salata',
            // İçecekler klasörü: Icecek
            'icecekler': 'Icecek',
            'icecek': 'Icecek'
        };
        // If already a proper folder-like string (e.g., 'Pizzalar'), keep it
        if (!mapping[key] && /^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(String(categoryFolder))) {
            return categoryFolder;
        }
        return mapping[key] || 'Pizzalar';
    }

    // Find matching image based on product name
    findMatchingImage(cleanName) {
        // Common image patterns to try
        const patterns = [
            cleanName,
            cleanName.replace(/-/g, ''),
            cleanName.replace(/-/g, '_'),
            cleanName.split('-')[0], // First word only
            cleanName.split('-').slice(0, 2).join('-'), // First two words
        ];

        // Known image mappings for common products
        const imageMappings = {
            'margarita': 'margarita.jpg',
            'sucuklu': 'sucuklu-pizza.jpg',
            'pepperoni': 'pepperoni-pizza.jpg',
            'ton-baligi': 'ton-balikli-sandvic.jpg',
            'tavuk-doner': 'tavuk-doner.jpg',
            'et-doner': 'et-doner.jpg',
            'hamburger': 'hamburger.jpg',
            'cheeseburger': 'cheeseburger.jpg',
            'sezar': 'sezar-salata.jpg',
            'cay': 'cay.jpg',
            'kahve': 'turk-kahvesi.jpg',
            'ayran': 'ayran.jpg',
            'cola': 'cocacola.jpg',
            'fanta': 'fanta.jpg',
            'sprite': 'sprite.jpg',
            'pepsi': 'pepsi.jpg',
            'soguk-sandvic': 'soguk-sandvic.jpg',
            'yicem-karisik': 'yicem-karisik.jpg',
            'yicem-sucuklu': 'yicem-sucuklu.jpg',
            'yicem-kasarli': 'yicem-kasarli.jpg',
            'yicem-salam': 'yicem-salam.jpg',
            'yicem-jambon': 'yicem-jambon.jpg',
            'yicem-kavurma': 'yicem-kavurma.jpg',
            'yicem-mega-karisik': 'yicem-mega-karisik.jpg',
            'yicem-super-karisik': 'yicem-super-karisik.jpg',
            'yicem-yengen': 'yicem-yengen.jpg',
            'yicem-donerli': 'yicem-donerli.jpg',
            'yicem-evkofteli': 'yicem-evkofteli.jpg',
            'yicem-schnitzel': 'yicem-schnitzel.jpg',
            'sanayi-tostu': 'sanayi-tostu.jpg',
            'bolonez': 'bolonez.jpg',
            'alfredo': 'alfredo.jpg',
                'arabiat': 'arabiat.jpg',
                'arabiata': 'arabiata.jpg',
                'napoliten': 'Napoliten.jpg',
            'pesto': 'pesto.jpg',
            'turkusulu': 'turkusulu.jpg',
            'manti': 'manti.jpg',
            'sefin-izgarasi': 'sefin-izgarasi.jpg',
            'ekmek-arasi': 'ekmekarasi.jpg',
                'kasarli-kofte': 'kasarli-kofte.jpg',
                'ekmek-arasi-kofte': 'kasarli-kofte.jpg',
                'ekmek-arasi-kasarli-kofte': 'kasarli-kofte.jpg',
                'kavurmali-yicem': 'kavurmali-yicem.jpg',
                'donerli-yicem': 'donerli-yicem.jpg',
                'klasik-vejeteryan': 'klasik-yicem.jpg',
                'brokoli-peynir-yicem': 'brokoli-yicem.jpg',
                'turk-usulu-4-peynirli': 'turkusulu.jpg',
                'sezar-salata': 'sezar.jpg',
                'pilavustu-tavuk-doner': 'pilav-ustu-tavuk-doner.jpg',
                '3-adet-tavuk-doner': '3lu-tavuk-doner.jpg',
                '5-adet-tavuk-doner': '5lı-tavuk-doner.jpg',
                'yicem-donerli': 'yicem-donerli.jpg',
                'tavuk-doner-beyti': 'tavuk-doner-beyti.jpg',
                'tavuk-doner-porsiyon': 'tavuk-doner-porsiyon.jpg',
                'tavuk-burger': 'tavukburger.jpg',
                'elma-dilim-patates': 'elmadilim.jpg',
                
                // Drinks image mappings
                'redbull': 'redbull.jpg',
                'coca-cola': 'cocacola.jpg',
                'pepsi': 'pepsi.jpg',
                'fanta': 'fanta.jpg',
                'sprite': 'sprite.jpg',
                'ice-tea': 'ice-tea.jpg',
                'litrelik-icecek': 'litrelikicecek.jpg',
                'ayran': 'ayran.jpg',
                'su': 'su.jpg',
                'soda': 'soda.jpg',
                'salgam': 'salgam.jpg',
                'cay': 'cay.jpg',
                'turk-kahvesi': 'turk-kahvesi.jpg',
                '4lu-cam-icecek': '4lucamicecek.jpg',
            'citir': 'citir.jpg',
            'elmadilim': 'elmadilim.jpg',
            'parmak-patates': 'parmakpatates.jpg',
            'cafe-de-paris': 'cafedeparis.jpg',
            'barbeku-soslu-tavuk': 'barbekusoslutavuk.jpg',
            'chicken-quesadilla': 'chicken-quesadilla.jpg',
            'chicken-stroganoff': 'chicken-stroganoff.jpg',
            'dagkekigi-kremali': 'dagkekigi-kremali.jpg',
            'kasarli-mantarli-quesadilla': 'kasarli-mantarli-quesadilla.jpg',
            'mantarli-kori-tavuk': 'mantarli-kori-tavuk.jpg',
            'mexican-soslu-tavuk': 'mexicanososlutavuk.jpg',
            'tatliaci-soslu-tavuk': 'tatliacisoslutavuk.jpg',
            'tavuk-wrap': 'tavuk-wrap.jpg',
            'viyana': 'viyana.jpg',
            'bahar-salata': 'baharsalata.jpg',
            'citir-tavuk-salata': 'citir-tavuk-salata.jpg',
            'diyet-tavuk-salata': 'diyet-tavuk-salata.jpg',
            'hellim-salata': 'hellim-salata.jpg',
            'tonno-salata': 'tonnosalata.jpg',
            '3lu-tavuk-doner': '3lu-tavuk-doner.jpg',
            '5li-tavuk-doner': '5lı-tavuk-doner.jpg',
            'pilav-ustu-tavuk-doner': 'pilav-ustu-tavuk-doner.jpg',
            'tavuk-doner-beyti': 'tavuk-doner-beyti.jpg',
            'tavuk-doner-porsiyon': 'tavuk-doner-porsiyon.jpg',
            'tavuk-iskender': 'tavuk-iskender.jpg',
            '3lu-et-doner': '3lu-etdoner.jpg',
            '5li-et-doner': '5li-etdoner.jpg',
            'ayvalik-et-doner': 'ayvalik-etdoner.jpg',
            'et-doner-porsiyon': 'et-doner-porsiyon.jpg',
            'et-iskender': 'et-iskender.jpg',
            'kasarli-et-doner': 'kasarli-etdoner.jpg',
            'pilav-ustu-et-doner': 'pilavustu-etdoner.jpg',
            'soslu-doner': 'soslu-doner.jpg',
            '4-peynirli-yicem': '4-peynirli-yicem.jpg',
            'brokoli-yicem': 'brokoli-yicem.jpg',
            'diavola-yicem': 'diavola-yicem.jpg',
            'donerli-yicem': 'donerli-yicem.jpg',
            'ispanak-tulum-yicem': 'ıspanak-tulum-yicem.jpg',
            'kavurmali-yicem': 'kavurmali-yicem.jpg',
            'klasik-yicem': 'klasik-yicem.jpg',
            'mix-yicem-pizza': 'mix-yicem-pizza.jpg',
            'sosisli-yicem': 'sosisli-yicem.jpg',
            'sucuklu-yicem': 'sucuklu-yicem.jpg',
            'tavuklu-yicem': 'tavuklu-yicem.jpg',
            'tonno-yicem': 'tonno-yicem.jpg',
            '4lu-cam-icecek': '4lucamicecek.jpg',
            'ice-tea': 'icetea.jpg',
            'litrelik-icecek': 'litrelikicecek.jpg',
            'red-bull': 'redbull.jpg',
            'salgam': 'salgam.jpg',
            'soda': 'soda.jpg',
            'su': 'su.jpg',
            'turk-kahvesi': 'turk-kahvesi.jpg',
            'lavas-ekmegi': 'lavasekmegi.jpg',
            'tas-firin-ekmegi': 'tasfirinekmegi.jpg',
            // Additional mappings for missing products
            'mix-yicem': 'mix-yicem-pizza.jpg',
            'yicem-super-karisik': 'yicem-super-karisik.jpg',
            'yicem-kasarli-jambon': 'yicem-kasarli-jambon.jpg',
            'ton-balikli': 'ton-balikli.jpg',
            'kasarli-tavuk-durum': 'tavuk-doner.jpg',
            'tavuk-iskender': 'tavuk-iskender.jpg',
            'kaasrli-et-doner': 'kasarli-etdoner.jpg',
            'soslu-kaasrli-et-durum': 'kasarli-etdoner.jpg',
            // Additional mappings for proper image matching (without Turkish chars - they are automatically converted)
            'et-doner-70gr': 'et-doner.jpg',
            'et-doner-100gr': 'et-doner.jpg',
            'ispanak-tulum-yicem': 'ıspanak-tulum-yicem.jpg',
            'yicem-karisik': 'yicem-karisik.jpg',
            'yicem-mega-karisik': 'yicem-mega-karisik.jpg',
            'yicem-kavurma': 'yicem-kavurma.jpg',
            'yicem-sucuk': 'yicem-sucuklu.jpg',
            'yicem-ev-kofteli': 'yicem-evkofteli.jpg',
            'tatli-aci-soslu-tavuk': 'tatliacisoslutavuk.jpg',
            'mexicano-soslu-tavuk': 'mexicanososlutavuk.jpg',
            'barbeku-soslu-tavuk': 'barbekusoslutavuk.jpg',
            'cafe-de-paris-soslu-tavuk': 'cafedeparis.jpg',
            'mantarli-kori-soslu-tavuk': 'mantarli-kori-tavuk.jpg',
            'dag-kekigi-kremali-tavuk': 'dagkekigi-kremali.jpg',
            'viyana-pilic-sinitzel': 'viyana.jpg',
            'kasarli-mantarli-quesadilla': 'kasarli-mantarli-quesadilla.jpg',
            'tavuk-quesadilla': 'chicken-quesadilla.jpg',
            'chicken-stroganoff': 'chicken-stroganoff.jpg',
            '5-adet-tavuk-doner': '5li-tavuk-doner.jpg',
            '5li-tavuk-doner': '5li-tavuk-doner.jpg',
            '3-adet-et-doner-70gr': '3lu-etdoner.jpg',
            '3-adet-et-doner-100gr': '3lu-etdoner.jpg',
            '5-adet-et-doner-70gr': '5li-etdoner.jpg',
            '5-adet-et-doner-100gr': '5li-etdoner.jpg',
            'pilavustu-et-doner': 'pilavustu-etdoner.jpg',
            'soslu-et-doner': 'soslu-doner.jpg',
            'soslu-kasarli-et-durum-70gr': 'kasarli-etdoner.jpg',
            'soslu-kasarli-et-durum-100gr': 'kasarli-etdoner.jpg',
            'ayvalik-et-durum-70gr': 'ayvalik-etdoner.jpg',
            'ayvalik-kasarli-et-doner-70gr': 'ayvalik-etdoner.jpg',
            'ev-yapimi-manti': 'manti.jpg',
            'ton-balikli': 'ton-balikli.jpg',
            'napoliten': 'Napoliten.jpg',
            'sefin-izgara-koftesi': 'sefin-izgarasi.jpg',
            'ekmek-arasi-kofte': 'ekmekarasi.jpg',
            'ekmek-arasi-kasarli-kofte': 'kasarli-kofte.jpg',
            'citir-tavuk-tabagi': 'citir.jpg',
            'tonno-yicem': 'tonno-yicem.jpg',
            'ice-tea': 'icetea.jpg',
            'redbull': 'redbull.jpg',
            'ayran': 'ayran.jpg',
            'cay': 'cay.jpg',
            'turk-kahvesi': 'turk-kahvesi.jpg',
            'turkusulu': 'turkusulu.jpg',
            'turk-usulu-4-peynirli': 'turkusulu.jpg'
        };

        // Try exact matches first
        for (const pattern of patterns) {
            if (imageMappings[pattern]) {
                return imageMappings[pattern];
            }
        }

        // Try partial matches
        for (const [key, value] of Object.entries(imageMappings)) {
            if (cleanName.includes(key) || key.includes(cleanName)) {
                return value;
            }
        }

        return null;
    }

    // Choose best matching file from AVAILABLE_IMAGES for a folder
    bestMatchFile(cleanName, folder) {
        const list = (typeof AVAILABLE_IMAGES !== 'undefined' && AVAILABLE_IMAGES[folder]) ? AVAILABLE_IMAGES[folder] : [];
        if (!cleanName || !list.length) return null;

        // Exact without extension
        const exact = list.find(f => f.replace(/\.jpg$/i, '') === cleanName);
        if (exact) return exact;

        // Starts with
        const starts = list.find(f => f.toLowerCase().startsWith(cleanName));
        if (starts) return starts;

        // Includes either way
        const includes = list.find(f => f.toLowerCase().includes(cleanName) || cleanName.includes(f.replace(/\.jpg$/i, '').toLowerCase()));
        if (includes) return includes;

        // Alternative candidates
        const altCandidates = [
            cleanName.replace(/-/g, ''),
            cleanName.replace(/-/g, '_'),
            cleanName.split('-')[0],
            cleanName.split('-').slice(0, 2).join('-')
        ].filter(Boolean);

        for (const c of altCandidates) {
            const hit = list.find(f => f.toLowerCase().includes(c));
            if (hit) return hit;
        }

        return null;
    }

    // Get default image for category
    getDefaultImage(categoryFolder, productId) {
        const key = String(categoryFolder || '')
            .toLowerCase()
            .replace(/\s+/g, '-')
            .trim();
        const defaultImages = {
            'pizzalar': 'margarita.jpg',
            'ayvalik-tostu': 'yicem-karisik.jpg',
            'soguk-sandvic': 'soguk-sandvic.jpg',
            'tavuk-doner': 'tavuk-doner.jpg',
            'et-doner': 'et-doner.jpg',
            'makarnalar': 'bolonez.jpg',
            'manti': 'manti.jpg',
            'hamburger': 'hamburger.jpg',
            'kofte-spesiyel': 'sefin-izgarasi.jpg',
            'aperatifler': 'citir.jpg',
            'bistro': 'cafedeparis.jpg',
            'salata': 'sezar.jpg',
            'icecekler': 'cay.jpg'
        };

        const folder = this.resolvePicFolder(categoryFolder);
        const defaultImg = defaultImages[key];
        // Yerel default görsel kullan, yoksa boş string (hata önleme)
        return defaultImg ? `./pic/${folder}/${defaultImg}` : `./pic/Pizzalar/margarita.jpg`;
    }

    showLanguageModal() {
        const modal = document.getElementById('languageModal');
        if (modal && !localStorage.getItem('language_selected')) {
            modal.classList.add('show');
        }
    }

    hideLanguageModal() {
        const modal = document.getElementById('languageModal');
        if (modal) {
            modal.classList.remove('show');
            localStorage.setItem('language_selected', 'true');
        }
    }

    // Product Data - Embedded menu data kullanıyor (artık fetch yok, hızlı yükleme)
	loadProducts() {
		try {
			// Gömülü menü verisini kullan (fetch'e gerek yok - hızlı yükleme)
			if (typeof EMBEDDED_MENU_DATA !== 'undefined' && EMBEDDED_MENU_DATA) {
				this.products = this.mapTranslatedMenuToProducts(EMBEDDED_MENU_DATA);
					// Pizzalar ve Ayvalık Tostu için ingredients'i çevirilerden dil bazlı tamamla
					this.normalizeIngredientsForCategories(['pizzalar','ayvalik-tostu']);
					// Döner kategorileri için açıklama, menü seçenekleri ve içerik normalizasyonu
					this.normalizeDonerCategories(['tavuk-doner','et-doner']);
				console.log(`Total products loaded (embedded menu): ${this.products.length}`);
					this.renderProducts();
			} else {
				console.error('EMBEDDED_MENU_DATA bulunamadı');
					this.products = [];
					this.renderProducts();
			}
		} catch (error) {
			console.error('Error loading products:', error);
			// Hata durumunda boş array
			this.products = [];
			this.renderProducts();
		}
	}

	// EMBEDDED_MENU_DATA -> dahili ürün yapısına dönüştür (artık fetch yok, tamamen embedded)
	mapTranslatedMenuToProducts(data) {
		if (!data || !data.restaurant || !Array.isArray(data.restaurant.categories)) return [];
		const catMap = {
			pizza: 'pizzalar',
			toast: 'ayvalik-tostu',
			sandwich: 'soguk-sandvic',
			'chicken-doner': 'tavuk-doner',
			'beef-doner': 'et-doner',
			pasta: 'makarnalar',
			manti: 'manti',
			hamburger: 'hamburger',
			kofte: 'kofte-spesiyel',
			aperatifler: 'aperatifler',
			bistro: 'bistro',
			salad: 'salata',
			drinks: 'icecekler',
			// Legacy mappings for backward compatibility
			ayvalik_tostu: 'ayvalik-tostu',
			soguk_sandvic: 'soguk-sandvic',
			tavuk_doner: 'tavuk-doner',
			et_doner: 'et-doner',
			makarna: 'makarnalar',
			kofte_spesiyel: 'kofte-spesiyel',
			salata: 'salata',
			icecekler: 'icecekler'
		};

		const products = [];
		for (const category of data.restaurant.categories) {
			const internalCat = catMap[category.id] || category.id;
			if (!Array.isArray(category.products)) continue;
			for (const product of category.products) {
				const nameTr = product?.name?.tr || product?.name?.en || '';
                const imagePath = (typeof PRODUCT_IMAGE_MAP !== 'undefined' && PRODUCT_IMAGE_MAP[product.id])
                    ? PRODUCT_IMAGE_MAP[product.id]
                    : this.getLocalImage(internalCat, product.id, nameTr);
				const mapped = {
					id: product.id,
					category: internalCat,
					price: product.price,
                    image: imagePath,
					translations: this.buildTranslations(product.name, product.description),
					// contents çok dilli obje; mevcut dili seç ya da tüm objeyi koru
					ingredients: (product.contents && (product.contents[this.currentLanguage] || product.contents.tr)) ? product.contents : (product.contents || {}),
					extras: []
				};
                // Bellekte kesin eşleştirme tablosunu doldur (ileride kalıcıya çekilebilir)
                if (typeof PRODUCT_IMAGE_MAP !== 'undefined' && !PRODUCT_IMAGE_MAP[product.id]) {
                    PRODUCT_IMAGE_MAP[product.id] = imagePath;
                }

				// Boyut/seçenekler -> radio extra
				if (Array.isArray(product.options) && product.options.length) {
					const optionLabel = product.id === 'd6' ? 'Seçenek' : 'Boyut';
					const optionTranslations = product.id === 'd6' 
						? { tr: 'Seçenek', en: 'Option', de: 'Option', ru: 'Опция', fr: 'Option', ar: 'خيار' }
						: { tr: 'Boyut', en: 'Size', de: 'Größe', ru: 'Размер', fr: 'Taille', ar: 'الحجم' };
					mapped.extras.push({
						type: 'radio',
						name: optionLabel,
						translations: optionTranslations,
						options: product.options.map(option => ({
							id: option.id,
							name: option.label?.[this.currentLanguage] || option.label?.tr || option.label?.en || '',
							translations: this.buildTranslations(option.label || {}, {}),
							priceDelta: option.price || 0
						}))
					});
				}

				// Ekstralar: ana ve yan ürünler -> checkbox grupları
				if (product.extras && Array.isArray(product.extras.mainProducts) && product.extras.mainProducts.length) {
					mapped.extras.push({
						type: 'checkbox',
						name: 'Ana Ürünler (2 seçim)',
						translations: { tr: 'Ana Ürünler (2 seçim)', en: 'Main Products (choose 2)', de: 'Hauptprodukte (2 auswählen)', ru: 'Основные продукты (выбрать 2)', fr: 'Produits principaux (choisir 2)', ar: 'المنتجات الرئيسية (اختياران)' },
						options: product.extras.mainProducts.map(item => ({
							id: item.id,
							name: item.name?.[this.currentLanguage] || item.name?.tr || item.name?.en || '',
							translations: this.buildTranslations(item.name || {}, {}),
							priceDelta: item.price || 0
						}))
					});
				}
				if (product.extras && Array.isArray(product.extras.sideProducts) && product.extras.sideProducts.length) {
					mapped.extras.push({
						type: 'checkbox',
						name: 'Yan Ürünler (4 seçim)',
						translations: { tr: 'Yan Ürünler (4 seçim)', en: 'Side Products (choose 4)', de: 'Beilagen (4 auswählen)', ru: 'Гарниры (выбрать 4)', fr: 'Accompagnements (choisir 4)', ar: 'المنتجات الجانبية (4 اختيارات)' },
						options: product.extras.sideProducts.map(item => ({
							id: item.id,
							name: item.name?.[this.currentLanguage] || item.name?.tr || item.name?.en || '',
							translations: this.buildTranslations(item.name || {}, {}),
							priceDelta: item.price || 0
						}))
					});
				}

				// Menü seçenekleri -> checkbox (Cips + Ayran, Cips + Kola vb.)
				if (product.extras && Array.isArray(product.extras.menuOptions) && product.extras.menuOptions.length) {
					mapped.extras.push({
						type: 'checkbox',
						name: 'Menü Seçenekleri',
						translations: { tr: 'Menü Seçenekleri', en: 'Menu Options', de: 'Menü-Optionen', ru: 'Варианты меню', fr: 'Options de Menu', ar: 'خيارات القائمة' },
						options: product.extras.menuOptions.map(item => ({
							id: item.id,
							name: item.name?.[this.currentLanguage] || item.name?.tr || item.name?.en || '',
							translations: this.buildTranslations(item.name || {}, {}),
							priceDelta: item.price || 0
						}))
					});
				}

				// Patates seçenekleri -> checkbox
				if (product.extras && Array.isArray(product.extras.potatoOptions) && product.extras.potatoOptions.length) {
					mapped.extras.push({
						type: 'checkbox',
						name: 'Patates Seçenekleri',
						translations: { tr: 'Patates Seçenekleri', en: 'Potato Options', de: 'Kartoffel-Optionen', ru: 'Варианты картофеля', fr: 'Options de Pommes', ar: 'خيارات البطاطس' },
						options: product.extras.potatoOptions.map(item => ({
							id: item.id,
							name: item.name?.[this.currentLanguage] || item.name?.tr || item.name?.en || '',
							translations: this.buildTranslations(item.name || {}, {}),
							priceDelta: item.price || 0
						}))
					});
				}

				// İçecek seçenekleri -> checkbox
				if (product.extras && Array.isArray(product.extras.drinkOptions) && product.extras.drinkOptions.length) {
					mapped.extras.push({
						type: 'checkbox',
						name: 'İçecek Seçenekleri',
						translations: { tr: 'İçecek Seçenekleri', en: 'Drink Options', de: 'Getränkeoptionen', ru: 'Варианты напитков', fr: 'Options de Boisson', ar: 'خيارات المشروبات' },
						options: product.extras.drinkOptions.map(item => ({
							id: item.id,
							name: item.name?.[this.currentLanguage] || item.name?.tr || item.name?.en || '',
							translations: this.buildTranslations(item.name || {}, {}),
							priceDelta: item.price || 0
						}))
					});
				}

				products.push(mapped);
			}
		}
		return products;
}

    // Ensure ingredients are language-specific by deriving from translations when missing
    normalizeIngredientsForCategories(categories = []) {
        const langs = ['tr','en','de','ru','fr','ar'];
        const splitDesc = (desc) => {
            return String(desc || '')
                .split(',')
                .map(s => s.trim())
                .filter(Boolean);
        };
        this.products = (this.products || []).map(p => {
            if (!categories.includes(p.category)) return p;
            const t = p.translations || {};
            let ing = p.ingredients;
            // Start from object form
            if (Array.isArray(ing)) {
                ing = { tr: ing };
            } else if (!ing || typeof ing !== 'object') {
                ing = {};
            }
            // Fill per language from existing translations when missing
            langs.forEach(l => {
                if (!Array.isArray(ing[l]) || ing[l].length === 0) {
                    const desc = t[l]?.description || '';
                    const arr = splitDesc(desc);
                    if (arr.length) {
                        ing[l] = arr;
                    }
                }
            });
            return { ...p, ingredients: ing };
        });
    }

    // Normalize descriptions, extras, and ingredients for doner categories
    normalizeDonerCategories(categories = []) {
        const langs = ['tr','en','de','ru','fr','ar'];
        const descByLang = {
            tr: 'Dürüm (Lavaş), Gobit Ekmek (Pita Ekmek), Taş Fırın Ekmeği veya Ayvalık Tostu Ekmeği Seçenekleri ile',
            en: 'With options: Wrap (Lavash), Gobit Bread (Pita), Stone Oven Bread or Ayvalık Toast Bread',
            de: 'Mit Optionen: Wrap (Lavash), Gobit Brot (Pita), Steinofenbrot oder Ayvalık-Toastbrot',
            ru: 'С вариантами: Лаваш (лаваш), хлеб гобит (пита), хлеб из каменной печи или хлеб для тоста Айвалык',
            fr: 'Avec options: Wrap (Lavash), Pain Gobit (Pita), Pain au four à pierre ou Pain toast Ayvalık',
            ar: 'مع خيارات: لفافة (لافاش)، خبز غوبِت (بيتا)، خبز فرن حجري أو خبز توست أيفاليك'
        };
        const potatoExtra = {
            type: 'checkbox',
            name: 'Ekstra Patates',
            translations: { tr: 'Ekstra Patates', en: 'Extra Fries', de: 'Extra Pommes', ru: 'Доп. картофель фри', fr: 'Frites supplémentaires', ar: 'بطاطس إضافية' },
            options: [ { id: 'patates', name: 'Patates', translations: { tr: 'Patates', en: 'Fries', de: 'Pommes', ru: 'Картофель фри', fr: 'Frites', ar: 'بطاطس' }, priceDelta: 10 } ]
        };
        this.products = (this.products || []).map(p => {
            if (!categories.includes(p.category)) return p;
            // Set multilingual descriptions
            const t = p.translations || {};
            const newTranslations = { ...t };
            // Products cd3, cd4, cd5, cd6, bd4, bd6, bd9, bd10 should have empty descriptions
            const productsWithoutDescription = ['cd3', 'cd4', 'cd5', 'cd6', 'bd3', 'bd4', 'bd6', 'bd9', 'bd10'];
            const shouldHaveEmptyDescription = productsWithoutDescription.includes(p.id);
            langs.forEach(l => {
                const name = (t[l]?.name) || (t.tr?.name) || '';
                const description = shouldHaveEmptyDescription ? '' : descByLang[l];
                newTranslations[l] = { name, description };
            });
            // Remove onions (Soğan) from ingredients
            const sanitizeIngs = (ings) => {
                if (Array.isArray(ings)) return ings.filter(x => (x || '').toLowerCase() !== 'soğan');
                if (ings && typeof ings === 'object') {
                    const m = { ...ings };
                    Object.keys(m).forEach(k => {
                        if (Array.isArray(m[k])) m[k] = m[k].filter(x => (x || '').toLowerCase() !== 'soğan');
                    });
                    return m;
                }
                return ings;
            };
            let newIngredients = sanitizeIngs(p.ingredients);
            // Extras are already mapped from JSON, so don't override them
            // Just ensure beef doner has potato checkbox if missing
            let extras = Array.isArray(p.extras) ? [...p.extras] : [];
            if (p.category === 'et-doner') {
                const hasPotato = extras.some(e => e && e.type === 'checkbox' && (e.name && (e.name.includes('Patates') || e.name.includes('Potatoes') || e.name.includes('Potato'))));
                if (!hasPotato) extras.push(potatoExtra);
            }
            return { ...p, translations: newTranslations, ingredients: newIngredients, extras };
        });
    }

    // KALDIRILDI: Eski JSON mapping fonksiyonları ve getCategoryFolder() - Artık sadece EMBEDDED_MENU_DATA kullanılıyor

    // Ürün adından resim yolunu otomatik oluştur
    getAutoImagePath(productId, productName, categoryFolder) {
        // Özel eşleştirmeler
        const specialMappings = {
            'Margarita Yicem': 'margarita.jpg',
            'Mix Yicem': 'mix-yicem-pizza.jpg',
            'Kavurmalı Yicem': 'kavurmali-yicem.jpg',
            '4 Peynirli Yicem': '4-peynirli-yicem.jpg',
            'Brokoli Yicem': 'brokoli-yicem.jpg',
            'Diavola Yicem': 'diavola-yicem.jpg',
            'Ispanak Tulum Yicem': 'ıspanak-tulum-yicem.jpg',
            'Klasik Yicem': 'klasik-yicem.jpg',
            'Sosisli Yicem': 'sosisli-yicem.jpg',
            'Sucuklu Yicem': 'sucuklu-yicem.jpg',
            'Tavuklu Yicem': 'tavuklu-yicem.jpg',
            'Tonno Yicem': 'tonno-yicem.jpg',
            'Yicem Dönerli': 'donerli-yicem.jpg',
            'Coca Cola': 'cocacola.jpg',
            'Fanta': 'fanta.jpg',
            'Sprite': 'sprite.jpg',
            'Ayran': 'ayran.jpg',
            'Su': 'su.jpg',
            'Çay': 'cay.jpg',
            'Türk Kahvesi': 'turk-kahvesi.jpg',
            'Ice Tea': 'icetea.jpg',
            'Soda': 'soda.jpg',
            'Şalgam': 'salgam.jpg',
            'Red Bull': 'redbull.jpg',
            'Litrelik İçecek': 'litrelikicecek.jpg',
            '4\'lü Cam İçecek': '4lucamicecek.jpg',
            'Çıtır': 'citir.jpg',
            'Elma Dilim Patates': 'elmadilim.jpg',
            'Parmak Patates': 'parmakpatates.jpg',
            'Hamburger': 'hamburger.jpg',
            'Cheeseburger': 'cheeseburger.jpg',
            'Tavuk Burger': 'tavukburger.jpg',
            'Bahar Salata': 'baharsalata.jpg',
            'Çıtır Tavuk Salata': 'citir-tavuk-salata.jpg',
            'Diyet Tavuk Salata': 'diyet-tavuk-salata.jpg',
            'Hellim Salata': 'hellim-salata.jpg',
            'Sezar': 'sezar.jpg',
            'Tonno Salata': 'tonnosalata.jpg',
            'Arabiata': 'arabiata.jpg',
            'Türk Usulü 4 Peynirli': 'turkusulu.jpg',
            'Bolonez': 'bolonez.jpg',
            'Alfredo': 'alfredo.jpg',
            'Pesto': 'pesto.jpg',
            'Ton Balıklı': 'ton-balikli.jpg',
            'Napoliten': 'Napoliten.jpg',
            'Mantı': 'manti.jpg',
            'Sanayi Tostu': 'sanayi-tostu.jpg',
            'Yicem Karışık': 'yicem-karisik.jpg',
            'Yicem Sucuklu': 'yicem-sucuklu.jpg',
            'Yicem Kaşarlı': 'yicem-kasarli.jpg',
            'Yicem Salam': 'yicem-salam.jpg',
            'Yicem Mega Karışık': 'yicem-mega-karisik.jpg',
            'Yicem Super Karışık': 'yicem-super-karisik.jpg',
            'Yicem Dönerli': 'yicem-donerli.jpg',
            'Yicem Ev Köfteli': 'yicem-evkofteli.jpg',
            'Yicem Schnitzel': 'yicem-schnitzel.jpg',
            'Yicem Kavurma': 'yicem-kavurma.jpg',
            'Yicem Yengen': 'yicem-yengen.jpg',
            'Café de Paris': 'cafedeparis.jpg',
            'Barbekü Soslu Tavuk': 'barbekusoslutavuk.jpg',
            'Chicken Quesadilla': 'chicken-quesadilla.jpg',
            'Chicken Stroganoff': 'chicken-stroganoff.jpg',
            'Dağ Kekiği Kremalı': 'dagkekigi-kremali.jpg',
            'Kaşarlı Mantarlı Quesadilla': 'kasarli-mantarli-quesadilla.jpg',
            'Mantarlı Köri Tavuk': 'mantarli-kori-tavuk.jpg',
            'Mexican Soslu Tavuk': 'mexicanososlutavuk.jpg',
            'Tatlı Acı Soslu Tavuk': 'tatliacisoslutavuk.jpg',
            'Tavuk Wrap': 'tavuk-wrap.jpg',
            'Viyana': 'viyana.jpg',
            'Tavuk Döner Beyti': 'tavuk-doner-beyti.jpg',
            'Tavuk Döner Porsiyon': 'tavuk-doner-porsiyon.jpg',
            'Pilavüstü Tavuk Döner': 'pilav-ustu-tavuk-doner.jpg',
            '3 Adet Tavuk Döner': '3lu-tavuk-doner.jpg',
            '5 Adet Tavuk Döner': '5lı-tavuk-doner.jpg',
            'Tavuk İskender': 'tavuk-iskender.jpg',
            'Et Döner Porsiyon': 'et-doner-porsiyon.jpg',
            'Pilavüstü Et Döner': 'pilavustu-etdoner.jpg',
            '3 Adet Et Döner': '3lu-etdoner.jpg',
            '5 Adet Et Döner': '5li-etdoner.jpg',
            'Et İskender': 'et-iskender.jpg',
            'Kaşarlı Et Döner': 'kasarli-etdoner.jpg',
            'Soslu Döner': 'soslu-doner.jpg',
            'Ayvalık Et Döner': 'ayvalik-etdoner.jpg',
            'Ekmek Arası Köfte': 'ekmekarasi.jpg',
            'Ekmek Arası Kaşarlı Köfte': 'kasarli-kofte.jpg',
            'Şefin İzgarası': 'sefin-izgarasi.jpg',
            'Soğuk Sandviç': 'soguk-sandvic.jpg',
            'Kaşarlı Soğuk Sandviç': 'yicem-kasarli.jpg',
            'Tavuklu Soğuk Sandviç': 'yicem-kasarli.jpg',
            'Ton Balıklı Soğuk Sandviç': 'yicem-kasarli.jpg',
            'Sucuklu Soğuk Sandviç': 'yicem-sucuklu.jpg',
            'Salamlı Soğuk Sandviç': 'yicem-salam.jpg',
            'Jambonlu Soğuk Sandviç': 'yicem-kasarli-jambon.jpg',
            'Mantarlı Soğuk Sandviç': 'yicem-kasarli.jpg'
        };
        
        // Özel eşleştirme varsa onu kullan
        if (specialMappings[productName]) {
            const folder = this.resolvePicFolder(categoryFolder);
            return `./pic/${folder}/${specialMappings[productName]}`;
        }
        
        // Yoksa otomatik oluştur
        const cleanName = productName.toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        
        const folder = this.resolvePicFolder(categoryFolder);
        return `./pic/${folder}/${cleanName}.jpg`;
    }

    // KALDIRILDI: getAllProductsFromJson() - Artık mapTranslatedMenuToProducts() kullanılıyor
    // KALDIRILDI: getSeedProducts() - Artık embedded data kullanılıyor
    // KALDIRILDI: setProductsFromJson() - Artık embedded data kullanılıyor
    // KALDIRILDI: setProductsFromPizzaJson() - Artık kullanılmıyor

    renderProducts() {
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return;

        let filteredProducts = this.currentCategory === 'all' 
            ? this.products 
            : this.products.filter(product => product.category === this.currentCategory);

        // When showing all, order by menu category sequence
        if (this.currentCategory === 'all') {
            const categoryOrder = [
                'pizzalar',
                'ayvalik-tostu',
                'soguk-sandvic',
                'tavuk-doner',
                'et-doner',
                'makarnalar',
                'manti',
                'hamburger',
                'kofte-spesiyel',
                'aperatifler',
                'bistro',
                'salata',
                'icecekler'
            ];
            const orderIndex = new Map(categoryOrder.map((c, i) => [c, i]));
            filteredProducts = [...filteredProducts].sort((a, b) => {
                const ai = orderIndex.has(a.category) ? orderIndex.get(a.category) : Number.MAX_SAFE_INTEGER;
                const bi = orderIndex.has(b.category) ? orderIndex.get(b.category) : Number.MAX_SAFE_INTEGER;
                return ai - bi;
            });
        }

        if (filteredProducts.length === 0) {
            const emptyText = {
                tr: 'Henüz ürün eklenmedi',
                en: 'No products yet',
                ru: 'Товары пока не добавлены',
                de: 'Noch keine Produkte',
                fr: 'Aucun produit pour le moment',
                ar: 'لا توجد منتجات بعد'
            };
            productsGrid.innerHTML = `<div class="no-products">${emptyText[this.currentLanguage] || emptyText.en}</div>`;
            return;
        }

        productsGrid.innerHTML = filteredProducts.map(product => {
            const translation = product.translations[this.currentLanguage] || product.translations['en'];
            // Localized ingredients for card preview
            const lang = this.currentLanguage || 'tr';
            let ingList = [];
            if (Array.isArray(product.ingredients)) {
                ingList = product.ingredients;
            } else if (product.ingredients && typeof product.ingredients === 'object') {
                ingList = product.ingredients[lang] || product.ingredients.tr || [];
            }
            const hideDescription = (product.category === 'pizzalar' || product.category === 'ayvalik-tostu' || product.category === 'makarnalar' || product.category === 'pasta' || product.category === 'manti' || product.category === 'bistro' || product.category === 'icecekler' || product.category === 'salata' || product.category === 'salad');
            const hideIngredients = false;
            const descriptionHtml = hideDescription ? '' : `<p class="product-description">${this.getDisplayDescription(product, translation)}</p>`;
            const ingredientsHtml = (hideIngredients || !Array.isArray(ingList) || !ingList.length)
                ? ''
                : `<div class="product-ingredients"><strong data-translate="ingredients">İçerikler</strong>: ${ingList.join(', ')}</div>`;
            return `
                <div class="product-card" data-category="${product.category}">
                    <img src="${product.image}" alt="${translation.name}" class="product-image" loading="lazy">
                    <div class="product-content">
                        <h3 class="product-name">${translation.name}</h3>
                        ${descriptionHtml}
                        ${ingredientsHtml}
                        <div class="product-footer">
                            <span class="product-price">₺${product.price}</span>
                            <button class="product-details-btn" data-product-id="${product.id}">
                                <i class="fas fa-shopping-cart"></i>
                                <span data-translate="product_details">Sipariş Ver</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Update translations for new elements
        this.updateTranslations();
    }

    // Theme System
    loadTheme() {
        const saved = localStorage.getItem('restaurant_theme');
        this.currentTheme = (saved === 'light' || saved === 'dark') ? saved : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        const cb = document.getElementById('themeToggle');
        if (cb) cb.checked = this.currentTheme === 'light';
    }

    toggleTheme(isLight) {
        this.currentTheme = isLight ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('restaurant_theme', this.currentTheme);
    }

    // Event Listeners
    setupEventListeners() {
        // Language modal
        const languageModal = document.getElementById('languageModal');
        const languageToggle = document.getElementById('languageToggle');
        const modalClose = document.querySelector('.modal-close');
        const languageBtns = document.querySelectorAll('.language-btn');

        if (languageToggle) {
            languageToggle.addEventListener('click', () => {
                if (languageModal) {
                    languageModal.classList.add('show');
                }
            });
        }

        if (modalClose) {
            modalClose.addEventListener('click', () => {
                this.hideLanguageModal();
            });
        }

        if (languageModal) {
            languageModal.addEventListener('click', (e) => {
                if (e.target === languageModal) {
                    this.hideLanguageModal();
                }
            });
        }

        languageBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.currentTarget.getAttribute('data-lang');
                if (this.isValidLanguage(lang)) {
                    this.currentLanguage = lang;
                    localStorage.setItem('restaurant_language', lang);
                    this.updateLanguage();
                    this.renderProducts();
                    this.hideLanguageModal();
                }
            });
        });

        // Category navigation
        const categoryBtns = document.querySelectorAll('.category-btn');
        const prevBtn = document.getElementById('prevCategory');
        const nextBtn = document.getElementById('nextCategory');
        const categoriesScroll = document.getElementById('categoriesScroll');

        categoryBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.currentTarget.getAttribute('data-category');
                
                // If bistro category, open modal first, then show products when modal closes
                if (category === 'bistro') {
                    // Update active state
                    categoryBtns.forEach(b => b.classList.remove('active'));
                    e.currentTarget.classList.add('active');
                    this.showBistroModal();
                    return;
                }
                
                this.currentCategory = category;
                
                // Update active state
                categoryBtns.forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                
                this.renderProducts();
            });
        });

        // Category scroll navigation
        if (prevBtn && categoriesScroll) {
            prevBtn.addEventListener('click', () => {
                categoriesScroll.scrollBy({ left: -200, behavior: 'smooth' });
            });
        }

        if (nextBtn && categoriesScroll) {
            nextBtn.addEventListener('click', () => {
                categoriesScroll.scrollBy({ left: 200, behavior: 'smooth' });
            });
        }

        // Product details modal - Open modal instead of adding to cart
        document.addEventListener('click', (e) => {
            if (e.target.closest('.product-details-btn')) {
                const btn = e.target.closest('.product-details-btn');
                const productId = btn.getAttribute('data-product-id');
                this.showProductModal(productId);
            }
        });

        // QR Modal - open on QR image click
        const qrImg = document.querySelector('.qr-image');
        const qrModal = document.getElementById('qrModal');
        const qrModalClose = document.getElementById('qrModalClose');
        if (qrImg && qrModal) {
            qrImg.addEventListener('click', () => {
                const modalImg = document.getElementById('qrModalImg');
                if (modalImg) {
                    modalImg.src = qrImg.getAttribute('src') || './qr.png';
                    modalImg.alt = qrImg.getAttribute('alt') || 'QR';
                }
                qrModal.classList.add('show');
            });
            if (qrModalClose) {
                qrModalClose.addEventListener('click', () => qrModal.classList.remove('show'));
            }
            qrModal.addEventListener('click', (ev) => {
                if (ev.target === qrModal) {
                    qrModal.classList.remove('show');
                }
            });
        }

        // Bistro Modal - setup close handlers
        const bistroModal = document.getElementById('bistroModal');
        const bistroModalClose = document.getElementById('bistroModalClose');
        if (bistroModal && bistroModalClose) {
            const showBistroProducts = () => {
                // Set bistro category and update active state
                this.currentCategory = 'bistro';
                const categoryBtns = document.querySelectorAll('.category-btn');
                categoryBtns.forEach(b => b.classList.remove('active'));
                const bistroBtn = document.querySelector('.category-btn[data-category="bistro"]');
                if (bistroBtn) {
                    bistroBtn.classList.add('active');
                }
                this.renderProducts();
            };

            bistroModalClose.addEventListener('click', () => {
                bistroModal.classList.remove('show');
                document.body.style.overflow = '';
                showBistroProducts();
            });
            bistroModal.addEventListener('click', (ev) => {
                if (ev.target === bistroModal) {
                    bistroModal.classList.remove('show');
                    document.body.style.overflow = '';
                    showBistroProducts();
                }
            });
        }

        // Add to cart
        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-to-cart-btn')) {
                const btn = e.target.closest('.add-to-cart-btn');
                const productId = btn.getAttribute('data-product-id');
                this.addToCart(productId);
            }
        });

            // WhatsApp order button
            const whatsappBtn = document.getElementById('whatsappOrderBtn');
            if (whatsappBtn) {
                whatsappBtn.addEventListener('click', () => {
                    this.sendWhatsAppOrder();
                });
            }

            // Email link - download QR masa image
            const emailLinks = document.querySelectorAll('a[href^="mailto:info@yicem.com"]');
            emailLinks.forEach(emailLink => {
                emailLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    // QR masa görselini indir
                    const downloadLink = document.createElement('a');
                    downloadLink.href = '/qrmasa.png';
                    downloadLink.download = 'qrmasa.png';
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                });
            });

			           // PWA Install - beforeinstallprompt Event Listener
			let deferredPrompt;
			
			window.addEventListener('beforeinstallprompt', (e) => {
			    // Varsayılan tarayıcı prompt'unu engelle
			    e.preventDefault();
			    // Event'i sakla, daha sonra kullanmak için
			    deferredPrompt = e;
			    console.log('beforeinstallprompt event captured');
			    
			    // Hero butonu göster (eğer gizliyse)
			    const heroInstallBtn = document.getElementById('heroInstallBtn');
			    if (heroInstallBtn) {
			        heroInstallBtn.style.display = 'flex';
			    }
			});
			
			// PWA Install - Hero Download Button
			const heroInstallBtn = document.getElementById('heroInstallBtn');
			
			if (heroInstallBtn) {
			    // İlk yüklemede butonu gizle (prompt yoksa)
			    if (!deferredPrompt) {
			        heroInstallBtn.style.display = 'none';
			    }
			    
			    heroInstallBtn.addEventListener('click', async (e) => {
			        e.preventDefault();
			        e.stopPropagation();
			        
			        console.log('Hero install button clicked');
			        console.log('deferredPrompt:', deferredPrompt);
			        
			        if (deferredPrompt) {
			            try {
			                // PWA install prompt'u göster
			                deferredPrompt.prompt();
			                
			                // Kullanıcı seçimini bekle
			                const choiceResult = await deferredPrompt.userChoice;
			                
			                console.log('User choice:', choiceResult.outcome);
			                
			                if (choiceResult.outcome === 'accepted') {
			                    console.log('User accepted the PWA install prompt');
			                } else {
			                    console.log('User dismissed the PWA install prompt');
			                }
			                
			                // Prompt'u temizle
			                deferredPrompt = null;
			                
			                // Butonu gizle
			                heroInstallBtn.style.display = 'none';
			            } catch (error) {
			                console.error('Error during PWA install:', error);
			            }
			        } else {
			            console.log('PWA install not available - deferredPrompt is null');
			            // Alternatif: Eğer app zaten kuruluysa veya desteklenmiyorsa
			            heroInstallBtn.style.display = 'none';
			        }
			    });
			}
			
			// Eğer app zaten kuruluysa butonu gizle
			window.addEventListener('appinstalled', () => {
			    console.log('PWA was installed');
			    const heroInstallBtn = document.getElementById('heroInstallBtn');
			    if (heroInstallBtn) {
			        heroInstallBtn.style.display = 'none';
			    }
			    deferredPrompt = null;
			});

            // Logo click - Scroll to top
            const logo = document.querySelector('.logo');
            if (logo) {
                logo.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            }

        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('change', (e) => {
                this.toggleTheme(e.currentTarget.checked);
            });
        }

        // CTA button
        const ctaButton = document.querySelector('.cta-button');
        if (ctaButton) {
            ctaButton.addEventListener('click', () => {
                document.querySelector('.products').scrollIntoView({ behavior: 'smooth' });
            });
        }

        // Header scroll effect
        window.addEventListener('scroll', () => {
            const header = document.getElementById('header');
            if (header) {
                if (window.scrollY > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
        });

        // Product modal close
        const productModal = document.getElementById('productModal');
        const productModalClose = document.getElementById('productModalClose');
        
        if (productModalClose) {
            productModalClose.addEventListener('click', () => {
                this.hideProductModal();
            });
        }

        if (productModal) {
            productModal.addEventListener('click', (e) => {
                if (e.target === productModal) {
                    this.hideProductModal();
                }
            });
        }

        // Modal içindeki Sipariş Ver butonu
        const productModalOrderBtn = document.getElementById('productModalOrderBtn');
        if (productModalOrderBtn) {
            productModalOrderBtn.addEventListener('click', () => {
                if (this.currentProduct) {
                    this.addToCart(this.currentProduct.id);
                    this.hideProductModal();
                }
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideLanguageModal();
                this.hideProductModal();
            }
        });

        // Touch gestures for mobile
        let startX = 0;
        let startY = 0;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;

            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;

            // Horizontal swipe
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    // Swipe left - next category
                    if (nextBtn) nextBtn.click();
                } else {
                    // Swipe right - previous category
                    if (prevBtn) prevBtn.click();
                }
            }

            startX = 0;
            startY = 0;
        });
    }

    showProductModal(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const translation = product.translations[this.currentLanguage] || product.translations['en'];
        const modal = document.getElementById('productModal');
        
        if (!modal) return;

        // Update modal content
        document.getElementById('productModalImg').src = product.image;
        document.getElementById('productModalImg').alt = translation.name;
        document.getElementById('productModalName').textContent = translation.name;
		document.getElementById('productModalDescription').textContent = this.getDisplayDescription(product, translation);
        document.getElementById('productModalPrice').textContent = `₺${product.price}`;
        this.currentProduct = product;
        this.currentSelections = { extras: {}, removedIngredients: new Set() };
        this.renderExtrasAndIngredients();
        this.updateTotalPrice();

        // Show modal
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    hideProductModal() {
        const modal = document.getElementById('productModal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    showBistroModal() {
        const modal = document.getElementById('bistroModal');
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    // Render extras (radio/checkbox) and removable ingredients
    renderExtrasAndIngredients() {
        const t = this.getTranslations()[this.currentLanguage];
        const container = document.querySelector('.product-modal-info');
        if (!container || !this.currentProduct) return;

        // Remove old dynamic blocks if exist
        const oldExtras = container.querySelector('.extras-groups');
        if (oldExtras) oldExtras.remove();
        const oldIngredients = container.querySelector('.ingredients-list');
        if (oldIngredients) oldIngredients.remove();
        const oldTotal = container.querySelector('.modal-total');
        if (oldTotal) oldTotal.remove();

        const frag = document.createDocumentFragment();

        // Ingredients (removable)
        if (Array.isArray(this.currentProduct.ingredients)) {
            const ingWrap = document.createElement('div');
            ingWrap.className = 'ingredients-list';
            const title = document.createElement('h4');
            title.textContent = t.ingredients;
            ingWrap.appendChild(title);

            const list = document.createElement('div');
            list.className = 'chips';
            this.currentProduct.ingredients.forEach((ing) => {
                const chip = document.createElement('label');
                chip.className = 'chip removable';
                const input = document.createElement('input');
                input.type = 'checkbox';
                input.checked = true; // default included
                input.addEventListener('change', () => {
                    if (input.checked) {
                        this.currentSelections.removedIngredients.delete(ing);
                    } else {
                        this.currentSelections.removedIngredients.add(ing);
                    }
                });
                const span = document.createElement('span');
                span.textContent = this.translateIngredient(ing, this.currentLanguage);
                chip.appendChild(input);
                chip.appendChild(span);
                list.appendChild(chip);
            });
            ingWrap.appendChild(list);
            frag.appendChild(ingWrap);
        }

        // Extras
        if (Array.isArray(this.currentProduct.extras)) {
            const extrasWrap = document.createElement('div');
            extrasWrap.className = 'extras-groups';
            const title = document.createElement('h4');
            title.textContent = t.extras;
            extrasWrap.appendChild(title);

            this.currentProduct.extras.forEach((group, groupIdx) => {
                const groupBlock = document.createElement('div');
                groupBlock.className = 'extra-group';
                const groupTitle = document.createElement('h5');
                const groupLabelRaw = (group.translations && group.translations[this.currentLanguage]) || group.name || '';
                groupTitle.textContent = this.normalizeLabel(groupLabelRaw);
                groupBlock.appendChild(groupTitle);

                const type = group.type === 'radio' ? 'radio' : 'checkbox';
                const optionsWrap = document.createElement('div');
                optionsWrap.className = 'extra-options';

                group.options.forEach((opt, optIdx) => {
                    const label = document.createElement('label');
                    label.className = 'option-row';
                    const input = document.createElement('input');
                    input.type = type;
                    input.name = `extra_${groupIdx}`;
                    input.value = opt.id ?? `${groupIdx}_${optIdx}`;
                    const priceDelta = Number(opt.priceDelta || 0);
                    input.addEventListener('change', () => {
                        if (type === 'radio') {
                            this.currentSelections.extras[groupIdx] = [input.value];
                        } else {
                            const current = new Set(this.currentSelections.extras[groupIdx] || []);
                            if (input.checked) current.add(input.value); else current.delete(input.value);
                            this.currentSelections.extras[groupIdx] = Array.from(current);
                        }
                        this.updateTotalPrice();
                    });

                    const optLabelRaw = (opt.translations && opt.translations[this.currentLanguage]) || opt.name || '';
                    const spanText = document.createElement('span');
                    spanText.textContent = this.normalizeLabel(optLabelRaw);
                    const spanPrice = document.createElement('span');
                    spanPrice.className = 'option-price';
                    if (priceDelta) spanPrice.textContent = `+₺${priceDelta}`;
                    label.appendChild(input);
                    label.appendChild(spanText);
                    label.appendChild(spanPrice);
                    optionsWrap.appendChild(label);
                });

                groupBlock.appendChild(optionsWrap);
                extrasWrap.appendChild(groupBlock);
            });

            frag.appendChild(extrasWrap);
        }

        // Total
        const totalRow = document.createElement('div');
        totalRow.className = 'modal-total';
        const totalLabel = document.createElement('span');
        totalLabel.textContent = t.total;
        const totalValue = document.createElement('strong');
        totalValue.id = 'modalTotalPrice';
        totalRow.appendChild(totalLabel);
        totalRow.appendChild(totalValue);
        frag.appendChild(totalRow);

        container.appendChild(frag);
    }

    // Compute price with selected extras
    updateTotalPrice() {
        if (!this.currentProduct) return;
        let total = Number(this.currentProduct.price || 0);
        if (Array.isArray(this.currentProduct.extras)) {
            this.currentProduct.extras.forEach((group, groupIdx) => {
                const selected = this.currentSelections.extras[groupIdx] || [];
                if (!Array.isArray(group.options)) return;
                group.options.forEach((opt, idx) => {
                    const id = opt.id ?? `${groupIdx}_${idx}`;
                    if (selected.includes(String(id))) {
                        total += Number(opt.priceDelta || 0);
                    }
                });
            });
        }
        const el = document.getElementById('modalTotalPrice');
        if (el) el.textContent = `₺${total.toFixed(2)}`;
        const basePriceEl = document.getElementById('productModalPrice');
        if (basePriceEl) basePriceEl.textContent = `₺${Number(this.currentProduct.price || 0).toFixed(2)}`;
    }

    // Cart System
    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const translation = product.translations[this.currentLanguage] || product.translations['en'];
        
        const cartItem = {
            id: productId,
            name: translation.name,
            description: translation.description,
            price: product.price,
            quantity: 1,
            extras: this.currentSelections.extras || {},
            removedIngredients: Array.from(this.currentSelections.removedIngredients || new Set())
        };

        // Check if item already exists in cart
        const existingItemIndex = this.cartItems.findIndex(item => 
            item.id === productId && 
            JSON.stringify(item.extras) === JSON.stringify(cartItem.extras) &&
            JSON.stringify(item.removedIngredients) === JSON.stringify(cartItem.removedIngredients)
        );

        if (existingItemIndex > -1) {
            this.cartItems[existingItemIndex].quantity += 1;
        } else {
            this.cartItems.push(cartItem);
        }

        this.updateWhatsAppButton();
        this.showCartFeedback();
    }

    updateWhatsAppButton() {
        const whatsappBtn = document.getElementById('whatsappOrderBtn');
        const cartBadge = document.getElementById('cartBadge');
        
        if (whatsappBtn && cartBadge) {
            const totalItems = this.cartItems.reduce((total, item) => total + item.quantity, 0);
            
            // WhatsApp butonunu her zaman göster
            whatsappBtn.style.display = 'flex';
            
            if (totalItems > 0) {
                cartBadge.style.display = 'flex';
                cartBadge.textContent = totalItems;
            } else {
                cartBadge.style.display = 'none';
            }
        }
    }

    showCartFeedback() {
        // Simple feedback - you can enhance this with animations
        const btn = event.target.closest('.add-to-cart-btn');
        if (btn) {
            const originalText = btn.querySelector('span').textContent;
            btn.querySelector('span').textContent = 'Eklendi!';
            btn.style.background = 'var(--color-success)';
            
            setTimeout(() => {
                btn.querySelector('span').textContent = originalText;
                btn.style.background = '';
            }, 1500);
        }
    }

    sendWhatsAppOrder() {
        const message = 'Merhaba Yicem, sipariş vermek istiyorum';
        const phoneNumber = '905412429007';
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
    }

    // PWA Service Worker Registration
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    }

    // PWA Install Prompt
    setupInstallPrompt() {
        this.deferredPrompt = null;
        const installBtn = document.getElementById('installBtn');
        const heroInstallBtn = document.getElementById('heroInstallBtn');

        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later
            this.deferredPrompt = e;
            // Show the install buttons
            if (installBtn) {
                installBtn.style.display = 'flex';
            }
            if (heroInstallBtn) {
                heroInstallBtn.style.display = 'flex';
            }
        });

        if (installBtn) {
            installBtn.addEventListener('click', async () => {
                if (this.deferredPrompt) {
                    // Show the install prompt
                    this.deferredPrompt.prompt();
                    // Wait for the user to respond to the prompt
                    const { outcome } = await this.deferredPrompt.userChoice;
                    console.log(`User response to the install prompt: ${outcome}`);
                    // We no longer need the prompt. Clear it up.
                    this.deferredPrompt = null;
                    // Hide the install button
                    installBtn.style.display = 'none';
                }
            });
        }

        window.addEventListener('appinstalled', (evt) => {
            console.log('PWA was installed');
            if (installBtn) {
                installBtn.style.display = 'none';
            }
            if (heroInstallBtn) {
                heroInstallBtn.style.display = 'none';
            }
        });
    }

    // Translate ingredients function
    translateIngredient(ingredient, language) {
        const translations = {
            tr: {
                'Mozzarella': 'Mozzarella',
                'Domates Sosu': 'Domates Sosu',
                'Fesleğen': 'Fesleğen',
                'Cherry Domates': 'Cherry Domates',
                'Sucuk': 'Sucuk',
                'Mantar': 'Mantar',
                'Zeytin': 'Zeytin',
                'Pepperoni': 'Pepperoni',
                'Peynir': 'Peynir',
                'Tavuk': 'Tavuk',
                'Dana Eti': 'Dana Eti',
                'Soğan': 'Soğan',
                'Biber': 'Biber',
                'Marul': 'Marul',
                'Salatalık': 'Salatalık',
                'Domates': 'Domates',
                'Ekmek': 'Ekmek',
                'Tereyağı': 'Tereyağı',
                'Tuz': 'Tuz',
                'Karabiber': 'Karabiber',
                'Sarımsak': 'Sarımsak',
                'Maydanoz': 'Maydanoz',
                'Nane': 'Nane',
                'Yoğurt': 'Yoğurt',
                'Pilav': 'Pilav',
                'Makarna': 'Makarna',
                'Hamur': 'Hamur',
                'Sos': 'Sos',
                'Baharat': 'Baharat',
                'Yağ': 'Yağ',
                'Yumurta': 'Yumurta',
                'Süt': 'Süt',
                'Krema': 'Krema',
                'Bal': 'Bal',
                'Şeker': 'Şeker',
                'Un': 'Un',
                'Patates': 'Patates',
                'Havuç': 'Havuç',
                'Lahana': 'Lahana',
                'Ispanak': 'Ispanak',
                'Patlıcan': 'Patlıcan',
                'Kabak': 'Kabak',
                'Mısır': 'Mısır',
                'Bezelye': 'Bezelye',
                'Fasulye': 'Fasulye',
                'Mercimek': 'Mercimek',
                'Nohut': 'Nohut',
                'Ceviz': 'Ceviz',
                'Fındık': 'Fındık',
                'Badem': 'Badem',
                'Antep Fıstığı': 'Antep Fıstığı',
                'Kuru Üzüm': 'Kuru Üzüm',
                'Hurma': 'Hurma',
                'İncir': 'İncir',
                'Elma': 'Elma',
                'Muz': 'Muz',
                'Portakal': 'Portakal',
                'Limon': 'Limon',
                'Çilek': 'Çilek',
                'Kiraz': 'Kiraz',
                'Üzüm': 'Üzüm',
                'Şeftali': 'Şeftali',
                'Armut': 'Armut',
                'Kivi': 'Kivi',
                'Ananas': 'Ananas',
                'Karpuz': 'Karpuz',
                'Kavun': 'Kavun',
                'Nar': 'Nar',
                'Avokado': 'Avokado',
                'Hindistan Cevizi': 'Hindistan Cevizi',
                'Zencefil': 'Zencefil',
                'Tarçın': 'Tarçın',
                'Vanilya': 'Vanilya',
                'Çikolata': 'Çikolata',
                'Kakao': 'Kakao',
                'Kahve': 'Kahve',
                'Çay': 'Çay'
            },
            en: {
                'Mozzarella': 'Mozzarella',
                'Domates Sosu': 'Tomato Sauce',
                'Fesleğen': 'Basil',
                'Cherry Domates': 'Cherry Tomatoes',
                'Sucuk': 'Sausage',
                'Mantar': 'Mushroom',
                'Zeytin': 'Olive',
                'Pepperoni': 'Pepperoni',
                'Peynir': 'Cheese',
                'Tavuk': 'Chicken',
                'Dana Eti': 'Beef',
                'Soğan': 'Onion',
                'Biber': 'Pepper',
                'Marul': 'Lettuce',
                'Salatalık': 'Cucumber',
                'Domates': 'Tomato',
                'Ekmek': 'Bread',
                'Tereyağı': 'Butter',
                'Tuz': 'Salt',
                'Karabiber': 'Black Pepper',
                'Sarımsak': 'Garlic',
                'Maydanoz': 'Parsley',
                'Nane': 'Mint',
                'Yoğurt': 'Yogurt',
                'Pilav': 'Rice',
                'Makarna': 'Pasta',
                'Hamur': 'Dough',
                'Sos': 'Sauce',
                'Baharat': 'Spice',
                'Yağ': 'Oil',
                'Yumurta': 'Egg',
                'Süt': 'Milk',
                'Krema': 'Cream',
                'Bal': 'Honey',
                'Şeker': 'Sugar',
                'Un': 'Flour',
                'Patates': 'Potato',
                'Havuç': 'Carrot',
                'Lahana': 'Cabbage',
                'Ispanak': 'Spinach',
                'Patlıcan': 'Eggplant',
                'Kabak': 'Zucchini',
                'Mısır': 'Corn',
                'Bezelye': 'Peas',
                'Fasulye': 'Beans',
                'Mercimek': 'Lentil',
                'Nohut': 'Chickpea',
                'Ceviz': 'Walnut',
                'Fındık': 'Hazelnut',
                'Badem': 'Almond',
                'Antep Fıstığı': 'Pistachio',
                'Kuru Üzüm': 'Raisin',
                'Hurma': 'Date',
                'İncir': 'Fig',
                'Elma': 'Apple',
                'Muz': 'Banana',
                'Portakal': 'Orange',
                'Limon': 'Lemon',
                'Çilek': 'Strawberry',
                'Kiraz': 'Cherry',
                'Üzüm': 'Grape',
                'Şeftali': 'Peach',
                'Armut': 'Pear',
                'Kivi': 'Kiwi',
                'Ananas': 'Pineapple',
                'Karpuz': 'Watermelon',
                'Kavun': 'Melon',
                'Nar': 'Pomegranate',
                'Avokado': 'Avocado',
                'Hindistan Cevizi': 'Coconut',
                'Zencefil': 'Ginger',
                'Tarçın': 'Cinnamon',
                'Vanilya': 'Vanilla',
                'Çikolata': 'Chocolate',
                'Kakao': 'Cocoa',
                'Kahve': 'Coffee',
                'Çay': 'Tea'
            },
            ru: {
                'Mozzarella': 'Моцарелла',
                'Domates Sosu': 'Томатный соус',
                'Fesleğen': 'Базилик',
                'Cherry Domates': 'Помидоры черри',
                'Sucuk': 'Колбаса',
                'Mantar': 'Грибы',
                'Zeytin': 'Оливки',
                'Pepperoni': 'Пепперони',
                'Peynir': 'Сыр',
                'Tavuk': 'Курица',
                'Dana Eti': 'Говядина',
                'Soğan': 'Лук',
                'Biber': 'Перец',
                'Marul': 'Салат',
                'Salatalık': 'Огурец',
                'Domates': 'Помидор',
                'Ekmek': 'Хлеб',
                'Tereyağı': 'Масло',
                'Tuz': 'Соль',
                'Karabiber': 'Черный перец',
                'Sarımsak': 'Чеснок',
                'Maydanoz': 'Петрушка',
                'Nane': 'Мята',
                'Yoğurt': 'Йогурт',
                'Pilav': 'Рис',
                'Makarna': 'Макароны',
                'Hamur': 'Тесто',
                'Sos': 'Соус',
                'Baharat': 'Специи',
                'Yağ': 'Масло',
                'Yumurta': 'Яйцо',
                'Süt': 'Молоко',
                'Krema': 'Сливки',
                'Bal': 'Мед',
                'Şeker': 'Сахар',
                'Un': 'Мука',
                'Patates': 'Картофель',
                'Havuç': 'Морковь',
                'Lahana': 'Капуста',
                'Ispanak': 'Шпинат',
                'Patlıcan': 'Баклажан',
                'Kabak': 'Кабачок',
                'Mısır': 'Кукуруза',
                'Bezelye': 'Горох',
                'Fasulye': 'Фасоль',
                'Mercimek': 'Чечевица',
                'Nohut': 'Нут',
                'Ceviz': 'Грецкий орех',
                'Fındık': 'Фундук',
                'Badem': 'Миндаль',
                'Antep Fıstığı': 'Фисташки',
                'Kuru Üzüm': 'Изюм',
                'Hurma': 'Финик',
                'İncir': 'Инжир',
                'Elma': 'Яблоко',
                'Muz': 'Банан',
                'Portakal': 'Апельсин',
                'Limon': 'Лимон',
                'Çilek': 'Клубника',
                'Kiraz': 'Вишня',
                'Üzüm': 'Виноград',
                'Şeftali': 'Персик',
                'Armut': 'Груша',
                'Kivi': 'Киви',
                'Ananas': 'Ананас',
                'Karpuz': 'Арбуз',
                'Kavun': 'Дыня',
                'Nar': 'Гранат',
                'Avokado': 'Авокадо',
                'Hindistan Cevizi': 'Кокос',
                'Zencefil': 'Имбирь',
                'Tarçın': 'Корица',
                'Vanilya': 'Ваниль',
                'Çikolata': 'Шоколад',
                'Kakao': 'Какао',
                'Kahve': 'Кофе',
                'Çay': 'Чай'
            },
            de: {
                'Mozzarella': 'Mozzarella',
                'Domates Sosu': 'Tomatensauce',
                'Fesleğen': 'Basilikum',
                'Cherry Domates': 'Kirschtomaten',
                'Sucuk': 'Wurst',
                'Mantar': 'Pilz',
                'Zeytin': 'Olive',
                'Pepperoni': 'Pepperoni',
                'Peynir': 'Käse',
                'Tavuk': 'Hähnchen',
                'Dana Eti': 'Rindfleisch',
                'Soğan': 'Zwiebel',
                'Biber': 'Pfeffer',
                'Marul': 'Salat',
                'Salatalık': 'Gurke',
                'Domates': 'Tomate',
                'Ekmek': 'Brot',
                'Tereyağı': 'Butter',
                'Tuz': 'Salz',
                'Karabiber': 'Schwarzer Pfeffer',
                'Sarımsak': 'Knoblauch',
                'Maydanoz': 'Petersilie',
                'Nane': 'Minze',
                'Yoğurt': 'Joghurt',
                'Pilav': 'Reis',
                'Makarna': 'Pasta',
                'Hamur': 'Teig',
                'Sos': 'Soße',
                'Baharat': 'Gewürz',
                'Yağ': 'Öl',
                'Yumurta': 'Ei',
                'Süt': 'Milch',
                'Krema': 'Sahne',
                'Bal': 'Honig',
                'Şeker': 'Zucker',
                'Un': 'Mehl',
                'Patates': 'Kartoffel',
                'Havuç': 'Karotte',
                'Lahana': 'Kohl',
                'Ispanak': 'Spinat',
                'Patlıcan': 'Aubergine',
                'Kabak': 'Zucchini',
                'Mısır': 'Mais',
                'Bezelye': 'Erbsen',
                'Fasulye': 'Bohnen',
                'Mercimek': 'Linsen',
                'Nohut': 'Kichererbsen',
                'Ceviz': 'Walnuss',
                'Fındık': 'Haselnuss',
                'Badem': 'Mandel',
                'Antep Fıstığı': 'Pistazie',
                'Kuru Üzüm': 'Rosine',
                'Hurma': 'Dattel',
                'İncir': 'Feige',
                'Elma': 'Apfel',
                'Muz': 'Banane',
                'Portakal': 'Orange',
                'Limon': 'Zitrone',
                'Çilek': 'Erdbeere',
                'Kiraz': 'Kirsche',
                'Üzüm': 'Traube',
                'Şeftali': 'Pfirsich',
                'Armut': 'Birne',
                'Kivi': 'Kiwi',
                'Ananas': 'Ananas',
                'Karpuz': 'Wassermelone',
                'Kavun': 'Melone',
                'Nar': 'Granatapfel',
                'Avokado': 'Avocado',
                'Hindistan Cevizi': 'Kokosnuss',
                'Zencefil': 'Ingwer',
                'Tarçın': 'Zimt',
                'Vanilya': 'Vanille',
                'Çikolata': 'Schokolade',
                'Kakao': 'Kakao',
                'Kahve': 'Kaffee',
                'Çay': 'Tee'
            },
            fr: {
                'Mozzarella': 'Mozzarella',
                'Domates Sosu': 'Sauce tomate',
                'Fesleğen': 'Basilic',
                'Cherry Domates': 'Tomates cerises',
                'Sucuk': 'Saucisse',
                'Mantar': 'Champignon',
                'Zeytin': 'Olive',
                'Pepperoni': 'Pepperoni',
                'Peynir': 'Fromage',
                'Tavuk': 'Poulet',
                'Dana Eti': 'Bœuf',
                'Soğan': 'Oignon',
                'Biber': 'Poivre',
                'Marul': 'Laitue',
                'Salatalık': 'Concombre',
                'Domates': 'Tomate',
                'Ekmek': 'Pain',
                'Tereyağı': 'Beurre',
                'Tuz': 'Sel',
                'Karabiber': 'Poivre noir',
                'Sarımsak': 'Ail',
                'Maydanoz': 'Persil',
                'Nane': 'Menthe',
                'Yoğurt': 'Yaourt',
                'Pilav': 'Riz',
                'Makarna': 'Pâtes',
                'Hamur': 'Pâte',
                'Sos': 'Sauce',
                'Baharat': 'Épice',
                'Yağ': 'Huile',
                'Yumurta': 'Œuf',
                'Süt': 'Lait',
                'Krema': 'Crème',
                'Bal': 'Miel',
                'Şeker': 'Sucre',
                'Un': 'Farine',
                'Patates': 'Pomme de terre',
                'Havuç': 'Carotte',
                'Lahana': 'Chou',
                'Ispanak': 'Épinard',
                'Patlıcan': 'Aubergine',
                'Kabak': 'Courgette',
                'Mısır': 'Maïs',
                'Bezelye': 'Pois',
                'Fasulye': 'Haricots',
                'Mercimek': 'Lentille',
                'Nohut': 'Pois chiche',
                'Ceviz': 'Noix',
                'Fındık': 'Noisette',
                'Badem': 'Amande',
                'Antep Fıstığı': 'Pistache',
                'Kuru Üzüm': 'Raisin sec',
                'Hurma': 'Datte',
                'İncir': 'Figue',
                'Elma': 'Pomme',
                'Muz': 'Banane',
                'Portakal': 'Orange',
                'Limon': 'Citron',
                'Çilek': 'Fraise',
                'Kiraz': 'Cerise',
                'Üzüm': 'Raisin',
                'Şeftali': 'Pêche',
                'Armut': 'Poire',
                'Kivi': 'Kiwi',
                'Ananas': 'Ananas',
                'Karpuz': 'Pastèque',
                'Kavun': 'Melon',
                'Nar': 'Grenade',
                'Avokado': 'Avocat',
                'Hindistan Cevizi': 'Noix de coco',
                'Zencefil': 'Gingembre',
                'Tarçın': 'Cannelle',
                'Vanilya': 'Vanille',
                'Çikolata': 'Chocolat',
                'Kakao': 'Cacao',
                'Kahve': 'Café',
                'Çay': 'Thé'
            },
            ar: {
                'Mozzarella': 'موزاريلا',
                'Domates Sosu': 'صلصة الطماطم',
                'Fesleğen': 'الريحان',
                'Cherry Domates': 'طماطم كرزية',
                'Sucuk': 'النقانق',
                'Mantar': 'الفطر',
                'Zeytin': 'الزيتون',
                'Pepperoni': 'بيبروني',
                'Peynir': 'الجبن',
                'Tavuk': 'الدجاج',
                'Dana Eti': 'لحم البقر',
                'Soğan': 'البصل',
                'Biber': 'الفلفل',
                'Marul': 'الخس',
                'Salatalık': 'الخيار',
                'Domates': 'الطماطم',
                'Ekmek': 'الخبز',
                'Tereyağı': 'الزبدة',
                'Tuz': 'الملح',
                'Karabiber': 'الفلفل الأسود',
                'Sarımsak': 'الثوم',
                'Maydanoz': 'البقدونس',
                'Nane': 'النعناع',
                'Yoğurt': 'الزبادي',
                'Pilav': 'الأرز',
                'Makarna': 'المعكرونة',
                'Hamur': 'العجين',
                'Sos': 'الصلصة',
                'Baharat': 'التوابل',
                'Yağ': 'الزيت',
                'Yumurta': 'البيض',
                'Süt': 'الحليب',
                'Krema': 'الكريمة',
                'Bal': 'العسل',
                'Şeker': 'السكر',
                'Un': 'الدقيق',
                'Patates': 'البطاطس',
                'Havuç': 'الجزر',
                'Lahana': 'الملفوف',
                'Ispanak': 'السبانخ',
                'Patlıcan': 'الباذنجان',
                'Kabak': 'الكوسة',
                'Mısır': 'الذرة',
                'Bezelye': 'البازلاء',
                'Fasulye': 'الفاصوليا',
                'Mercimek': 'العدس',
                'Nohut': 'الحمص',
                'Ceviz': 'الجوز',
                'Fındık': 'البندق',
                'Badem': 'اللوز',
                'Antep Fıstığı': 'الفستق',
                'Kuru Üzüm': 'الزبيب',
                'Hurma': 'التمر',
                'İncir': 'التين',
                'Elma': 'التفاح',
                'Muz': 'الموز',
                'Portakal': 'البرتقال',
                'Limon': 'الليمون',
                'Çilek': 'الفراولة',
                'Kiraz': 'الكرز',
                'Üzüm': 'العنب',
                'Şeftali': 'الخوخ',
                'Armut': 'الكمثرى',
                'Kivi': 'الكيوي',
                'Ananas': 'الأناناس',
                'Karpuz': 'البطيخ',
                'Kavun': 'الشمام',
                'Nar': 'الرمان',
                'Avokado': 'الأفوكادو',
                'Hindistan Cevizi': 'جوز الهند',
                'Zencefil': 'الزنجبيل',
                'Tarçın': 'القرفة',
                'Vanilya': 'الفانيليا',
                'Çikolata': 'الشوكولاتة',
                'Kakao': 'الكاكاو',
                'Kahve': 'القهوة',
                'Çay': 'الشاي'
            }
        };

        return translations[language]?.[ingredient] || ingredient;
    }

    // Utility methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    .no-products {
        grid-column: 1 / -1;
        text-align: center;
        padding: var(--spacing-xxl);
        color: var(--color-text-secondary);
        font-size: var(--font-size-lg);
    }
`;
document.head.appendChild(style);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.restaurantApp = new RestaurantApp();
});

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
