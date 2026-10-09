// HSN/SAC Data for GST Calculator (India 2026+)
const HSN_DATA = [
    // 0% - Exempted / Nil Rated
    { code: "0401", description: "Fresh milk, curd, buttermilk, paneer (unpackaged)", rate: 0, category: "Food & Agriculture" },
    { code: "0701", description: "Fresh vegetables, potatoes, onions, tomatoes", rate: 0, category: "Food & Agriculture" },
    { code: "0801", description: "Fresh fruits (apples, bananas, mangoes, etc.)", rate: 0, category: "Food & Agriculture" },
    { code: "3002", description: "Life-saving drugs & vaccines", rate: 0, category: "Healthcare" },
    { code: "9971", description: "Health insurance & Life insurance premiums (Exempted 2025/2026+)", rate: 0, category: "Insurance & Financial" },
    { code: "4901", description: "Printed books, newspapers, journals", rate: 0, category: "Education" },

    // 3% - Special Rate (Gold & Jewellery)
    { code: "7108", description: "Gold unwrought or semi-manufactured forms", rate: 3, category: "Jewellery & Metals" },
    { code: "7106", description: "Silver unwrought or semi-manufactured forms", rate: 3, category: "Jewellery & Metals" },
    { code: "7113", description: "Articles of jewellery and parts thereof", rate: 3, category: "Jewellery & Metals" },

    // 5% - Merit Rate
    { code: "0402", description: "Packaged paneer, milk powder, condensed milk", rate: 5, category: "Food & Agriculture" },
    { code: "0405", description: "Butter, ghee, cheese, dairy spreads", rate: 5, category: "Food & Agriculture" },
    { code: "0902", description: "Tea, coffee, spices, cashew nuts", rate: 5, category: "Food & Agriculture" },
    { code: "1905", description: "Rusk, branded bread, basic biscuits", rate: 5, category: "Food & Agriculture" },
    { code: "6101", description: "Apparel and clothing accessories (< ₹1000 per piece)", rate: 5, category: "Textiles & Apparel" },
    { code: "3004", description: "Essential medicines and formulations", rate: 5, category: "Healthcare" },

    // 18% - Standard Rate (Goods & Services)
    { code: "8517", description: "Smartphones, mobile phones, telecommunication equipment", rate: 18, category: "Electronics" },
    { code: "8471", description: "Laptops, computers, computer peripherals & hardware", rate: 18, category: "Electronics" },
    { code: "8528", description: "Monitors, TVs, projectors", rate: 18, category: "Electronics" },
    { code: "8415", description: "Air conditioners, refrigerators, washing machines", rate: 18, category: "Appliances" },
    { code: "9983", description: "IT consulting, software development & cloud services", rate: 18, category: "Services" },
    { code: "9982", description: "Legal, accounting, auditing & consulting services", rate: 18, category: "Services" },
    { code: "9963", description: "Restaurant services & hotel accommodation", rate: 18, category: "Services & Hospitality" },
    { code: "3304", description: "Cosmetics, skincare & beauty products", rate: 18, category: "Personal Care" },

    // 40% - Luxury / De-merit / Sin Rate
    { code: "2402", description: "Cigarettes, cigars, tobacco products", rate: 40, category: "Sin Goods" },
    { code: "2403", description: "Pan masala, gutkha, chewing tobacco", rate: 40, category: "Sin Goods" },
    { code: "2202", description: "Aerated waters, caffeinated drinks, energy drinks", rate: 40, category: "Beverages" },
    { code: "8711", description: "Motorcycles with engine capacity > 350cc", rate: 40, category: "Automotive" },
    { code: "8703", description: "Luxury motor cars, SUVs, racing cars", rate: 40, category: "Automotive" },
    { code: "8901", description: "Yachts, luxury vessels and pleasure boats", rate: 40, category: "Luxury" },
    { code: "9996", description: "Online money gaming, casino, horse racing services", rate: 40, category: "Gaming & Entertainment" }
];
