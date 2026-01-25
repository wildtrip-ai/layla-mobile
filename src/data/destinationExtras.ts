// Transport, Budget, Packing List, and Local Phrases data for destinations

export interface TransportOption {
  type: "airport" | "train" | "bus" | "ferry";
  name: string;
  travelTime: string;
  description: string;
}

export interface BudgetInfo {
  currency: string;
  accommodationBudget: { low: number; mid: number; high: number };
  foodBudget: { low: number; mid: number; high: number };
  activitiesBudget: { low: number; mid: number; high: number };
  transportBudget: number;
}

export interface PackingCategory {
  category: string;
  items: string[];
}

export interface LocalPhrase {
  phrase: string;
  translation: string;
  pronunciation?: string;
}

export interface DestinationExtras {
  transport: TransportOption[];
  budget: BudgetInfo;
  packingList: PackingCategory[];
  localPhrases: { language: string; phrases: LocalPhrase[] };
}

export const destinationExtras: Record<string, DestinationExtras> = {
  // Spain destinations
  "costa-del-sol": {
    transport: [
      { type: "airport", name: "Málaga Airport (AGP)", travelTime: "20-40 min", description: "Main international airport serving the region" },
      { type: "train", name: "AVE from Madrid", travelTime: "2.5 hours", description: "High-speed rail to Málaga station" },
      { type: "bus", name: "ALSA Bus Network", travelTime: "Varies", description: "Connects coastal towns along the coast" },
    ],
    budget: {
      currency: "EUR",
      accommodationBudget: { low: 50, mid: 120, high: 300 },
      foodBudget: { low: 25, mid: 50, high: 100 },
      activitiesBudget: { low: 15, mid: 40, high: 100 },
      transportBudget: 15,
    },
    packingList: [
      { category: "Beach Essentials", items: ["Swimsuit", "Beach towel", "Sunscreen SPF 50+", "Sunglasses", "Flip flops"] },
      { category: "Clothing", items: ["Light summer clothes", "Evening wear for restaurants", "Comfortable walking shoes", "Light cardigan"] },
      { category: "Activities", items: ["Water shoes for rocky beaches", "Snorkeling gear", "Golf attire if playing", "Hiking boots for villages"] },
    ],
    localPhrases: {
      language: "Spanish",
      phrases: [
        { phrase: "Hola", translation: "Hello", pronunciation: "OH-lah" },
        { phrase: "Gracias", translation: "Thank you", pronunciation: "GRAH-see-ahs" },
        { phrase: "¿Cuánto cuesta?", translation: "How much does it cost?", pronunciation: "KWAHN-toh KWES-tah" },
        { phrase: "La cuenta, por favor", translation: "The bill, please", pronunciation: "lah KWEN-tah por fah-VOR" },
        { phrase: "¿Dónde está la playa?", translation: "Where is the beach?", pronunciation: "DON-deh es-TAH lah PLAH-yah" },
        { phrase: "Una cerveza, por favor", translation: "A beer, please", pronunciation: "OO-nah ser-VEH-sah por fah-VOR" },
      ],
    },
  },
  "ibiza": {
    transport: [
      { type: "airport", name: "Ibiza Airport (IBZ)", travelTime: "15-30 min", description: "Direct flights from major European cities" },
      { type: "ferry", name: "Baleària/Trasmed", travelTime: "2-8 hours", description: "Ferries from Barcelona, Valencia, and Denia" },
    ],
    budget: {
      currency: "EUR",
      accommodationBudget: { low: 80, mid: 180, high: 500 },
      foodBudget: { low: 35, mid: 70, high: 150 },
      activitiesBudget: { low: 30, mid: 80, high: 200 },
      transportBudget: 20,
    },
    packingList: [
      { category: "Party Essentials", items: ["Stylish club outfits", "Comfortable dancing shoes", "Earplugs for clubs", "Portable phone charger"] },
      { category: "Beach & Pool", items: ["Designer swimwear", "Beach cover-ups", "Waterproof bag", "Sunglasses"] },
      { category: "Day Activities", items: ["Boat-friendly sandals", "Snorkeling gear", "Light linen clothes", "Wide-brim hat"] },
    ],
    localPhrases: {
      language: "Spanish/Catalan",
      phrases: [
        { phrase: "Bon dia", translation: "Good morning (Catalan)", pronunciation: "bon DEE-ah" },
        { phrase: "Gràcies", translation: "Thank you (Catalan)", pronunciation: "GRAH-see-es" },
        { phrase: "¿A qué hora abre el club?", translation: "What time does the club open?", pronunciation: "ah keh OH-rah AH-breh el kloob" },
        { phrase: "¿Dónde está la cala?", translation: "Where is the cove?", pronunciation: "DON-deh es-TAH lah KAH-lah" },
        { phrase: "Una copa, por favor", translation: "A drink, please", pronunciation: "OO-nah KOH-pah por fah-VOR" },
      ],
    },
  },
  "canary-islands": {
    transport: [
      { type: "airport", name: "Tenerife South (TFS)", travelTime: "20-45 min", description: "Main tourist airport for Tenerife" },
      { type: "airport", name: "Gran Canaria (LPA)", travelTime: "20-35 min", description: "Major hub for the eastern islands" },
      { type: "ferry", name: "Fred Olsen/Armas", travelTime: "1-5 hours", description: "Inter-island ferry connections" },
    ],
    budget: {
      currency: "EUR",
      accommodationBudget: { low: 45, mid: 100, high: 250 },
      foodBudget: { low: 20, mid: 45, high: 90 },
      activitiesBudget: { low: 15, mid: 35, high: 80 },
      transportBudget: 12,
    },
    packingList: [
      { category: "Year-Round Essentials", items: ["Light layers for varying microclimates", "Windbreaker", "Sunscreen", "Comfortable walking shoes"] },
      { category: "Nature & Hiking", items: ["Sturdy hiking boots", "Backpack with hydration", "Warm fleece for Teide", "Camera for stargazing"] },
      { category: "Beach", items: ["Swimsuit", "Beach sandals", "Reef-safe sunscreen", "Snorkeling gear"] },
    ],
    localPhrases: {
      language: "Spanish",
      phrases: [
        { phrase: "¡Muyayo!", translation: "Cool!/Great! (Canarian slang)", pronunciation: "moo-YAH-yoh" },
        { phrase: "Papas arrugadas", translation: "Wrinkled potatoes (local dish)", pronunciation: "PAH-pahs ah-roo-GAH-dahs" },
        { phrase: "¿Hay guagua?", translation: "Is there a bus?", pronunciation: "eye GWAH-gwah" },
        { phrase: "Un barraquito", translation: "A local coffee drink", pronunciation: "oon bah-rah-KEE-toh" },
        { phrase: "¿Cómo llego al Teide?", translation: "How do I get to Teide?", pronunciation: "KOH-moh YEH-goh al TEY-deh" },
      ],
    },
  },
  "balearic-islands": {
    transport: [
      { type: "airport", name: "Palma de Mallorca (PMI)", travelTime: "15-30 min", description: "One of Europe's busiest summer airports" },
      { type: "airport", name: "Menorca (MAH)", travelTime: "10-20 min", description: "Small airport with seasonal flights" },
      { type: "ferry", name: "Baleària/Trasmed", travelTime: "4-8 hours", description: "Regular ferries from Barcelona and Valencia" },
    ],
    budget: {
      currency: "EUR",
      accommodationBudget: { low: 60, mid: 140, high: 400 },
      foodBudget: { low: 30, mid: 60, high: 120 },
      activitiesBudget: { low: 20, mid: 50, high: 120 },
      transportBudget: 18,
    },
    packingList: [
      { category: "Island Hopping", items: ["Lightweight luggage", "Quick-dry clothing", "Multiple swimsuits", "Universal adapter"] },
      { category: "Mallorca Mountains", items: ["Hiking boots", "Breathable layers", "Rain jacket", "Trekking poles"] },
      { category: "Beach & Sea", items: ["Snorkeling set", "Waterproof phone case", "Beach shoes", "Reef-safe sunscreen"] },
    ],
    localPhrases: {
      language: "Spanish/Catalan",
      phrases: [
        { phrase: "Bon dia", translation: "Good morning (Catalan)", pronunciation: "bon DEE-ah" },
        { phrase: "Moltes gràcies", translation: "Thank you very much (Catalan)", pronunciation: "MOL-tes GRAH-see-es" },
        { phrase: "On és la platja?", translation: "Where is the beach? (Catalan)", pronunciation: "on es la PLAH-jah" },
        { phrase: "Ensaïmada", translation: "Local spiral pastry", pronunciation: "en-sigh-MAH-dah" },
        { phrase: "Sobrassada", translation: "Cured sausage spread", pronunciation: "so-brah-SAH-dah" },
      ],
    },
  },
  // Italy destinations
  "amalfi-coast": {
    transport: [
      { type: "airport", name: "Naples (NAP)", travelTime: "1.5-2 hours", description: "Closest major airport, then bus or ferry" },
      { type: "train", name: "Naples Central", travelTime: "1 hour to Salerno", description: "High-speed trains, then local transport" },
      { type: "ferry", name: "SITA/NLG Ferries", travelTime: "45-90 min", description: "Scenic coast-hugging ferries between towns" },
      { type: "bus", name: "SITA Sud", travelTime: "Varies", description: "Winding coastal bus route" },
    ],
    budget: {
      currency: "EUR",
      accommodationBudget: { low: 80, mid: 200, high: 600 },
      foodBudget: { low: 35, mid: 70, high: 150 },
      activitiesBudget: { low: 20, mid: 50, high: 120 },
      transportBudget: 20,
    },
    packingList: [
      { category: "Coastal Essentials", items: ["Comfortable walking sandals", "Light sundresses/linen clothes", "Sunhat", "Seasickness pills for ferries"] },
      { category: "Hiking", items: ["Sturdy hiking shoes for Path of Gods", "Backpack with water", "Trekking poles", "Light layers"] },
      { category: "Evening", items: ["Smart casual attire", "Comfortable heels/nice shoes", "Light cardigan", "Small crossbody bag"] },
    ],
    localPhrases: {
      language: "Italian",
      phrases: [
        { phrase: "Buongiorno", translation: "Good morning", pronunciation: "bwon-JOR-no" },
        { phrase: "Grazie mille", translation: "Thank you very much", pronunciation: "GRAH-tsee-eh MEE-leh" },
        { phrase: "Il conto, per favore", translation: "The bill, please", pronunciation: "eel KON-toh per fah-VOR-eh" },
        { phrase: "Un limoncello, per favore", translation: "A limoncello, please", pronunciation: "oon lee-mon-CHEL-loh per fah-VOR-eh" },
        { phrase: "Che bella vista!", translation: "What a beautiful view!", pronunciation: "keh BEL-lah VEE-stah" },
        { phrase: "Dov'è il porto?", translation: "Where is the port?", pronunciation: "doh-VEH eel POR-toh" },
      ],
    },
  },
  "tuscany": {
    transport: [
      { type: "airport", name: "Florence (FLR)", travelTime: "20-30 min to city", description: "Small airport with European connections" },
      { type: "airport", name: "Pisa (PSA)", travelTime: "1 hour to Florence", description: "Larger airport with more routes" },
      { type: "train", name: "High-speed from Rome/Milan", travelTime: "1.5-3 hours", description: "Frequent trains to Florence and Pisa" },
    ],
    budget: {
      currency: "EUR",
      accommodationBudget: { low: 70, mid: 160, high: 450 },
      foodBudget: { low: 30, mid: 60, high: 130 },
      activitiesBudget: { low: 15, mid: 40, high: 100 },
      transportBudget: 15,
    },
    packingList: [
      { category: "Art & Culture", items: ["Comfortable museum shoes", "Light scarf for churches", "Small binoculars for frescoes", "Sketchbook"] },
      { category: "Wine Country", items: ["Casual chic clothing", "Layers for cellar visits", "Camera", "Wine journal"] },
      { category: "Countryside", items: ["Driving sunglasses", "Hiking shoes", "Picnic blanket", "Reusable water bottle"] },
    ],
    localPhrases: {
      language: "Italian",
      phrases: [
        { phrase: "Salute!", translation: "Cheers!", pronunciation: "sah-LOO-teh" },
        { phrase: "Un bicchiere di Chianti", translation: "A glass of Chianti", pronunciation: "oon beek-KYEH-reh dee kee-AHN-tee" },
        { phrase: "Posso assaggiare?", translation: "Can I taste?", pronunciation: "POS-soh ahs-sahd-JAH-reh" },
        { phrase: "È delizioso!", translation: "It's delicious!", pronunciation: "eh deh-lee-tsee-OH-zoh" },
        { phrase: "Quanto costa l'ingresso?", translation: "How much is the entrance?", pronunciation: "KWAHN-toh KOS-tah leen-GRES-soh" },
      ],
    },
  },
  "sardinia": {
    transport: [
      { type: "airport", name: "Cagliari (CAG)", travelTime: "15-25 min", description: "Southern Sardinia's main airport" },
      { type: "airport", name: "Olbia (OLB)", travelTime: "20-40 min", description: "Gateway to Costa Smeralda" },
      { type: "ferry", name: "Tirrenia/Moby", travelTime: "5-12 hours", description: "Overnight ferries from mainland Italy" },
    ],
    budget: {
      currency: "EUR",
      accommodationBudget: { low: 60, mid: 150, high: 500 },
      foodBudget: { low: 30, mid: 55, high: 120 },
      activitiesBudget: { low: 20, mid: 45, high: 100 },
      transportBudget: 25,
    },
    packingList: [
      { category: "Beach Paradise", items: ["Multiple swimsuits", "Beach umbrella (some beaches don't have rentals)", "Snorkeling gear", "Waterproof bag"] },
      { category: "Exploration", items: ["4x4 friendly clothes", "Hiking sandals", "Binoculars", "Insect repellent"] },
      { category: "Evening", items: ["Resort wear", "Light jacket for sea breezes", "Comfortable sandals", "Sun hat"] },
    ],
    localPhrases: {
      language: "Italian/Sardinian",
      phrases: [
        { phrase: "Ajò!", translation: "Let's go! (Sardinian)", pronunciation: "ah-YOH" },
        { phrase: "Porceddu", translation: "Roast suckling pig", pronunciation: "por-CHED-doo" },
        { phrase: "Mirto", translation: "Local myrtle liqueur", pronunciation: "MEER-toh" },
        { phrase: "Dov'è la spiaggia?", translation: "Where is the beach?", pronunciation: "doh-VEH lah spee-AHD-jah" },
        { phrase: "Una bottiglia d'acqua", translation: "A bottle of water", pronunciation: "OO-nah bot-TEEL-yah DAHK-wah" },
      ],
    },
  },
  "sicily": {
    transport: [
      { type: "airport", name: "Catania (CTA)", travelTime: "20-40 min", description: "Eastern Sicily's main hub" },
      { type: "airport", name: "Palermo (PMO)", travelTime: "30-45 min", description: "Western Sicily's main airport" },
      { type: "ferry", name: "Caronte/Liberty", travelTime: "20 min from mainland", description: "Frequent ferries from Villa San Giovanni" },
      { type: "train", name: "Trenitalia", travelTime: "Train + ferry", description: "Trains from Rome include ferry crossing" },
    ],
    budget: {
      currency: "EUR",
      accommodationBudget: { low: 50, mid: 120, high: 350 },
      foodBudget: { low: 25, mid: 50, high: 100 },
      activitiesBudget: { low: 15, mid: 35, high: 80 },
      transportBudget: 18,
    },
    packingList: [
      { category: "Volcano Ready", items: ["Sturdy hiking boots for Etna", "Warm layers for summit", "Dust mask", "Windproof jacket"] },
      { category: "Historical Sites", items: ["Comfortable walking shoes", "Hat for sun protection", "Guidebook", "Binoculars"] },
      { category: "Street Food", items: ["Wet wipes", "Small backpack", "Cash for markets", "Reusable water bottle"] },
    ],
    localPhrases: {
      language: "Italian/Sicilian",
      phrases: [
        { phrase: "Minchia!", translation: "Wow! (Sicilian exclamation)", pronunciation: "MEEN-kyah" },
        { phrase: "Arancino o arancina?", translation: "Rice ball (varies by region)", pronunciation: "ah-rahn-CHEE-noh / ah-rahn-CHEE-nah" },
        { phrase: "Un cannolo, per favore", translation: "A cannoli, please", pronunciation: "oon kah-NOH-loh per fah-VOR-eh" },
        { phrase: "Quanto costa il tour dell'Etna?", translation: "How much is the Etna tour?", pronunciation: "KWAHN-toh KOS-tah eel toor del-LET-nah" },
        { phrase: "Che buono!", translation: "How delicious!", pronunciation: "keh BWOH-noh" },
      ],
    },
  },
  // Portugal destinations
  "algarve": {
    transport: [
      { type: "airport", name: "Faro (FAO)", travelTime: "15-60 min", description: "Region's main airport with direct EU flights" },
      { type: "train", name: "CP Rail from Lisbon", travelTime: "2.5-3 hours", description: "Regional trains to coastal towns" },
      { type: "bus", name: "Rede Expressos", travelTime: "3-4 hours", description: "Direct buses from Lisbon" },
    ],
    budget: {
      currency: "EUR",
      accommodationBudget: { low: 45, mid: 100, high: 280 },
      foodBudget: { low: 20, mid: 40, high: 90 },
      activitiesBudget: { low: 15, mid: 35, high: 80 },
      transportBudget: 12,
    },
    packingList: [
      { category: "Coastal Adventures", items: ["Kayaking clothes", "Water shoes for caves", "Dry bag", "GoPro or waterproof camera"] },
      { category: "Beach", items: ["Sunscreen SPF 50", "Wide-brim hat", "Beach towel", "Reading material"] },
      { category: "Cliff Walks", items: ["Hiking shoes", "Light layers", "Binoculars", "Sun protection"] },
    ],
    localPhrases: {
      language: "Portuguese",
      phrases: [
        { phrase: "Bom dia", translation: "Good morning", pronunciation: "bom DEE-ah" },
        { phrase: "Obrigado/Obrigada", translation: "Thank you (m/f)", pronunciation: "oh-bree-GAH-doo / oh-bree-GAH-dah" },
        { phrase: "Uma cerveja, por favor", translation: "A beer, please", pronunciation: "OO-mah ser-VEH-zhah poor fah-VOR" },
        { phrase: "Onde fica a praia?", translation: "Where is the beach?", pronunciation: "ON-deh FEE-kah ah PRAH-yah" },
        { phrase: "Uma cataplana para dois", translation: "A cataplana for two", pronunciation: "OO-mah kah-tah-PLAH-nah PAH-rah doysh" },
      ],
    },
  },
  "madeira-dest": {
    transport: [
      { type: "airport", name: "Funchal (FNC)", travelTime: "20-40 min", description: "Famous for challenging approach, great views" },
      { type: "ferry", name: "Naviera Armas", travelTime: "22 hours", description: "Weekly ferry from Portimão (mainland)" },
    ],
    budget: {
      currency: "EUR",
      accommodationBudget: { low: 50, mid: 110, high: 300 },
      foodBudget: { low: 20, mid: 40, high: 90 },
      activitiesBudget: { low: 15, mid: 35, high: 80 },
      transportBudget: 15,
    },
    packingList: [
      { category: "Levada Hiking", items: ["Waterproof hiking boots", "Rain jacket", "Trekking poles", "Headlamp for tunnels"] },
      { category: "Layers", items: ["Fleece jacket", "Windbreaker", "Long pants", "Moisture-wicking shirts"] },
      { category: "Essentials", items: ["Daypack", "Reusable water bottle", "Camera", "First aid kit"] },
    ],
    localPhrases: {
      language: "Portuguese",
      phrases: [
        { phrase: "Uma poncha, por favor", translation: "A poncha (local drink), please", pronunciation: "OO-mah PON-shah poor fah-VOR" },
        { phrase: "Espetada", translation: "Beef skewers on laurel stick", pronunciation: "esh-peh-TAH-dah" },
        { phrase: "Bolo do caco", translation: "Traditional bread", pronunciation: "BOH-loo doo KAH-koo" },
        { phrase: "Onde começa a levada?", translation: "Where does the levada start?", pronunciation: "ON-deh koh-MEH-sah ah leh-VAH-dah" },
        { phrase: "Que vista linda!", translation: "What a beautiful view!", pronunciation: "keh VEESH-tah LEEN-dah" },
      ],
    },
  },
  "azores-dest": {
    transport: [
      { type: "airport", name: "Ponta Delgada (PDL)", travelTime: "15-30 min", description: "Main gateway to São Miguel island" },
      { type: "airport", name: "Terceira (TER)", travelTime: "10-20 min", description: "Hub for central islands" },
      { type: "ferry", name: "Atlânticoline", travelTime: "2-8 hours", description: "Inter-island ferry services" },
    ],
    budget: {
      currency: "EUR",
      accommodationBudget: { low: 45, mid: 90, high: 220 },
      foodBudget: { low: 18, mid: 35, high: 75 },
      activitiesBudget: { low: 20, mid: 50, high: 120 },
      transportBudget: 20,
    },
    packingList: [
      { category: "Weather Ready", items: ["Waterproof everything", "Multiple layers", "Quick-dry clothing", "Compact umbrella"] },
      { category: "Adventure", items: ["Swimsuit for hot springs", "Hiking boots", "Whale watching binoculars", "Wetsuit for diving"] },
      { category: "Photography", items: ["Camera with rain cover", "Extra batteries", "Tripod for waterfalls", "Lens cleaning kit"] },
    ],
    localPhrases: {
      language: "Portuguese",
      phrases: [
        { phrase: "Cozido das Furnas", translation: "Volcanic-cooked stew", pronunciation: "koh-ZEE-doo dahsh FOOR-nahsh" },
        { phrase: "Queijadas", translation: "Traditional cheese tarts", pronunciation: "kay-JAH-dahsh" },
        { phrase: "Onde posso ver baleias?", translation: "Where can I see whales?", pronunciation: "ON-deh POS-soo vehr bah-LAY-ahsh" },
        { phrase: "Uma bica, por favor", translation: "An espresso, please", pronunciation: "OO-mah BEE-kah poor fah-VOR" },
        { phrase: "A que horas é a maré baixa?", translation: "What time is low tide?", pronunciation: "ah keh OH-rahsh eh ah mah-REH BIGH-shah" },
      ],
    },
  },
  "douro": {
    transport: [
      { type: "airport", name: "Porto (OPO)", travelTime: "1.5-2 hours", description: "Fly to Porto, then drive or train east" },
      { type: "train", name: "Historic Douro Line", travelTime: "2-3 hours", description: "Scenic railway along the river" },
      { type: "bus", name: "Rede Expressos", travelTime: "2-3 hours", description: "Bus services to valley towns" },
    ],
    budget: {
      currency: "EUR",
      accommodationBudget: { low: 60, mid: 130, high: 350 },
      foodBudget: { low: 25, mid: 50, high: 100 },
      activitiesBudget: { low: 20, mid: 60, high: 150 },
      transportBudget: 15,
    },
    packingList: [
      { category: "Wine Tasting", items: ["Smart casual attire", "Comfortable walking shoes", "Wine journal", "Camera"] },
      { category: "River Cruise", items: ["Layers for boat", "Sunglasses", "Sunhat", "Light jacket for evenings"] },
      { category: "Vineyards", items: ["Comfortable shoes for terraces", "Sun protection", "Small backpack", "Cash for small quintas"] },
    ],
    localPhrases: {
      language: "Portuguese",
      phrases: [
        { phrase: "Um cálice de Porto", translation: "A glass of Port wine", pronunciation: "oom KAH-lee-seh deh POR-too" },
        { phrase: "Quinta", translation: "Wine estate", pronunciation: "KEEN-tah" },
        { phrase: "Vinho do Porto", translation: "Port wine", pronunciation: "VEEN-yoo doo POR-too" },
        { phrase: "Posso provar?", translation: "Can I taste?", pronunciation: "POS-soo proo-VAR" },
        { phrase: "Saúde!", translation: "Cheers!", pronunciation: "sah-OO-deh" },
      ],
    },
  },
  // Indonesia destinations
  "bali-dest": {
    transport: [
      { type: "airport", name: "Ngurah Rai (DPS)", travelTime: "20-90 min", description: "International airport near Kuta/Seminyak" },
      { type: "ferry", name: "From Java", travelTime: "45 min crossing", description: "Ferries from Banyuwangi to Gilimanuk" },
    ],
    budget: {
      currency: "USD",
      accommodationBudget: { low: 25, mid: 80, high: 300 },
      foodBudget: { low: 10, mid: 25, high: 60 },
      activitiesBudget: { low: 15, mid: 40, high: 100 },
      transportBudget: 10,
    },
    packingList: [
      { category: "Temple Visits", items: ["Sarong (or buy locally)", "Modest clothing covering shoulders/knees", "Sash for temples", "Comfortable walking shoes"] },
      { category: "Tropical Climate", items: ["Light breathable clothes", "Rain jacket", "Insect repellent", "Sunscreen"] },
      { category: "Adventures", items: ["Swimsuit", "Water shoes", "Reef-safe sunscreen", "Dry bag"] },
    ],
    localPhrases: {
      language: "Indonesian/Balinese",
      phrases: [
        { phrase: "Terima kasih", translation: "Thank you", pronunciation: "teh-REE-mah KAH-see" },
        { phrase: "Om Swastiastu", translation: "Balinese greeting", pronunciation: "om swas-tee-AHS-too" },
        { phrase: "Berapa harganya?", translation: "How much is it?", pronunciation: "beh-RAH-pah har-GAH-nyah" },
        { phrase: "Nasi goreng", translation: "Fried rice", pronunciation: "NAH-see go-RENG" },
        { phrase: "Bintang, satu", translation: "One Bintang (beer)", pronunciation: "BEEN-tahng SAH-too" },
        { phrase: "Di mana pantai?", translation: "Where is the beach?", pronunciation: "dee MAH-nah PAN-tai" },
      ],
    },
  },
  "raja-ampat-dest": {
    transport: [
      { type: "airport", name: "Sorong (SOQ)", travelTime: "2-4 hour ferry", description: "Fly to Sorong, then ferry to islands" },
      { type: "ferry", name: "Public ferries", travelTime: "2-4 hours", description: "Regular boats to Waisai and islands" },
    ],
    budget: {
      currency: "USD",
      accommodationBudget: { low: 50, mid: 150, high: 500 },
      foodBudget: { low: 15, mid: 35, high: 80 },
      activitiesBudget: { low: 50, mid: 150, high: 400 },
      transportBudget: 30,
    },
    packingList: [
      { category: "Diving Essentials", items: ["Dive certification card", "Own mask and snorkel", "Dive computer", "Reef-safe sunscreen"] },
      { category: "Remote Location", items: ["First aid kit", "Medications", "Cash (no ATMs)", "Extra batteries"] },
      { category: "Protection", items: ["Rash guard", "Water shoes", "Insect repellent", "Waterproof bags"] },
    ],
    localPhrases: {
      language: "Indonesian/Papuan",
      phrases: [
        { phrase: "Selamat pagi", translation: "Good morning", pronunciation: "seh-LAH-maht PAH-gee" },
        { phrase: "Tolong", translation: "Please/Help", pronunciation: "TOH-long" },
        { phrase: "Bagus sekali!", translation: "Very beautiful!", pronunciation: "BAH-goos seh-KAH-lee" },
        { phrase: "Saya mau menyelam", translation: "I want to dive", pronunciation: "SAH-yah mau men-yeh-LAHM" },
        { phrase: "Di mana manta?", translation: "Where are the mantas?", pronunciation: "dee MAH-nah MAN-tah" },
      ],
    },
  },
  "komodo-dest": {
    transport: [
      { type: "airport", name: "Labuan Bajo (LBJ)", travelTime: "In town", description: "Small airport with flights from Bali" },
      { type: "ferry", name: "PELNI/Liveaboard", travelTime: "Varies", description: "Multi-day boat tours to the islands" },
    ],
    budget: {
      currency: "USD",
      accommodationBudget: { low: 30, mid: 100, high: 350 },
      foodBudget: { low: 12, mid: 30, high: 70 },
      activitiesBudget: { low: 50, mid: 120, high: 300 },
      transportBudget: 25,
    },
    packingList: [
      { category: "Dragon Trekking", items: ["Closed-toe hiking shoes", "Long pants", "Walking stick provided", "Camera with zoom lens"] },
      { category: "Island Hopping", items: ["Multiple swimsuits", "Snorkeling gear", "Reef-safe sunscreen", "Waterproof camera"] },
      { category: "Boat Life", items: ["Motion sickness pills", "Quick-dry towel", "Dry bag", "Sunhat with strap"] },
    ],
    localPhrases: {
      language: "Indonesian",
      phrases: [
        { phrase: "Hati-hati!", translation: "Be careful!", pronunciation: "HAH-tee HAH-tee" },
        { phrase: "Komodo", translation: "Komodo dragon", pronunciation: "koh-MOH-doh" },
        { phrase: "Pulau", translation: "Island", pronunciation: "poo-LAU" },
        { phrase: "Saya ingin snorkeling", translation: "I want to snorkel", pronunciation: "SAH-yah EEN-geen SNOR-kel-ing" },
        { phrase: "Kapan kita berangkat?", translation: "When do we leave?", pronunciation: "KAH-pan KEE-tah beh-RAHNG-kaht" },
      ],
    },
  },
  "lombok-dest": {
    transport: [
      { type: "airport", name: "Lombok (LOP)", travelTime: "30-60 min", description: "International airport in south Lombok" },
      { type: "ferry", name: "Fast boats", travelTime: "1.5-2.5 hours", description: "Speed boats from Bali to Gili Islands" },
      { type: "ferry", name: "Public ferry", travelTime: "4-5 hours", description: "Car ferry from Padang Bai, Bali" },
    ],
    budget: {
      currency: "USD",
      accommodationBudget: { low: 20, mid: 60, high: 200 },
      foodBudget: { low: 8, mid: 20, high: 50 },
      activitiesBudget: { low: 20, mid: 50, high: 150 },
      transportBudget: 12,
    },
    packingList: [
      { category: "Rinjani Trekking", items: ["Sturdy hiking boots", "Warm sleeping bag", "Headlamp", "Trekking poles"] },
      { category: "Gili Islands", items: ["Swimsuit", "Reef shoes", "Snorkeling gear", "Underwater camera"] },
      { category: "General", items: ["Light clothes", "Modest wear for villages", "Insect repellent", "Sunscreen"] },
    ],
    localPhrases: {
      language: "Indonesian/Sasak",
      phrases: [
        { phrase: "Sugeng rawuh", translation: "Welcome (Sasak)", pronunciation: "SOO-geng RAH-woo" },
        { phrase: "Gili", translation: "Small island", pronunciation: "GEE-lee" },
        { phrase: "Pantai", translation: "Beach", pronunciation: "PAN-tai" },
        { phrase: "Saya mau ke Rinjani", translation: "I want to go to Rinjani", pronunciation: "SAH-yah mau keh rin-JAH-nee" },
        { phrase: "Enak!", translation: "Delicious!", pronunciation: "EH-nak" },
      ],
    },
  },
  // Germany destinations
  "bavaria": {
    transport: [
      { type: "airport", name: "Munich (MUC)", travelTime: "40 min to city", description: "Major international hub" },
      { type: "train", name: "DB ICE/IC", travelTime: "4h from Berlin", description: "High-speed trains to Munich" },
      { type: "train", name: "Bayern Ticket", travelTime: "Regional", description: "Day pass for unlimited regional travel" },
    ],
    budget: {
      currency: "EUR",
      accommodationBudget: { low: 60, mid: 130, high: 350 },
      foodBudget: { low: 25, mid: 50, high: 100 },
      activitiesBudget: { low: 15, mid: 35, high: 80 },
      transportBudget: 15,
    },
    packingList: [
      { category: "Alpine Adventures", items: ["Hiking boots", "Rain jacket", "Warm layers", "Trekking poles"] },
      { category: "Castle Visits", items: ["Comfortable walking shoes", "Camera", "Light jacket", "Small backpack"] },
      { category: "Beer Garden Ready", items: ["Casual comfortable clothes", "Light cardigan for evenings", "Cash for traditional venues", "Appetite for pretzels"] },
    ],
    localPhrases: {
      language: "German/Bavarian",
      phrases: [
        { phrase: "Grüß Gott", translation: "Hello (Bavarian greeting)", pronunciation: "groos got" },
        { phrase: "Ein Maß, bitte", translation: "One liter of beer, please", pronunciation: "ayn mahs BIT-teh" },
        { phrase: "Prost!", translation: "Cheers!", pronunciation: "prohst" },
        { phrase: "Danke schön", translation: "Thank you very much", pronunciation: "DAHN-keh shurn" },
        { phrase: "Wo ist das Schloss?", translation: "Where is the castle?", pronunciation: "voh ist dahs shloss" },
        { phrase: "Die Rechnung, bitte", translation: "The bill, please", pronunciation: "dee REKH-noong BIT-teh" },
      ],
    },
  },
  "black-forest-dest": {
    transport: [
      { type: "airport", name: "Stuttgart (STR)", travelTime: "1-1.5 hours", description: "Nearest major airport" },
      { type: "airport", name: "Basel/Mulhouse (BSL)", travelTime: "1-1.5 hours", description: "Alternative airport near Swiss border" },
      { type: "train", name: "Schwarzwaldbahn", travelTime: "Varies", description: "Scenic railway through the forest" },
    ],
    budget: {
      currency: "EUR",
      accommodationBudget: { low: 55, mid: 120, high: 280 },
      foodBudget: { low: 22, mid: 45, high: 90 },
      activitiesBudget: { low: 12, mid: 30, high: 70 },
      transportBudget: 15,
    },
    packingList: [
      { category: "Forest Hiking", items: ["Waterproof hiking boots", "Rain gear", "Layered clothing", "Trail map or GPS"] },
      { category: "Spa & Wellness", items: ["Swimsuit", "Flip flops", "Robe (or rent)", "Reading material"] },
      { category: "Photography", items: ["Camera with good low-light", "Tripod for waterfalls", "Extra batteries", "Weather protection"] },
    ],
    localPhrases: {
      language: "German/Alemannic",
      phrases: [
        { phrase: "Guten Tag", translation: "Good day", pronunciation: "GOO-ten tahk" },
        { phrase: "Schwarzwälder Kirschtorte", translation: "Black Forest cake", pronunciation: "SHVARTS-vel-der KIRSH-tor-teh" },
        { phrase: "Ein Stück Kuchen, bitte", translation: "A piece of cake, please", pronunciation: "ayn shtook KOO-khen BIT-teh" },
        { phrase: "Wo beginnt der Wanderweg?", translation: "Where does the hiking trail start?", pronunciation: "voh beh-GINNT dehr VAN-der-vehk" },
        { phrase: "Kuckucksuhr", translation: "Cuckoo clock", pronunciation: "KOO-kooks-oor" },
      ],
    },
  },
  "rhine-dest": {
    transport: [
      { type: "airport", name: "Frankfurt (FRA)", travelTime: "1-1.5 hours", description: "Germany's largest airport" },
      { type: "airport", name: "Cologne/Bonn (CGN)", travelTime: "1-1.5 hours", description: "Good for northern Rhine Valley" },
      { type: "train", name: "Rhine Railway", travelTime: "Scenic route", description: "Trains along both sides of the river" },
      { type: "ferry", name: "KD Rhine Cruises", travelTime: "1-8 hours", description: "Day cruises and longer voyages" },
    ],
    budget: {
      currency: "EUR",
      accommodationBudget: { low: 60, mid: 130, high: 300 },
      foodBudget: { low: 25, mid: 50, high: 100 },
      activitiesBudget: { low: 15, mid: 40, high: 100 },
      transportBudget: 18,
    },
    packingList: [
      { category: "River Cruise", items: ["Smart casual attire", "Comfortable deck shoes", "Binoculars", "Light jacket for breezes"] },
      { category: "Castle Exploration", items: ["Comfortable walking shoes", "Camera with zoom lens", "Small backpack", "Layers"] },
      { category: "Wine Tasting", items: ["Comfortable clothes", "Wine journal", "Cash for small wineries", "Light cardigan"] },
    ],
    localPhrases: {
      language: "German",
      phrases: [
        { phrase: "Ein Glas Riesling, bitte", translation: "A glass of Riesling, please", pronunciation: "ayn glahs REES-ling BIT-teh" },
        { phrase: "Welches Weingut empfehlen Sie?", translation: "Which winery do you recommend?", pronunciation: "VEL-khes VINE-goot emp-FEH-len zee" },
        { phrase: "Wo ist die Burg?", translation: "Where is the castle?", pronunciation: "voh ist dee boork" },
        { phrase: "Schöne Aussicht!", translation: "Beautiful view!", pronunciation: "SHUR-neh OWS-zikht" },
        { phrase: "Wann fährt das Schiff?", translation: "When does the boat leave?", pronunciation: "vahn fehrt dahs shif" },
      ],
    },
  },
  "baltic-coast": {
    transport: [
      { type: "airport", name: "Rostock-Laage (RLG)", travelTime: "30-45 min", description: "Small regional airport" },
      { type: "airport", name: "Hamburg (HAM)", travelTime: "2-3 hours", description: "Major airport with connections" },
      { type: "train", name: "DB Regional", travelTime: "3-4h from Berlin", description: "Regular trains to coastal towns" },
      { type: "ferry", name: "Scandlines", travelTime: "2-6 hours", description: "Ferries to Denmark and Sweden" },
    ],
    budget: {
      currency: "EUR",
      accommodationBudget: { low: 50, mid: 110, high: 250 },
      foodBudget: { low: 20, mid: 40, high: 80 },
      activitiesBudget: { low: 10, mid: 25, high: 60 },
      transportBudget: 12,
    },
    packingList: [
      { category: "Beach Season", items: ["Windbreaker", "Swimsuit", "Beach blanket", "Sand-free towel"] },
      { category: "Weather", items: ["Rain jacket", "Warm sweater", "Comfortable walking shoes", "Beanie for windy days"] },
      { category: "Cycling", items: ["Cycling shorts", "Helmet (or rent)", "Bike lock", "Repair kit"] },
    ],
    localPhrases: {
      language: "German/Low German",
      phrases: [
        { phrase: "Moin", translation: "Hello (Northern greeting)", pronunciation: "moyn" },
        { phrase: "Fischbrötchen", translation: "Fish sandwich", pronunciation: "FISH-brurt-khen" },
        { phrase: "Strandkorb", translation: "Beach basket chair", pronunciation: "SHTRAHNT-korb" },
        { phrase: "Wo kann ich Fahrräder mieten?", translation: "Where can I rent bicycles?", pronunciation: "voh kahn ikh FAR-reh-der MEE-ten" },
        { phrase: "Das Meer ist kalt!", translation: "The sea is cold!", pronunciation: "dahs mehr ist kahlt" },
      ],
    },
  },
};

