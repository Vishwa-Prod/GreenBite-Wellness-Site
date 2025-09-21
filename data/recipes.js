// Recipe data for GreenBite
const recipesData = [
    {
        id: 1,
        title: "Quinoa Power Bowl",
        category: "lunch",
        description: "A nutrient-packed bowl with quinoa, roasted vegetables, and tahini dressing.",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
        prepTime: "15 mins",
        cookTime: "25 mins",
        totalTime: "40 mins",
        servings: 2,
        difficulty: "Easy",
        ingredients: [
            "1 cup quinoa",
            "2 cups vegetable broth",
            "1 sweet potato, cubed",
            "1 bell pepper, sliced",
            "1 zucchini, sliced",
            "1 can chickpeas, drained",
            "2 tbsp olive oil",
            "1 avocado, sliced",
            "2 tbsp tahini",
            "1 lemon, juiced",
            "2 cloves garlic, minced",
            "Salt and pepper to taste",
            "Fresh herbs for garnish"
        ],
        instructions: [
            "Preheat oven to 400°F (200°C).",
            "Rinse quinoa and cook in vegetable broth according to package directions.",
            "Toss sweet potato, bell pepper, and zucchini with olive oil, salt, and pepper.",
            "Roast vegetables for 20-25 minutes until tender.",
            "Drain and rinse chickpeas, then add to the roasted vegetables for last 5 minutes.",
            "Make tahini dressing by whisking together tahini, lemon juice, garlic, and 2-3 tbsp water.",
            "Divide quinoa between bowls and top with roasted vegetables and chickpeas.",
            "Add sliced avocado and drizzle with tahini dressing.",
            "Garnish with fresh herbs and serve immediately."
        ],
        nutrition: {
            calories: 485,
            protein: 18,
            carbs: 65,
            fat: 18,
            fiber: 12,
            sugar: 8,
            sodium: 320
        },
        tags: ["vegetarian", "vegan", "gluten-free", "high-protein", "high-fiber"]
    },
    {
        id: 2,
        title: "Green Smoothie Bowl",
        category: "breakfast",
        description: "A refreshing and energizing smoothie bowl packed with nutrients.",
        image: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400&h=300&fit=crop",
        prepTime: "10 mins",
        cookTime: "0 mins",
        totalTime: "10 mins",
        servings: 1,
        difficulty: "Easy",
        ingredients: [
            "1 frozen banana",
            "1 cup spinach leaves",
            "1/2 avocado",
            "1/2 cup almond milk",
            "1 tbsp chia seeds",
            "1 tsp honey or maple syrup",
            "1/2 cup frozen mango chunks",
            "Toppings: granola, berries, coconut flakes, nuts"
        ],
        instructions: [
            "Add frozen banana, spinach, avocado, and almond milk to a blender.",
            "Add chia seeds, honey, and frozen mango.",
            "Blend until smooth and creamy, adding more almond milk if needed.",
            "Pour into a bowl and add your favorite toppings.",
            "Serve immediately and enjoy!"
        ],
        nutrition: {
            calories: 320,
            protein: 8,
            carbs: 45,
            fat: 14,
            fiber: 12,
            sugar: 28,
            sodium: 85
        },
        tags: ["vegetarian", "vegan", "gluten-free", "dairy-free", "raw"]
    },
    {
        id: 3,
        title: "Mediterranean Chickpea Salad",
        category: "lunch",
        description: "A fresh and flavorful salad with chickpeas, vegetables, and herbs.",
        image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop",
        prepTime: "15 mins",
        cookTime: "0 mins",
        totalTime: "15 mins",
        servings: 4,
        difficulty: "Easy",
        ingredients: [
            "2 cans chickpeas, drained and rinsed",
            "1 cucumber, diced",
            "2 tomatoes, diced",
            "1/2 red onion, finely chopped",
            "1/2 cup kalamata olives, pitted",
            "1/2 cup feta cheese, crumbled",
            "1/4 cup fresh parsley, chopped",
            "2 tbsp fresh mint, chopped",
            "3 tbsp olive oil",
            "2 tbsp lemon juice",
            "1 tsp dried oregano",
            "Salt and pepper to taste"
        ],
        instructions: [
            "In a large bowl, combine chickpeas, cucumber, tomatoes, and red onion.",
            "Add olives, feta cheese, parsley, and mint.",
            "In a small bowl, whisk together olive oil, lemon juice, oregano, salt, and pepper.",
            "Pour dressing over salad and toss to combine.",
            "Let sit for 10 minutes to allow flavors to meld.",
            "Serve chilled or at room temperature."
        ],
        nutrition: {
            calories: 285,
            protein: 12,
            carbs: 32,
            fat: 12,
            fiber: 9,
            sugar: 8,
            sodium: 580
        },
        tags: ["vegetarian", "mediterranean", "high-protein", "high-fiber"]
    },
    {
        id: 4,
        title: "Baked Salmon with Herbs",
        category: "dinner",
        description: "Perfectly baked salmon with a flavorful herb crust.",
        image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop",
        prepTime: "10 mins",
        cookTime: "15 mins",
        totalTime: "25 mins",
        servings: 4,
        difficulty: "Medium",
        ingredients: [
            "4 salmon fillets (6 oz each)",
            "2 tbsp olive oil",
            "2 cloves garlic, minced",
            "2 tbsp fresh dill, chopped",
            "2 tbsp fresh parsley, chopped",
            "1 lemon, sliced",
            "Salt and pepper to taste",
            "1 tbsp capers (optional)"
        ],
        instructions: [
            "Preheat oven to 425°F (220°C).",
            "Pat salmon fillets dry and place on a lined baking sheet.",
            "Mix olive oil, garlic, dill, parsley, salt, and pepper in a small bowl.",
            "Brush herb mixture over salmon fillets.",
            "Top with lemon slices and capers if using.",
            "Bake for 12-15 minutes until fish flakes easily.",
            "Serve immediately with your favorite sides."
        ],
        nutrition: {
            calories: 350,
            protein: 35,
            carbs: 2,
            fat: 22,
            fiber: 0,
            sugar: 1,
            sodium: 95
        },
        tags: ["high-protein", "omega-3", "low-carb", "keto-friendly"]
    },
    {
        id: 5,
        title: "Energy Balls",
        category: "snack",
        description: "No-bake energy balls perfect for a quick healthy snack.",
        image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop",
        prepTime: "15 mins",
        cookTime: "0 mins",
        totalTime: "15 mins",
        servings: 12,
        difficulty: "Easy",
        ingredients: [
            "1 cup rolled oats",
            "1/2 cup peanut butter",
            "1/3 cup honey",
            "1/3 cup mini chocolate chips",
            "1/3 cup ground flaxseed",
            "1 tsp vanilla extract",
            "Pinch of salt"
        ],
        instructions: [
            "Mix all ingredients in a bowl until well combined.",
            "Refrigerate mixture for 30 minutes to make rolling easier.",
            "Roll mixture into 1-inch balls using your hands.",
            "Place on a lined baking sheet or plate.",
            "Refrigerate for at least 1 hour before serving.",
            "Store in refrigerator for up to 1 week."
        ],
        nutrition: {
            calories: 145,
            protein: 5,
            carbs: 15,
            fat: 8,
            fiber: 3,
            sugar: 9,
            sodium: 35
        },
        tags: ["vegetarian", "no-bake", "portable", "kid-friendly"]
    },
    {
        id: 6,
        title: "Vegetable Stir-Fry",
        category: "dinner",
        description: "Colorful and nutritious stir-fry with seasonal vegetables.",
        image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop",
        prepTime: "15 mins",
        cookTime: "10 mins",
        totalTime: "25 mins",
        servings: 3,
        difficulty: "Easy",
        ingredients: [
            "2 tbsp sesame oil",
            "1 bell pepper, sliced",
            "1 broccoli head, cut into florets",
            "1 carrot, julienned",
            "1 zucchini, sliced",
            "2 cloves garlic, minced",
            "1 tbsp fresh ginger, grated",
            "3 tbsp soy sauce (low sodium)",
            "1 tbsp rice vinegar",
            "1 tsp honey",
            "2 green onions, sliced",
            "2 tbsp sesame seeds"
        ],
        instructions: [
            "Heat sesame oil in a large wok or skillet over high heat.",
            "Add garlic and ginger, stir-fry for 30 seconds.",
            "Add harder vegetables (broccoli, carrots) first, cook 2-3 minutes.",
            "Add bell pepper and zucchini, cook another 2-3 minutes.",
            "Mix soy sauce, rice vinegar, and honey in a small bowl.",
            "Pour sauce over vegetables and toss to coat.",
            "Cook for another 1-2 minutes until vegetables are crisp-tender.",
            "Garnish with green onions and sesame seeds before serving."
        ],
        nutrition: {
            calories: 125,
            protein: 4,
            carbs: 12,
            fat: 7,
            fiber: 4,
            sugar: 8,
            sodium: 485
        },
        tags: ["vegetarian", "vegan", "low-calorie", "quick-cooking"]
    },
    {
        id: 7,
        title: "Overnight Oats",
        category: "breakfast",
        description: "Creamy overnight oats with berries and nuts for busy mornings.",
        image: "images/overnight-oats.jpeg",
        prepTime: "5 mins",
        cookTime: "0 mins",
        totalTime: "5 mins + overnight",
        servings: 1,
        difficulty: "Easy",
        ingredients: [
            "1/2 cup rolled oats",
            "1/2 cup almond milk",
            "1 tbsp chia seeds",
            "1 tbsp maple syrup",
            "1/2 tsp vanilla extract",
            "1/4 cup Greek yogurt",
            "1/2 cup mixed berries",
            "2 tbsp chopped almonds",
            "Pinch of cinnamon"
        ],
        instructions: [
            "Combine oats, almond milk, chia seeds, maple syrup, and vanilla in a jar.",
            "Stir well to combine all ingredients.",
            "Add Greek yogurt and mix gently.",
            "Top with berries and almonds.",
            "Sprinkle with cinnamon.",
            "Refrigerate overnight (at least 4 hours).",
            "Enjoy cold straight from the jar or warm slightly if preferred."
        ],
        nutrition: {
            calories: 290,
            protein: 12,
            carbs: 45,
            fat: 8,
            fiber: 10,
            sugar: 18,
            sodium: 95
        },
        tags: ["vegetarian", "make-ahead", "high-fiber", "portable"]
    },
    {
        id: 8,
        title: "Dark Chocolate Avocado Mousse",
        category: "dessert",
        description: "Rich and creamy chocolate mousse made with healthy avocados.",
        image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop",
        prepTime: "10 mins",
        cookTime: "0 mins",
        totalTime: "10 mins + chill time",
        servings: 4,
        difficulty: "Easy",
        ingredients: [
            "2 ripe avocados",
            "1/4 cup unsweetened cocoa powder",
            "1/4 cup maple syrup",
            "2 tbsp almond milk",
            "1 tsp vanilla extract",
            "Pinch of salt",
            "Fresh berries for topping",
            "Chopped dark chocolate for garnish"
        ],
        instructions: [
            "Cut avocados in half and remove pits.",
            "Scoop avocado flesh into a food processor.",
            "Add cocoa powder, maple syrup, almond milk, vanilla, and salt.",
            "Process until smooth and creamy, scraping sides as needed.",
            "Taste and adjust sweetness with more maple syrup if desired.",
            "Divide mousse between serving glasses.",
            "Refrigerate for at least 1 hour before serving.",
            "Top with berries and chocolate before serving."
        ],
        nutrition: {
            calories: 165,
            protein: 3,
            carbs: 20,
            fat: 10,
            fiber: 7,
            sugar: 12,
            sodium: 35
        },
        tags: ["vegetarian", "vegan", "dairy-free", "healthy-dessert", "no-bake"]
    },
    {
        id: 9,
        title: "Turkey and Veggie Lettuce Wraps",
        category: "lunch",
        description: "Light and refreshing lettuce wraps filled with seasoned ground turkey.",
        image: "images/turkey-lettuce-wraps.jpeg",
        prepTime: "10 mins",
        cookTime: "15 mins",
        totalTime: "25 mins",
        servings: 4,
        difficulty: "Medium",
        ingredients: [
            "1 lb lean ground turkey",
            "1 onion, diced",
            "2 cloves garlic, minced",
            "1 bell pepper, diced",
            "1 carrot, diced",
            "2 tbsp olive oil",
            "2 tbsp soy sauce",
            "1 tbsp rice vinegar",
            "1 tsp sesame oil",
            "1 head butter lettuce",
            "1/4 cup cilantro, chopped",
            "2 green onions, sliced"
        ],
        instructions: [
            "Heat olive oil in a large skillet over medium-high heat.",
            "Add onion and cook until softened, about 3 minutes.",
            "Add garlic, bell pepper, and carrot, cook 2 minutes more.",
            "Add ground turkey and cook, breaking up with spoon, until browned.",
            "Stir in soy sauce, rice vinegar, and sesame oil.",
            "Cook for another 2-3 minutes until turkey is cooked through.",
            "Separate lettuce leaves and arrange on a platter.",
            "Spoon turkey mixture into lettuce cups.",
            "Top with cilantro and green onions before serving."
        ],
        nutrition: {
            calories: 220,
            protein: 25,
            carbs: 8,
            fat: 10,
            fiber: 2,
            sugar: 5,
            sodium: 380
        },
        tags: ["low-carb", "high-protein", "gluten-free", "keto-friendly"]
    },
    {
        id: 10,
        title: "Chia Pudding Parfait",
        category: "breakfast",
        description: "Layered chia pudding with fruit and nuts for a nutritious start.",
        image: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=400&h=300&fit=crop",
        prepTime: "10 mins",
        cookTime: "0 mins",
        totalTime: "10 mins + overnight",
        servings: 2,
        difficulty: "Easy",
        ingredients: [
            "1/4 cup chia seeds",
            "1 cup coconut milk",
            "2 tbsp maple syrup",
            "1/2 tsp vanilla extract",
            "1/2 cup Greek yogurt",
            "1 cup mixed berries",
            "1/4 cup granola",
            "2 tbsp chopped nuts",
            "Fresh mint for garnish"
        ],
        instructions: [
            "Whisk together chia seeds, coconut milk, maple syrup, and vanilla.",
            "Let sit for 5 minutes, then whisk again to prevent clumping.",
            "Refrigerate overnight or at least 4 hours until thickened.",
            "In serving glasses, layer chia pudding with Greek yogurt.",
            "Add layers of berries and granola.",
            "Top with chopped nuts and fresh mint.",
            "Serve immediately or refrigerate until ready to eat."
        ],
        nutrition: {
            calories: 310,
            protein: 12,
            carbs: 28,
            fat: 18,
            fiber: 12,
            sugar: 15,
            sodium: 85
        },
        tags: ["vegetarian", "high-fiber", "omega-3", "make-ahead"]
    }
];

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = recipesData;
}