// Default transport and budget for destinations without specific data
export const defaultDestinationExtras: DestinationExtras = {
  transport: [
    { type: "airport", name: "Nearest Airport", travelTime: "Varies", description: "Check local airports for connections" },
  ],
  budget: {
    currency: "EUR",
    accommodationBudget: { low: 50, mid: 120, high: 300 },
    foodBudget: { low: 25, mid: 50, high: 100 },
    activitiesBudget: { low: 20, mid: 50, high: 100 },
    transportBudget: 15,
  },
  packingList: [
    { category: "Essentials", items: ["Passport and documents", "Travel adapter", "Comfortable shoes", "Weather-appropriate clothing"] },
    { category: "Health & Safety", items: ["First aid kit", "Medications", "Hand sanitizer", "Sunscreen"] },
    { category: "Travel Comfort", items: ["Reusable water bottle", "Day backpack", "Portable charger", "Travel pillow"] },
  ],
  localPhrases: {
    language: "Local Language",
    phrases: [
      { phrase: "Hello", translation: "Greeting", pronunciation: "Check locally" },
      { phrase: "Thank you", translation: "Expression of gratitude", pronunciation: "Check locally" },
      { phrase: "How much?", translation: "Asking for price", pronunciation: "Check locally" },
      { phrase: "Where is...?", translation: "Asking for directions", pronunciation: "Check locally" },
    ],
  },
};

export function getDestinationExtras(destinationId: string): DestinationExtras {
  return destinationExtras[destinationId] || defaultDestinationExtras;
}